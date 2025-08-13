create table if not exists public.idempotency_keys (
  id uuid primary key default gen_random_uuid(),
  function_name text not null,
  key text not null,
  user_id uuid null,
  request_hash text not null,
  status text not null default 'pending',
  response_snapshot jsonb null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (function_name, key)
);

create index if not exists idx_idempotency_fn_key on public.idempotency_keys(function_name, key);
create index if not exists idx_idempotency_updated_at on public.idempotency_keys(updated_at);

alter table public.idempotency_keys enable row level security;

create policy idemp_insert on public.idempotency_keys
for insert to authenticated
with check (auth.uid() = user_id or user_id is null);

create policy idemp_select_own on public.idempotency_keys
for select to authenticated
using (user_id is null or user_id = auth.uid());

create policy idemp_service_all on public.idempotency_keys
for all to service_role
using (true)
with check (true);

create function public.touch_idempotency_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_touch_idempotency on public.idempotency_keys;
create trigger trg_touch_idempotency before update on public.idempotency_keys
for each row execute procedure public.touch_idempotency_updated_at();
