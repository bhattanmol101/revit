-- Create forum posts and their media atomically, and only expose stale upload
-- reservations to the client-side storage cleanup worker.

create or replace function public.create_forum_post_with_media(
  p_post_id uuid,
  p_forum_id uuid,
  p_post_type public.post_type,
  p_body text default null,
  p_entity_id uuid default null,
  p_media_paths text[] default array[]::text[]
)
returns public.posts
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  created_post public.posts;
  media_path text;
  media_position integer := 0;
begin
  if current_user_id is null then
    raise exception using errcode = '42501', message = 'You must be signed in to publish a forum post.';
  end if;
  if not public.can_participate_in_forum(p_forum_id) then
    raise exception using errcode = '42501', message = 'Join this forum before posting in it.';
  end if;
  if cardinality(p_media_paths) > 3 then
    raise exception using errcode = '23514', message = 'A post can contain up to three images.';
  end if;
  if p_post_type = 'SHARE' and p_entity_id is null then
    raise exception using errcode = '23514', message = 'A Share post requires a restaurant.';
  end if;
  if p_post_type = 'ASK' and p_entity_id is not null then
    raise exception using errcode = '23514', message = 'An Ask post cannot include a restaurant.';
  end if;
  insert into public.posts (
    id,
    author_id,
    post_type,
    entity_id,
    forum_id,
    body
  )
  values (
    p_post_id,
    current_user_id,
    p_post_type,
    p_entity_id,
    p_forum_id,
    nullif(btrim(p_body), '')
  )
  returning * into created_post;

  foreach media_path in array p_media_paths loop
    media_position := media_position + 1;
    if media_path not like current_user_id::text || '/' || p_post_id::text || '/%' then
      raise exception using errcode = '23514', message = 'Invalid post image path.';
    end if;

    insert into public.post_media (post_id, storage_path, position)
    values (p_post_id, media_path, media_position);
  end loop;

  delete from public.post_image_cleanup
  where owner_id = current_user_id and storage_path = any(p_media_paths);

  return created_post;
end;
$$;

revoke all on function public.create_forum_post_with_media(
  uuid,
  uuid,
  public.post_type,
  text,
  uuid,
  text[]
) from public;
grant execute on function public.create_forum_post_with_media(
  uuid,
  uuid,
  public.post_type,
  text,
  uuid,
  text[]
) to authenticated;

create or replace function public.get_stale_post_image_cleanup()
returns setof text
language sql
stable
security invoker
set search_path = ''
as $$
  select post_image_cleanup.storage_path
  from public.post_image_cleanup
  where post_image_cleanup.owner_id = (select auth.uid())
    and post_image_cleanup.created_at < now() - interval '1 hour'
  order by post_image_cleanup.created_at, post_image_cleanup.storage_path;
$$;

revoke all on function public.get_stale_post_image_cleanup() from public;
grant execute on function public.get_stale_post_image_cleanup() to authenticated;

create or replace function public.get_forum_summaries(p_forum_id uuid default null)
returns table (
  id uuid,
  owner_id uuid,
  slug text,
  name text,
  description text,
  rules text,
  cover_image_path text,
  created_at timestamptz,
  updated_at timestamptz,
  member_count bigint,
  is_member boolean
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    forums.id,
    forums.owner_id,
    forums.slug,
    forums.name,
    forums.description,
    forums.rules,
    forums.cover_image_path,
    forums.created_at,
    forums.updated_at,
    count(forum_memberships.user_id) as member_count,
    coalesce(bool_or(forum_memberships.user_id = (select auth.uid())), false) as is_member
  from public.forums
  left join public.forum_memberships
    on forum_memberships.forum_id = forums.id
  where p_forum_id is null or forums.id = p_forum_id
  group by forums.id
  order by forums.created_at desc, forums.id;
$$;

revoke all on function public.get_forum_summaries(uuid) from public;
grant execute on function public.get_forum_summaries(uuid) to authenticated;
