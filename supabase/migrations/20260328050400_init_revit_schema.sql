-- Enable useful extensions
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";
create extension if not exists "citext";

-- ============================================================================
-- updated_at trigger helper
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
return new;
end;
$$;

-- ============================================================================
-- profiles
-- one row per auth user
-- state-based lifecycle
-- ============================================================================
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    username citext not null unique,
    full_name text not null,
    bio text,
    avatar_url text,
    state text not null default 'active',
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    constraint profiles_username_length check (char_length(username::text) between 3 and 30)
);

create index if not exists profiles_created_at_idx
    on public.profiles (created_at desc);

create index if not exists profiles_state_idx
    on public.profiles (state);

create trigger set_profiles_updated_at
    before update on public.profiles
    for each row
    execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "active profiles are publicly readable"
on public.profiles
for select
using (state = 'active');

create policy "users can insert their own profile"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "users can update their own non deleted profile"
on public.profiles
for update
using (
    auth.uid() = id
    and state <> 'deleted'
);


-- optional auto-create profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
uname text;
fname text;
begin
    uname := coalesce(
        nullif(new.raw_user_meta_data ->> 'username', ''),
        split_part(coalesce(new.email, 'user_' || new.id::text), '@', 1)
    );
    fname := new.raw_user_meta_data ->> 'full_name';

insert into public.profiles (id, username, full_name, state)
values (
        new.id,
        lower(regexp_replace(uname, '[^a-zA-Z0-9_]+', '', 'g')),
        fname,
        'active'
    )
on conflict (id) do nothing;
return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function public.handle_new_user();

-- ============================================================================
-- posts
-- state-based lifecycle
-- ============================================================================
create table if not exists public.posts (
    id uuid primary key default gen_random_uuid(),
    author_id uuid not null references public.profiles(id) on delete cascade,
    title text not null,
    body text,
    image_url text,
    state text not null default 'active',
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    constraint posts_title_length check (char_length(title) between 1 and 200)
);

create index if not exists posts_author_id_idx
    on public.posts (author_id);

create index if not exists posts_created_at_idx
    on public.posts (created_at desc);

create index if not exists posts_state_idx
    on public.posts (state);

create index if not exists posts_state_created_at_idx
    on public.posts (state, created_at desc);

create trigger set_posts_updated_at
    before update on public.posts
    for each row
    execute function public.set_updated_at();

alter table public.posts enable row level security;

create policy "active posts are publicly readable"
on public.posts
for select
using (
    state = 'active'
    or auth.uid() = author_id
);

create policy "authenticated users can create posts"
on public.posts
for insert
to authenticated
with check (
  auth.uid() = author_id
);

create policy "users can update their own non deleted posts"
on public.posts
for update to authenticated
using (
        auth.uid() = author_id
        and state <> 'deleted'
    )
with check (auth.uid() = author_id);

create policy "users can delete their own posts"
on public.posts
for delete
to authenticated
using (auth.uid() = author_id);

-- ============================================================================
-- tags
-- normalized tag catalog
-- ============================================================================
create table if not exists public.tags (
    id uuid primary key default gen_random_uuid(),
    name citext not null unique,
    slug text not null unique,
    created_at timestamptz not null default timezone('utc', now()),
    constraint tags_name_length check (char_length(name::text) between 1 and 50),
    constraint tags_slug_length check (char_length(slug) between 1 and 60)
);

create index if not exists tags_name_idx
    on public.tags (name);

create index if not exists tags_slug_idx
    on public.tags (slug);

alter table public.tags enable row level security;

create policy "tags are publicly readable"
on public.tags
for select
using (true);

create policy "authenticated users can create tags"
on public.tags
for insert
to authenticated
with check (true);

-- ============================================================================
-- post_tags
-- many-to-many between posts and tags
-- ============================================================================
create table if not exists public.post_tags (
    post_id uuid not null references public.posts(id) on delete cascade,
    tag_id uuid not null references public.tags(id) on delete cascade,
    created_at timestamptz not null default timezone('utc', now()),
    primary key (post_id, tag_id)
);

create index if not exists post_tags_tag_id_idx
    on public.post_tags (tag_id);

create index if not exists post_tags_post_id_idx
    on public.post_tags (post_id);

alter table public.post_tags enable row level security;

create policy "post_tags for readable posts are publicly readable"
on public.post_tags
for select
using (
        exists (
               select 1
               from public.posts p
               where p.id = post_tags.post_id
               and (
                   p.state = 'active'
                   or p.author_id = auth.uid()
               )
            )
        );

create policy "post owners can attach tags to their posts"
on public.post_tags
for insert
to authenticated
with check (
  exists (
    select 1
    from public.posts p
    where p.id = post_tags.post_id
      and p.author_id = auth.uid()
      and p.state <> 'deleted'
  )
);

create policy "post owners can remove tags from their posts"
on public.post_tags
for delete
to authenticated
using (
  exists (
    select 1
    from public.posts p
    where p.id = post_tags.post_id
      and p.author_id = auth.uid()
      and p.state <> 'deleted'
  )
);

-- ============================================================================
-- reviews
-- review = comment + rating on a post
-- hard delete only
-- one review per reviewer per post
-- ============================================================================
create table if not exists public.reviews (
    id uuid primary key default gen_random_uuid(),
    post_id uuid not null references public.posts(id) on delete cascade,
    reviewer_id uuid not null references public.profiles(id) on delete cascade,
    rating smallint not null,
    comment text,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    constraint reviews_rating_range check (rating between 1 and 5),
    constraint reviews_comment_not_empty check (comment is null or char_length(trim(comment)) > 0),
    constraint reviews_unique_post_reviewer unique (post_id, reviewer_id)
    );

create index if not exists reviews_post_id_idx
    on public.reviews (post_id);

create index if not exists reviews_reviewer_id_idx
    on public.reviews (reviewer_id);

create index if not exists reviews_post_created_at_idx
    on public.reviews (post_id, created_at desc);

create index if not exists reviews_post_rating_idx
    on public.reviews (post_id, rating);

create trigger set_reviews_updated_at
    before update on public.reviews
    for each row
    execute function public.set_updated_at();

alter table public.reviews enable row level security;

create policy "reviews on readable posts are publicly readable"
on public.reviews
for select
using (
        exists (
               select 1
               from public.posts p
               where p.id = reviews.post_id
               and (
                   p.state = 'active'
                   or p.author_id = auth.uid()
               )
            )
        );

create policy "authenticated users can create their own reviews"
on public.reviews
for insert
to authenticated
with check (
  auth.uid() = reviewer_id
  and exists (
    select 1
    from public.posts p
    where p.id = post_id
      and p.state = 'active'
  )
);

create policy "users can update their own reviews"
on public.reviews
for update to authenticated
using (auth.uid() = reviewer_id)
with check (auth.uid() = reviewer_id);

create policy "users can delete their own reviews"
on public.reviews
for delete
to authenticated
using (auth.uid() = reviewer_id);