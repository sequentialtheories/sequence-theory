create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  email text,
  name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select"
on public.profiles for select
using ( auth.uid() = user_id );

drop policy if exists "profiles_self_upsert" on public.profiles;
create policy "profiles_self_upsert"
on public.profiles for insert
with check ( auth.uid() = user_id );

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update"
on public.profiles for update
using ( auth.uid() = user_id );

create index if not exists idx_profiles_email on public.profiles (email);

create or replace view public.profiles_canonical as
select
  user_id as id,
  email,
  name,
  avatar_url,
  created_at,
  updated_at
from public.profiles;
