-- 🔐 Enable UUID extension (if not already)
create extension if not exists "uuid-ossp";

-- 👤 Profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- 🔐 Enable RLS
alter table public.profiles enable row level security;

-- ✅ Policy: user can read own profile
create policy "Users can read own profile"
on public.profiles
for select
using (auth.uid() = id);

-- ✅ Policy: user can insert own profile
create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

-- ✅ Policy: user can update own profile
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id);

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

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();