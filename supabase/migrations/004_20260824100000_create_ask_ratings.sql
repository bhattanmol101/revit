-- Plan 5.1: authenticated users can rate Ask posts once with a 1.0–5.0 score.

create table public.ratings (
  rater_id uuid not null references public.profiles (id) on delete cascade,
  post_id uuid not null references public.posts (id) on delete cascade,
  score numeric(2, 1) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ratings_pkey primary key (rater_id, post_id),
  constraint ratings_score_range check (score between 1.0 and 5.0)
);

create index ratings_by_post_created_at_idx
  on public.ratings (post_id, created_at desc, rater_id);

create index ratings_by_rater_created_at_idx
  on public.ratings (rater_id, created_at desc, post_id);

create function public.ensure_rating_targets_ask_post()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  target_post_type public.post_type;
begin
  select posts.post_type
  into target_post_type
  from public.posts
  where posts.id = new.post_id;

  if target_post_type is distinct from 'ASK' then
    raise exception using
      errcode = '23514',
      constraint = 'ratings_ask_posts_only',
      message = 'Ratings can only target Ask posts.';
  end if;

  return new;
end;
$$;

create trigger ratings_require_ask_post
  before insert or update of post_id on public.ratings
  for each row execute function public.ensure_rating_targets_ask_post();

create function public.prevent_rated_post_type_change()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.post_type = 'ASK'
    and new.post_type <> 'ASK'
    and exists (
      select 1
      from public.ratings
      where ratings.post_id = old.id
    )
  then
    raise exception using
      errcode = '23514',
      constraint = 'ratings_ask_posts_only',
      message = 'A rated Ask post cannot be changed to another post type.';
  end if;

  return new;
end;
$$;

create trigger posts_keep_rated_posts_as_ask
  before update of post_type on public.posts
  for each row execute function public.prevent_rated_post_type_change();

create trigger ratings_set_updated_at
  before update on public.ratings
  for each row execute function public.set_updated_at();

alter table public.ratings enable row level security;

revoke all on table public.ratings from anon, authenticated;
grant select, insert, delete on table public.ratings to authenticated;
grant update (score) on table public.ratings to authenticated;

create policy "Authenticated users can view Ask ratings"
  on public.ratings
  for select
  to authenticated
  using (true);

create policy "Users can create their own Ask ratings"
  on public.ratings
  for insert
  to authenticated
  with check ((select auth.uid()) = rater_id);

create policy "Users can update their own Ask ratings"
  on public.ratings
  for update
  to authenticated
  using ((select auth.uid()) = rater_id)
  with check ((select auth.uid()) = rater_id);

create policy "Users can delete their own Ask ratings"
  on public.ratings
  for delete
  to authenticated
  using ((select auth.uid()) = rater_id);
