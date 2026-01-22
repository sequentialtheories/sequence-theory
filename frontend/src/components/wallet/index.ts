/**
 * Wallet Components
 * 
 * SECURITY NOTICE:
 * Wallet keys are managed by Turnkey's secure TEE infrastructure.
 * Sequence Theory has NO access to user private keys.
 */

// Turnkey Wallet Components
export { TurnkeyWalletSetup } from './TurnkeyWalletSetup';
export { TurnkeyWalletManager } from './TurnkeyWalletManager';

// Legacy components (deprecated)
export { WalletSetup } from './WalletSetup';
export { WalletManager } from './WalletManager';
