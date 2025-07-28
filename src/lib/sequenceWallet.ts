import { supabase } from '@/integrations/supabase/client'

export class SequenceWalletService {
  async createWalletForUser(email: string, userId: string): Promise<{ address: string; success: boolean; error?: string }> {
    try {
      console.log('🚀 Starting wallet creation for user:', { userId, email });

      // Call the edge function to create a real Sequence wallet
      console.log('📞 Calling create-sequence-wallet edge function...');
      const { data, error } = await supabase.functions.invoke('create-sequence-wallet', {
        body: {
          email,
          userId
        }
      });

      console.log('📋 Edge function response:', { data, error });

      if (error) {
        console.error('❌ Error calling create-sequence-wallet function:', error);
        return {
          address: '',
          success: false,
          error: error.message
        };
      }

      if (!data || !data.success) {
        const errorMsg = data?.error || 'Unknown error from edge function';
        console.error('❌ Wallet creation failed:', errorMsg);
        return {
          address: '',
          success: false,
          error: errorMsg
        };
      }

      console.log('✅ Successfully created Sequence wallet:', data.walletAddress);
      return {
        address: data.walletAddress,
        success: true
      };
    } catch (error) {
      console.error('💥 Exception in createWalletForUser:', error);
      return {
        address: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async retryPendingWallets(): Promise<void> {
    try {
      console.log('🔄 Checking for pending wallets to retry...');
      
      const { data: pendingWallets, error } = await supabase
        .from('user_wallets')
        .select('*')
        .like('wallet_address', 'pending_%');

      if (error) {
        console.error('❌ Error fetching pending wallets:', error);
        return;
      }

      if (!pendingWallets || pendingWallets.length === 0) {
        console.log('✅ No pending wallets found');
        return;
      }

      console.log(`🔄 Found ${pendingWallets.length} pending wallets, retrying...`);

      for (const wallet of pendingWallets) {
        try {
          // Get user profile to get email
          const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('user_id', wallet.user_id)
            .single();

          if (!profile?.email) {
            console.warn(`⚠️ No email found for user ${wallet.user_id}, skipping`);
            continue;
          }

          console.log(`🔄 Retrying wallet creation for user ${wallet.user_id}...`);
          const result = await this.createWalletForUser(profile.email, wallet.user_id);

          if (result.success) {
            // Update the wallet record
            const existingConfig = wallet.wallet_config as Record<string, any> || {};
            const updatedConfig = {
              ...existingConfig,
              status: 'active',
              retried_at: new Date().toISOString()
            };

            await supabase
              .from('user_wallets')
              .update({
                wallet_address: result.address,
                wallet_config: updatedConfig,
                updated_at: new Date().toISOString()
              })
              .eq('user_id', wallet.user_id);

            console.log(`✅ Successfully retried wallet for user ${wallet.user_id}`);
          } else {
            console.error(`❌ Failed to retry wallet for user ${wallet.user_id}:`, result.error);
          }
        } catch (retryError) {
          console.error(`💥 Error retrying wallet for user ${wallet.user_id}:`, retryError);
        }
      }
    } catch (error) {
      console.error('💥 Error in retryPendingWallets:', error);
    }
  }
}

export const sequenceWalletService = new SequenceWalletService();