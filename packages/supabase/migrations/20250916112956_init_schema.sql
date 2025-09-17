-- 001_init_schema.sql

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ==========================
-- PROFILES (extended user info)
-- ==========================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (char_length(username) >= 3),
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ==========================
-- POSTS
-- ==========================
create table posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  caption text,
  media_url text not null,
  rating int check (rating >= 1 and rating <= 5),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index posts_user_id_idx on posts (user_id);

-- -- ==========================
-- -- COMMENTS
-- -- ==========================
create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  content text not null check (char_length(content) > 0),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique (post_id, user_id) -- one rating per user per post
);

create index comments_post_id_idx on comments (post_id);


-- Aggregated view to get post ratings
create or replace view post_comments_summary as
select 
  post_id,
  coalesce(round(avg(rating)::numeric, 2), 0) as avg_rating,
  coalesce(count(*), 0) as total_ratings
  coalesce(count(*), 0) as comments_count
from comments
group by post_id;


-- Function to create a profile row after signup
create or replace function handle_new_user()
returns trigger as $$
declare
  fullName text;
begin
  -- Extract metadata from auth.users
  fullName := new.raw_user_meta_data ->> 'full_name';

  insert into public.profiles (id, username, full_name)
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
alter table profiles enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;

-- Example RLS policies (extend as needed)

-- Profiles: anyone can read, users update only their own
create policy "Public profiles are viewable by everyone"
on profiles for select using (true);

create policy "Users can update their own profile"
on profiles for update using (auth.uid() = id);

create policy "Anyone can view posts"
on posts for select
with check (true);

create policy "Users can create posts"
on posts for insert
with check (auth.uid() = user_id);

create policy "Users can rate/comment posts"
on comments for insert
with check (auth.uid() = user_id);

create policy "Users can update their own ratings/comment"
on comments for update
using (auth.uid() = user_id);

create policy "Anyone can view ratings/comments"
on comments for select
using (true);