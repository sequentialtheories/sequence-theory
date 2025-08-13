Sequence Theory — Testnet readiness and TVC integration recap

Overview
- Unified auth between Sequence Theory and The Vault Club (TVC) backed by a single Supabase project.
- Edge Functions hardened with strict CORS, idempotency with 409 in-flight and cached replay, and request_id propagation.
- Epoch-based vault simulation flows implemented for deposit/harvest with a UTC anchor to ensure deterministic week boundaries.
- Tiny TVC integration SDK supported via runtime config (window.__TVC_CONFIG).
- Basic CI in place.

What’s deployed or ready to deploy
- New/updated Supabase Edge Functions under supabase/functions:
  - vault-club-user-creation
  - vault-club-auth-sync
  - vault-club-contract-create
  - vault-club-contract-join
  - vault-club-balance
  - vault-club-deposit
  - vault-club-harvest
- All above functions:
  - Validate x-vault-club-api-key (VAULT_CLUB_API_KEY) and require Authorization Bearer for user endpoints.
  - Strict CORS allowlist: https://staging.sequencetheory.com, https://staging.vaultclub.app, http://localhost:5173, http://localhost:3000.
  - Idempotency for multi-header keys (idempotency-key, Idempotency-Key, x-idempotency-key, X-Idempotency-Key).
    - 409 conflict_idempotency_in_flight when a matching request is still processing.
    - Cached response snapshot returned on repeat calls after success.
  - Every JSON response includes request_id; audit rows include the same request_id for tracing.
- Migrations:
  - idempotency_keys table and indexes.
  - api_access_logs and api_audit_logs used for request/response tracing.
  - UTC-anchored epoch helpers and vault epoch tables suitable for weekly cycles on testnet.

Deployment notes (Supabase)
- Git connection: Repo sequentialtheories/sequence-theory, branch devin/1754825321-edge-contracts, functions root supabase/functions. Enable auto-deploy after first deploy.
- Secrets required (Edge Functions → Secrets):
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY (server-side only; never surface to TVC)
  - VAULT_CLUB_API_KEY (rotateable). If using an alias, set VAULT_CLUB_EDGE_KEY to the same value.
- CORS is enforced in-function; no dashboard CORS needed for these endpoints.

TVC runtime configuration
- TVC must set window.__TVC_CONFIG values before loading the SDK:
  - functionsBase = https://qldjhlnsphlixmzzrdwi.functions.supabase.co
  - vaultClubApiKey = VAULT_CLUB_API_KEY
- The tiny SDK in TVC reads these values and sends Authorization and x-vault-club-api-key on requests.

Smoke tests (staging)
- Get a fresh Supabase JWT via vault-club-auth-sync in TVC, then:

JWT="<sb-access-token>"
BASE="https://qldjhlnsphlixmzzrdwi.functions.supabase.co"
KEY="<VAULT_CLUB_API_KEY>"

# Create
curl -s -X POST "$BASE/vault-create" \
 -H "authorization: Bearer $JWT" -H "x-vault-club-api-key: $KEY" \
 -H "content-type: application/json" \
 -d '{"name":"Club A","rigor":"MEDIUM","lock_months":24}' | jq

# Join
curl -s -X POST "$BASE/vault-join" \
 -H "authorization: Bearer $JWT" -H "x-vault-club-api-key: $KEY" \
 -H "content-type: application/json" \
 -d '{"subclub_id":"<returned id>"}' | jq

# Deposit (idempotent)
IDEMP="00000000-0000-0000-0000-000000000123"
curl -s -X POST "$BASE/vault-deposit" \
 -H "authorization: Bearer $JWT" -H "x-vault-club-api-key: $KEY" \
 -H "x-idempotency-key: $IDEMP" -H "content-type: application/json" \
 -d '{"subclub_id":"<id>","amount_usdc":100}' | jq
# Repeat same key → should return cached snapshot (no duplicate ledger)
curl -s -X POST "$BASE/vault-deposit" \
 -H "authorization: Bearer $JWT" -H "x-vault-club-api-key: $KEY" \
 -H "x-idempotency-key: $IDEMP" -H "content-type: application/json" \
 -d '{"subclub_id":"<id>","amount_usdc":100}' | jq

# Harvest
curl -s -X POST "$BASE/vault-harvest" \
 -H "authorization: Bearer $JWT" -H "x-vault-club-api-key: $KEY" \
 -H "x-idempotency-key: 00000000-0000-0000-0000-000000000124" \
 -H "content-type: application/json" \
 -d '{"subclub_id":"<id>"}' | jq

# Balance
curl -s "$BASE/vault-balance?subclub_id=<id>" \
 -H "authorization: Bearer $JWT" -H "x-vault-club-api-key: $KEY" | jq

Expected:
- All responses have success:true and request_id.
- Replayed deposit returns the same snapshot (idempotency OK).
- api_access_logs and tx_ledger entries align with calls and contain request_id.
- Non-member balance returns 403/empty due to RLS.

E2E workflow from TVC (no UI changes)
- Sign up via vault-club-user-creation → sign in via vault-club-auth-sync → set session in TVC:
  await st.auth.setSession({ access_token, refresh_token });
  localStorage.setItem('sb-access-token', access_token);
- Create contract → join → deposit → harvest → check balance.
- TVC SDK calls these endpoints using window.__TVC_CONFIG.

Security and CORS
- Strict allowlist: only staging domains and localhost dev ports accepted. Disallowed origins receive Access-Control-Allow-Origin: null.
- Server-side secret usage only; do not expose SUPABASE_SERVICE_ROLE_KEY.

What’s left / future sessions
- Rate limiting writes (example target 10/min/user, respond with 429 rate_limited).
- Canonical error codes coverage: invalid_input, unauthorized, forbidden, conflict_idempotency, not_found, rate_limited, internal.
- Expand automated tests:
  - Unit tests for idempotency edge cases and cached replay.
  - Playwright smoke tests from TVC with a mock browser session to assert CORS headers and request_id in responses.
- Operational runbooks:
  - Key rotation procedure (VAULT_CLUB_API_KEY) and Lovable “Add API” step.
  - How to trace a request_id in api_access_logs and tx_ledger.
- Confirm UTC epoch helper alignment with Monday 00:00 UTC boundary for all epoch logic.

Links
- docs/tvc-integration.md contains a focused integration guide and SDK snippet.
- http/examples.http has sample calls for local testing.

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/902c4709-595e-47f5-b881-6247d8b5fbf9

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/902c4709-595e-47f5-b881-6247d8b5fbf9) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/902c4709-595e-47f5-b881-6247d8b5fbf9) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
## Vault Club integration: env, functions, and migrations

Environment variables expected by Edge Functions:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- VAULT_CLUB_API_KEY
- Optional: VAULT_CLUB_EDGE_KEY

CORS and headers:
- Edge Functions allow: authorization, x-client-info, apikey, content-type, x-vault-club-api-key, idempotency-key

Idempotency and audit logging:
- Table: public.idempotency_keys
- Edge Functions vault-club-user-creation and vault-club-auth-sync accept Idempotency-Key and cache responses
- Audit entries are written to api_access_logs

Epoch-based simulation:
- contract_deposits has a generated epoch_id based on date_trunc('week', created_at)
- current_epoch() returns the current weekly epoch as bigint
- contract_epoch_stats view summarizes totals per contract_id, epoch_id
- process_epoch(contract_id uuid, epoch_id bigint) confirms pending deposits for that epoch

How to apply migrations:
1) Apply SQL files in supabase/migrations:
   - 20250811113000_idempotency.sql
   - 20250811113500_epochs.sql
   - 20250811114000_indices.sql
2) Deploy functions:
   - supabase functions deploy vault-club-user-creation
   - supabase functions deploy vault-club-auth-sync
   - supabase functions deploy external-api

Deployment via Git connection:
- Repository: sequentialtheories/sequence-theory
- Branch: devin/1754825321-edge-contracts or main
- Root: supabase/functions

Staging/runtime config for TVC
- window.__TVC_CONFIG.functionsBase = "https://qldjhlnsphlixmzzrdwi.functions.supabase.co"
- window.__TVC_CONFIG.vaultClubApiKey = "&lt;VAULT_CLUB_API_KEY&gt;"
