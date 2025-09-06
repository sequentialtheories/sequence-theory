import { useState, useEffect, useCallback } from 'react';
import { SequenceWaaS } from '@0xsequence/waas';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { SEQUENCE_CONFIG, validateSequenceConfig } from '@/lib/config';

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
}

export const useSequenceWallet = (): UseSequenceWalletReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sequenceWaaS, setSequenceWaaS] = useState<SequenceWaaS | null>(null);

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

  // Check if user is already signed in
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
        }
      }
    } catch (err) {
      console.error('Session check failed:', err);
      // Don't throw here, just log - user might need to sign in fresh
    }
  }, []);

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

  // Initialize on user change
  useEffect(() => {
    if (user?.email && !sequenceWaaS) {
      initializeSequence()
        .then(checkExistingSession)
        .catch(err => {
          console.error('Initialization failed:', err);
          setError(err.message);
        });
    }
  }, [user?.email, sequenceWaaS, initializeSequence, checkExistingSession]);

  return {
    wallet,
    loading,
    error,
    signIn,
    signOut,
    signMessage
  };
};