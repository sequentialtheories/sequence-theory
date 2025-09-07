import { useState, useEffect, useCallback } from 'react';
import { SequenceWaaS } from '@0xsequence/waas';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { SEQUENCE_CONFIG, validateSequenceConfig } from '@/lib/config';
import { supabase } from '@/integrations/supabase/client';

interface WalletInfo {
  address: string;
  network: string;
  isConnected: boolean;
}

interface UseSequenceWalletReturn {
  wallet: WalletInfo | null;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  autoCreateWallet: boolean;
}

export const useSequenceWallet = (): UseSequenceWalletReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sequenceWaaS, setSequenceWaaS] = useState<SequenceWaaS | null>(null);
  const [autoCreateWallet, setAutoCreateWallet] = useState(false);

  // Initialize Sequence WaaS instance
  const initializeSequence = useCallback(async () => {
    try {
      // Validate configuration first
      const configValidation = validateSequenceConfig();
      if (!configValidation.isValid) {
        throw new Error(`Configuration Error: ${configValidation.errors.join(', ')}`);
      }

      const waasInstance = new SequenceWaaS({
        projectAccessKey: SEQUENCE_CONFIG.projectAccessKey,
        waasConfigKey: SEQUENCE_CONFIG.waasConfigKey,
        network: SEQUENCE_CONFIG.network
      });

      setSequenceWaaS(waasInstance);
      return waasInstance;
    } catch (err: any) {
      console.error('Failed to initialize Sequence:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  // Persist wallet to Supabase
  const persistWalletToSupabase = useCallback(async (address: string) => {
    if (!user?.id) return;
    
    try {
      await supabase.from('user_wallets').upsert({
        user_id: user.id,
        wallet_address: address,
        network: SEQUENCE_CONFIG.network,
        provider: 'sequence_waas',
        provenance: 'sequence_embedded',
        created_via: 'sequence'
      });
      console.log('Wallet persisted to Supabase:', address);
    } catch (err) {
      console.error('Failed to persist wallet:', err);
      // Don't throw - wallet creation succeeded, persistence is optional
    }
  }, [user?.id]);

  // Check existing session and load from Supabase if needed
  const checkExistingSession = useCallback(async (waasInstance: SequenceWaaS) => {
    try {
      const isSignedIn = await waasInstance.isSignedIn();
      if (isSignedIn) {
        const address = await waasInstance.getAddress();
        if (address) {
          setWallet({
            address,
            network: SEQUENCE_CONFIG.network,
            isConnected: true
          });
          await persistWalletToSupabase(address);
          return true;
        }
      }
      
      // If not signed in to Sequence, check if we have wallet in Supabase
      if (user?.id) {
        const { data: walletData } = await supabase
          .from('user_wallets')
          .select('wallet_address, network')
          .eq('user_id', user.id)
          .eq('provider', 'sequence_waas')
          .single();
        
        if (walletData?.wallet_address) {
          console.log('Found existing wallet in Supabase, attempting to restore session');
          return false; // Indicates we should try to create/restore session
        }
      }
      
      return false;
    } catch (err) {
      console.error('Session check failed:', err);
      return false;
    }
  }, [user?.id, persistWalletToSupabase]);

  // Sign in with Sequence (following official SDK patterns)
  const signIn = useCallback(async () => {
    if (!user?.email) {
      throw new Error('User email required for wallet sign in');
    }

    try {
      setLoading(true);
      setError(null);

      let waasInstance = sequenceWaaS;
      if (!waasInstance) {
        waasInstance = await initializeSequence();
      }

      // Follow the official Sequence sign in pattern
      const signInResponse = await waasInstance.signIn(
        { email: user.email },
        `session_${Date.now()}`
      );

      const address = await waasInstance.getAddress();
      if (!address) {
        throw new Error('No wallet address returned after sign in');
      }

      setWallet({
        address,
        network: SEQUENCE_CONFIG.network,
        isConnected: true
      });

      // Persist to Supabase
      await persistWalletToSupabase(address);

      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your Sequence wallet"
      });

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign in to wallet';
      setError(errorMessage);
      toast({
        title: "Wallet Connection Failed", 
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.email, sequenceWaaS, initializeSequence, toast]);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      if (sequenceWaaS) {
        // Note: signOut method availability depends on SDK version
        // Check Sequence documentation for current method
        if ('signOut' in sequenceWaaS) {
          await (sequenceWaaS as any).signOut();
        }
      }
      setWallet(null);
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  }, [sequenceWaaS]);

  // Sign message
  const signMessage = useCallback(async (message: string): Promise<string> => {
    if (!sequenceWaaS || !wallet?.isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      const response = await sequenceWaaS.signMessage({ message });
      if (!response?.data?.signature) {
        throw new Error('No signature returned');
      }
      return response.data.signature;
    } catch (err: any) {
      console.error('Message signing failed:', err);
      throw new Error(`Failed to sign message: ${err.message}`);
    }
  }, [sequenceWaaS, wallet?.isConnected]);

  // Auto-create wallet for authenticated users
  const autoCreateWalletForUser = useCallback(async () => {
    if (!user?.email || !sequenceWaaS || wallet?.isConnected || loading) {
      return;
    }

    console.log('Auto-creating wallet for authenticated user:', user.email);
    setAutoCreateWallet(true);
    
    try {
      await signIn();
    } catch (err) {
      console.error('Auto wallet creation failed:', err);
      // Don't show toast for auto-creation failures, just log
    } finally {
      setAutoCreateWallet(false);
    }
  }, [user?.email, sequenceWaaS, wallet?.isConnected, loading, signIn]);

  // Initialize Sequence SDK on user login
  useEffect(() => {
    if (user?.email && !sequenceWaaS) {
      console.log('Initializing Sequence SDK for user:', user.email);
      setLoading(true);
      
      initializeSequence()
        .then(async (waasInstance) => {
          const hasExistingSession = await checkExistingSession(waasInstance);
          if (!hasExistingSession && !wallet?.isConnected) {
            // Auto-create wallet after initialization
            setTimeout(() => autoCreateWalletForUser(), 1000);
          }
        })
        .catch(err => {
          console.error('Initialization failed:', err);
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user?.email, sequenceWaaS, initializeSequence, checkExistingSession, autoCreateWalletForUser, wallet?.isConnected]);

  // Auto-create wallet when SDK is ready
  useEffect(() => {
    if (user?.email && sequenceWaaS && !wallet?.isConnected && !loading && !autoCreateWallet) {
      const timer = setTimeout(() => {
        autoCreateWalletForUser();
      }, 2000); // Give some time for session check
      
      return () => clearTimeout(timer);
    }
  }, [user?.email, sequenceWaaS, wallet?.isConnected, loading, autoCreateWallet, autoCreateWalletForUser]);

  return {
    wallet,
    loading,
    error,
    signIn,
    signOut,
    signMessage,
    autoCreateWallet
  };
};