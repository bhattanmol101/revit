-- Plan 7.1: platform-managed restaurant entities for normal Share posts.

create table public.entity_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  label text not null,
  created_at timestamptz not null default now(),
  constraint entity_categories_slug_format check (
    slug ~ '^[a-z][a-z0-9-]{1,62}$'
  ),
  constraint entity_categories_label_length check (
    char_length(btrim(label)) between 1 and 80
  ),
  constraint entity_categories_slug_key unique (slug),
  constraint entity_categories_label_key unique (label)
);

create table public.entities (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.entity_categories (id) on delete restrict,
  name text not null,
  normalized_name text not null,
  address_line_1 text not null,
  address_line_2 text,
  locality text not null,
  administrative_area text,
  country_code text,
  postal_code text,
  normalized_address text not null,
  normalized_locality text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint entities_name_length check (char_length(btrim(name)) between 1 and 160),
  constraint entities_address_line_1_length check (
    char_length(btrim(address_line_1)) between 1 and 200
  ),
  constraint entities_address_line_2_length check (
    address_line_2 is null or char_length(btrim(address_line_2)) between 1 and 200
  ),
  constraint entities_locality_length check (
    char_length(btrim(locality)) between 1 and 120
  ),
  constraint entities_administrative_area_length check (
    administrative_area is null
    or char_length(btrim(administrative_area)) between 1 and 120
  ),
  constraint entities_country_code_format check (
    country_code is null or country_code ~ '^[A-Z]{2}$'
  ),
  constraint entities_postal_code_length check (
    postal_code is null or char_length(btrim(postal_code)) between 1 and 24
  ),
  constraint entities_normalized_name_length check (
    char_length(normalized_name) between 1 and 160
  ),
  constraint entities_normalized_address_length check (
    char_length(normalized_address) between 1 and 500
  ),
  constraint entities_normalized_locality_length check (
    char_length(normalized_locality) between 1 and 120
  ),
  constraint entities_category_name_locality_address_key unique (
    category_id,
    normalized_name,
    normalized_locality,
    normalized_address
  )
);

create index entities_by_category_name_idx
  on public.entities (category_id, normalized_name, normalized_locality);

create function public.normalize_entity_text(value text)
returns text
language sql
immutable
set search_path = ''
as $$
  select lower(regexp_replace(btrim(value), '\s+', ' ', 'g'));
$$;

create function public.prepare_entity()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.name := btrim(new.name);
  new.locality := btrim(new.locality);
  new.address_line_1 := nullif(btrim(new.address_line_1), '');
  new.address_line_2 := nullif(btrim(new.address_line_2), '');
  new.administrative_area := nullif(btrim(new.administrative_area), '');
  new.country_code := nullif(upper(btrim(new.country_code)), '');
  new.postal_code := nullif(btrim(new.postal_code), '');
  new.normalized_name := public.normalize_entity_text(new.name);
  new.normalized_locality := public.normalize_entity_text(new.locality);
  new.normalized_address := public.normalize_entity_text(
    concat_ws(' ', new.address_line_1, new.address_line_2, new.postal_code)
  );

  return new;
end;
$$;

create trigger entities_prepare
  before insert or update of name, address_line_1, address_line_2, locality,
    administrative_area, country_code, postal_code on public.entities
  for each row execute function public.prepare_entity();

create trigger entities_set_updated_at
  before update on public.entities
  for each row execute function public.set_updated_at();

alter table public.entity_categories enable row level security;
alter table public.entities enable row level security;

revoke all on table public.entity_categories from anon, authenticated;
revoke all on table public.entities from anon, authenticated;
grant select on table public.entity_categories to authenticated;
grant select on table public.entities to authenticated;

create policy "Authenticated users can view entity categories"
  on public.entity_categories
  for select
  to authenticated
  using (true);

create policy "Authenticated users can view entities"
  on public.entities
  for select
  to authenticated
  using (true);

insert into public.entity_categories (slug, label)
values ('restaurant', 'Restaurant');

alter table public.posts
  add constraint posts_entity_id_fkey
  foreign key (entity_id) references public.entities (id) on delete restrict;

alter table public.posts
  add constraint posts_share_entity_required check (
    post_type <> 'SHARE' or entity_id is not null
  );

create function public.validate_share_post_entity()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  entity_category_slug text;
begin
  if new.post_type <> 'SHARE' then
    return new;
  end if;

  select entity_categories.slug
  into entity_category_slug
  from public.entities
  join public.entity_categories on entity_categories.id = entities.category_id
  where entities.id = new.entity_id;

  if entity_category_slug is distinct from 'restaurant' then
    raise exception using
      errcode = '23514',
      constraint = 'posts_share_restaurant_entity',
      message = 'Share posts must reference a restaurant entity.';
  end if;

  return new;
end;
$$;

create trigger posts_validate_share_entity
  before insert or update of post_type, entity_id on public.posts
  for each row execute function public.validate_share_post_entity();
