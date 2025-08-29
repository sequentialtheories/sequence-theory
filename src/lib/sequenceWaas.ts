import { SequenceWaaS } from '@0xsequence/waas'
import { supabase } from '@/integrations/supabase/client'
import { CFG } from './config'

// Sequence WaaS instance configured for Amoy testnet via runtime config
export const sequenceWaas = new SequenceWaaS({
  projectAccessKey: CFG.SEQUENCE_PROJECT_ACCESS_KEY,
  waasConfigKey: CFG.SEQUENCE_WAAS_CONFIG_KEY,
  network: CFG.SEQUENCE_NETWORK // 'amoy' for testnet
})

// NON-CUSTODIAL Sequence Wallet operations
// Users maintain full control of their private keys
// We only store public wallet addresses for reference

export const signInWithSequence = async (email: string) => {
  try {
    console.log(`Creating non-custodial Sequence wallet for: ${email.slice(0, 3)}***`)
    
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
    
    console.log('✅ Non-custodial Sequence wallet created:', signInResult.wallet?.slice(0, 6) + '...')
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
      .select('wallet_address, network') // Only public information, email removed for security
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
    
    // 1. Update canonical profiles.eth_address (new approach)
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ eth_address: signInResult.wallet })
      .eq('user_id', userId)
    
    if (profileError) {
      console.error('Error updating profile eth_address:', profileError)
      // Continue with user_wallets fallback
    }
    
    // 2. Backward compatibility: also store in user_wallets  
    const { data, error } = await supabase
      .from('user_wallets')
      .upsert({
        user_id: userId,
        wallet_address: signInResult.wallet, // PUBLIC address only
        network: CFG.SEQUENCE_NETWORK, // Use config network (amoy)
      }, {
        onConflict: 'user_id'
      })
      .select('wallet_address, network') // Only return public info
      .maybeSingle()

    if (error) {
      console.error('Error storing wallet reference:', error)
      throw error
    }

    console.log('✅ Non-custodial wallet created - public address stored as reference:', data?.wallet_address?.slice(0, 6) + '...')
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
    // Import the enhanced balance function
    const { getSequenceWalletBalance: getBalance } = await import('./sequence');
    const balance = await getBalance(address);
    
    console.log('Getting balance for wallet (public blockchain data):', address, balance);
    return { success: true, balance: `${balance.matic} MATIC, ${balance.usdc} USDC` };
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

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
    console.log('🔐 User requesting key export information (non-custodial)')
    return { 
      success: true, 
      message: 'Use the "View Private Key" option to securely display your private key for backup purposes.' 
    }
  } catch (error) {
    console.error('Error with key export:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Get private key for secure display (never stored in database)
export const getPrivateKeyForDisplay = async (): Promise<{ privateKey?: string; error?: string }> => {
  try {
    // Check if user has an active session
    const isSignedIn = await sequenceWaas.isSignedIn()
    
    if (!isSignedIn) {
      return { error: 'Please sign in to your Sequence wallet first.' }
    }

    // For Sequence WaaS, private keys are managed internally and not directly exposable
    // This is by design for security - Sequence uses secure enclaves
    console.log('🔐 Private key display requested (Sequence WaaS manages keys securely)')
    
    // Return a secure message explaining the non-custodial nature
    return { 
      error: 'Sequence WaaS manages your private keys securely in hardware enclaves. While you maintain full control, direct private key export requires using Sequence\'s official tools. Your wallet is fully non-custodial - we cannot access your keys.' 
    }
  } catch (error) {
    console.error('Error accessing wallet info:', error)
    return { error: error instanceof Error ? error.message : 'Failed to access wallet information' }
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
