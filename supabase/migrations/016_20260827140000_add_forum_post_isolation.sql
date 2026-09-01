-- Plan 11.2: establish the forum post boundary before the forum composer is exposed.

alter table public.posts
  add column forum_id uuid references public.forums (id) on delete cascade;

create index posts_by_forum_created_at_idx
  on public.posts (forum_id, created_at desc, id)
  where forum_id is not null;

create function public.can_participate_in_forum(p_forum_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.forum_memberships
    where forum_memberships.forum_id = p_forum_id
      and forum_memberships.user_id = (select auth.uid())
  );
$$;

create function public.can_participate_in_post(p_post_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.posts
    where posts.id = p_post_id
      and (
        posts.forum_id is null
        or public.can_participate_in_forum(posts.forum_id)
      )
  );
$$;

create function public.validate_forum_post_membership()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.forum_id is not null
    and not public.can_participate_in_forum(new.forum_id) then
    raise exception using
      errcode = '42501',
      message = 'Join this forum before posting in it.';
  end if;

  return new;
end;
$$;

create trigger posts_require_forum_membership
  before insert or update of forum_id on public.posts
  for each row execute function public.validate_forum_post_membership();

create or replace function public.get_home_feed(
  p_limit integer default 11,
  p_offset integer default 0
)
returns setof public.posts
language sql
stable
security invoker
set search_path = ''
as $$
  select posts.*
  from public.posts
  join public.follows
    on follows.following_id = posts.author_id
  where follows.follower_id = (select auth.uid())
    and posts.forum_id is null
  order by posts.created_at desc, posts.id asc
  limit greatest(1, least(p_limit, 50))
  offset greatest(p_offset, 0);
$$;

create or replace function public.validate_entity_rating_post()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  rated_post_author_id uuid;
  rated_post_entity_id uuid;
  rated_post_forum_id uuid;
  rated_post_type public.post_type;
begin
  select posts.author_id, posts.entity_id, posts.forum_id, posts.post_type
  into rated_post_author_id, rated_post_entity_id, rated_post_forum_id, rated_post_type
  from public.posts
  where posts.id = new.post_id;

  if not found
    or rated_post_type <> 'SHARE'
    or rated_post_forum_id is not null
    or rated_post_author_id <> new.author_id
    or rated_post_entity_id <> new.entity_id then
    raise exception using
      errcode = '23514',
      constraint = 'entity_ratings_share_post_match',
      message = 'A global restaurant rating must belong to its author’s normal Share post.';
  end if;

  return new;
end;
$$;

drop policy "Users can comment on accessible posts" on public.comments;
drop policy "Users can update their own comments" on public.comments;
drop policy "Users can delete their own comments" on public.comments;

create policy "Members can comment on accessible posts"
  on public.comments
  for insert
  to authenticated
  with check (
    (select auth.uid()) = author_id
    and public.can_participate_in_post(post_id)
  );

create policy "Members can update their own comments"
  on public.comments
  for update
  to authenticated
  using ((select auth.uid()) = author_id)
  with check (
    (select auth.uid()) = author_id
    and public.can_participate_in_post(post_id)
  );

create policy "Members can delete their own comments"
  on public.comments
  for delete
  to authenticated
  using (
    (select auth.uid()) = author_id
    and public.can_participate_in_post(post_id)
  );

drop policy "Users can create their own Ask ratings" on public.ratings;
drop policy "Users can update their own Ask ratings" on public.ratings;
drop policy "Users can delete their own Ask ratings" on public.ratings;

create policy "Members can create their own Ask ratings"
  on public.ratings
  for insert
  to authenticated
  with check (
    (select auth.uid()) = rater_id
    and public.can_participate_in_post(post_id)
  );

create policy "Members can update their own Ask ratings"
  on public.ratings
  for update
  to authenticated
  using (
    (select auth.uid()) = rater_id
    and public.can_participate_in_post(post_id)
  )
  with check (
    (select auth.uid()) = rater_id
    and public.can_participate_in_post(post_id)
  );

create policy "Members can delete their own Ask ratings"
  on public.ratings
  for delete
  to authenticated
  using (
    (select auth.uid()) = rater_id
    and public.can_participate_in_post(post_id)
  );

revoke all on function public.can_participate_in_forum(uuid) from public;
revoke all on function public.can_participate_in_post(uuid) from public;
grant execute on function public.can_participate_in_forum(uuid) to authenticated;
grant execute on function public.can_participate_in_post(uuid) to authenticated;
