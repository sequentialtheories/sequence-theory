import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

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
    if (!user?.id || !user?.email) return

    try {
      setLoading(true)
      setError(null)

      const { data, error: functionError } = await supabase.functions.invoke('sequence-wallet-manager', {
        body: { action: 'get' }
      })

      if (functionError) {
        throw new Error(functionError.message)
      }

      if (data?.success && data?.wallet) {
        setWallet(data.wallet)
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

      const { data, error: functionError } = await supabase.functions.invoke('sequence-wallet-manager', {
        body: { action: 'create' }
      })

      if (functionError) {
        throw new Error(functionError.message)
      }

      if (data?.success && data?.wallet) {
        setWallet(data.wallet)
        toast({
          title: "Wallet Created",
          description: "Your embedded wallet has been created successfully!"
        })
      } else {
        throw new Error('Failed to create wallet')
      }
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

    // Real signing not implemented - would require Sequence WaaS signMessage API
    throw new Error('Message signing not yet implemented. Real cryptographic signing will be available once Sequence WaaS integration is complete.')
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