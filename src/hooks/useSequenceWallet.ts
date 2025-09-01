import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { CFG } from '@/lib/config'

interface WalletInfo {
  address: string
  network: string
  provider: string
}

interface UseSequenceWalletReturn {
  wallet: WalletInfo | null
  loading: boolean
  error: string | null
  createWallet: () => Promise<void>
  refetchWallet: () => Promise<void>
  signMessage: (message: string) => Promise<string>
}

export const useSequenceWallet = (): UseSequenceWalletReturn => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [wallet, setWallet] = useState<WalletInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sequenceRef = useRef<any>(null) // Store the sequence instance for reuse

  const fetchWallet = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      setError(null)

      const { data: existingWallet, error: fetchError } = await supabase
        .from('user_wallets')
        .select('wallet_address, network, provider')
        .eq('user_id', user.id)
        .maybeSingle()

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      if (existingWallet) {
        setWallet({
          address: existingWallet.wallet_address,
          network: existingWallet.network,
          provider: existingWallet.provider || 'sequence_waas'
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch wallet'
      setError(errorMessage)
      console.error('Error fetching wallet:', err)
    } finally {
      setLoading(false)
    }
  }

  const createWallet = async () => {
    console.log('createWallet function started');
    if (!user?.id || !user?.email) {
      throw new Error('User not authenticated')
    }

    try {
      setLoading(true)
      setError(null)

      console.log('=== WALLET CREATION DEBUG START ===');
      console.log('User info:', { id: user.id, email: user.email });

      // Step 1: Validate configuration early
      console.log('Step 1: Validating configuration...');
      if (!CFG.SEQUENCE_PROJECT_ACCESS_KEY) {
        throw new Error('SEQUENCE_PROJECT_ACCESS_KEY is missing from configuration. Please check your CFG settings.')
      }
      if (!CFG.SEQUENCE_WAAS_CONFIG_KEY) {
        throw new Error('SEQUENCE_WAAS_CONFIG_KEY is missing from configuration. Please check your CFG settings.')
      }
      if (!CFG.SEQUENCE_NETWORK) {
        throw new Error('SEQUENCE_NETWORK is missing from configuration. Please check your CFG settings.')
      }
      console.log('Step 1: ✅ Configuration validated');
      console.log('Config values:', {
        projectAccessKey: CFG.SEQUENCE_PROJECT_ACCESS_KEY.substring(0, 10) + '...',
        waasConfigKey: CFG.SEQUENCE_WAAS_CONFIG_KEY.substring(0, 10) + '...',
        network: CFG.SEQUENCE_NETWORK
      });

      // Step 2: Import Sequence WaaS SDK
      console.log('Step 2: Importing Sequence SDK...');
      const { SequenceWaaS } = await import('@0xsequence/waas')
      console.log('Step 2: ✅ SDK imported successfully');

      // Step 3: Initialize Sequence WaaS
      console.log('Step 3: Initializing Sequence WaaS...');
      const sequence = new SequenceWaaS({
        projectAccessKey: CFG.SEQUENCE_PROJECT_ACCESS_KEY,
        waasConfigKey: CFG.SEQUENCE_WAAS_CONFIG_KEY,
        network: CFG.SEQUENCE_NETWORK as any
      })
      console.log('Step 3: ✅ SequenceWaaS initialized');

      // Step 4: Sign in with email
      console.log('Step 4: Calling sequence.signIn with email:', user.email);
      // @ts-ignore - Sequence WaaS typing may be incomplete
      const signInResponse = await sequence.signIn({ 
        email: user.email 
      })
      console.log('Step 4: ✅ signIn response:', signInResponse);

      // Step 5: Get wallet address using sequence.getAddress()
      console.log('Step 5: Getting wallet address using sequence.getAddress()...');
      const walletAddress = await sequence.getAddress();
      console.log('Step 5: ✅ Got wallet address:', walletAddress);

      if (!walletAddress) {
        throw new Error('No wallet address returned from sequence.getAddress()');
      }

      // Step 6: Store the sequence instance for future use
      sequenceRef.current = sequence;
      console.log('Step 6: ✅ Sequence instance stored for future use');

      // Step 7: Store wallet in database
      console.log('Step 7: Storing wallet in database...');
      const { error: upsertError } = await supabase
        .from('user_wallets')
        .upsert({
          user_id: user.id,
          wallet_address: walletAddress,
          network: CFG.SEQUENCE_NETWORK,
          provider: 'sequence_waas'
        }, {
          onConflict: 'user_id'
        })

      if (upsertError) {
        console.error('Step 7: ❌ Database upsert failed:', upsertError);
        throw new Error(`Failed to store wallet: ${upsertError.message}`)
      }
      console.log('Step 7: ✅ Wallet stored in user_wallets');

      // Step 8: Update profile
      console.log('Step 8: Updating profile...');
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ eth_address: walletAddress })
        .eq('user_id', user.id)

      if (profileError) {
        console.warn('Step 8: ⚠️ Profile update warning:', profileError)
      } else {
        console.log('Step 8: ✅ Profile updated');
      }

      const walletInfo = {
        address: walletAddress,
        network: CFG.SEQUENCE_NETWORK,
        provider: 'sequence_waas'
      }

      setWallet(walletInfo)
      console.log('=== WALLET CREATION DEBUG SUCCESS ===');
      
      toast({
        title: "Wallet Created",
        description: "Your embedded wallet has been created successfully!"
      })

    } catch (err: any) {
      console.log('=== WALLET CREATION DEBUG ERROR ===');
      console.error('Detailed error info:', {
        name: err?.name,
        message: err?.message,
        stack: err?.stack,
        fullError: err
      });
      console.log('=== WALLET CREATION DEBUG END ===');

      const errorMessage = err instanceof Error ? err.message : 'Failed to create wallet'
      setError(errorMessage)
      toast({
        title: "Wallet Creation Failed",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signMessage = async (message: string): Promise<string> => {
    if (!wallet?.address) {
      throw new Error('No wallet available')
    }

    if (!sequenceRef.current) {
      throw new Error('Sequence instance not available. Please create wallet first.')
    }

    try {
      console.log('Signing message:', message);
      const signatureResponse = await sequenceRef.current.signMessage({
        message: message
      });
      
      if (!signatureResponse?.data?.signature) {
        throw new Error('No signature returned from Sequence WaaS');
      }

      console.log('Message signed successfully');
      return signatureResponse.data.signature;
    } catch (err: any) {
      console.error('Error signing message:', err);
      throw new Error(`Failed to sign message: ${err.message}`);
    }
  }

  const refetchWallet = async () => {
    await fetchWallet()
  }

  // Auto-fetch wallet on mount and user change
  useEffect(() => {
    fetchWallet()
  }, [user?.id])

  return {
    wallet,
    loading,
    error,
    createWallet,
    refetchWallet,
    signMessage
  }
}