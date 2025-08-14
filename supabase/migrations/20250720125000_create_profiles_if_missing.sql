create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  email text,
  name text,
  avatar_url text,
  updated_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select"
on public.profiles for select
using ( auth.uid() = user_id );

drop policy if exists "profiles_self_upsert" on public.profiles;
create policy "profiles_self_upsert"
on public.profiles for insert with check ( auth.uid() = user_id );

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update"
on public.profiles for update
using ( auth.uid() = user_id );
