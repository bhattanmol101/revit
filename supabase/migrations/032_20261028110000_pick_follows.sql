create table public.pick_follows (
  user_id uuid not null references public.profiles(id) on delete cascade,
  pick_id uuid not null references public.picks(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, pick_id)
);
alter table public.pick_follows enable row level security;
grant select, insert, delete on public.pick_follows to authenticated;
create policy "Users can see their pick follows" on public.pick_follows for select to authenticated using (user_id = (select auth.uid()));
create policy "Users can follow picks from people they follow" on public.pick_follows for insert to authenticated with check (
  user_id = (select auth.uid()) and exists (
    select 1 from public.picks p join public.follows f on f.following_id = p.author_id
    where p.id = pick_id and f.follower_id = (select auth.uid())
  )
);
create policy "Users can unfollow picks" on public.pick_follows for delete to authenticated using (user_id = (select auth.uid()));
