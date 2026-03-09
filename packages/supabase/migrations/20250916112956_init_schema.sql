-- 001_init_schema.sql

-- Generic timestamp update trigger function (reusable for all tables)
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
return new;
end;
$$ language plpgsql;

-- ==========================
-- PROFILE (extended user info)
-- ==========================
create table profile (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (char_length(username) >= 3),
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable timestamp update trigger on profile table
create trigger update_timestamp
before update on profile
for each row
execute function set_updated_at();

-- Enable RLS
alter table profile enable row level security;

-- Allow users to read all profiles (public social-style app)
create policy "Allow read access to all profiles"
on profile
for select
using (true);

-- Allow users to insert their own profile (on signup or manually)
create policy "Allow users to insert their own profile"
on profile
for insert
with check (auth.uid() = id);

-- Allow users to update their own profile
create policy "Allow users to update their own profile"
on profile
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Allow users to delete their own profile (optional)
create policy "Allow users to delete their own profile"
on profile
for delete
using (auth.uid() = id);

-- ==========================
-- PROFILE END
-- ==========================

-- ==========================
-- POST
-- ==========================
create table post (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profile(id) on delete cascade,
  caption text,
  media_url text[] not null,
  rating int check (rating >= 1 and rating <= 5),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger update_post_updated_at
before update on post
for each row
execute function set_updated_at();

--- Indexes for Post table ---

-- Speeds up queries filtering by author or sorting by date
create index if not exists post_user_id_idx on post (user_id);
create index if not exists post_created_at_idx on post (created_at desc);

-- Caption search (useful for search bars or hashtags)
create index if not exists post_caption_trgm_idx
    on post using gin (caption gin_trgm_ops);


--- RLS for Post table ---

-- Enable Row Level Security
alter table public.post enable row level security;

-- Allow everyone to read posts (social feed style)
create policy "Allow read access to all posts"
on public.post
for select
using (true);

-- Allow logged-in users to create posts for themselves
create policy "Allow users to insert their own posts"
on public.post
for insert
with check (auth.uid() = user_id);

-- Allow users to update their own posts
create policy "Allow users to update their own posts"
on public.post
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Allow users to delete their own posts (optional)
create policy "Allow users to delete their own posts"
on public.post
for delete
using (auth.uid() = user_id);

-- ==========================
-- POST END
-- ==========================

-- ==========================
-- COMMENT
-- ==========================
create table comment (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references post(id) on delete cascade,
  user_id uuid not null references profile(id) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  content text default "",
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique (post_id, user_id) -- one rating per user per post
);

create trigger update_comment_updated_at
before update on comment
for each row
execute function set_updated_at();

--- Indexes for Comment table ---

-- Quickly fetch comments for a post
create index if not exists comment_post_id_idx on comment (post_id);

-- Useful for sorting by creation time (e.g., newest comments)
create index if not exists comment_created_at_idx on comment (created_at desc);

create index if not exists comment_rating_idx on comment (rating);

--- RLS for Comment table ---

-- Enable Row Level Security
alter table comment enable row level security;

-- Allow everyone to read all comments (public feed)
create policy "Allow read access to all comments"
on comment
for select
using (true);

-- Allow logged-in users to create comments for themselves
create policy "Allow users to insert their own comments"
on comment
for insert
with check (auth.uid() = user_id);

-- Allow users to update their own comments
create policy "Allow users to update their own comments"
on comment
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Allow users to delete their own comments
create policy "Allow users to delete their own comments"
on comment
for delete
using (auth.uid() = user_id);

-- ==========================
-- COMMENT END
-- ==========================

-- ==========================
-- FORUM
-- ==========================
create table forum (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references profile(id) on delete cascade,
  name text not null check (char_length(name) > 0),
  description text not null check (char_length(description) > 0),
  media_url text not null,
  category text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger update_forum_updated_at
before update on forum
for each row
execute function set_updated_at();

--- Indexes for Forum table ---

-- Filter forums by creator
create index if not exists forum_created_by_idx on forum (created_by);

-- Index for sorting or fetching the latest forums
create index if not exists forum_created_at_idx on forum (created_at desc);

-- Optional: category-based filtering
create index if not exists forum_category_idx on forum (category);

-- Optional: full-text search for name and description
create index if not exists forum_name_trgm_idx
    on forum using gin (name gin_trgm_ops);

create index if not exists forum_description_trgm_idx
    on forum using gin (description gin_trgm_ops);

--- RLS for Forum table ---

-- Enable Row Level Security
alter table forum enable row level security;

-- Allow everyone to read all forums
create policy "Allow read access to all forums"
on forum
for select
using (true);

-- Allow logged-in users to create forums
create policy "Allow users to insert their own forums"
on forum
for insert
with check (auth.uid() = created_by);

-- Allow users to update their own forums
create policy "Allow users to update their own forums"
on forum
for update
using (auth.uid() = created_by)
with check (auth.uid() = created_by);

-- Allow users to delete their own forums
create policy "Allow users to delete their own forums"
on forum
for delete
using (auth.uid() = created_by);

-- ==========================
-- FORUM END
-- ==========================

-- ==========================
-- FORUM MEMBERSHIP
-- ==========================
create table forum_membership (
  user_id uuid not null references profile(id) on delete cascade,
  forum_id uuid not null references forum(id) on delete cascade,
  role text default 'member' check (role in ('member', 'moderator', 'admin')),
  joined_at timestamptz default now(),
  primary key (user_id, forum_id)
);

-- Fast lookup: all members of a forum
create index if not exists forum_membership_forum_id_idx on forum_membership (forum_id);

-- Fast lookup: all forums a user belongs to
create index if not exists forum_membership_user_id_idx on forum_membership (user_id);

-- Enable RLS
alter table forum_membership enable row level security;

-- Allow everyone to read membership info (optional: restrict later)
create policy "Allow read access to all memberships"
on forum_membership
for select
using (true);

-- Allow logged-in users to join a forum (insert their own membership)
create policy "Allow users to join a forum"
on forum_membership
for insert
with check (auth.uid() = user_id);

-- Allow users to leave a forum (delete their own membership)
create policy "Allow users to leave a forum"
on forum_membership
for delete
using (auth.uid() = user_id);

-- Allow moderators/admins to manage other members (optional advanced policy)
create or replace function is_forum_admin_or_moderator(
  _forum_id uuid,
  _user_id uuid
)
returns boolean
language sql
security definer
set search_path = public
as $$
select exists (
    select 1
    from forum_membership
    where forum_id = _forum_id
      and user_id = _user_id
      and role in ('admin', 'moderator')
);
$$;

grant execute on function is_forum_admin_or_moderator(uuid, uuid) to authenticated;

create policy "Allow forum admins/moderators to manage members"
on forum_membership
for all
using (is_forum_admin_or_moderator(forum_membership.forum_id, auth.uid()))
with check (true);

-- ==========================
-- FORUM POST
-- ==========================
create table forum_post (
  id uuid primary key default gen_random_uuid(),
  forum_id uuid not null references forum(id) on delete cascade,
  user_id uuid not null references profile(id) on delete cascade,
  caption text,
  media_url text[] not null,
  rating int check (rating >= 1 and rating <= 5),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger update_forum_post_updated_at
before update on forum_post
for each row
execute function set_updated_at();

-- Speed up lookups for forum discussions
create index if not exists forum_post_forum_id_idx on forum_post (forum_id);

-- For latest posts sorting
create index if not exists forum_post_created_at_idx on forum_post (created_at desc);

create index if not exists forum_post_forum_id_created_at_idx
    on forum_post (forum_id, created_at desc);

-- Enable RLS
alter table forum_post enable row level security;

-- Allow everyone to read forum posts (public feed)
create policy "Allow read access to all forum posts"
on forum_post
for select
using (true);

-- Allow forum members to create posts
create policy "Allow forum members to create posts"
on forum_post
for insert
with check (
  auth.uid() = user_id and
  exists (
    select 1
    from forum_membership fm
    where fm.user_id = auth.uid()
      and fm.forum_id = forum_post.forum_id
  )
);

-- Allow users to update only their own posts
create policy "Allow users to update their own forum posts"
on forum_post
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Allow users to delete their own forum posts
create policy "Allow users to delete their own forum posts"
on forum_post
for delete
using (auth.uid() = user_id);

-- ==========================
-- FORUM POST END
-- ==========================

-- ==========================
-- FORUM POST COMMENT
-- ==========================
create table forum_post_comment (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references forum_post(id) on delete cascade,
  user_id uuid not null references profile(id) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  content text default "",
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique (post_id, user_id) -- one rating per user per post
);

create trigger update_forum_post_comment_updated_at
before update on forum_post_comment
for each row
execute function set_updated_at();

create index forum_post_comment_post_id_idx on comment (post_id);

-- Find all comments for a given post quickly
create index if not exists forum_post_comment_post_id_idx on forum_post_comment (post_id);

-- Sort comments efficiently
create index if not exists forum_post_comment_created_at_idx on forum_post_comment (created_at desc);

-- Enable RLS
alter table forum_post_comment enable row level security;

-- Allow all users to read comments
create policy "Allow read access to all forum post comments"
on forum_post_comment
for select
using (true);

-- Allow forum members to create comments
create policy "Allow forum members to create comments"
on forum_post_comment
for insert
with check (
  auth.uid() = user_id and
  exists (
    select 1
    from forum_membership fm
    join forum_post fp on fp.forum_id = fm.forum_id
    where fm.user_id = auth.uid()
      and fp.id = forum_post_comment.post_id
  )
);

-- Allow users to update their own comments
create policy "Allow users to update their own comments"
on forum_post_comment
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Allow users to delete their own comments
create policy "Allow users to delete their own comments"
on forum_post_comment
for delete
using (auth.uid() = user_id);

-- ==========================
-- FORUM POST COMMENT ENDS
-- ==========================

-- ==========================
-- VIEWS
-- ==========================

-- Drop the old view safely if it exists
drop view if exists post_comment_summary;

-- Aggregated view to get post-ratings
create or replace view post_comment_summary as
select
    post_id,
    coalesce(round(avg(rating)::numeric, 2), 0) as avg_rating,
    coalesce(count(*), 0) as comment_count
from comment
group by post_id;

revoke all on post_comment_summary from anon, authenticated;
grant select on post_comment_summary to authenticated;

-- Drop the old view safely if it exists
drop view if exists forum_post_comment_summary;

-- Create the new aggregated view
create or replace view forum_post_comment_summary as
select
    post_id,
    coalesce(round(avg(rating)::numeric, 2), 0) as avg_rating,
    coalesce(count(*), 0) as comment_count
from forum_post_comment
group by post_id;

revoke all on forum_post_comment_summary from anon, authenticated;
grant select on forum_post_comment_summary to authenticated;

-- Drop the old view safely if it exists
drop view if exists forum_trending;

create or replace view forum_trending as
select
    f.id,
    f.name,
    f.description,
    f.category,
    f.created_at,
    p.username as created_by,
    -- Count posts in the last 7 days
    coalesce(count(distinct po.id) filter (where po.created_at > now() - interval '7 days'), 0) as recent_post_count,
    -- Total posts in the forum
    coalesce(count(distinct po.id), 0) as total_post_count,
    -- Total members in the forum
    coalesce(count(distinct m.user_id), 0) as member_count
from forum f
join profile p on p.id = f.created_by
left join forum_post po on po.forum_id = f.id
left join forum_membership m on m.forum_id = f.id
group by f.id, f.name, f.description, f.category, f.created_at, p.username
order by recent_post_count desc;

revoke all on forum_trending from anon, authenticated;
grant select on forum_trending to authenticated;


-- Drop the old view safely if it exists
drop view if exists forum_membership_summary;

create or replace view forum_membership_summary as
select
    forum_id,
    coalesce(count(distinct user_id), 0) as member_count
from forum_membership
group by forum_id;

revoke all on forum_membership_summary from anon, authenticated;
grant select on forum_membership_summary to authenticated;


drop view if exists forum_post_summary;

create or replace view forum_post_summary as
select
    forum_id,
    coalesce(count(*), 0) as post_count
from forum_post
group by forum_id;


revoke all on forum_post_summary from anon, authenticated;
grant select on forum_post_summary to authenticated;


-- Function to create a profile row after signup
create or replace function handle_new_user()
returns trigger as $$
declare
  fullName text;
begin
  -- Extract metadata from auth.users
  fullName := new.raw_user_meta_data ->> 'full_name';

  insert into public.profile (id, username, full_name)
  values (
    new.id,
    split_part(new.email, '@', 1),
    fullName
  );

  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users table
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure handle_new_user();