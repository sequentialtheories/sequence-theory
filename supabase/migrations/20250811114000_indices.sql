create index if not exists idx_contract_deposits_contract_epoch on public.contract_deposits(contract_id, created_at);
create index if not exists idx_contract_deposits_epoch_id on public.contract_deposits(epoch_id);
