-- Plan 10.3: create and replace a Pick atomically, including its ordered items.

create function public.create_personal_pick(
  p_title text,
  p_description text default null,
  p_items jsonb default '[]'::jsonb
)
returns public.picks
language plpgsql
set search_path = ''
as $$
declare
  created_pick public.picks;
begin
  if (select auth.uid()) is null then
    raise exception using
      errcode = '42501',
      message = 'You must be signed in to create a Pick.';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception using
      errcode = '23514',
      constraint = 'personal_pick_items_required',
      message = 'A Pick needs at least one restaurant.';
  end if;

  insert into public.picks (author_id, title, description)
  values ((select auth.uid()), p_title, nullif(btrim(p_description), ''))
  returning * into created_pick;

  insert into public.pick_items (pick_id, entity_id, position, note)
  select
    created_pick.id,
    item.entity_id,
    item.position,
    nullif(btrim(item.note), '')
  from jsonb_to_recordset(p_items) as item(
    entity_id uuid,
    position integer,
    note text
  );

  return created_pick;
end;
$$;

create function public.update_personal_pick(
  p_pick_id uuid,
  p_title text,
  p_description text default null,
  p_items jsonb default '[]'::jsonb
)
returns public.picks
language plpgsql
set search_path = ''
as $$
declare
  updated_pick public.picks;
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception using
      errcode = '23514',
      constraint = 'personal_pick_items_required',
      message = 'A Pick needs at least one restaurant.';
  end if;

  update public.picks
  set
    title = p_title,
    description = nullif(btrim(p_description), '')
  where id = p_pick_id
    and author_id = (select auth.uid())
    and pick_type = 'PERSONAL'
  returning * into updated_pick;

  if not found then
    raise exception using
      errcode = '42501',
      message = 'You can only update your own Pick.';
  end if;

  delete from public.pick_items
  where pick_id = updated_pick.id;

  insert into public.pick_items (pick_id, entity_id, position, note)
  select
    updated_pick.id,
    item.entity_id,
    item.position,
    nullif(btrim(item.note), '')
  from jsonb_to_recordset(p_items) as item(
    entity_id uuid,
    position integer,
    note text
  );

  return updated_pick;
end;
$$;

revoke all on function public.create_personal_pick(text, text, jsonb) from public;
revoke all on function public.update_personal_pick(uuid, text, text, jsonb) from public;
grant execute on function public.create_personal_pick(text, text, jsonb) to authenticated;
grant execute on function public.update_personal_pick(uuid, text, text, jsonb) to authenticated;
