# Two-Way Sync Architecture: Sequence Theory ↔ Vault Club

## Overview

Both **Sequence Theory** and **The Vault Club** share the same Supabase backend, enabling:
- ✅ Users can create accounts on EITHER site
- ✅ Same credentials work on BOTH sites  
- ✅ Wallet is provisioned automatically via Turnkey
- ✅ Profile and wallet data synced in real-time

## Architecture Diagram

```
┌─────────────────────────────┐     ┌─────────────────────────────┐
│     Sequence Theory         │     │      The Vault Club         │
│   (sequencetheory.com)      │     │     (vaultclub.io)          │
└──────────────┬──────────────┘     └──────────────┬──────────────┘
               │                                    │
               │      Same Supabase Project         │
               │                                    │
               ▼                                    ▼
        ┌──────────────────────────────────────────────────┐
        │              SUPABASE                             │
        │  ┌─────────────────────────────────────────────┐ │
        │  │           auth.users                        │ │
        │  │  (Single source of truth for all users)     │ │
        │  └─────────────────────────────────────────────┘ │
        │                      │                           │
        │                      ▼                           │
        │  ┌─────────────────────────────────────────────┐ │
        │  │            profiles                         │ │
        │  │   user_id, name, email, eth_address         │ │
        │  └─────────────────────────────────────────────┘ │
        │                      │                           │
        │                      ▼                           │
        │  ┌─────────────────────────────────────────────┐ │
        │  │          user_wallets                       │ │
        │  │  wallet_address, turnkey_sub_org_id, etc.   │ │
        │  └─────────────────────────────────────────────┘ │
        │                                                  │
        │  Edge Functions:                                 │
        │  • turnkey-invisible-wallet (provisions wallet)  │
        │  • vault-club-user-creation (creates users)      │
        │  • vault-club-auth-sync (cross-platform login)   │
        └──────────────────────────────────────────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────────────┐
        │              TURNKEY API                         │
        │  Creates real Polygon wallets with:              │
        │  • Sub-organization per user                     │
        │  • HD wallet (m/44'/60'/0'/0/0)                  │
        │  • No authenticators (invisible/server-side)     │
        └──────────────────────────────────────────────────┘
```

## User Flows

### Flow 1: User Signs Up on Sequence Theory
```
1. User visits sequencetheory.com
2. Fills signup form (email + password)
3. Supabase Auth creates user in auth.users
4. Database trigger OR useInvisibleWallet hook fires
5. turnkey-invisible-wallet Edge Function:
   - Creates Turnkey sub-organization
   - Generates Polygon wallet address
   - Stores in user_wallets table
   - Updates profiles.eth_address
6. User sees their wallet on dashboard
7. User can now login to vaultclub.io with SAME credentials
```

### Flow 2: User Signs Up on Vault Club
```
1. User visits vaultclub.io
2. Fills signup form (email + password)
3. vault-club-user-creation Edge Function:
   - Creates user in Supabase Auth
   - Calls turnkey-invisible-wallet internally
   - Returns user data + wallet address
4. User sees their wallet on Vault Club
5. User can now login to sequencetheory.com with SAME credentials
```

### Flow 3: Cross-Platform Login
```
1. User already has account (created on either site)
2. User visits the OTHER site and logs in
3. vault-club-auth-sync Edge Function:
   - Validates credentials against Supabase Auth
   - Fetches profile and wallet data
   - If no wallet exists, triggers provisioning
   - Returns session token
4. User is logged in with full data access
```

## Supabase Secrets Required

Add these in **Supabase Dashboard > Project Settings > Vault**:

| Secret Name | Description | Where to Get |
|-------------|-------------|--------------|
| `TURNKEY_API_PUBLIC_KEY` | Turnkey API public key | Turnkey Dashboard > API Keys |
| `TURNKEY_API_PRIVATE_KEY` | Turnkey API private key (base64url) | Turnkey Dashboard > API Keys |
| `TURNKEY_ORGANIZATION_ID` | Your Turnkey org ID | Turnkey Dashboard > Organization |
| `VAULT_CLUB_API_KEY` | (Optional) Server-to-server API key | Generate a secure random string |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-set by Supabase | Already available |

## Edge Functions

### turnkey-invisible-wallet
- **Purpose**: Creates Turnkey wallet for a user
- **Trigger**: Database trigger on auth.users OR frontend hook OR other Edge Functions
- **CORS**: Allows both sequencetheory.com and vaultclub.io

### vault-club-user-creation  
- **Purpose**: Creates new user account with wallet
- **Trigger**: Called from Vault Club signup
- **Action**: Creates auth user → Calls turnkey-invisible-wallet → Returns data

### vault-club-auth-sync
- **Purpose**: Validates credentials for cross-platform login
- **Trigger**: Called when user logs in from either platform
- **Action**: Authenticates → Fetches data → Returns session

## Database Tables

### profiles
```sql
- user_id (UUID, FK to auth.users)
- email (TEXT)
- name (TEXT)
- eth_address (TEXT) -- Polygon wallet address
- created_at, updated_at
```

### user_wallets
```sql
- user_id (UUID, FK to auth.users)
- wallet_address (TEXT) -- Polygon address
- network (TEXT, default 'polygon')
- provider (TEXT, default 'turnkey')
- provenance (ENUM: 'turnkey_invisible', etc.)
- turnkey_sub_org_id (TEXT) -- Turnkey sub-org ID
- turnkey_wallet_id (TEXT) -- Turnkey wallet ID
- created_via (TEXT) -- 'invisible_api', 'vault_club_signup', etc.
```

## Testing the Sync

### Test 1: Create on Sequence Theory, Login on Vault Club
```bash
# 1. Sign up on Sequence Theory (via UI)
# 2. Note your email and password
# 3. Call Vault Club auth sync:
curl -X POST https://qldjhlnsphlixmzzrdwi.supabase.co/functions/v1/vault-club-auth-sync \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "yourpassword"}'
```

### Test 2: Create on Vault Club, Login on Sequence Theory
```bash
# 1. Create user via Vault Club:
curl -X POST https://qldjhlnsphlixmzzrdwi.supabase.co/functions/v1/vault-club-user-creation \
  -H "Content-Type: application/json" \
  -H "x-vault-club-api-key: YOUR_API_KEY" \
  -d '{"email": "new@example.com", "password": "securepass123", "name": "Test User"}'

# 2. Login on Sequence Theory with those credentials (via UI)
```

## Troubleshooting

### Wallet Not Appearing
1. Check Supabase logs for Edge Function errors
2. Verify Turnkey credentials are in Vault
3. Check user_wallets table for the user_id
4. Frontend may need to refresh to see wallet

### Cross-Platform Login Failing
1. Verify both domains in Supabase Auth redirect URLs
2. Check CORS headers in Edge Function responses
3. Ensure cookies/localStorage not blocking cross-origin

### Turnkey API Errors
1. Verify TURNKEY_API_PRIVATE_KEY is base64url encoded
2. Check Turnkey dashboard for rate limits
3. Ensure ORGANIZATION_ID is correct
