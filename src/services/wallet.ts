import { sequenceDebug } from './sequenceDebug';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface WalletCreationResult {
  success: boolean;
  address?: string;
  error?: string;
}

export async function createUserWallet(userId: string, email: string): Promise<WalletCreationResult> {
  try {
    console.log('🔐 Starting wallet creation for user:', userId);

    // Enable network monitoring for debugging
    sequenceDebug.enableNetworkMonitoring();

    // Check if user already has a wallet in user_wallets table
    const { data: existingWallet } = await supabase
      .from('user_wallets')
      .select('wallet_address')
      .eq('user_id', userId)
      .maybeSingle();

    if (existingWallet?.wallet_address) {
      console.log('✅ User already has wallet:', existingWallet.wallet_address);
      return { success: true, address: existingWallet.wallet_address };
    }

    // Create new wallet via Sequence
    const result = await sequenceDebug.createWallet(email);

    if (!result.success || !result.address) {
      console.error('❌ Wallet creation failed:', result);
      if (import.meta.env.DEV) console.table(result.debugSteps);
      throw new Error((result as any).error?.message || 'Failed to create wallet');
    }

    // Save to database (user_wallets)
    const { error: upsertError } = await supabase
      .from('user_wallets')
      .upsert({
        user_id: userId,
        wallet_address: result.address,
        network: 'amoy',
        provider: 'sequence_waas',
        created_via: 'sequence',
      }, { onConflict: 'user_id' });

    if (upsertError) {
      console.error('Failed to save wallet address:', upsertError);
      throw upsertError;
    }

    console.log('✅ Wallet created successfully:', result.address);
    toast({ title: 'Wallet created', description: 'Your embedded wallet is ready.' });

    return { success: true, address: result.address };
  } catch (error: any) {
    console.error('❌ Wallet creation error:', error);
    const errorMessage = error?.message || 'Unknown error occurred';

    if (errorMessage.includes('401')) {
      toast({ title: 'Authentication failed', description: 'Check your Sequence project key.', variant: 'destructive' });
    } else if (errorMessage.includes('403')) {
      toast({ title: 'Permission denied', description: 'Verify WaaS is enabled in Sequence Builder.', variant: 'destructive' });
    } else if (errorMessage.toLowerCase().includes('network')) {
      toast({ title: 'Network error', description: 'Please check your internet connection.', variant: 'destructive' });
    } else {
      toast({ title: 'Wallet creation failed', description: errorMessage, variant: 'destructive' });
    }

    return { success: false, error: errorMessage };
  }
}

export { sequenceDebug } from './sequenceDebug';