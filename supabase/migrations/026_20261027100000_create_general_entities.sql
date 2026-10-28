-- Phase 3: expose category-aware entity creation to authenticated clients.

create function public.create_entity(
  p_category_slug text,
  p_name text,
  p_description text default null,
  p_image_url text default null,
  p_address_line_1 text default null,
  p_address_line_2 text default null,
  p_locality text default null,
  p_administrative_area text default null,
  p_country_code text default null,
  p_postal_code text default null
)
returns public.entities
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  selected_category_id uuid;
  created_entity public.entities;
begin
  if current_user_id is null then
    raise exception using errcode = '42501', message = 'You must be signed in to create an entity.';
  end if;
  select id into selected_category_id
  from public.entity_categories
  where slug = lower(btrim(p_category_slug));
  if selected_category_id is null then
    raise exception using errcode = '23503', message = 'Choose a valid entity category.';
  end if;
  if nullif(btrim(p_name), '') is null then
    raise exception using errcode = '23514', message = 'An entity name is required.';
  end if;

  insert into public.entities (
    category_id, name, description, image_url,
    address_line_1, address_line_2, locality,
    administrative_area, country_code, postal_code
  ) values (
    selected_category_id, p_name, p_description, p_image_url,
    p_address_line_1, p_address_line_2, p_locality,
    p_administrative_area, p_country_code, p_postal_code
  ) returning * into created_entity;

  return created_entity;
end;
$$;

revoke all on function public.create_entity(text, text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.create_entity(text, text, text, text, text, text, text, text, text, text) to authenticated;
