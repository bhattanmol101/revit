-- Plan 8.1: one global rating per user and restaurant, backed by a Share post.

create table public.entity_ratings (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities (id) on delete restrict,
  author_id uuid not null references public.profiles (id) on delete cascade,
  post_id uuid not null references public.posts (id) on delete cascade,
  score numeric(2, 1) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint entity_ratings_score_range check (score between 1.0 and 5.0),
  constraint entity_ratings_author_entity_key unique (author_id, entity_id),
  constraint entity_ratings_post_key unique (post_id)
);

create index entity_ratings_by_entity_created_at_idx
  on public.entity_ratings (entity_id, created_at desc, id);

create index entity_ratings_by_author_created_at_idx
  on public.entity_ratings (author_id, created_at desc, id);

create trigger entity_ratings_set_updated_at
  before update on public.entity_ratings
  for each row execute function public.set_updated_at();

create function public.validate_entity_rating_post()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  rated_post_author_id uuid;
  rated_post_entity_id uuid;
  rated_post_type public.post_type;
begin
  select posts.author_id, posts.entity_id, posts.post_type
  into rated_post_author_id, rated_post_entity_id, rated_post_type
  from public.posts
  where posts.id = new.post_id;

  if not found
    or rated_post_type <> 'SHARE'
    or rated_post_author_id <> new.author_id
    or rated_post_entity_id <> new.entity_id then
    raise exception using
      errcode = '23514',
      constraint = 'entity_ratings_share_post_match',
      message = 'A restaurant rating must belong to its author’s matching Share post.';
  end if;

  return new;
end;
$$;

create trigger entity_ratings_validate_post
  before insert or update of entity_id, author_id, post_id on public.entity_ratings
  for each row execute function public.validate_entity_rating_post();

alter table public.entity_ratings enable row level security;

revoke all on table public.entity_ratings from anon, authenticated;
grant select, insert, delete on table public.entity_ratings to authenticated;
grant update (score) on table public.entity_ratings to authenticated;

create policy "Authenticated users can view restaurant ratings"
  on public.entity_ratings
  for select
  to authenticated
  using (true);

create policy "Users can add their own restaurant ratings"
  on public.entity_ratings
  for insert
  to authenticated
  with check ((select auth.uid()) = author_id);

create policy "Users can update their own restaurant ratings"
  on public.entity_ratings
  for update
  to authenticated
  using ((select auth.uid()) = author_id)
  with check ((select auth.uid()) = author_id);

create policy "Users can delete their own restaurant ratings"
  on public.entity_ratings
  for delete
  to authenticated
  using ((select auth.uid()) = author_id);
