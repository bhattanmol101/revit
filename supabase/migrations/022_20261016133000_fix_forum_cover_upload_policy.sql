-- Evaluate forum ownership without the storage.objects policy inheriting
-- forums RLS state. The path must already be registered on the owner's forum.

create or replace function public.can_upload_forum_cover(p_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.forums
    where forums.owner_id = (select auth.uid())
      and forums.id::text = (storage.foldername(p_name))[2]
      and forums.cover_image_path = p_name
  );
$$;

revoke all on function public.can_upload_forum_cover(text) from public;
grant execute on function public.can_upload_forum_cover(text) to authenticated;

drop policy if exists "Forum owners can upload their registered cover"
  on storage.objects;

create policy "Forum owners can upload their registered cover"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'forum-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and public.can_upload_forum_cover(name)
  );
