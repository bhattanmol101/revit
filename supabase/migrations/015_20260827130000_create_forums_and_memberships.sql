-- Plan 11.1: public forums with member-only participation.

create table public.forums (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  slug text not null,
  name text not null,
  description text,
  rules text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint forums_slug_format check (slug ~ '^[a-z][a-z0-9-]{2,62}$'),
  constraint forums_slug_key unique (slug),
  constraint forums_name_length check (char_length(btrim(name)) between 1 and 100),
  constraint forums_description_length check (
    description is null or char_length(btrim(description)) <= 1_000
  ),
  constraint forums_rules_length check (char_length(btrim(rules)) <= 2_000)
);

create table public.forum_memberships (
  forum_id uuid not null references public.forums (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (forum_id, user_id)
);

create index forums_by_created_at_idx on public.forums (created_at desc, id);
create index forum_memberships_by_user_created_at_idx
  on public.forum_memberships (user_id, created_at desc, forum_id);

create function public.prepare_forum()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.slug := lower(btrim(new.slug));
  new.name := btrim(new.name);
  new.description := nullif(btrim(new.description), '');
  new.rules := btrim(new.rules);
  return new;
end;
$$;

create trigger forums_prepare
  before insert or update of slug, name, description, rules on public.forums
  for each row execute function public.prepare_forum();

create trigger forums_set_updated_at
  before update on public.forums
  for each row execute function public.set_updated_at();

create function public.add_forum_owner_membership()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  insert into public.forum_memberships (forum_id, user_id)
  values (new.id, new.owner_id);
  return new;
end;
$$;

create trigger forums_add_owner_membership
  after insert on public.forums
  for each row execute function public.add_forum_owner_membership();

alter table public.forums enable row level security;
alter table public.forum_memberships enable row level security;

revoke all on table public.forums from anon, authenticated;
revoke all on table public.forum_memberships from anon, authenticated;
grant select, insert, update, delete on table public.forums to authenticated;
grant select, insert, delete on table public.forum_memberships to authenticated;

create policy "Authenticated users can view forums"
  on public.forums
  for select
  to authenticated
  using (true);

create policy "Users can create their own forums"
  on public.forums
  for insert
  to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "Forum owners can update their forums"
  on public.forums
  for update
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy "Forum owners can delete their forums"
  on public.forums
  for delete
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Authenticated users can view forum memberships"
  on public.forum_memberships
  for select
  to authenticated
  using (true);

create policy "Users can join forums themselves"
  on public.forum_memberships
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Members can leave forums they do not own"
  on public.forum_memberships
  for delete
  to authenticated
  using (
    (select auth.uid()) = user_id
    and not exists (
      select 1
      from public.forums
      where forums.id = forum_memberships.forum_id
        and forums.owner_id = forum_memberships.user_id
    )
  );
