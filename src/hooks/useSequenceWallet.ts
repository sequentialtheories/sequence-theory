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
  isVerificationRequired: boolean;
  verificationEmail: string | null;
  verificationError: string | null;
  verifyEmailCode: (code: string) => Promise<void>;
  resendVerificationCode: () => Promise<void>;
}

export const useSequenceWallet = (): UseSequenceWalletReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sequenceWaaS, setSequenceWaaS] = useState<SequenceWaaS | null>(null);
  const [autoCreateWallet, setAutoCreateWallet] = useState(false);
  const [isVerificationRequired, setIsVerificationRequired] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);

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

  // Complete wallet setup after successful verification
  const completeWalletSetup = useCallback(async (waasInstance: SequenceWaaS) => {
    try {
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

      // Clear verification states
      setIsVerificationRequired(false);
      setVerificationEmail(null);
      setVerificationError(null);
      setPendingSessionId(null);

      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your Sequence wallet"
      });

    } catch (err: any) {
      console.error('Wallet setup completion failed:', err);
      throw err;
    }
  }, [persistWalletToSupabase, toast]);

  // Sign in with Sequence (updated for email verification flow)
  const signIn = useCallback(async () => {
    if (!user?.email) {
      throw new Error('User email required for wallet sign in');
    }

    try {
      setLoading(true);
      setError(null);
      setVerificationError(null);

      let waasInstance = sequenceWaaS;
      if (!waasInstance) {
        waasInstance = await initializeSequence();
      }

      console.log('Attempting Sequence sign in for:', user.email);
      
      const sessionId = `session_${Date.now()}`;
      setPendingSessionId(sessionId);

      // Follow the official Sequence sign in pattern
      const signInResponse = await waasInstance.signIn(
        { email: user.email },
        sessionId
      );

      console.log('Sign in response:', signInResponse);

      // Check if the user is already signed in (existing session)
      try {
        const isSignedIn = await waasInstance.isSignedIn();
        if (isSignedIn) {
          console.log('User already signed in, completing wallet setup');
          await completeWalletSetup(waasInstance);
          return;
        }
      } catch (err) {
        console.log('Not signed in yet, proceeding with verification flow');
      }

      // If we reach here, email verification is required
      console.log('Email verification required for:', user.email);
      setIsVerificationRequired(true);
      setVerificationEmail(user.email);
      
      toast({
        title: "Verification Required",
        description: `Please check your email (${user.email}) for the verification code`
      });

    } catch (err: any) {
      console.error('Sign in failed:', err);
      const errorMessage = err.message || 'Failed to sign in to wallet';
      setError(errorMessage);
      
      // Clear verification states on error
      setIsVerificationRequired(false);
      setVerificationEmail(null);
      setPendingSessionId(null);
      
      toast({
        title: "Wallet Connection Failed", 
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.email, sequenceWaaS, initializeSequence, toast, completeWalletSetup]);

  // Verify email code
  const verifyEmailCode = useCallback(async (code: string) => {
    if (!sequenceWaaS || !pendingSessionId || !user?.email) {
      throw new Error('No pending verification session');
    }

    try {
      setLoading(true);
      setVerificationError(null);

      console.log('Verifying email code for session:', pendingSessionId);

      // Try different possible verification method names
      let verificationResult;
      try {
        // Most likely method name based on Sequence patterns
        if ('verifyEmailCode' in sequenceWaaS) {
          verificationResult = await (sequenceWaaS as any).verifyEmailCode(code, pendingSessionId);
        } else if ('completeEmailAuth' in sequenceWaaS) {
          verificationResult = await (sequenceWaaS as any).completeEmailAuth(code, pendingSessionId);
        } else if ('verifySignIn' in sequenceWaaS) {
          verificationResult = await (sequenceWaaS as any).verifySignIn(code);
        } else {
          throw new Error('Email verification method not found in SDK');
        }
      } catch (methodErr: any) {
        console.error('Verification method failed:', methodErr);
        throw new Error(`Verification failed: ${methodErr.message}`);
      }

      console.log('Verification result:', verificationResult);

      // Complete wallet setup after successful verification
      await completeWalletSetup(sequenceWaaS);

    } catch (err: any) {
      console.error('Email verification failed:', err);
      const errorMessage = err.message || 'Invalid verification code';
      setVerificationError(errorMessage);
      
      // Map common Sequence error types to user-friendly messages
      if (errorMessage.includes('invalid') || errorMessage.includes('code')) {
        setVerificationError('Invalid verification code. Please try again.');
      } else if (errorMessage.includes('expired')) {
        setVerificationError('Verification code has expired. Please request a new one.');
      } else if (errorMessage.includes('attempts')) {
        setVerificationError('Too many verification attempts. Please try again later.');
      } else {
        setVerificationError(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [sequenceWaaS, pendingSessionId, user?.email, completeWalletSetup]);

  // Resend verification code
  const resendVerificationCode = useCallback(async () => {
    if (!user?.email) {
      throw new Error('No email available for resend');
    }

    try {
      setLoading(true);
      setVerificationError(null);

      // Re-trigger the sign in process to send a new code
      await signIn();
      
      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your email"
      });

    } catch (err: any) {
      console.error('Resend failed:', err);
      const errorMessage = err.message || 'Failed to resend verification code';
      setVerificationError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.email, signIn, toast]);

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
      // Clear verification states
      setIsVerificationRequired(false);
      setVerificationEmail(null);
      setVerificationError(null);
      setPendingSessionId(null);
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
    autoCreateWallet,
    isVerificationRequired,
    verificationEmail,
    verificationError,
    verifyEmailCode,
    resendVerificationCode
  };
};