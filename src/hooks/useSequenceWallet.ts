import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { sequenceDebug } from '@/services/sequenceDebug'

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

      // Delegate to the debug service for consistent wallet creation
      const result = await sequenceDebug.createWallet(user.email)
      
      if (!result.success || !result.address) {
        throw new Error(result.error?.message || 'Failed to create wallet')
      }

      // Update database
      const { error: upsertError } = await supabase
        .from('user_wallets')
        .upsert({
          user_id: user.id,
          wallet_address: result.address,
          network: 'amoy',
          provider: 'sequence_waas'
        }, { onConflict: 'user_id' })

      if (upsertError) {
        throw new Error(`Failed to store wallet: ${upsertError.message}`)
      }

      setWallet({
        address: result.address,
        network: 'amoy',
        provider: 'sequence_waas'
      })
      
      toast({
        title: "Wallet Created",
        description: "Your embedded wallet has been created successfully!"
      })

    } catch (err: any) {
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

    try {
      // Use sequenceDebug service for message signing
      return await sequenceDebug.signMessage(message)
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