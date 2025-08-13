import { SequenceWaaS } from '@0xsequence/waas'
import { supabase } from '@/integrations/supabase/client'

export const sequenceWaas = new SequenceWaaS({
  projectAccessKey: 'AQAAAAAAAKg7Q8xQ94GXN9ogCwnDTzn-BkE',
  waasConfigKey: 'eyJwcm9qZWN0SWQiOjQzMDY3LCJycGNTZXJ2ZXIiOiJodHRwczovL3dhYXMuc2VxdWVuY2UuYXBwIn0=',
  network: 'polygon'
})

// Sequence Wallet operations using actual SDK
export const signInWithSequence = async (email: string) => {
  try {
    console.log('Signing in with Sequence for:', email)
    
    // Handle OTP code requirement
    let otpResolver: ((code: string) => Promise<void>) | null = null
    
    sequenceWaas.onEmailAuthCodeRequired(async (respondWithCode) => {
      otpResolver = respondWithCode
      console.log('OTP required for email authentication')
    })
    
    const signInResult = await sequenceWaas.signIn({ email }, "Sequence Theory Session")
    
    if (!signInResult.wallet) {
      throw new Error('Failed to create Sequence wallet')
    }
    
    console.log('✅ Sequence wallet created:', signInResult.wallet)
    return {
      success: true,
      wallet: signInResult.wallet,
      sessionId: signInResult.sessionId,
      email: signInResult.email,
      otpResolver
    }
    
  } catch (error) {
    console.error('Failed to sign in with Sequence:', error)
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
    // First check if user already has a Sequence wallet stored
    const { data: existingWallet, error: fetchError } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    // If wallet exists and looks like a real address (not fake), return it
    if (existingWallet && !fetchError && existingWallet.wallet_address.startsWith('0x') && existingWallet.wallet_address.length === 42) {
      console.log('Found existing Sequence wallet:', existingWallet.wallet_address)
      return { success: true, walletAddress: existingWallet.wallet_address }
    }

    // Create new Sequence wallet
    console.log('Creating new Sequence wallet for:', email)
    const signInResult = await signInWithSequence(email)
    
    if (!signInResult.success || !signInResult.wallet) {
      throw new Error(signInResult.error || 'Failed to create Sequence wallet')
    }

    // Store the real Sequence wallet address
    const { data, error } = await supabase
      .from('user_wallets')
      .upsert({
        user_id: userId,
        wallet_address: signInResult.wallet,
        network: 'polygon',
        email: email
      }, {
        onConflict: 'user_id'
      })
      .select()
      .maybeSingle()

    if (error) {
      console.error('Error storing Sequence wallet:', error)
      throw error
    }

    console.log('✅ Sequence wallet created and stored:', data)
    return { success: true, walletAddress: signInResult.wallet }
    
  } catch (error) {
    console.error('Error getting or creating Sequence wallet:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export const getSequenceWalletBalance = async (address: string) => {
  try {
    // This would typically use Sequence's balance checking methods
    // For now, return placeholder - implement actual balance checking as needed
    console.log('Getting balance for Sequence wallet:', address)
    return { success: true, balance: '0' }
  } catch (error) {
    console.error('Error getting wallet balance:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const sendSequenceTransaction = async (transactions: any[]) => {
  try {
    const txn = await sequenceWaas.sendTransaction({
      transactions
    })
    
    console.log('✅ Transaction sent:', txn)
    return { success: true, transaction: txn }
  } catch (error) {
    console.error('Error sending transaction:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Backward compatibility exports
export const getOrCreateWallet = getOrCreateSequenceWallet
export const createWalletForUser = async (userId: string, email: string) => {
  return await getOrCreateSequenceWallet(userId, email)
}
