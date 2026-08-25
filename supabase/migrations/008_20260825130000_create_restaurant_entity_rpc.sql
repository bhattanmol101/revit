-- Plan 7.3: authenticated restaurant submission without granting direct entity writes.

create function public.create_restaurant_entity(
  p_name text,
  p_address_line_1 text,
  p_locality text,
  p_address_line_2 text default null,
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
  restaurant_category_id uuid;
  created_entity public.entities;
begin
  if (select auth.uid()) is null then
    raise exception using
      errcode = '42501',
      message = 'You must be signed in to add a restaurant.';
  end if;

  select entity_categories.id
  into restaurant_category_id
  from public.entity_categories
  where entity_categories.slug = 'restaurant';

  if restaurant_category_id is null then
    raise exception using
      errcode = '23514',
      message = 'The restaurant category is unavailable.';
  end if;

  insert into public.entities (
    category_id,
    name,
    address_line_1,
    address_line_2,
    locality,
    administrative_area,
    country_code,
    postal_code
  )
  values (
    restaurant_category_id,
    p_name,
    p_address_line_1,
    p_address_line_2,
    p_locality,
    p_administrative_area,
    p_country_code,
    p_postal_code
  )
  returning * into created_entity;

  return created_entity;
exception
  when unique_violation then
    raise exception using
      errcode = '23505',
      constraint = 'entities_category_name_locality_address_key',
      message = 'A restaurant with the same name and address already exists.';
end;
$$;

revoke all on function public.create_restaurant_entity(
  text, text, text, text, text, text, text
) from public;
grant execute on function public.create_restaurant_entity(
  text, text, text, text, text, text, text
) to authenticated;
