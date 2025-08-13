do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='contract_deposits' and column_name='epoch_id') then
    alter table public.contract_deposits add column epoch_id bigint generated always as (
      floor(extract(epoch from date_trunc('week', (created_at at time zone 'UTC'))) / 604800)
    ) stored;
  end if;
end $$;

create or replace function public.current_epoch() returns bigint
language sql stable as $$
  select floor(extract(epoch from date_trunc('week', (now() at time zone 'UTC'))) / 604800)::bigint;
$$;

create or replace view public.contract_epoch_stats as
select
  cd.contract_id,
  cd.epoch_id,
  count(*) as deposit_count,
  sum(cd.amount) as total_amount
from public.contract_deposits cd
group by cd.contract_id, cd.epoch_id;

create or replace function public.process_epoch(p_contract_id uuid, p_epoch_id bigint)
returns void
language plpgsql
security definer
as $$
begin
  update public.contract_deposits
    set status = 'confirmed'
  where contract_id = p_contract_id
    and epoch_id = p_epoch_id
    and status = 'pending';
end;
$$;

grant select on public.contract_epoch_stats to authenticated;
grant execute on function public.process_epoch(uuid, bigint) to authenticated;

create policy select_epoch_stats on public.contract_epoch_stats
for select to authenticated
using (true);
