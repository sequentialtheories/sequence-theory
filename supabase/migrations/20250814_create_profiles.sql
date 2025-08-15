
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
