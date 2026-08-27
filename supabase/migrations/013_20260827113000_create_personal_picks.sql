-- Plan 10.2: public, user-owned restaurant collections. Dynamic picks are out of scope.

create type public.pick_type as enum ('PERSONAL');

create table public.picks (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  pick_type public.pick_type not null default 'PERSONAL',
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint picks_title_length check (char_length(btrim(title)) between 1 and 100),
  constraint picks_description_length check (
    description is null or char_length(btrim(description)) <= 1_000
  )
);

create table public.pick_items (
  pick_id uuid not null references public.picks (id) on delete cascade,
  entity_id uuid not null references public.entities (id) on delete restrict,
  position integer not null,
  note text,
  created_at timestamptz not null default now(),
  primary key (pick_id, entity_id),
  constraint pick_items_position_positive check (position >= 1),
  constraint pick_items_pick_position_key unique (pick_id, position),
  constraint pick_items_note_length check (
    note is null or char_length(btrim(note)) <= 500
  )
);

create index picks_by_author_created_at_idx
  on public.picks (author_id, created_at desc, id);

create index pick_items_by_pick_position_idx
  on public.pick_items (pick_id, position, entity_id);

create trigger picks_set_updated_at
  before update on public.picks
  for each row execute function public.set_updated_at();

create function public.validate_pick_item_restaurant()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  entity_category_slug text;
begin
  select entity_categories.slug
  into entity_category_slug
  from public.entities
  join public.entity_categories on entity_categories.id = entities.category_id
  where entities.id = new.entity_id;

  if entity_category_slug is distinct from 'restaurant' then
    raise exception using
      errcode = '23514',
      constraint = 'pick_items_restaurant_entity',
      message = 'Pick items must reference a restaurant entity.';
  end if;

  return new;
end;
$$;

create trigger pick_items_validate_restaurant
  before insert or update of entity_id on public.pick_items
  for each row execute function public.validate_pick_item_restaurant();

alter table public.picks enable row level security;
alter table public.pick_items enable row level security;

revoke all on table public.picks from anon, authenticated;
revoke all on table public.pick_items from anon, authenticated;
grant select, insert, update, delete on table public.picks to authenticated;
grant select, insert, update, delete on table public.pick_items to authenticated;

create policy "Authenticated users can view picks"
  on public.picks
  for select
  to authenticated
  using (true);

create policy "Users can create their own picks"
  on public.picks
  for insert
  to authenticated
  with check ((select auth.uid()) = author_id);

create policy "Users can update their own picks"
  on public.picks
  for update
  to authenticated
  using ((select auth.uid()) = author_id)
  with check ((select auth.uid()) = author_id);

create policy "Users can delete their own picks"
  on public.picks
  for delete
  to authenticated
  using ((select auth.uid()) = author_id);

create policy "Authenticated users can view pick items"
  on public.pick_items
  for select
  to authenticated
  using (true);

create policy "Pick owners can add items"
  on public.pick_items
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.picks
      where picks.id = pick_items.pick_id
        and picks.author_id = (select auth.uid())
    )
  );

create policy "Pick owners can update items"
  on public.pick_items
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.picks
      where picks.id = pick_items.pick_id
        and picks.author_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.picks
      where picks.id = pick_items.pick_id
        and picks.author_id = (select auth.uid())
    )
  );

create policy "Pick owners can delete items"
  on public.pick_items
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.picks
      where picks.id = pick_items.pick_id
        and picks.author_id = (select auth.uid())
    )
  );
