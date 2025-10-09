-- 001_init_schema.sql

-- ==========================
-- PROFILE (extended user info)
-- ==========================
create table profile (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (char_length(username) >= 3),
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ==========================
-- POST
-- ==========================
create table post (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profile(id) on delete cascade,
  caption text,
  media_url text[] not null,
  rating int check (rating >= 1 and rating <= 5),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index post_user_id_idx on post (user_id);

-- -- ==========================
-- -- COMMENT
-- -- ==========================
create table comment (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references post(id) on delete cascade,
  user_id uuid not null references profile(id) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  content text default "",
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique (post_id, user_id) -- one rating per user per post
);

create index comment_post_id_idx on comment (post_id);

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
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index forum_user_id_idx on forum (created_by);

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


create index forum_membership_user_id_idx on forum_membership (user_id);
create index forum_membership_forum_id_idx on forum_membership (forum_id);

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
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index forum_post_user_id_idx on forum_post (user_id);
create index forum_post_forum_id_idx on forum_post (forum_id);

-- -- ==========================
-- -- FORUM POST COMMENTS
-- -- ==========================
create table forum_post_comment (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references forum_post(id) on delete cascade,
  user_id uuid not null references profile(id) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  content text default "",
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique (post_id, user_id) -- one rating per user per post
);

create index forum_post_comment_post_id_idx on comment (post_id);


-- Aggregated view to get post ratings
create or replace view post_comment_summary as
select 
  post_id,
  coalesce(round(avg(rating)::numeric, 2), 0) as avg_rating,
  coalesce(count(*), 0) as comment_count
from comment
group by post_id;

-- Aggregated view to get forum post ratings
create or replace view forum_post_comment_summary as
select 
  post_id,
  coalesce(round(avg(rating)::numeric, 2), 0) as avg_rating,
  coalesce(count(*), 0) as comment_count
from forum_post_comment
group by post_id;

create or replace view forum_trending as
select 
  f.id,
  f.name,
  f.description,
  f.category,
  f.category,
  f.created_at,
  p.username as created_by,
  coalesce(count(distinct po.id), 0) as recent_post_count,
  coalesce(count(distinct all_post.id), 0) as total_post_count,
  coalesce(count(distinct m.user_id), 0) as member_count
from forum f
join profile p on p.id = f.created_by
left join forum_post po 
  on po.forum_id = f.id 
  and po.created_at > now() - interval '7 days'
left join forum_post all_post
  on all_post.forum_id = f.id
left join forum_membership m 
  on m.forum_id = f.id
group by f.id, f.name, f.description, f.created_at, p.username
order by recent_post_count desc;

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

-- ==========================
-- SECURITY (RLS policies)
-- ==========================
alter table profile enable row level security;
alter table post enable row level security;
alter table comment enable row level security;
alter table forum enable row level security;
alter table forum_membership enable row level security;
alter table forum_post enable row level security;
alter table forum_post_comment enable row level security;

-- Example RLS policies (extend as needed)

-- Profiles: anyone can read, users update only their own
create policy "Profiles are viewable by everyone"
on profile for select 
using (true);

create policy "Users can update their own profile"
on profile for update using (auth.uid() = id);

create policy "Anyone can view posts"
on post for select 
using (true);

create policy "Users can create posts"
on post for insert
with check (auth.uid() = user_id);

create policy "Users can update their own posts"
on comment for update
using (auth.uid() = user_id);

create policy "Users can comment on posts"
on comment for insert
with check (auth.uid() = user_id);

create policy "Users can update their own comment"
on comment for update
using (auth.uid() = user_id);

create policy "Anyone can view comments"
on comment for select
using (true);

-- Anyone can view forums
create policy "Forums are viewable by everyone"
on forum for select
using (true);

-- Only logged-in users can create forums
create policy "Users can create forums"
on forum for insert
with check (auth.role() = 'authenticated');

-- Forum creator can update/delete their forum
create policy "Forum owners can update/delete"
on forum for all
using (auth.uid() = created_by);

-- Members can view memberships of their forums
create policy "Memberships are viewable by forum members"
on forum_membership for select
using (
  auth.uid() = user_id
  or forum_id in (select id from forum) -- allow general visibility
);

-- Users can join a forum (insert themselves only)
create policy "Users can join forums"
on forum_membership for insert
with check (auth.uid() = user_id);

-- Users can leave a forum (delete their own membership)
create policy "Users can leave forums"
on forum_membership for delete
using (auth.uid() = user_id);

-- Anyone can read posts
create policy "Posts are viewable by everyone"
on forum_post for select
using (true);

-- Only forum members can create posts
create policy "Members can create posts"
on forum_post for insert
with check (
  auth.uid() = user_id
  and forum_id in (
    select forum_id from forum_membership where user_id = auth.uid()
  )
);

-- Post owners can update/delete their posts
create policy "Post owners can modify"
on forum_post for all
using (auth.uid() = user_id);

-- Anyone can read comments
create policy "Comments are viewable by everyone"
on forum_post_comment for select
using (true);

-- Forum members can add comments
create policy "Members can add comments"
on forum_post_comment for insert
with check (
  auth.uid() = user_id
  and post_id in (
    select id from forum_post
    where forum_id in (
      select forum_id from forum_membership where user_id = auth.uid()
    )
  )
);

-- Comment owners can update/delete
create policy "Comment owners can modify"
on forum_post_comment for all
using (auth.uid() = user_id);