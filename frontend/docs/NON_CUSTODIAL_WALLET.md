# Non-Custodial Wallet Architecture

## Security Principles

This document describes the non-custodial wallet implementation for Sequence Theory.

### Core Guarantees

1. **Sequence Theory CANNOT access user private keys**
   - All key generation happens client-side using ethers.js
   - Private keys are encrypted with user's password before storage
   - Encrypted data is stored only in browser localStorage

2. **Sequence Theory CANNOT move user funds**
   - There is NO backend signing authority
   - There are NO admin keys for fund movement
   - All transactions require user authorization

3. **Users have FULL control**
   - Users can export their seed phrase (12 words)
   - Users can export their private key
   - Users can import existing wallets
   - Users can delete their wallet from the device

4. **Seed phrase is the ONLY backup**
   - If users lose their seed phrase, their wallet is unrecoverable
   - Sequence Theory cannot help recover lost wallets

## Technical Implementation

### Client-Side Wallet Generation

```typescript
// All generation happens in the browser
import { ethers, HDNodeWallet, Mnemonic } from 'ethers';

// Generate 12-word seed phrase
const randomBytes = ethers.randomBytes(16);
const mnemonic = Mnemonic.fromEntropy(randomBytes);

// Derive wallet from seed phrase
const wallet = HDNodeWallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/0");
```

### Encryption

- Private keys are encrypted using AES-256-GCM
- Encryption key is derived from user's password using PBKDF2
- 100,000 iterations for key derivation
- Random salt and IV for each encryption

### Storage

- Encrypted wallet data stored in `localStorage`
- Only public address is synced to Supabase
- NO private key material is ever sent to any server

## Components Removed (Security)

The following custodial components have been **removed**:

1. `/api/provision-wallet` endpoint - **DELETED**
2. `useInvisibleWallet` hook - **DELETED**
3. Turnkey API integration - **DELETED**
4. Backend signing functions - **DELETED**

## User Flow

### Wallet Creation

1. User signs up/logs in via email/password
2. User is prompted to create a wallet
3. User sets a wallet password (client-side only)
4. 12-word seed phrase is generated client-side
5. User is required to backup the seed phrase
6. Encrypted wallet is stored in localStorage
7. Public address is synced to Supabase for identification

### Wallet Recovery

1. User clicks "Import Wallet"
2. User enters their 12-word seed phrase
3. User sets a new password
4. Wallet is restored from seed phrase

### Viewing Seed Phrase / Private Key

1. User clicks "View Seed Phrase" or "View Private Key"
2. User enters their wallet password
3. Data is decrypted client-side and displayed
4. Data is never sent to any server

## Disclosure Requirements

The UI must clearly disclose:

- "Sequence Theory cannot access your private keys"
- "Sequence Theory cannot move your funds"
- "Only you control your wallet"
- "Your seed phrase is your only backup"
- "If you lose your seed phrase, your wallet cannot be recovered"

## Security Checklist

- [x] No backend signing authority
- [x] No backend custody of private keys
- [x] No unilateral fund movement capability
- [x] No Turnkey/custodial wallet provisioning
- [x] Client-side key generation only
- [x] User-controlled seed phrase backup
- [x] Clear security disclosures in UI

## FAQ Copy Suggestions

### "How does Sequence Theory secure my wallet?"

Your wallet is non-custodial, meaning you have complete control. We use industry-standard encryption to protect your wallet on your device, but we never have access to your private keys or seed phrase. Only you can authorize transactions.

### "Can Sequence Theory access my funds?"

No. Sequence Theory has no access to your private keys and cannot move your funds under any circumstances. Your wallet is secured entirely on your device, and only you hold the keys.

### "What if I forget my password?"

Your wallet password is used to encrypt your wallet on your device. If you forget it, you can restore your wallet using your 12-word seed phrase. We cannot reset your password for you.

### "What if I lose my seed phrase?"

If you lose your seed phrase and cannot access your wallet, your funds are permanently lost. We cannot recover your wallet. Please store your seed phrase in a secure location.
