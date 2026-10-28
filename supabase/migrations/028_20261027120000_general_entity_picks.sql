-- Allow personal Picks to contain any entity category.
create or replace function public.validate_pick_item_restaurant()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (select 1 from public.entities where id = new.entity_id) then
    raise exception using errcode = '23503', message = 'Pick items must reference a valid entity.';
  end if;
  return new;
end;
$$;
