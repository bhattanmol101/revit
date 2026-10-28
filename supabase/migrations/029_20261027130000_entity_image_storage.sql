-- Entity photos are public profile content. Uploads are owner-scoped by path.
insert into storage.buckets (
  id, name, public, file_size_limit, allowed_mime_types
)
values (
  'entity-images', 'entity-images', true, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
);

create policy "Authenticated users can upload entity images"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'entity-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Owners can replace entity images"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'entity-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'entity-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Owners can delete entity images"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'entity-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
