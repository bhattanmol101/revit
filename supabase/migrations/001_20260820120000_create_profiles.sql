-- Plan 2.1: profiles are created automatically for every Supabase Auth user.
-- Onboarding replaces these safe placeholders with the user's chosen identity.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  display_name text not null,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format check (username = lower(username) and username ~ '^[a-z0-9_]{3,30}$'),
  constraint profiles_display_name_length check (char_length(trim(display_name)) between 1 and 80),
  constraint profiles_bio_length check (bio is null or char_length(bio) <= 280)
);

create unique index profiles_username_key on public.profiles (username);
create function public.set_updated_at() returns trigger language plpgsql set search_path = public as $$ begin new.updated_at = now(); return new; end; $$;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$ begin insert into public.profiles (id, username, display_name) values (new.id, substring(replace(new.id::text, '-', '') from 1 for 12), 'John Doe'); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
alter table public.profiles enable row level security;
revoke all on table public.profiles from anon, authenticated;
grant select, update on table public.profiles to authenticated;
create policy "Authenticated users can view profiles" on public.profiles for select to authenticated using (true);
create policy "Users can update their own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
