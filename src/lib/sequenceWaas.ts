import { SequenceWaaS } from '@0xsequence/waas'
import { supabase } from '@/integrations/supabase/client'
import { ethers } from 'ethers'

export const sequenceWaas = new SequenceWaaS({
  projectAccessKey: 'AQAAAAAAAKg7Q8xQ94GXN9ogCwnDTzn-BkE',
  waasConfigKey: 'eyJwcm9qZWN0SWQiOjQzMDY3LCJycGNTZXJ2ZXIiOiJodHRwczovL3dhYXMuc2VxdWVuY2UuYXBwIn0=',
  network: 'polygon'
})

// Frontend wallet operations
export const createWalletForUser = async (userId: string, email: string) => {
  try {
    console.log('Creating wallet for user:', userId, email)
    
    // Create deterministic seed from user data
    const seed = ethers.keccak256(ethers.toUtf8Bytes(`${userId}-${email}`))
    const deterministicAddress = ethers.getAddress(seed.slice(0, 42))
    
    console.log('Generated deterministic address:', deterministicAddress)
    
    // Store wallet in database
    const { data, error } = await supabase
      .from('user_wallets')
      .upsert({
        user_id: userId,
        wallet_address: deterministicAddress,
        network: 'polygon',
        email: email
      }, {
        onConflict: 'user_id'
      })
      .select()
      .maybeSingle()

    if (error) {
      console.error('Error storing wallet:', error)
      throw error
    }

    console.log('✅ Wallet created and stored:', data)
    return { success: true, walletAddress: deterministicAddress }
    
  } catch (error) {
    console.error('Failed to create wallet:', error)
    return { success: false, error: error.message }
  }
}

export const getOrCreateWallet = async (userId: string, email: string) => {
  try {
    // First try to get existing wallet
    const { data: existingWallet, error: fetchError } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (existingWallet && !fetchError) {
      console.log('Found existing wallet:', existingWallet.wallet_address)
      return { success: true, walletAddress: existingWallet.wallet_address }
    }

    // If no wallet found, create one
    if (fetchError?.code === 'PGRST116') {
      console.log('No wallet found, creating new one...')
      return await createWalletForUser(userId, email)
    }

    throw fetchError
  } catch (error) {
    console.error('Error getting or creating wallet:', error)
    return { success: false, error: error.message }
  }
}
