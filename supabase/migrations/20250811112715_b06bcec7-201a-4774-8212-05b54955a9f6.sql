
-- 1) Simulation-friendly schema

-- Clubs
create table if not exists public.subclubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rigor text not null check (rigor in ('LIGHT','MEDIUM','HEAVY')),
  lock_months int not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

-- Memberships
create table if not exists public.memberships (
  subclub_id uuid references public.subclubs(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null default 'MEMBER' check (role in ('OWNER','MEMBER')),
  joined_at timestamptz not null default now(),
  primary key (subclub_id, user_id)
);

-- Weekly snapshots (simulated balances)
create table if not exists public.vault_states (
  subclub_id uuid references public.subclubs(id) on delete cascade,
  epoch_week int not null,
  tvl_usdc numeric(38,6) not null,
  p1_usdc numeric(38,6) not null,
  p2_usdc numeric(38,6) not null,
  p3_usdc numeric(38,6) not null,
  wbtc_sats numeric(38,0) not null default 0,
  primary key (subclub_id, epoch_week)
);

-- Ledger + idempotency
create table if not exists public.tx_ledger (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text not null,
  user_id uuid not null references auth.users(id),
  subclub_id uuid not null references public.subclubs(id),
  kind text not null check (kind in ('DEPOSIT','HARVEST','JOIN','CREATE')),
  amount_usdc numeric(38,6),
  status text not null check (status in ('PENDING','APPLIED','REJECTED')),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (idempotency_key)
);

-- Forum persistence (avoid conflict with existing public.forum_posts)
create table if not exists public.forum_topics (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.forum_messages (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.forum_topics(id) on delete cascade,
  body text not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists memberships_user_id_idx on public.memberships (user_id);
create index if not exists memberships_subclub_id_idx on public.memberships (subclub_id);

create index if not exists vault_states_subclub_epoch_idx on public.vault_states (subclub_id, epoch_week);

create index if not exists tx_ledger_user_id_idx on public.tx_ledger (user_id);
create index if not exists tx_ledger_subclub_id_idx on public.tx_ledger (subclub_id);

create index if not exists forum_topics_created_by_idx on public.forum_topics (created_by);
create index if not exists forum_messages_topic_id_idx on public.forum_messages (topic_id);
create index if not exists forum_messages_created_by_idx on public.forum_messages (created_by);

-- 2) RLS enablement
alter table public.subclubs enable row level security;
alter table public.memberships enable row level security;
alter table public.vault_states enable row level security;
alter table public.tx_ledger enable row level security;
alter table public.forum_topics enable row level security;
alter table public.forum_messages enable row level security;

-- 3) Helper to avoid "infinite recursion" in RLS when checking ownership
create or replace function public.is_owner_of_subclub(p_subclub_id uuid)
returns boolean
language sql
stable
security definer
set search_path = 'public'
as $$
  select exists (
    select 1 from public.memberships
    where subclub_id = p_subclub_id
      and user_id = auth.uid()
      and role = 'OWNER'
  );
$$;

-- 4) Policies

-- subclubs: members can read; creator inserts; owners can update
drop policy if exists subclubs_sel on public.subclubs;
create policy subclubs_sel on public.subclubs
for select
using (
  exists (
    select 1 from public.memberships m
    where m.subclub_id = subclubs.id
      and m.user_id = auth.uid()
  )
);

drop policy if exists subclubs_ins on public.subclubs;
create policy subclubs_ins on public.subclubs
for insert
with check (created_by = auth.uid());

drop policy if exists subclubs_upd on public.subclubs;
create policy subclubs_upd on public.subclubs
for update
using (public.is_owner_of_subclub(subclubs.id));

-- memberships: user reads own; owners can see club members; user inserts own join
drop policy if exists memberships_sel on public.memberships;
create policy memberships_sel on public.memberships
for select
using (
  user_id = auth.uid()
  or public.is_owner_of_subclub(memberships.subclub_id)
);

drop policy if exists memberships_ins on public.memberships;
create policy memberships_ins on public.memberships
for insert
with check (user_id = auth.uid());

-- vault_states: members read only
drop policy if exists vault_states_sel on public.vault_states;
create policy vault_states_sel on public.vault_states
for select
using (
  exists (
    select 1 from public.memberships m
    where m.subclub_id = vault_states.subclub_id
      and m.user_id = auth.uid()
  )
);

-- tx_ledger: user reads own; writes own
drop policy if exists tx_sel on public.tx_ledger;
create policy tx_sel on public.tx_ledger
for select
using (user_id = auth.uid());

drop policy if exists tx_ins on public.tx_ledger;
create policy tx_ins on public.tx_ledger
for insert
with check (user_id = auth.uid());

-- forum: any authenticated read; author inserts (using forum_messages)
drop policy if exists forum_topics_sel on public.forum_topics;
create policy forum_topics_sel on public.forum_topics
for select
using (auth.role() = 'authenticated');

drop policy if exists forum_topics_ins on public.forum_topics;
create policy forum_topics_ins on public.forum_topics
for insert
with check (created_by = auth.uid());

drop policy if exists forum_messages_sel on public.forum_messages;
create policy forum_messages_sel on public.forum_messages
for select
using (auth.role() = 'authenticated');

drop policy if exists forum_messages_ins on public.forum_messages;
create policy forum_messages_ins on public.forum_messages
for insert
with check (created_by = auth.uid());
