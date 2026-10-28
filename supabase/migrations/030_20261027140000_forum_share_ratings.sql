-- Forum Share posts carry a contextual score without affecting global entity ratings.

create table public.forum_share_ratings (
  post_id uuid primary key references public.posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  entity_id uuid not null references public.entities (id) on delete restrict,
  score numeric(2, 1) not null check (score between 1.0 and 5.0),
  created_at timestamptz not null default now()
);

create index forum_share_ratings_by_entity_idx
  on public.forum_share_ratings (entity_id, created_at desc);

create function public.validate_forum_share_rating_post()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  share_author_id uuid;
  share_entity_id uuid;
  share_forum_id uuid;
  share_post_type public.post_type;
begin
  select posts.author_id, posts.entity_id, posts.forum_id, posts.post_type
  into share_author_id, share_entity_id, share_forum_id, share_post_type
  from public.posts
  where posts.id = new.post_id;

  if not found
    or share_post_type <> 'SHARE'
    or share_forum_id is null
    or share_author_id <> new.author_id
    or share_entity_id <> new.entity_id then
    raise exception using
      errcode = '23514',
      constraint = 'forum_share_ratings_post_match',
      message = 'A forum rating must belong to its author’s matching forum Share post.';
  end if;

  return new;
end;
$$;

create trigger forum_share_ratings_validate_post
  before insert or update of author_id, entity_id, post_id
  on public.forum_share_ratings
  for each row execute function public.validate_forum_share_rating_post();

alter table public.forum_share_ratings enable row level security;
revoke all on table public.forum_share_ratings from anon, authenticated;
grant select, insert on table public.forum_share_ratings to authenticated;

create policy "Forum participants can view forum share ratings"
  on public.forum_share_ratings
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.posts
      where posts.id = forum_share_ratings.post_id
    )
  );

create policy "Users can add their own forum share ratings"
  on public.forum_share_ratings
  for insert
  to authenticated
  with check ((select auth.uid()) = author_id);

drop function public.create_forum_post_with_media(
  uuid, uuid, public.post_type, text, uuid, text[]
);

create function public.create_forum_post_with_media(
  p_post_id uuid,
  p_forum_id uuid,
  p_post_type public.post_type,
  p_body text default null,
  p_entity_id uuid default null,
  p_media_paths text[] default array[]::text[],
  p_score numeric default null
)
returns public.posts
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  created_post public.posts;
  media_path text;
  media_position integer := 0;
begin
  if current_user_id is null then
    raise exception using errcode = '42501', message = 'You must be signed in to publish a forum post.';
  end if;
  if not public.can_participate_in_forum(p_forum_id) then
    raise exception using errcode = '42501', message = 'Join this forum before posting in it.';
  end if;
  if cardinality(p_media_paths) > 3 then
    raise exception using errcode = '23514', message = 'A post can contain up to three images.';
  end if;
  if p_post_type = 'SHARE' and (p_entity_id is null or p_score is null or p_score < 1 or p_score > 5) then
    raise exception using errcode = '23514', message = 'A forum Share requires an entity and a rating from 1 to 5.';
  end if;
  if p_post_type = 'ASK' and (p_entity_id is not null or p_score is not null) then
    raise exception using errcode = '23514', message = 'An Ask post cannot include an entity or rating.';
  end if;

  insert into public.posts (id, author_id, post_type, entity_id, forum_id, body)
  values (p_post_id, current_user_id, p_post_type, p_entity_id, p_forum_id, nullif(btrim(p_body), ''))
  returning * into created_post;

  if p_post_type = 'SHARE' then
    insert into public.forum_share_ratings (author_id, entity_id, post_id, score)
    values (current_user_id, p_entity_id, p_post_id, p_score);
  end if;

  foreach media_path in array p_media_paths loop
    media_position := media_position + 1;
    if media_path not like current_user_id::text || '/' || p_post_id::text || '/%' then
      raise exception using errcode = '23514', message = 'Invalid post image path.';
    end if;
    insert into public.post_media (post_id, storage_path, position)
    values (p_post_id, media_path, media_position);
  end loop;
  delete from public.post_image_cleanup
  where owner_id = current_user_id and storage_path = any(p_media_paths);
  return created_post;
end;
$$;

revoke all on function public.create_forum_post_with_media(
  uuid, uuid, public.post_type, text, uuid, text[], numeric
) from public;
grant execute on function public.create_forum_post_with_media(
  uuid, uuid, public.post_type, text, uuid, text[], numeric
) to authenticated;
