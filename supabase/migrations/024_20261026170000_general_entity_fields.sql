-- Phase 1: allow the entity table to represent non-place entities while
-- preserving existing restaurant rows and their current uniqueness behavior.

alter table public.entities
  add column description text,
  add column image_url text;

alter table public.entities
  alter column address_line_1 drop not null,
  alter column locality drop not null,
  alter column normalized_address drop not null,
  alter column normalized_locality drop not null;

alter table public.entities
  drop constraint entities_address_line_1_length,
  drop constraint entities_locality_length,
  drop constraint entities_normalized_address_length,
  drop constraint entities_normalized_locality_length;

alter table public.entities
  add constraint entities_address_line_1_length check (
    address_line_1 is null or char_length(btrim(address_line_1)) between 1 and 200
  ),
  add constraint entities_locality_length check (
    locality is null or char_length(btrim(locality)) between 1 and 120
  ),
  add constraint entities_normalized_address_length check (
    normalized_address is null or char_length(normalized_address) between 1 and 500
  ),
  add constraint entities_normalized_locality_length check (
    normalized_locality is null or char_length(normalized_locality) between 1 and 120
  ),
  add constraint entities_description_length check (
    description is null or char_length(btrim(description)) between 1 and 2000
  ),
  add constraint entities_image_url_length check (
    image_url is null or char_length(btrim(image_url)) between 1 and 2048
  );

create or replace function public.prepare_entity()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.name := btrim(new.name);
  new.description := nullif(btrim(new.description), '');
  new.image_url := nullif(btrim(new.image_url), '');
  new.address_line_1 := nullif(btrim(new.address_line_1), '');
  new.address_line_2 := nullif(btrim(new.address_line_2), '');
  new.locality := nullif(btrim(new.locality), '');
  new.administrative_area := nullif(btrim(new.administrative_area), '');
  new.country_code := nullif(upper(btrim(new.country_code)), '');
  new.postal_code := nullif(btrim(new.postal_code), '');
  new.normalized_name := public.normalize_entity_text(new.name);
  new.normalized_locality := case
    when new.locality is null then null
    else public.normalize_entity_text(new.locality)
  end;
  new.normalized_address := case
    when new.address_line_1 is null and new.address_line_2 is null and new.postal_code is null then null
    else public.normalize_entity_text(
      concat_ws(' ', new.address_line_1, new.address_line_2, new.postal_code)
    )
  end;

  return new;
end;
$$;

drop index public.entities_by_category_name_idx;
create index entities_by_category_name_idx
  on public.entities (category_id, normalized_name, normalized_locality);
