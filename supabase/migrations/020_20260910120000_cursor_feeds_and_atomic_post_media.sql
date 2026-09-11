-- Stable cursor feeds and atomic registration of posts with their media.

drop function if exists public.get_home_feed(integer, integer);

create function public.get_home_feed(
  p_limit integer default 11,
  p_before_created_at timestamptz default null,
  p_before_id uuid default null,
  p_mode text default 'following'
)
returns setof public.posts
language sql
stable
security invoker
set search_path = ''
as $$
  select posts.*
  from public.posts
  where posts.forum_id is null
    and (
      p_mode = 'for-you'
      or (
        p_mode = 'following'
        and (
          posts.author_id = (select auth.uid())
          or exists (
            select 1
            from public.follows
            where follows.follower_id = (select auth.uid())
              and follows.following_id = posts.author_id
          )
        )
      )
    )
    and (
      p_before_created_at is null
      or (posts.created_at, posts.id) < (p_before_created_at, p_before_id)
    )
  order by posts.created_at desc, posts.id desc
  limit greatest(1, least(p_limit, 50));
$$;

revoke all on function public.get_home_feed(integer, timestamptz, uuid, text) from public;
grant execute on function public.get_home_feed(integer, timestamptz, uuid, text) to authenticated;

drop policy "Authors can upload images to their posts" on storage.objects;

create policy "Authors can upload images to reserved post paths"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'post-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (storage.foldername(name))[2] is not null
  );

create table public.post_image_cleanup (
  storage_path text primary key,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.post_image_cleanup enable row level security;
revoke all on table public.post_image_cleanup from anon, authenticated;
grant select, insert, delete on table public.post_image_cleanup to authenticated;

create policy "Authors can reserve their image cleanup"
  on public.post_image_cleanup for insert to authenticated
  with check (owner_id = (select auth.uid()));

create policy "Authors can view their pending image cleanup"
  on public.post_image_cleanup for select to authenticated
  using (owner_id = (select auth.uid()));

create policy "Authors can complete their pending image cleanup"
  on public.post_image_cleanup for delete to authenticated
  using (owner_id = (select auth.uid()));

create function public.create_ask_post_with_media(
  p_post_id uuid,
  p_title text,
  p_body text default null,
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
    raise exception using errcode = '42501', message = 'You must be signed in to create a post.';
  end if;
  if cardinality(p_media_paths) > 3 then
    raise exception using errcode = '23514', message = 'A post can contain up to three images.';
  end if;

  insert into public.posts (id, author_id, post_type, title, body)
  values (p_post_id, current_user_id, 'ASK', btrim(p_title), nullif(btrim(p_body), ''))
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

create function public.create_share_rating_post_with_media(
  p_post_id uuid,
  p_entity_id uuid,
  p_score numeric,
  p_body text default null,
  p_media_paths text[] default array[]::text[]
)
returns public.posts
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  created_post public.posts;
  media_path text;
  media_position integer := 0;
begin
  if current_user_id is null then
    raise exception using errcode = '42501', message = 'You must be signed in to share a restaurant rating.';
  end if;
  if cardinality(p_media_paths) > 3 then
    raise exception using errcode = '23514', message = 'A post can contain up to three images.';
  end if;

  insert into public.posts (id, author_id, post_type, entity_id, body)
  values (p_post_id, current_user_id, 'SHARE', p_entity_id, nullif(btrim(p_body), ''))
  returning * into created_post;

  insert into public.entity_ratings (author_id, entity_id, post_id, score)
  values (current_user_id, p_entity_id, p_post_id, p_score);

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

revoke all on function public.create_ask_post_with_media(uuid, text, text, text[]) from public;
revoke all on function public.create_share_rating_post_with_media(uuid, uuid, numeric, text, text[]) from public;
grant execute on function public.create_ask_post_with_media(uuid, text, text, text[]) to authenticated;
grant execute on function public.create_share_rating_post_with_media(uuid, uuid, numeric, text, text[]) to authenticated;

create function public.delete_post_with_cleanup(p_post_id uuid)
returns text[]
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  paths text[];
begin
  if not exists (
    select 1 from public.posts
    where id = p_post_id and author_id = current_user_id
  ) then
    raise exception using errcode = '42501', message = 'You can only delete your own post.';
  end if;

  select coalesce(array_agg(storage_path), array[]::text[])
  into paths
  from public.post_media
  where post_id = p_post_id;

  insert into public.post_image_cleanup (storage_path, owner_id)
  select path, current_user_id
  from unnest(paths) as path
  on conflict (storage_path) do nothing;

  delete from public.posts where id = p_post_id;
  return paths;
end;
$$;

revoke all on function public.delete_post_with_cleanup(uuid) from public;
grant execute on function public.delete_post_with_cleanup(uuid) to authenticated;
