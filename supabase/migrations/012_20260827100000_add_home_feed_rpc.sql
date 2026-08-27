-- Plan 9.1: chronological normal-post feed from the current user's follows.

create function public.get_home_feed(
  p_limit integer default 11,
  p_offset integer default 0
)
returns setof public.posts
language sql
stable
security invoker
set search_path = ''
as $$
  select posts.*
  from public.posts
  join public.follows
    on follows.following_id = posts.author_id
  where follows.follower_id = (select auth.uid())
  order by posts.created_at desc, posts.id asc
  limit greatest(1, least(p_limit, 50))
  offset greatest(p_offset, 0);
$$;

revoke all on function public.get_home_feed(integer, integer) from public;
grant execute on function public.get_home_feed(integer, integer) to authenticated;
