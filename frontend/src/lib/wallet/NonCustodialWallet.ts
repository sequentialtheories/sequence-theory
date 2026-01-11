/**
 * NON-CUSTODIAL WALLET IMPLEMENTATION
 * 
 * SECURITY PRINCIPLES:
 * - All cryptographic operations happen CLIENT-SIDE ONLY
 * - Private keys NEVER leave the user's device
 * - Seed phrases are generated and stored locally
 * - Sequence Theory has ZERO access to private key material
 * - Backend only stores PUBLIC wallet address for identification
 * 
 * This implementation ensures users have FULL control over their funds.
 */

import { ethers, HDNodeWallet, Mnemonic } from 'ethers';

// Encryption key derivation from user password
const deriveEncryptionKey = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

// Encrypt data with user's password
const encryptData = async (data: string, password: string): Promise<string> => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveEncryptionKey(password, salt);
  
  const encoder = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(data)
  );
  
  // Combine salt + iv + encrypted data
  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);
  
  return btoa(String.fromCharCode(...combined));
};

// Decrypt data with user's password
const decryptData = async (encryptedBase64: string, password: string): Promise<string> => {
  const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
  
  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const encrypted = combined.slice(28);
  
  const key = await deriveEncryptionKey(password, salt);
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encrypted
  );
  
  return new TextDecoder().decode(decrypted);
};

export interface WalletData {
  address: string;
  encryptedMnemonic: string;
  createdAt: string;
  derivationPath: string;
}

export interface DecryptedWallet {
  address: string;
  privateKey: string;
  mnemonic: string;
  derivationPath: string;
}

const WALLET_STORAGE_KEY = 'st_wallet_data';
const DERIVATION_PATH = "m/44'/60'/0'/0/0"; // Standard Ethereum path

/**
 * Generate a new wallet with a random seed phrase
 * ALL GENERATION HAPPENS CLIENT-SIDE
 */
export const generateWallet = async (password: string): Promise<{ wallet: WalletData; mnemonic: string }> => {
  // Generate random mnemonic (seed phrase) - 12 words
  const randomBytes = ethers.randomBytes(16); // 128 bits = 12 words
  const mnemonic = Mnemonic.fromEntropy(randomBytes);
  
  // Derive wallet from mnemonic
  const hdWallet = HDNodeWallet.fromMnemonic(mnemonic, DERIVATION_PATH);
  
  // Encrypt the mnemonic with user's password
  const encryptedMnemonic = await encryptData(mnemonic.phrase, password);
  
  const walletData: WalletData = {
    address: hdWallet.address,
    encryptedMnemonic,
    createdAt: new Date().toISOString(),
    derivationPath: DERIVATION_PATH
  };
  
  return {
    wallet: walletData,
    mnemonic: mnemonic.phrase // Return for user to backup - ONLY SHOWN ONCE
  };
};

/**
 * Import wallet from existing seed phrase
 */
export const importWalletFromMnemonic = async (
  mnemonicPhrase: string,
  password: string
): Promise<WalletData> => {
  // Validate mnemonic
  if (!ethers.Mnemonic.isValidMnemonic(mnemonicPhrase.trim())) {
    throw new Error('Invalid seed phrase');
  }
  
  const mnemonic = Mnemonic.fromPhrase(mnemonicPhrase.trim());
  const hdWallet = HDNodeWallet.fromMnemonic(mnemonic, DERIVATION_PATH);
  
  const encryptedMnemonic = await encryptData(mnemonic.phrase, password);
  
  return {
    address: hdWallet.address,
    encryptedMnemonic,
    createdAt: new Date().toISOString(),
    derivationPath: DERIVATION_PATH
  };
};

/**
 * Decrypt wallet to access private key and mnemonic
 * ONLY HAPPENS CLIENT-SIDE - NEVER SENT TO SERVER
 */
export const decryptWallet = async (
  walletData: WalletData,
  password: string
): Promise<DecryptedWallet> => {
  try {
    const mnemonicPhrase = await decryptData(walletData.encryptedMnemonic, password);
    const mnemonic = Mnemonic.fromPhrase(mnemonicPhrase);
    const hdWallet = HDNodeWallet.fromMnemonic(mnemonic, walletData.derivationPath);
    
    return {
      address: hdWallet.address,
      privateKey: hdWallet.privateKey,
      mnemonic: mnemonicPhrase,
      derivationPath: walletData.derivationPath
    };
  } catch (error) {
    throw new Error('Invalid password or corrupted wallet data');
  }
};

/**
 * Save wallet data to local storage
 * ONLY PUBLIC DATA + ENCRYPTED MNEMONIC - NEVER PLAINTEXT KEYS
 */
export const saveWalletToStorage = (walletData: WalletData): void => {
  localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(walletData));
};

/**
 * Load wallet data from local storage
 */
export const loadWalletFromStorage = (): WalletData | null => {
  const stored = localStorage.getItem(WALLET_STORAGE_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored) as WalletData;
  } catch {
    return null;
  }
};

/**
 * Remove wallet from local storage
 * WARNING: If user hasn't backed up seed phrase, wallet is UNRECOVERABLE
 */
export const clearWalletFromStorage = (): void => {
  localStorage.removeItem(WALLET_STORAGE_KEY);
};

/**
 * Check if wallet exists in storage
 */
export const hasStoredWallet = (): boolean => {
  return localStorage.getItem(WALLET_STORAGE_KEY) !== null;
};

/**
 * Validate a mnemonic phrase
 */
export const isValidMnemonic = (phrase: string): boolean => {
  return ethers.Mnemonic.isValidMnemonic(phrase.trim());
};

/**
 * Get wallet address from storage (public info only)
 */
export const getStoredWalletAddress = (): string | null => {
  const wallet = loadWalletFromStorage();
  return wallet?.address || null;
};

/**
 * Sign a message with the wallet (requires password)
 * Used for authentication/consent signing
 */
export const signMessage = async (
  message: string,
  password: string
): Promise<string> => {
  const walletData = loadWalletFromStorage();
  if (!walletData) throw new Error('No wallet found');
  
  const decrypted = await decryptWallet(walletData, password);
  const wallet = new ethers.Wallet(decrypted.privateKey);
  
  return wallet.signMessage(message);
};

/**
 * Verify wallet ownership by signing a challenge
 */
export const verifyWalletOwnership = async (
  challenge: string,
  password: string
): Promise<{ signature: string; address: string }> => {
  const walletData = loadWalletFromStorage();
  if (!walletData) throw new Error('No wallet found');
  
  const signature = await signMessage(challenge, password);
  
  return {
    signature,
    address: walletData.address
  };
};
