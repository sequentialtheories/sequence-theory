# TVC Integration Guide

This guide provides everything needed to integrate Vault Club operations from TVC with the Sequence Theory backend.

## Overview

All Vault Club operations are implemented as Supabase Edge Functions with:
- **Authentication**: Supabase JWT tokens
- **Authorization**: `x-vault-club-api-key` header
- **Idempotency**: `x-idempotency-key` header for write operations
- **Response Format**: Standard envelope `{success, data, error, ts, version}`

## Functions Base URL

```
https://qldjhlnsphlixmzzrdwi.supabase.co/functions/v1
```

## Required Headers

All requests must include:
- `authorization: Bearer <JWT_TOKEN>` (from Supabase auth)
- `x-vault-club-api-key: <VAULT_CLUB_API_KEY>` (provided by Sequence Theory)
- `content-type: application/json` (for POST requests)
- `x-idempotency-key: <UUID>` (for write operations only)

## TVC SDK

Add this to your TVC project as `src/lib/tvcClient.ts`:

```typescript
type Env = { functionsBase: string; vaultClubApiKey: string };
const cfg = (): Env => (window as any).__TVC_CONFIG;

const commonHeaders = () => ({
  "content-type": "application/json",
  "x-vault-club-api-key": cfg().vaultClubApiKey,
  ...(localStorage.getItem("sb-access-token")
    ? { "authorization": `Bearer ${localStorage.getItem("sb-access-token")}` } : {})
});

const rid = () => (crypto as any).randomUUID?.() || Math.random().toString(36).slice(2);

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${cfg().functionsBase}/${path}`, { 
    ...init, 
    headers: { ...commonHeaders(), ...(init?.headers || {}) } 
  });
  const json = await res.json();
  if (!res.ok || json?.success === false) throw new Error(json?.error || res.statusText);
  return json;
}

export const TVC = {
  create: (name: string, rigor: "LIGHT" | "MEDIUM" | "HEAVY", lock_months: number) =>
    call("vault-create", { 
      method: "POST", 
      body: JSON.stringify({ name, rigor, lock_months }) 
    }),
    
  join: (subclub_id: string) =>
    call("vault-join", { 
      method: "POST", 
      body: JSON.stringify({ subclub_id }) 
    }),
    
  balance: (subclub_id: string) =>
    call(`vault-balance?subclub_id=${encodeURIComponent(subclub_id)}`),
    
  deposit: (subclub_id: string, amount_usdc: number) =>
    call("vault-deposit", { 
      method: "POST", 
      headers: { "x-idempotency-key": rid() }, 
      body: JSON.stringify({ subclub_id, amount_usdc }) 
    }),
    
  harvest: (subclub_id: string) =>
    call("vault-harvest", { 
      method: "POST", 
      headers: { "x-idempotency-key": rid() }, 
      body: JSON.stringify({ subclub_id }) 
    }),
};
```

## Runtime Configuration

Add this script tag to your TVC `index.html` (before any other scripts):

```html
<script>
  window.__TVC_CONFIG = window.__TVC_CONFIG || {};
  window.__TVC_CONFIG.functionsBase = "https://qldjhlnsphlixmzzrdwi.supabase.co/functions/v1";
  window.__TVC_CONFIG.vaultClubApiKey = "<VAULT_CLUB_API_KEY>"; // provided by Sequence Theory
</script>
```

**Note**: Replace `<VAULT_CLUB_API_KEY>` with the actual key provided by Sequence Theory team.

## Mock Replacement Mapping

Replace your existing TVC mocks with these SDK calls:

| TVC Mock Function | TVC SDK Call | Notes |
|------------------|--------------|-------|
| `createVaultClub()` | `TVC.create(name, rigor, lock_months)` | Returns `{success, data: {subclub_id, name, rigor, lock_months, created_at}}` |
| `joinVaultClub()` | `TVC.join(subclub_id)` | Returns `{success, data: {subclub_id, user_id, role, joined_at}}` |
| `getVaultBalance()` | `TVC.balance(subclub_id)` | Returns `{success, data: {epoch_week, tvl_usdc, p1_usdc, p2_usdc, p3_usdc, member_count, per_user_share?}}` |
| `depositToVault()` | `TVC.deposit(subclub_id, amount_usdc)` | Returns `{success, data: {transaction_id, new_epoch_week, new_tvl_usdc, split}}` |
| `harvestVault()` | `TVC.harvest(subclub_id)` | Returns `{success, data: {transaction_id, total_yield_usdc, new_epoch_week, profits, new_balances}}` |

## API Endpoints

### 1. Create Vault Club
**POST** `/vault-create`

```json
{
  "name": "My Vault Club",
  "rigor": "MEDIUM",
  "lock_months": 12
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subclub_id": "uuid",
    "name": "My Vault Club",
    "rigor": "MEDIUM", 
    "lock_months": 12,
    "created_at": "2024-01-01T00:00:00Z"
  },
  "error": null,
  "ts": "2024-01-01T00:00:00Z",
  "version": "1.0"
}
```

### 2. Join Vault Club
**POST** `/vault-join`

```json
{
  "subclub_id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subclub_id": "uuid",
    "user_id": "uuid",
    "role": "MEMBER",
    "joined_at": "2024-01-01T00:00:00Z"
  },
  "error": null,
  "ts": "2024-01-01T00:00:00Z",
  "version": "1.0"
}
```

### 3. Get Vault Balance
**GET** `/vault-balance?subclub_id=uuid`

**Response:**
```json
{
  "success": true,
  "data": {
    "subclub_id": "uuid",
    "epoch_week": 5,
    "tvl_usdc": "10000.50",
    "p1_usdc": "6000.30",
    "p2_usdc": "1000.05", 
    "p3_usdc": "3000.15",
    "wbtc_sats": "0",
    "member_count": 10,
    "user_role": "MEMBER",
    "per_user_share": {
      "p1_usdc_share": "600.03",
      "p2_usdc_share": "100.005",
      "p3_usdc_share": "300.015",
      "tvl_usdc_share": "1000.05"
    }
  },
  "error": null,
  "ts": "2024-01-01T00:00:00Z",
  "version": "1.0"
}
```

### 4. Deposit to Vault
**POST** `/vault-deposit`
**Headers:** `x-idempotency-key: <uuid>`

```json
{
  "subclub_id": "uuid",
  "amount_usdc": 1000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction_id": "uuid",
    "amount_usdc": 1000,
    "new_epoch_week": 6,
    "new_tvl_usdc": "11000.50",
    "split": {
      "p1_amount": 600,
      "p2_amount": 100,
      "p3_amount": 300
    },
    "status": "APPLIED"
  },
  "error": null,
  "ts": "2024-01-01T00:00:00Z",
  "version": "1.0"
}
```

### 5. Harvest Vault
**POST** `/vault-harvest`
**Headers:** `x-idempotency-key: <uuid>`

```json
{
  "subclub_id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction_id": "uuid",
    "total_yield_usdc": 125.75,
    "new_epoch_week": 6,
    "new_tvl_usdc": "11126.25",
    "profits": {
      "p1_profit": 60.15,
      "p2_profit": 20.30,
      "p3_profit": 45.30
    },
    "rrl_changes": {
      "p1_change": 85.42,
      "p2_change": 15.18,
      "p3_change": 25.15
    },
    "new_balances": {
      "p1_usdc": "6685.72",
      "p2_usdc": "1015.23",
      "p3_usdc": "3025.30"
    },
    "status": "APPLIED"
  },
  "error": null,
  "ts": "2024-01-01T00:00:00Z",
  "version": "1.0"
}
```

## Forum Integration

For forum functionality, you can use the Supabase client directly with RLS policies or create simple Edge Function wrappers. The tables are:

- `forum_topics` (id, title, created_by, created_at)
- `forum_messages` (id, topic_id, body, created_by, created_at)

Both have RLS policies allowing authenticated users to read and authors to write.

## Curl Smoke Tests

### Create a vault club:
```bash
curl -X POST "https://qldjhlnsphlixmzzrdwi.supabase.co/functions/v1/vault-create" \
  -H "authorization: Bearer <JWT_TOKEN>" \
  -H "x-vault-club-api-key: <API_KEY>" \
  -H "content-type: application/json" \
  -d '{"name": "Test Club", "rigor": "LIGHT", "lock_months": 6}'
```

### Join a vault club:
```bash
curl -X POST "https://qldjhlnsphlixmzzrdwi.supabase.co/functions/v1/vault-join" \
  -H "authorization: Bearer <JWT_TOKEN>" \
  -H "x-vault-club-api-key: <API_KEY>" \
  -H "content-type: application/json" \
  -d '{"subclub_id": "<SUBCLUB_ID>"}'
```

### Get balance:
```bash
curl "https://qldjhlnsphlixmzzrdwi.supabase.co/functions/v1/vault-balance?subclub_id=<SUBCLUB_ID>" \
  -H "authorization: Bearer <JWT_TOKEN>" \
  -H "x-vault-club-api-key: <API_KEY>"
```

### Make a deposit:
```bash
curl -X POST "https://qldjhlnsphlixmzzrdwi.supabase.co/functions/v1/vault-deposit" \
  -H "authorization: Bearer <JWT_TOKEN>" \
  -H "x-vault-club-api-key: <API_KEY>" \
  -H "x-idempotency-key: $(uuidgen)" \
  -H "content-type: application/json" \
  -d '{"subclub_id": "<SUBCLUB_ID>", "amount_usdc": 1000}'
```

### Harvest vault:
```bash
curl -X POST "https://qldjhlnsphlixmzzrdwi.supabase.co/functions/v1/vault-harvest" \
  -H "authorization: Bearer <JWT_TOKEN>" \
  -H "x-vault-club-api-key: <API_KEY>" \
  -H "x-idempotency-key: $(uuidgen)" \
  -H "content-type: application/json" \
  -d '{"subclub_id": "<SUBCLUB_ID>"}'
```

## Error Handling

All functions return errors in the standard envelope format:

```json
{
  "success": false,
  "data": null,
  "error": "Error message description",
  "ts": "2024-01-01T00:00:00Z",
  "version": "1.0"
}
```

Common error status codes:
- `400`: Bad request (missing fields, invalid data)
- `401`: Unauthorized (missing/invalid JWT)
- `403`: Forbidden (invalid API key, not a member)
- `404`: Not found (subclub doesn't exist)
- `409`: Conflict (already a member, duplicate idempotency key)
- `500`: Internal server error

## Security & Best Practices

1. **Never commit the `VAULT_CLUB_API_KEY`** - it should be injected at runtime
2. **Always use idempotency keys** for write operations to prevent duplicates
3. **Handle errors gracefully** - the SDK throws on non-2xx responses
4. **JWT tokens are managed by Supabase** - ensure your auth flow sets them correctly
5. **Test in staging first** - use the functions URL provided above

## Support

For technical support or questions about this integration, contact the Sequence Theory team.