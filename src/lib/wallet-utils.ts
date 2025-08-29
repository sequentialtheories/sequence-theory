import { supabase } from '@/integrations/supabase/client';

/**
 * Upserts a wallet reference for the user in Supabase
 * This only stores the public wallet address, not private keys
 */
export async function upsertUserWallet(
  userId: string, 
  walletAddress: string, 
  network: string = 'amoy'
) {
  try {
    const { data, error } = await supabase
      .from('user_wallets')
      .upsert({
        user_id: userId,
        wallet_address: walletAddress,
        network,
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting wallet:', error);
      return { success: false, error: error.message };
    }

    console.log('Wallet upserted successfully:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error upserting wallet:', err);
    return { success: false, error: 'Unexpected error occurred' };
  }
}

/**
 * Checks if a user has a wallet stored in Supabase
 */
export async function checkUserWallet(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_wallets')
      .select('wallet_address, network')
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking user wallet:', error);
      return { success: false, error: error.message };
    }

    return { success: true, wallet: data };
  } catch (err) {
    console.error('Unexpected error checking wallet:', err);
    return { success: false, error: 'Unexpected error occurred' };
  }
}