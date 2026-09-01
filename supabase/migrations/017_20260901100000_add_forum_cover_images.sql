alter table public.forums add column cover_image_path text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('forum-images', 'forum-images', false, 10485760, array['image/jpeg','image/png','image/webp','image/heic','image/heif']);

create policy "Authenticated users can view forum covers" on storage.objects for select to authenticated using (bucket_id = 'forum-images');
create policy "Forum owners can upload covers" on storage.objects for insert to authenticated with check (bucket_id = 'forum-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Forum owners can delete covers" on storage.objects for delete to authenticated using (bucket_id = 'forum-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
