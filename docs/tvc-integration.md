TVC Integration Guide

Runtime configuration
- In TVC, set these values before loading the SDK:
  <script>
  window.__TVC_CONFIG = window.__TVC_CONFIG || {};
  window.__TVC_CONFIG.functionsBase = "https://qldjhlnsphlixmzzrdwi.functions.supabase.co";
  window.__TVC_CONFIG.vaultClubApiKey = "<VAULT_CLUB_API_KEY>";
  </script>

SDK expectations
- The TVC SDK reads window.__TVC_CONFIG.functionsBase and window.__TVC_CONFIG.vaultClubApiKey.
- It sends:
  - Authorization: Bearer <Supabase access_token>
  - x-vault-club-api-key: <VAULT_CLUB_API_KEY>
  - optional idempotency key headers: idempotency-key, Idempotency-Key, x-idempotency-key, X-Idempotency-Key.

CORS allowlist
- Only these origins:
  - https://staging.sequencetheory.com
  - https://staging.vaultclub.app
  - http://localhost:5173
  - http://localhost:3000
- All functions respond to OPTIONS preflight; disallowed origins receive Access-Control-Allow-Origin: null.

Idempotency behavior
- Send one of the supported idempotency key headers for write operations.
- If the request is currently processing for the same request_hash:
  - 409 conflict_idempotency_in_flight
- If an identical request previously succeeded:
  - Functions return the cached response (response_snapshot).
- request_hash inputs per function:
  - vault-club-user-creation: email + optional name
  - vault-club-auth-sync: email
  - vault-club-contract-create: auth_user_id + payload fields
  - vault-club-contract-join: auth_user_id + contract_id + contribution_amount + wallet_address
  - vault-club-deposit: auth_user_id + amount + wallet_address
  - vault-club-harvest: epoch_number

Epoch anchoring (UTC)
- Vault epochs are anchored to UTC boundaries to ensure deterministic behavior across timezones.
- Weekly cycle example: starts Monday 00:00 UTC; harvest operates on the most recently closed epoch.

Endpoints cheat sheet
- POST /vault-club-user-creation: creates Sequence Theory account + deterministic wallet.
- POST /vault-club-auth-sync: validates credentials and returns session/user/wallet/api_key data.
- POST /vault-create: creates a vault club contract (with idempotency).
- POST /vault-join: joins a contract.
- POST /vault-deposit: idempotent deposit into current epoch (creates epoch if none open).
- POST /vault-harvest: executes simulated yields for the most recently closed epoch.
- GET /vault-balance?subclub_id=...: returns balance; RLS blocks non-members.

Response envelope
- success: boolean
- request_id: string (UUID)
- data: object on success; error: string on failure

Auditing and tracing
- api_access_logs capture endpoint, ip, user_agent, request_data, response_status.
- api_audit_logs capture user_id, endpoint, method, status_code, idempotency_key, request_meta, response_meta.
- tx_ledger.details should include {"request_id": "..."} for data writes that map to ledger entries.

Operations
- Rotate VAULT_CLUB_API_KEY if unrecoverable; also set VAULT_CLUB_EDGE_KEY to the same value if used by consumers.
- Add the key in Lovable via “Add API” so TVC has access to the same value at build/runtime.
- Do not expose SUPABASE_SERVICE_ROLE_KEY to the client.

CI
- sequence-theory/.github/workflows/ci.yml validates the repo.
- Recommend adding Playwright E2E against a staging environment in a follow-up PR.

Future enhancements
- Add write rate limiting and canonical error codes.
- Add unit and E2E coverage for idempotency replay and CORS preflight behavior.

# TVC ↔ Sequence Theory Integration Guide

This guide shows how the TVC frontend calls Sequence Theory Edge Functions in staging with strict CORS, idempotency, and request tracing.

## Runtime configuration (TVC)

Add this snippet to TVC staging so the SDK picks up correct endpoints:

&lt;script&gt;
window.__TVC_CONFIG = window.__TVC_CONFIG || {};
window.__TVC_CONFIG.functionsBase = "https://qldjhlnsphlixmzzrdwi.functions.supabase.co";
window.__TVC_CONFIG.vaultClubApiKey = "&lt;VAULT_CLUB_API_KEY&gt;";
&lt;/script&gt;

The SDK reads both values at runtime.

## Request headers (all requests)

- authorization: Bearer &lt;Supabase JWT&gt;
- x-vault-club-api-key: &lt;VAULT_CLUB_API_KEY&gt;
- content-type: application/json
- For writes: Idempotency-Key (or x-idempotency-key)

## CORS

Allowed origins:
- https://staging.sequencetheory.com
- https://staging.vaultclub.app
- http://localhost:5173
- http://localhost:3000

## Response envelope

- success: boolean
- data: object (if success)
- error: string | code (if error)
- request_id: UUID present on every response

## Idempotency behavior

- First write with a new key: runs and stores a snapshot
- While in-flight: function returns HTTP 409 with error=conflict_idempotency_in_flight
- After success: repeating same key returns the cached snapshot (no duplicate side effects)

## Epochs

Deposits/harvests are grouped by week-based epochs anchored to UTC (Monday 00:00 UTC) for determinism.

## Curl smoke tests

Set variables:

```bash
JWT="&lt;sb-access-token&gt;"
BASE="https://qldjhlnsphlixmzzrdwi.functions.supabase.co"
KEY="&lt;VAULT_CLUB_API_KEY&gt;"
```

Create:
```bash
curl -s -X POST "$BASE/vault-create" \
 -H "authorization: Bearer $JWT" -H "x-vault-club-api-key: $KEY" \
 -H "content-type: application/json" \
 -d '{"name":"Club A","rigor":"MEDIUM","lock_months":24}' | jq
```

Join:
```bash
curl -s -X POST "$BASE/vault-join" \
 -H "authorization: Bearer $JWT" -H "x-vault-club-api-key: $KEY" \
 -H "content-type: application/json" \
 -d '{"subclub_id":"&lt;returned id&gt;"}' | jq
```

Deposit (idempotent):
```bash
IDEMP="00000000-0000-0000-0000-000000000123"
curl -s -X POST "$BASE/vault-deposit" \
 -H "authorization: Bearer $JWT" -H "x-vault-club-api-key: $KEY" \
 -H "x-idempotency-key: $IDEMP" -H "content-type: application/json" \
 -d '{"subclub_id":"&lt;id&gt;","amount_usdc":100}' | jq

# Repeat same key — returns cached snapshot, no duplicate ledger
curl -s -X POST "$BASE/vault-deposit" \
 -H "authorization: Bearer $JWT" -H "x-vault-club-api-key: $KEY" \
 -H "x-idempotency-key: $IDEMP" -H "content-type: application/json" \
 -d '{"subclub_id":"&lt;id&gt;","amount_usdc":100}' | jq
```

Harvest:
```bash
curl -s -X POST "$BASE/vault-harvest" \
 -H "authorization: Bearer $JWT" -H "x-vault-club-api-key: $KEY" \
 -H "x-idempotency-key: 00000000-0000-0000-0000-000000000124" \
 -H "content-type: application/json" \
 -d '{"subclub_id":"&lt;id&gt;"}' | jq
```

Balance:
```bash
curl -s "$BASE/vault-balance?subclub_id=&lt;id&gt;" \
 -H "authorization: Bearer $JWT" -H "x-vault-club-api-key: $KEY" | jq
```

Expected:
- `{success:true,...,request_id}` for valid calls
- Deposit replay returns the same snapshot
- `api_access_logs` and `tx_ledger` contain entries with matching `request_id`
- RLS blocks non-members from member-only data

## Staging checklist

- Edge Functions deployed via Git (branch `devin/1754825321-edge-contracts`, root `supabase/functions`), auto-deploy on push enabled
- Secrets set: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, VAULT_CLUB_API_KEY (and optional VAULT_CLUB_EDGE_KEY alias)
- CORS locked to the four origins above
- TVC runtime values set and Lovable “Add API” filled with VAULT_CLUB_API_KEY
- CI green on `sequence-theory` and `TVC`
