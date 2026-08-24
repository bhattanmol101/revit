-- Plan 6.1: comments and one-level replies for accessible posts.

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  parent_id uuid references public.comments (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint comments_body_length
    check (char_length(btrim(body)) between 1 and 2000),
  constraint comments_not_own_parent check (parent_id is distinct from id)
);

create index comments_by_post_parent_created_at_idx
  on public.comments (post_id, parent_id, created_at, id);

create index comments_by_author_created_at_idx
  on public.comments (author_id, created_at desc, id);

create function public.validate_comment_parent()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  parent_post_id uuid;
  parent_parent_id uuid;
begin
  if new.parent_id is null then
    return new;
  end if;

  select comments.post_id, comments.parent_id
  into parent_post_id, parent_parent_id
  from public.comments
  where comments.id = new.parent_id;

  if not found then
    raise exception using
      errcode = '23503',
      constraint = 'comments_parent_id_fkey',
      message = 'The parent comment does not exist.';
  end if;

  if parent_post_id <> new.post_id then
    raise exception using
      errcode = '23514',
      constraint = 'comments_parent_same_post',
      message = 'A reply must belong to the same post as its parent.';
  end if;

  if parent_parent_id is not null then
    raise exception using
      errcode = '23514',
      constraint = 'comments_one_reply_level',
      message = 'Replies cannot have replies.';
  end if;

  return new;
end;
$$;

create trigger comments_validate_parent
  before insert or update of post_id, parent_id on public.comments
  for each row execute function public.validate_comment_parent();

create trigger comments_set_updated_at
  before update on public.comments
  for each row execute function public.set_updated_at();

alter table public.comments enable row level security;

revoke all on table public.comments from anon, authenticated;
grant select, insert, delete on table public.comments to authenticated;
grant update (body) on table public.comments to authenticated;

create policy "Users can view comments on accessible posts"
  on public.comments
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.posts
      where posts.id = comments.post_id
    )
  );

create policy "Users can comment on accessible posts"
  on public.comments
  for insert
  to authenticated
  with check (
    (select auth.uid()) = author_id
    and exists (
      select 1
      from public.posts
      where posts.id = comments.post_id
    )
  );

create policy "Users can update their own comments"
  on public.comments
  for update
  to authenticated
  using ((select auth.uid()) = author_id)
  with check (
    (select auth.uid()) = author_id
    and exists (
      select 1
      from public.posts
      where posts.id = comments.post_id
    )
  );

create policy "Users can delete their own comments"
  on public.comments
  for delete
  to authenticated
  using ((select auth.uid()) = author_id);
