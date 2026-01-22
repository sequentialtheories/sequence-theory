/**
 * Non-Custodial Wallet Components
 * 
 * SECURITY NOTICE:
 * All wallet functionality is 100% client-side.
 * Sequence Theory has NO access to user private keys.
 */

// Turnkey Wallet Components (new - recommended)
export { default as TurnkeyWalletSetup } from './TurnkeyWalletSetup';
export { default as TurnkeyWalletManager } from './TurnkeyWalletManager';

// Legacy components (deprecated - will be removed)
export { WalletSetup } from './WalletSetup';
export { WalletManager } from './WalletManager';
