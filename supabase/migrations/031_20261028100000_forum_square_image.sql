alter table public.forums
  add column image_path text,
  add constraint forums_image_path_length check (
    image_path is null or char_length(image_path) between 1 and 512
  );

drop function public.get_forum_summaries(uuid);

create function public.get_forum_summaries(p_forum_id uuid default null)
returns table (
  id uuid,
  owner_id uuid,
  slug text,
  name text,
  description text,
  rules text,
  image_path text,
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
    forums.image_path,
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

drop policy if exists "Authenticated users can view registered forum covers"
  on storage.objects;

create policy "Authenticated users can view registered forum images"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'forum-images'
    and exists (
      select 1
      from public.forums
      where forums.image_path = storage.objects.name
        or forums.cover_image_path = storage.objects.name
    )
  );

drop policy if exists "Forum owners can upload covers to their own paths"
  on storage.objects;

create policy "Forum owners can upload images to their own paths"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'forum-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and array_length(storage.foldername(name), 1) = 2
    and (storage.foldername(name))[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    and storage.filename(name) ~* '^(image|cover)\.(jpg|jpeg|png|webp|heic|heif)$'
  );

drop policy if exists "Forum owners can delete their own cover paths"
  on storage.objects;

create policy "Forum owners can delete their own forum images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'forum-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and array_length(storage.foldername(name), 1) = 2
    and (storage.foldername(name))[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    and storage.filename(name) ~* '^(image|cover)\.(jpg|jpeg|png|webp|heic|heif)$'
  );
