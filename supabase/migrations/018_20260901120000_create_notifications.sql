-- Plan 12.1: durable, in-app activity for social actions.

create type public.notification_type as enum (
  'FOLLOW',
  'ASK_RATING',
  'COMMENT',
  'REPLY',
  'FORUM_JOIN',
  'FORUM_POST'
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  actor_id uuid not null references public.profiles (id) on delete cascade,
  notification_type public.notification_type not null,
  post_id uuid references public.posts (id) on delete cascade,
  comment_id uuid references public.comments (id) on delete cascade,
  forum_id uuid references public.forums (id) on delete cascade,
  created_at timestamptz not null default now(),
  read_at timestamptz,
  constraint notifications_no_self_notification check (recipient_id <> actor_id),
  constraint notifications_reference_length check (
    case notification_type
      when 'FOLLOW' then post_id is null and comment_id is null and forum_id is null
      when 'ASK_RATING' then post_id is not null and comment_id is null
      when 'COMMENT' then post_id is not null and comment_id is not null
      when 'REPLY' then post_id is not null and comment_id is not null
      when 'FORUM_JOIN' then forum_id is not null
      when 'FORUM_POST' then post_id is not null and forum_id is not null
    end
  )
);

create index notifications_by_recipient_created_at_idx
  on public.notifications (recipient_id, created_at desc, id desc);

create index notifications_unread_by_recipient_idx
  on public.notifications (recipient_id, created_at desc, id desc)
  where read_at is null;

alter table public.notifications enable row level security;

revoke all on table public.notifications from anon, authenticated;
grant select, update (read_at) on table public.notifications to authenticated;

create policy "Users can view their own notifications"
  on public.notifications
  for select
  to authenticated
  using ((select auth.uid()) = recipient_id);

create policy "Users can mark their own notifications read"
  on public.notifications
  for update
  to authenticated
  using ((select auth.uid()) = recipient_id)
  with check ((select auth.uid()) = recipient_id);

create function public.create_notification(
  p_recipient_id uuid,
  p_actor_id uuid,
  p_notification_type public.notification_type,
  p_post_id uuid default null,
  p_comment_id uuid default null,
  p_forum_id uuid default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_recipient_id = p_actor_id then
    return;
  end if;

  insert into public.notifications (
    recipient_id, actor_id, notification_type, post_id, comment_id, forum_id
  ) values (
    p_recipient_id, p_actor_id, p_notification_type, p_post_id, p_comment_id, p_forum_id
  );
end;
$$;

create function public.notify_on_follow()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.create_notification(new.following_id, new.follower_id, 'FOLLOW');
  return new;
end;
$$;

create trigger follows_create_notification
  after insert on public.follows
  for each row execute function public.notify_on_follow();

create function public.notify_on_ask_rating()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  post_author_id uuid;
begin
  select author_id into post_author_id from public.posts where id = new.post_id;
  if found then
    perform public.create_notification(post_author_id, new.rater_id, 'ASK_RATING', new.post_id);
  end if;
  return new;
end;
$$;

create trigger ratings_create_notification
  after insert on public.ratings
  for each row execute function public.notify_on_ask_rating();

create function public.notify_on_comment()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  recipient uuid;
  activity_type public.notification_type;
begin
  if new.parent_id is null then
    select author_id into recipient from public.posts where id = new.post_id;
    activity_type := 'COMMENT';
  else
    select author_id into recipient from public.comments where id = new.parent_id;
    activity_type := 'REPLY';
  end if;

  if recipient is not null then
    perform public.create_notification(recipient, new.author_id, activity_type, new.post_id, new.id);
  end if;
  return new;
end;
$$;

create trigger comments_create_notification
  after insert on public.comments
  for each row execute function public.notify_on_comment();

create function public.notify_on_forum_membership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  forum_owner_id uuid;
begin
  select owner_id into forum_owner_id from public.forums where id = new.forum_id;
  if found then
    perform public.create_notification(forum_owner_id, new.user_id, 'FORUM_JOIN', null, null, new.forum_id);
  end if;
  return new;
end;
$$;

create trigger forum_memberships_create_notification
  after insert on public.forum_memberships
  for each row execute function public.notify_on_forum_membership();

create function public.notify_on_forum_post()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  forum_owner_id uuid;
begin
  if new.forum_id is null then
    return new;
  end if;

  select owner_id into forum_owner_id from public.forums where id = new.forum_id;
  if found then
    perform public.create_notification(forum_owner_id, new.author_id, 'FORUM_POST', new.id, null, new.forum_id);
  end if;
  return new;
end;
$$;

create trigger forum_posts_create_notification
  after insert on public.posts
  for each row execute function public.notify_on_forum_post();

revoke all on function public.create_notification(uuid, uuid, public.notification_type, uuid, uuid, uuid) from public;
revoke all on function public.notify_on_follow() from public;
revoke all on function public.notify_on_ask_rating() from public;
revoke all on function public.notify_on_comment() from public;
revoke all on function public.notify_on_forum_membership() from public;
revoke all on function public.notify_on_forum_post() from public;
