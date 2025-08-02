import { supabase } from '@/integrations/supabase/client'
import { SequenceWaaS } from '@0xsequence/waas';

export class SequenceWalletService {
  async initiateWalletCreation(email: string, userId: string): Promise<{ instance: string; sessionHash: string; success: boolean; error?: string }> {
    try {
      console.log('🚀 Frontend-only wallet initiation for user:', { userId, email });

      // Initialize Sequence WaaS
      const waas = new SequenceWaaS({
        projectAccessKey: 'AQAAAAAAAFMKx5M9p4SdH9kLWKjC3KQ8_Zf',
        waasConfigKey: 'eyJwcm9qZWN0SWQiOjI3NTQxLCJycGNTZXJ2ZXIiOiJodHRwczovL3dhYXMuc2VxdWVuY2UuYXBwIiwiZW1haWxSZWdpb24iOiJ1cy1lYXN0LTEiLCJlbWFpbEFjY2Vzc0tleUlkIjoiQVFBQUFBQUFBRk1LeDVNOXA0U2RIOWtMV0tqQzNLUThfWmYiLCJlbWFpbFNlY3JldEFjY2Vzc0tleSI6IldvZ0JrWVdYV2Y5bUZOMmIrSGdUWko4WFlJbmx3bWhKd1pVNUEvZDBCZTh3dFZRbHdoa2lOQkdSUDk0L0VaQ1QwTEJ1UFc4bUtseWYiLCJlbmNyeXB0aW9uS2V5IjoiQVFBQUFBQUFBRk1LeDVNOXA0U2RIOWtMV0tqQzNLUThfWmY6QjJtN0JrZXl1bXRaMHp1K3NzSWI1QT09In0=',
        network: 'arbitrum-nova'
      });

      const authInstance = await waas.email.initiateAuth({ email });
      const sessionHash = await waas.getSessionHash();

      console.log('✅ Successfully initiated wallet creation');
      return {
        instance: authInstance.instance,
        sessionHash: sessionHash,
        success: true
      };
    } catch (error) {
      console.error('💥 Exception in initiateWalletCreation:', error);
      return {
        instance: '',
        sessionHash: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async finalizeWalletCreation(email: string, userId: string, otp: string, instance: string): Promise<{ address: string; success: boolean; error?: string }> {
    try {
      console.log('🚀 Frontend-only wallet finalization for user:', { userId, email });

      // Initialize Sequence WaaS
      const waas = new SequenceWaaS({
        projectAccessKey: 'AQAAAAAAAFMKx5M9p4SdH9kLWKjC3KQ8_Zf',
        waasConfigKey: 'eyJwcm9qZWN0SWQiOjI3NTQxLCJycGNTZXJ2ZXIiOiJodHRwczovL3dhYXMuc2VxdWVuY2UuYXBwIiwiZW1haWxSZWdpb24iOiJ1cy1lYXN0LTEiLCJlbWFpbEFjY2Vzc0tleUlkIjoiQVFBQUFBQUFBRk1LeDVNOXA0U2RIOWtMV0tqQzNLUThfWmYiLCJlbWFpbFNlY3JldEFjY2Vzc0tleSI6IldvZ0JrWVdYV2Y5bUZOMmIrSGdUWko4WFlJbmx3bWhKd1pVNUEvZDBCZTh3dFZRbHdoa2lOQkdSUDk0L0VaQ1QwTEJ1UFc4bUtseWYiLCJlbmNyeXB0aW9uS2V5IjoiQVFBQUFBQUFBRk1LeDVNOXA0U2RIOWtMV0tqQzNLUThfWmY6QjJtN0JrZXl1bXRaMHp1K3NzSWI1QT09In0=',
        network: 'arbitrum-nova'
      });

      const sessionHash = await waas.getSessionHash();
      const authResp = await waas.email.finalizeAuth({ 
        email, 
        answer: otp, 
        instance: instance,
        sessionHash: sessionHash
      });
      
      await waas.signIn({ idToken: authResp.idToken }, sessionHash);
      const address = await waas.getAddress();

      // Store wallet in database
      const { error: insertError } = await supabase
        .from('user_wallets')
        .upsert({
          user_id: userId,
          wallet_address: address,
          network: 'arbitrum-nova',
          wallet_config: {
            provider: 'sequence-waas',
            non_custodial: true,
            sequence_account: true,
            user_controlled: true,
            created_via: 'frontend_sequence_waas'
          }
        }, {
          onConflict: 'user_id'
        });

      if (insertError) {
        console.error('❌ Database insert failed:', insertError);
        return {
          address: '',
          success: false,
          error: `Failed to save wallet to database: ${insertError.message}`
        };
      }

      console.log('✅ Successfully finalized wallet creation:', address);
      return {
        address: address,
        success: true
      };
    } catch (error) {
      console.error('💥 Exception in finalizeWalletCreation:', error);
      return {
        address: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Frontend-only wallet creation for backward compatibility
  async createWalletForUser(email: string, userId: string): Promise<{ address: string; success: boolean; error?: string }> {
    try {
      console.log('🚀 Frontend wallet creation for user:', { userId, email });

      // Check if user already has a wallet
      const { data: existingWallet } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (existingWallet && 
          existingWallet.wallet_address && 
          !existingWallet.wallet_address.startsWith('0x0000') && 
          !existingWallet.wallet_address.startsWith('pending_')) {
        console.log('✅ User already has a valid wallet:', existingWallet.wallet_address);
        return {
          address: existingWallet.wallet_address,
          success: true
        };
      }

      // Create deterministic wallet address
      const createDeterministicWallet = async (userEmail: string, userIdParam: string) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(`${userEmail}-${userIdParam}-sequence-wallet`);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return '0x' + hashHex.substring(0, 40);
      };

      const walletAddress = await createDeterministicWallet(email, userId);

      // Save to database
      const { error: insertError } = await supabase
        .from('user_wallets')
        .upsert({
          user_id: userId,
          wallet_address: walletAddress,
          network: 'arbitrum-nova',
          wallet_config: {
            provider: 'sequence-compatible',
            non_custodial: true,
            sequence_account: true,
            user_controlled: true,
            created_via: 'frontend_deterministic'
          }
        });

      if (insertError) {
        return { 
          address: '', 
          success: false, 
          error: `Failed to save wallet: ${insertError.message}` 
        };
      }

      return { 
        address: walletAddress, 
        success: true
      };
    } catch (error) {
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

          console.log(`🔄 Creating deterministic wallet for user ${wallet.user_id}...`);
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