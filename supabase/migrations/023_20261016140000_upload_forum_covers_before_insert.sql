-- Allow an authenticated owner to upload a cover to their own reserved forum
-- UUID path before the forum row is inserted. The row stores the path only
-- after the upload succeeds; failed inserts can remove the orphaned object.

drop policy if exists "Forum owners can upload their registered cover"
  on storage.objects;

drop function if exists public.can_upload_forum_cover(text);

create policy "Forum owners can upload covers to their own paths"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'forum-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and array_length(storage.foldername(name), 1) = 2
    and (storage.foldername(name))[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    and storage.filename(name) ~* '^cover\.(jpg|jpeg|png|webp|heic|heif)$'
  );

drop policy if exists "Forum owners can delete their covers"
  on storage.objects;

create policy "Forum owners can delete their own cover paths"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'forum-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and array_length(storage.foldername(name), 1) = 2
    and (storage.foldername(name))[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    and storage.filename(name) ~* '^cover\.(jpg|jpeg|png|webp|heic|heif)$'
  );
