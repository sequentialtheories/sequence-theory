/**
 * TURNKEY WALLET HOOK
 * 
 * Replaces the old useNonCustodialWallet hook with Turnkey Embedded Wallets.
 * 
 * Features:
 * - Passkey (WebAuthn) authentication
 * - Email OTP fallback authentication
 * - Wallet creation via Turnkey sub-organizations
 * - Message signing
 * - Transaction signing
 * 
 * SECURITY:
 * - NO private keys stored locally
 * - NO seed phrases exposed
 * - All signing happens in Turnkey's secure TEE
 */

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

export interface TurnkeyWalletState {
  address: string | null;
  hasWallet: boolean;
  isLoading: boolean;
  error: string | null;
  network: string;
  provider: string;
}

export interface UseTurnkeyWalletReturn {
  state: TurnkeyWalletState;
  createWallet: () => Promise<{ success: boolean; address?: string; error?: string }>;
  signMessage: (message: string) => Promise<{ success: boolean; signature?: string; error?: string }>;
  signTransaction: (tx: TransactionRequest) => Promise<{ success: boolean; signedTx?: string; error?: string }>;
  refreshWalletInfo: () => Promise<void>;
}

export interface TransactionRequest {
  to: string;
  value: string;
  data?: string;
  chainId?: number;
  gasLimit?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  nonce?: number;
}

export function useTurnkeyWallet(): UseTurnkeyWalletReturn {
  const { session, user } = useAuth();
  
  const [state, setState] = useState<TurnkeyWalletState>({
    address: null,
    hasWallet: false,
    isLoading: true,
    error: null,
    network: 'polygon',
    provider: 'turnkey'
  });

  // Fetch wallet info on mount and when session changes
  const refreshWalletInfo = useCallback(async () => {
    if (!session?.access_token) {
      setState(prev => ({ ...prev, isLoading: false, hasWallet: false, address: null }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`${BACKEND_URL}/api/turnkey/wallet-info`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wallet info');
      }

      const data = await response.json();
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        hasWallet: data.hasWallet,
        address: data.wallet?.address || null,
        network: data.wallet?.network || 'polygon',
        provider: data.wallet?.provider || 'turnkey',
        error: null
      }));
    } catch (error) {
      console.error('Error fetching wallet info:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch wallet'
      }));
    }
  }, [session?.access_token]);

  useEffect(() => {
    refreshWalletInfo();
  }, [refreshWalletInfo]);

  // Create a new Turnkey wallet
  const createWallet = useCallback(async (): Promise<{ success: boolean; address?: string; error?: string }> => {
    if (!session?.access_token || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    if (state.hasWallet) {
      return { success: false, error: 'Wallet already exists' };
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`${BACKEND_URL}/api/turnkey/create-wallet`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user.email,
          name: user.user_metadata?.name || user.email?.split('@')[0],
          user_id: user.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create wallet');
      }

      const data = await response.json();
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        hasWallet: true,
        address: data.wallet_address,
        error: null
      }));

      return { success: true, address: data.wallet_address };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create wallet';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  }, [session?.access_token, user, state.hasWallet]);

  // Sign a message
  const signMessage = useCallback(async (message: string): Promise<{ success: boolean; signature?: string; error?: string }> => {
    if (!session?.access_token) {
      return { success: false, error: 'Not authenticated' };
    }

    if (!state.hasWallet) {
      return { success: false, error: 'No wallet found' };
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/turnkey/sign-message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to sign message');
      }

      const data = await response.json();
      return { success: true, signature: data.signature };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign message';
      return { success: false, error: errorMessage };
    }
  }, [session?.access_token, state.hasWallet]);

  // Sign a transaction
  const signTransaction = useCallback(async (tx: TransactionRequest): Promise<{ success: boolean; signedTx?: string; error?: string }> => {
    if (!session?.access_token) {
      return { success: false, error: 'Not authenticated' };
    }

    if (!state.hasWallet) {
      return { success: false, error: 'No wallet found' };
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/turnkey/sign-transaction`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: tx.to,
          value: tx.value,
          data: tx.data || '0x',
          chainId: tx.chainId || 137,
          gasLimit: tx.gasLimit,
          maxFeePerGas: tx.maxFeePerGas,
          maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
          nonce: tx.nonce
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to sign transaction');
      }

      const data = await response.json();
      return { success: true, signedTx: data.signedTransaction };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign transaction';
      return { success: false, error: errorMessage };
    }
  }, [session?.access_token, state.hasWallet]);

  return {
    state,
    createWallet,
    signMessage,
    signTransaction,
    refreshWalletInfo
  };
}

export default useTurnkeyWallet;
