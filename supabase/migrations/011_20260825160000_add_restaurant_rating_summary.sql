-- Plan 8.3: calculate restaurant scores from the canonical entity ratings.

create function public.get_restaurant_rating_summary(p_entity_id uuid)
returns table (
  average_score numeric,
  rating_count bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    round(avg(entity_ratings.score), 1) as average_score,
    count(*) as rating_count
  from public.entity_ratings
  where entity_ratings.entity_id = p_entity_id;
$$;

revoke all on function public.get_restaurant_rating_summary(uuid) from public;
grant execute on function public.get_restaurant_rating_summary(uuid) to authenticated;
