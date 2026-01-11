/**
 * NON-CUSTODIAL WALLET HOOK
 * 
 * This hook provides a React interface for the non-custodial wallet system.
 * 
 * SECURITY GUARANTEES:
 * - Wallet is generated CLIENT-SIDE only
 * - Private keys never leave the browser
 * - Seed phrase is encrypted with user's password
 * - Sequence Theory has NO ACCESS to private keys
 * - Only PUBLIC wallet address is stored in Supabase
 */

import { useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import {
  WalletData,
  DecryptedWallet,
  generateWallet,
  importWalletFromMnemonic,
  decryptWallet,
  saveWalletToStorage,
  loadWalletFromStorage,
  clearWalletFromStorage,
  hasStoredWallet,
  getStoredWalletAddress,
  signMessage,
  isValidMnemonic
} from '@/lib/wallet/NonCustodialWallet';

export interface WalletState {
  isInitialized: boolean;
  hasWallet: boolean;
  address: string | null;
  isUnlocked: boolean;
  error: string | null;
}

export interface UseNonCustodialWalletReturn {
  state: WalletState;
  // Wallet creation
  createWallet: (password: string) => Promise<{ success: boolean; mnemonic?: string; error?: string }>;
  importWallet: (mnemonic: string, password: string) => Promise<{ success: boolean; error?: string }>;
  // Wallet access
  unlockWallet: (password: string) => Promise<{ success: boolean; wallet?: DecryptedWallet; error?: string }>;
  lockWallet: () => void;
  // Wallet info
  exportSeedPhrase: (password: string) => Promise<{ success: boolean; mnemonic?: string; error?: string }>;
  exportPrivateKey: (password: string) => Promise<{ success: boolean; privateKey?: string; error?: string }>;
  // Signing
  signMessageWithWallet: (message: string, password: string) => Promise<{ success: boolean; signature?: string; error?: string }>;
  // Management
  deleteWallet: () => void;
  // Sync
  syncAddressToSupabase: (session: Session) => Promise<void>;
}

export const useNonCustodialWallet = (session: Session | null): UseNonCustodialWalletReturn => {
  const [state, setState] = useState<WalletState>({
    isInitialized: false,
    hasWallet: false,
    address: null,
    isUnlocked: false,
    error: null
  });

  const [unlockedWallet, setUnlockedWallet] = useState<DecryptedWallet | null>(null);

  // Initialize state from local storage
  useEffect(() => {
    const hasWallet = hasStoredWallet();
    const address = getStoredWalletAddress();
    
    setState(prev => ({
      ...prev,
      isInitialized: true,
      hasWallet,
      address
    }));
  }, []);

  /**
   * Sync public wallet address to Supabase
   * ONLY syncs the PUBLIC address - never private data
   */
  const syncAddressToSupabase = useCallback(async (userSession: Session) => {
    const address = getStoredWalletAddress();
    if (!address || !userSession?.user?.id) return;

    try {
      // Update profile with public address only
      await supabase
        .from('profiles')
        .update({ eth_address: address })
        .eq('user_id', userSession.user.id);

      console.log('[NonCustodialWallet] Public address synced to profile');
    } catch (error) {
      console.error('[NonCustodialWallet] Failed to sync address:', error);
    }
  }, []);

  // Auto-sync when session changes and wallet exists
  useEffect(() => {
    if (session && state.hasWallet && state.address) {
      syncAddressToSupabase(session);
    }
  }, [session, state.hasWallet, state.address, syncAddressToSupabase]);

  /**
   * Create a new wallet - generates seed phrase CLIENT-SIDE
   */
  const createWallet = useCallback(async (password: string): Promise<{ success: boolean; mnemonic?: string; error?: string }> => {
    try {
      if (!password || password.length < 8) {
        return { success: false, error: 'Password must be at least 8 characters' };
      }

      const { wallet, mnemonic } = await generateWallet(password);
      saveWalletToStorage(wallet);

      setState(prev => ({
        ...prev,
        hasWallet: true,
        address: wallet.address,
        error: null
      }));

      // Sync public address to Supabase if logged in
      if (session) {
        await syncAddressToSupabase(session);
      }

      return { success: true, mnemonic };
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to create wallet';
      setState(prev => ({ ...prev, error: errorMsg }));
      return { success: false, error: errorMsg };
    }
  }, [session, syncAddressToSupabase]);

  /**
   * Import wallet from seed phrase
   */
  const importWallet = useCallback(async (
    mnemonic: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!isValidMnemonic(mnemonic)) {
        return { success: false, error: 'Invalid seed phrase' };
      }

      if (!password || password.length < 8) {
        return { success: false, error: 'Password must be at least 8 characters' };
      }

      const wallet = await importWalletFromMnemonic(mnemonic, password);
      saveWalletToStorage(wallet);

      setState(prev => ({
        ...prev,
        hasWallet: true,
        address: wallet.address,
        error: null
      }));

      if (session) {
        await syncAddressToSupabase(session);
      }

      return { success: true };
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to import wallet';
      setState(prev => ({ ...prev, error: errorMsg }));
      return { success: false, error: errorMsg };
    }
  }, [session, syncAddressToSupabase]);

  /**
   * Unlock wallet with password
   */
  const unlockWallet = useCallback(async (
    password: string
  ): Promise<{ success: boolean; wallet?: DecryptedWallet; error?: string }> => {
    try {
      const walletData = loadWalletFromStorage();
      if (!walletData) {
        return { success: false, error: 'No wallet found' };
      }

      const decrypted = await decryptWallet(walletData, password);
      setUnlockedWallet(decrypted);

      setState(prev => ({
        ...prev,
        isUnlocked: true,
        error: null
      }));

      return { success: true, wallet: decrypted };
    } catch (error: any) {
      const errorMsg = error?.message || 'Invalid password';
      setState(prev => ({ ...prev, error: errorMsg }));
      return { success: false, error: errorMsg };
    }
  }, []);

  /**
   * Lock wallet - clear decrypted data from memory
   */
  const lockWallet = useCallback(() => {
    setUnlockedWallet(null);
    setState(prev => ({
      ...prev,
      isUnlocked: false
    }));
  }, []);

  /**
   * Export seed phrase (requires password)
   */
  const exportSeedPhrase = useCallback(async (
    password: string
  ): Promise<{ success: boolean; mnemonic?: string; error?: string }> => {
    try {
      const walletData = loadWalletFromStorage();
      if (!walletData) {
        return { success: false, error: 'No wallet found' };
      }

      const decrypted = await decryptWallet(walletData, password);
      return { success: true, mnemonic: decrypted.mnemonic };
    } catch (error: any) {
      return { success: false, error: error?.message || 'Invalid password' };
    }
  }, []);

  /**
   * Export private key (requires password)
   */
  const exportPrivateKey = useCallback(async (
    password: string
  ): Promise<{ success: boolean; privateKey?: string; error?: string }> => {
    try {
      const walletData = loadWalletFromStorage();
      if (!walletData) {
        return { success: false, error: 'No wallet found' };
      }

      const decrypted = await decryptWallet(walletData, password);
      return { success: true, privateKey: decrypted.privateKey };
    } catch (error: any) {
      return { success: false, error: error?.message || 'Invalid password' };
    }
  }, []);

  /**
   * Sign a message
   */
  const signMessageWithWallet = useCallback(async (
    message: string,
    password: string
  ): Promise<{ success: boolean; signature?: string; error?: string }> => {
    try {
      const signature = await signMessage(message, password);
      return { success: true, signature };
    } catch (error: any) {
      return { success: false, error: error?.message || 'Failed to sign message' };
    }
  }, []);

  /**
   * Delete wallet from storage
   * WARNING: This is irreversible if seed phrase not backed up
   */
  const deleteWallet = useCallback(() => {
    clearWalletFromStorage();
    setUnlockedWallet(null);
    setState({
      isInitialized: true,
      hasWallet: false,
      address: null,
      isUnlocked: false,
      error: null
    });
  }, []);

  return {
    state,
    createWallet,
    importWallet,
    unlockWallet,
    lockWallet,
    exportSeedPhrase,
    exportPrivateKey,
    signMessageWithWallet,
    deleteWallet,
    syncAddressToSupabase
  };
};
