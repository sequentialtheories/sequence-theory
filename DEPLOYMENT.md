Sequence Theory — Supabase Edge Functions Deployment Guide

Prereqs
- Supabase project created and accessible
- Repo: sequentialtheories/sequence-theory
- Branch: devin/1754825321-edge-contracts (or main after merge)
- Functions root: supabase/functions
- Secrets ready: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, VAULT_CLUB_API_KEY

A) Deploy via Git connection
1) In Supabase dashboard: Project → Edge Functions → Connect Git repository
2) Repository: sequentialtheories/sequence-theory
3) Branch: devin/1754825321-edge-contracts
4) Functions directory: supabase/functions
5) Deploy
6) Optional: enable auto-deploy on new commits to this branch

B) Manual deploy per function
1) Edge Functions → Create or open the function name
2) Point to code in supabase/functions/<function-name>/index.ts
3) Deploy from UI

Functions to deploy
- vault-club-user-creation
- vault-club-auth-sync
- external-api
- Any additional vault-club-* endpoints present for contract ops (create, join, balance, stats, deposit, harvest) if included

Secrets
Project → Edge Functions → Secrets
- SUPABASE_URL = Project URL
- SUPABASE_SERVICE_ROLE_KEY = Service role key
- VAULT_CLUB_API_KEY = Shared TVC → Edge key
- Optional alias: VAULT_CLUB_EDGE_KEY (map to same value as VAULT_CLUB_API_KEY if preferred)

CORS and headers
- Functions accept: authorization, x-client-info, apikey, content-type, x-vault-club-api-key, idempotency-key

Migrations checklist
Apply the following SQL files in supabase/migrations:
- 20250811113000_idempotency.sql
- 20250811113500_epochs.sql
- 20250811114000_indices.sql

Post-deploy health checks
- OPTIONS https://<project-ref>.functions.supabase.co/vault-club-user-creation
- POST with headers:
  - x-vault-club-api-key: <VAULT_CLUB_API_KEY>
  - idempotency-key: <uuid>
- Verify 200 responses and consistent payloads on idempotent retries

Observability checks
- api_access_logs should record calls with endpoint, ip, user_agent, response_status
- idempotency_keys should contain success entries with response_snapshot when using Idempotency-Key

Notes
- Local LSP errors for Deno imports are expected; functions run under Supabase’s Deno runtime
- Do not duplicate functions; use existing names and paths
