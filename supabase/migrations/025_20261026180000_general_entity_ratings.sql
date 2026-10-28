-- Phase 2: Share ratings apply to any categorized entity.

create or replace function public.validate_share_post_entity()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.post_type <> 'SHARE' then
    return new;
  end if;

  if new.entity_id is null or not exists (
    select 1 from public.entities where entities.id = new.entity_id
  ) then
    raise exception using
      errcode = '23514',
      constraint = 'posts_share_entity_required',
      message = 'A Share post must reference an entity.';
  end if;

  return new;
end;
$$;

create or replace function public.validate_entity_rating_post()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  rated_post_author_id uuid;
  rated_post_entity_id uuid;
  rated_post_forum_id uuid;
  rated_post_type public.post_type;
begin
  select posts.author_id, posts.entity_id, posts.forum_id, posts.post_type
  into rated_post_author_id, rated_post_entity_id, rated_post_forum_id, rated_post_type
  from public.posts
  where posts.id = new.post_id;

  if not found
    or rated_post_type <> 'SHARE'
    or rated_post_forum_id is not null
    or rated_post_author_id <> new.author_id
    or rated_post_entity_id <> new.entity_id then
    raise exception using
      errcode = '23514',
      constraint = 'entity_ratings_share_post_match',
      message = 'A rating must belong to its author’s matching Share post.';
  end if;

  return new;
end;
$$;

create or replace function public.create_share_rating_post(
  p_entity_id uuid,
  p_score numeric,
  p_body text default null
)
returns public.posts
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  created_post public.posts;
begin
  if current_user_id is null then
    raise exception using errcode = '42501', message = 'You must be signed in to publish a rating.';
  end if;
  if not exists (select 1 from public.entities where id = p_entity_id) then
    raise exception using errcode = '23503', message = 'Choose a valid entity to rate.';
  end if;
  if p_score is null or p_score < 1 or p_score > 5 then
    raise exception using errcode = '23514', message = 'A rating must be between 1 and 5.';
  end if;

  insert into public.posts (author_id, post_type, entity_id, body)
  values (current_user_id, 'SHARE', p_entity_id, nullif(btrim(p_body), ''))
  returning * into created_post;

  insert into public.entity_ratings (author_id, entity_id, post_id, score)
  values (current_user_id, p_entity_id, created_post.id, p_score);

  return created_post;
end;
$$;

create or replace function public.update_share_rating_post(
  p_post_id uuid,
  p_score numeric,
  p_body text default null
)
returns public.posts
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  updated_post public.posts;
begin
  if current_user_id is null then
    raise exception using errcode = '42501', message = 'You must be signed in to update a rating.';
  end if;
  if p_score is null or p_score < 1 or p_score > 5 then
    raise exception using errcode = '23514', message = 'A rating must be between 1 and 5.';
  end if;

  update public.posts
  set body = nullif(btrim(p_body), '')
  where id = p_post_id and author_id = current_user_id
    and post_type = 'SHARE' and forum_id is null
  returning * into updated_post;

  if not found then
    raise exception using errcode = '42501', message = 'You can only update your own Share rating.';
  end if;

  update public.entity_ratings
  set score = p_score
  where post_id = p_post_id and author_id = current_user_id;
  if not found then
    raise exception using errcode = '23514', constraint = 'entity_ratings_share_post_match',
      message = 'The Share post has no matching entity rating.';
  end if;
  return updated_post;
end;
$$;

create or replace function public.create_share_rating_post_with_media(
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
    raise exception using errcode = '42501', message = 'You must be signed in to publish a rating.';
  end if;
  if p_score is null or p_score < 1 or p_score > 5 then
    raise exception using errcode = '23514', message = 'A rating must be between 1 and 5.';
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
    raise exception using errcode = '23514', message = 'A Share post requires an entity.';
  end if;
  if p_post_type = 'ASK' and p_entity_id is not null then
    raise exception using errcode = '23514', message = 'An Ask post cannot include an entity.';
  end if;
  insert into public.posts (id, author_id, post_type, entity_id, forum_id, body)
  values (p_post_id, current_user_id, p_post_type, p_entity_id, p_forum_id, nullif(btrim(p_body), ''))
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

create or replace function public.get_entity_rating_summary(p_entity_id uuid)
returns table (average_score numeric, rating_count bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  select round(avg(entity_ratings.score), 1), count(*)
  from public.entity_ratings
  where entity_ratings.entity_id = p_entity_id;
$$;

revoke all on function public.get_entity_rating_summary(uuid) from public;
grant execute on function public.get_entity_rating_summary(uuid) to authenticated;
