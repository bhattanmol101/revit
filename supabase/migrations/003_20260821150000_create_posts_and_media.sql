-- Plan 4.1: normal Ask and Share posts with up to three owned images.
-- The entity_id foreign key is added when restaurant entities are introduced in Plan 7.

create type public.post_type as enum ('ASK', 'SHARE');

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  post_type public.post_type not null,
  entity_id uuid,
  title text,
  body text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint posts_title_length check (
    title is null or char_length(trim(title)) between 1 and 120
  ),
  constraint posts_body_length check (
    body is null or char_length(trim(body)) between 1 and 2000
  ),
  constraint posts_ask_title_required check (
    post_type <> 'ASK' or title is not null
  ),
  constraint posts_ask_has_no_entity check (
    post_type <> 'ASK' or entity_id is null
  )
);

create index posts_by_author_created_at_idx
  on public.posts (author_id, created_at desc, id);

create index posts_by_type_created_at_idx
  on public.posts (post_type, created_at desc, id);

create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

alter table public.posts enable row level security;

revoke all on table public.posts from anon, authenticated;
grant select, insert, delete on table public.posts to authenticated;
grant update (title, body) on table public.posts to authenticated;

create policy "Authenticated users can view posts"
  on public.posts
  for select
  to authenticated
  using (true);

create policy "Users can create their own posts"
  on public.posts
  for insert
  to authenticated
  with check ((select auth.uid()) = author_id);

create policy "Users can update their own posts"
  on public.posts
  for update
  to authenticated
  using ((select auth.uid()) = author_id)
  with check ((select auth.uid()) = author_id);

create policy "Users can delete their own posts"
  on public.posts
  for delete
  to authenticated
  using ((select auth.uid()) = author_id);

create table public.post_media (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  storage_path text not null,
  position smallint not null,
  alt_text text,
  created_at timestamptz not null default now(),
  constraint post_media_storage_path_key unique (storage_path),
  constraint post_media_post_position_key unique (post_id, position),
  constraint post_media_position_range check (position between 1 and 3),
  constraint post_media_storage_path_length check (
    char_length(storage_path) between 1 and 512
  ),
  constraint post_media_alt_text_length check (
    alt_text is null or char_length(trim(alt_text)) between 1 and 300
  )
);

create index post_media_by_post_idx
  on public.post_media (post_id, position);

alter table public.post_media enable row level security;

revoke all on table public.post_media from anon, authenticated;
grant select, insert, delete on table public.post_media to authenticated;
grant update (position, alt_text) on table public.post_media to authenticated;

create policy "Authenticated users can view post media"
  on public.post_media
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.posts
      where posts.id = post_media.post_id
    )
  );

create policy "Authors can add media to their posts"
  on public.post_media
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.posts
      where posts.id = post_media.post_id
        and posts.author_id = (select auth.uid())
        and post_media.storage_path like (select auth.uid())::text || '/' || posts.id::text || '/%'
    )
  );

create policy "Authors can update their post media"
  on public.post_media
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.posts
      where posts.id = post_media.post_id
        and posts.author_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.posts
      where posts.id = post_media.post_id
        and posts.author_id = (select auth.uid())
        and post_media.storage_path like (select auth.uid())::text || '/' || posts.id::text || '/%'
    )
  );

create policy "Authors can delete their post media"
  on public.post_media
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.posts
      where posts.id = post_media.post_id
        and posts.author_id = (select auth.uid())
    )
  );

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'post-images',
  'post-images',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
);

create policy "Authenticated users can view registered post images"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'post-images'
    and exists (
      select 1
      from public.post_media
      where post_media.storage_path = storage.objects.name
    )
  );

create policy "Authors can upload images to their posts"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'post-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (
      select 1
      from public.posts
      where posts.author_id = (select auth.uid())
        and posts.id::text = (storage.foldername(name))[2]
    )
  );

create policy "Authors can delete their post images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'post-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
