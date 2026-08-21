-- Plan 3.1: authenticated users can follow profiles and remove only their own follows.

create table public.follows (
  follower_id uuid not null references public.profiles (id) on delete cascade,
  following_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint follows_pkey primary key (follower_id, following_id),
  constraint follows_no_self_follow check (follower_id <> following_id)
);

create index follows_by_follower_created_at_idx
  on public.follows (follower_id, created_at desc, following_id);

create index follows_by_following_created_at_idx
  on public.follows (following_id, created_at desc, follower_id);

alter table public.follows enable row level security;

revoke all on table public.follows from anon, authenticated;
grant select, insert, delete on table public.follows to authenticated;

create policy "Authenticated users can view follows"
  on public.follows
  for select
  to authenticated
  using (true);

create policy "Users can create their own follows"
  on public.follows
  for insert
  to authenticated
  with check ((select auth.uid()) = follower_id);

create policy "Users can delete their own follows"
  on public.follows
  for delete
  to authenticated
  using ((select auth.uid()) = follower_id);
