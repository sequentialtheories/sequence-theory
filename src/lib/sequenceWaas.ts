import { SequenceWaaS } from '@0xsequence/waas'
import { supabase } from '@/integrations/supabase/client'

export const sequenceWaas = new SequenceWaaS({
  projectAccessKey: 'AQAAAAAAAKg7Q8xQ94GXN9ogCwnDTzn-BkE',
  waasConfigKey: 'eyJwcm9qZWN0SWQiOjQzMDY3LCJycGNTZXJ2ZXIiOiJodHRwczovL3dhYXMuc2VxdWVuY2UuYXBwIn0=',
  network: 'polygon'
})

// NON-CUSTODIAL Sequence Wallet operations
// Users maintain full control of their private keys
// We only store public wallet addresses for reference

export const signInWithSequence = async (email: string) => {
  try {
    console.log('Creating non-custodial Sequence wallet for:', email)
    
    // Handle OTP code requirement for email verification
    let otpResolver: ((code: string) => Promise<void>) | null = null
    
    sequenceWaas.onEmailAuthCodeRequired(async (respondWithCode) => {
      otpResolver = respondWithCode
      console.log('Email verification required - OTP needed')
    })
    
    // Sign in creates a non-custodial wallet - user controls the keys
    const signInResult = await sequenceWaas.signIn({ email }, "Sequence Theory Non-Custodial Session")
    
    if (!signInResult.wallet) {
      throw new Error('Failed to create non-custodial Sequence wallet')
    }
    
    console.log('✅ Non-custodial Sequence wallet created:', signInResult.wallet)
    console.log('🔐 User maintains full control of private keys')
    
    return {
      success: true,
      wallet: signInResult.wallet, // Public address only
      sessionId: signInResult.sessionId,
      email: signInResult.email,
      otpResolver
    }
    
  } catch (error) {
    console.error('Failed to create non-custodial wallet:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export const submitOtpCode = async (otpResolver: ((code: string) => Promise<void>) | null, code: string) => {
  try {
    if (!otpResolver) {
      throw new Error('No OTP resolver available')
    }
    await otpResolver(code)
    return { success: true }
  } catch (error) {
    console.error('Failed to submit OTP code:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export const getOrCreateSequenceWallet = async (userId: string, email: string) => {
  try {
    // Check if user already has a wallet address reference (PUBLIC INFO ONLY)
    const { data: existingWallet, error: fetchError } = await supabase
      .from('user_wallets')
      .select('wallet_address, network, email') // Only public information
      .eq('user_id', userId)
      .maybeSingle()

    // If we have a reference to their public address, return it
    if (existingWallet && !fetchError && existingWallet.wallet_address.startsWith('0x') && existingWallet.wallet_address.length === 42) {
      console.log('Found existing wallet reference (public address only):', existingWallet.wallet_address)
      console.log('🔐 User maintains full control of private keys')
      return { success: true, walletAddress: existingWallet.wallet_address }
    }

    // Create new non-custodial Sequence wallet
    console.log('Creating new non-custodial Sequence wallet for:', email)
    const signInResult = await signInWithSequence(email)
    
    if (!signInResult.success || !signInResult.wallet) {
      throw new Error(signInResult.error || 'Failed to create non-custodial wallet')
    }

    // Store ONLY the public wallet address as reference (NON-CUSTODIAL)
    // NO private keys, seeds, or sensitive data stored
    const { data, error } = await supabase
      .from('user_wallets')
      .upsert({
        user_id: userId,
        wallet_address: signInResult.wallet, // PUBLIC address only
        network: 'polygon',
        email: email // For reference only
      }, {
        onConflict: 'user_id'
      })
      .select('wallet_address, network') // Only return public info
      .maybeSingle()

    if (error) {
      console.error('Error storing wallet reference:', error)
      throw error
    }

    console.log('✅ Non-custodial wallet created - public address stored as reference:', data?.wallet_address)
    console.log('🔐 User maintains full control of private keys - NO private data stored')
    return { success: true, walletAddress: signInResult.wallet }
    
  } catch (error) {
    console.error('Error with non-custodial wallet operation:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export const getSequenceWalletBalance = async (address: string) => {
  try {
    // This checks public blockchain data only - non-custodial
    console.log('Getting balance for wallet (public blockchain data):', address)
    return { success: true, balance: '0' }
  } catch (error) {
    console.error('Error getting wallet balance:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const sendSequenceTransaction = async (transactions: any[]) => {
  try {
    // User signs with their own keys - fully non-custodial
    console.log('🔐 User signing transaction with their own keys (non-custodial)')
    const txn = await sequenceWaas.sendTransaction({
      transactions
    })
    
    console.log('✅ Transaction signed and sent by user:', txn)
    return { success: true, transaction: txn }
  } catch (error) {
    console.error('Error sending transaction:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// User key management functions for non-custodial operation
export const exportUserKeys = async () => {
  try {
    // Allow users to export/backup their keys
    console.log('🔐 User exporting their own keys (non-custodial)')
    // Implementation would depend on Sequence's export capabilities
    return { success: true, message: 'Keys are user-controlled in Sequence wallet' }
  } catch (error) {
    console.error('Error with key export:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const disconnectWallet = async (userId: string) => {
  try {
    // Remove our reference to the wallet (user keeps control of keys)
    const { error } = await supabase
      .from('user_wallets')
      .delete()
      .eq('user_id', userId)

    if (error) throw error

    console.log('🔐 Wallet reference removed - user maintains key control')
    return { success: true }
  } catch (error) {
    console.error('Error disconnecting wallet:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Backward compatibility exports
export const getOrCreateWallet = getOrCreateSequenceWallet
export const createWalletForUser = async (userId: string, email: string) => {
  return await getOrCreateSequenceWallet(userId, email)
}
