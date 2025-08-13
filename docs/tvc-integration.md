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
