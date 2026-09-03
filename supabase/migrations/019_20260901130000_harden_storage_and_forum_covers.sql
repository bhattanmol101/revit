-- Plan 12.2: close the remaining Storage ownership gap for forum covers.

alter table public.forums
  add constraint forums_cover_image_path_length check (
    cover_image_path is null or char_length(cover_image_path) between 1 and 512
  );

drop policy "Authenticated users can view forum covers" on storage.objects;
drop policy "Forum owners can upload covers" on storage.objects;
drop policy "Forum owners can delete covers" on storage.objects;

create policy "Authenticated users can view registered forum covers"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'forum-images'
    and exists (
      select 1 from public.forums
      where forums.cover_image_path = storage.objects.name
    )
  );

create policy "Forum owners can upload their registered cover"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'forum-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (
      select 1 from public.forums
      where forums.owner_id = (select auth.uid())
        and forums.id::text = (storage.foldername(name))[2]
    )
  );

create policy "Forum owners can delete their covers"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'forum-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (
      select 1 from public.forums
      where forums.owner_id = (select auth.uid())
        and forums.id::text = (storage.foldername(name))[2]
    )
  );
