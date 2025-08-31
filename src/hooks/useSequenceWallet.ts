import { useState, useEffect } from 'react'
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
    if (!user?.id || !user?.email) {
      throw new Error('User not authenticated')
    }

    try {
      setLoading(true)
      setError(null)

      // Import Sequence WaaS SDK (client-side only)
      const { SequenceWaaS } = await import('@0xsequence/waas')

      // Validate base64 encoded waasConfigKey
      const waasConfigKey = CFG.SEQUENCE_WAAS_CONFIG_KEY
      try {
        atob(waasConfigKey) // Validate it's base64
      } catch (error) {
        throw new Error('Invalid WaaS config key: not properly base64 encoded')
      }

      console.log('Sequence config:', {
        projectAccessKey: CFG.SEQUENCE_PROJECT_ACCESS_KEY.slice(0, 8) + '...',
        waasConfigKey: waasConfigKey.slice(0, 8) + '...',
        network: CFG.SEQUENCE_NETWORK
      })

      // Initialize Sequence WaaS in browser environment
      const sequence = new SequenceWaaS({
        projectAccessKey: CFG.SEQUENCE_PROJECT_ACCESS_KEY,
        waasConfigKey: waasConfigKey,
        network: CFG.SEQUENCE_NETWORK as any
      })

      // Sign in with email - creates/retrieves wallet
      // @ts-ignore - Sequence WaaS typing may be incomplete
      const signInResponse = await sequence.signIn({ 
        email: user.email 
      })

      const walletAddress = signInResponse.wallet

      // Store wallet in database
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
        throw new Error(`Failed to store wallet: ${upsertError.message}`)
      }

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ eth_address: walletAddress })
        .eq('user_id', user.id)

      if (profileError) {
        console.warn('Error updating profile:', profileError)
      }

      const walletInfo = {
        address: walletAddress,
        network: CFG.SEQUENCE_NETWORK,
        provider: 'sequence_waas'
      }

      setWallet(walletInfo)
      
      toast({
        title: "Wallet Created",
        description: "Your embedded wallet has been created successfully!"
      })

    } catch (err) {
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

    // Real signing not implemented yet
    throw new Error('Message signing not yet implemented. Will be available once Sequence WaaS integration is complete.')
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