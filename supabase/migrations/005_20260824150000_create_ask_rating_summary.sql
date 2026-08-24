-- Plan 5.3: derive an Ask post's rating summary from its rating rows.

create function public.get_ask_rating_summary(target_post_id uuid)
returns table (
  average_score numeric,
  rating_count bigint
)
language sql
stable
set search_path = ''
as $$
  select
    round(avg(ratings.score), 1) as average_score,
    count(*) as rating_count
  from public.ratings
  where ratings.post_id = target_post_id;
$$;

revoke all on function public.get_ask_rating_summary(uuid) from public;
grant execute on function public.get_ask_rating_summary(uuid) to authenticated;
