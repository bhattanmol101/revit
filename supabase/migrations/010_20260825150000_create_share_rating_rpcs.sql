-- Plan 8.2: atomically create or update a normal Share post and restaurant rating.

create function public.create_share_rating_post(
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
  current_user_id uuid;
  created_post public.posts;
begin
  current_user_id := (select auth.uid());

  if current_user_id is null then
    raise exception using
      errcode = '42501',
      message = 'You must be signed in to share a restaurant rating.';
  end if;

  if exists (
    select 1
    from public.entity_ratings
    where entity_ratings.author_id = current_user_id
      and entity_ratings.entity_id = p_entity_id
  ) then
    raise exception using
      errcode = '23505',
      constraint = 'entity_ratings_author_entity_key',
      message = 'You have already rated this restaurant.';
  end if;

  insert into public.posts (author_id, post_type, entity_id, body)
  values (current_user_id, 'SHARE', p_entity_id, nullif(btrim(p_body), ''))
  returning * into created_post;

  insert into public.entity_ratings (author_id, entity_id, post_id, score)
  values (current_user_id, p_entity_id, created_post.id, p_score);

  return created_post;
end;
$$;

create function public.update_share_rating_post(
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
  current_user_id uuid;
  updated_post public.posts;
begin
  current_user_id := (select auth.uid());

  if current_user_id is null then
    raise exception using
      errcode = '42501',
      message = 'You must be signed in to update a restaurant rating.';
  end if;

  update public.posts
  set body = nullif(btrim(p_body), '')
  where posts.id = p_post_id
    and posts.author_id = current_user_id
    and posts.post_type = 'SHARE'
  returning * into updated_post;

  if not found then
    raise exception using
      errcode = '42501',
      message = 'You can only update your own Share post.';
  end if;

  update public.entity_ratings
  set score = p_score
  where entity_ratings.post_id = p_post_id
    and entity_ratings.author_id = current_user_id;

  if not found then
    raise exception using
      errcode = '23514',
      constraint = 'entity_ratings_share_post_match',
      message = 'The Share post has no matching restaurant rating.';
  end if;

  return updated_post;
end;
$$;

revoke all on function public.create_share_rating_post(uuid, numeric, text) from public;
revoke all on function public.update_share_rating_post(uuid, numeric, text) from public;
grant execute on function public.create_share_rating_post(uuid, numeric, text) to authenticated;
grant execute on function public.update_share_rating_post(uuid, numeric, text) to authenticated;
