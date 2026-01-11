# Security Architecture - Sequence Theory

## Overview

Sequence Theory is designed as a **non-custodial** platform. This means:

- We do NOT hold user funds
- We do NOT have access to private keys
- We CANNOT move funds without user authorization

## Wallet Infrastructure

### What We Use

- **ethers.js** - Client-side wallet generation and signing
- **Web Crypto API** - Browser-native encryption
- **localStorage** - Encrypted wallet storage
- **Supabase** - User authentication and public address storage only

### What We Do NOT Use

- ~~Turnkey~~ - Removed (was custodial risk)
- ~~Backend wallet provisioning~~ - Removed
- ~~Server-side signing~~ - Removed
- ~~Admin withdrawal keys~~ - Never implemented

## Data Flow

```
[User Browser]
    |
    |-- Generate seed phrase (ethers.js)
    |-- Derive private key (ethers.js)
    |-- Encrypt with password (Web Crypto API)
    |-- Store encrypted data (localStorage)
    |
    |-- Send PUBLIC address only ---> [Supabase]
    |
    |-- Sign transactions locally (ethers.js)
    |-- Submit signed tx ---> [Polygon Network]
```

## Backend Capabilities

The backend CAN:
- Store public wallet addresses for user identification
- Serve market data (CoinGecko integration)
- Manage user profiles and learning progress

The backend CANNOT:
- Create wallets
- Sign transactions
- Access private keys
- Move user funds

## Supabase Data

Stored in Supabase:
- User ID
- Email
- Name
- Public wallet address (eth_address)
- Learning progress

NOT stored in Supabase:
- Private keys
- Seed phrases
- Wallet passwords
- Any sensitive key material

## Threat Model

### If Sequence Theory is compromised:

- Attacker gets: User emails, names, public wallet addresses
- Attacker does NOT get: Private keys, ability to move funds
- User funds remain safe

### If user device is compromised:

- Attacker needs user's wallet password to decrypt
- With password, attacker could access funds
- User should use strong, unique password

### If user loses device:

- User can restore wallet on new device with seed phrase
- Without seed phrase, wallet is lost

## Recommendations for Users

1. Use a strong, unique wallet password
2. Store seed phrase offline in secure location
3. Never share seed phrase with anyone
4. Verify you're on the correct website before entering password
