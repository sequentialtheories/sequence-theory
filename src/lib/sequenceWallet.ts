import { supabase } from '@/integrations/supabase/client'
import { SequenceWaaS } from '@0xsequence/waas';

/**
 * Sequence Embedded Wallet Service
 * Implements seamless, non-custodial wallet creation as per Sequence documentation
 * https://docs.sequence.xyz/sdk/embedded-wallet/
 */
export class SequenceWalletService {
  private waas: SequenceWaaS | null = null;

  private initializeWaaS() {
    if (!this.waas) {
      this.waas = new SequenceWaaS({
        projectAccessKey: 'AQAAAAAAAKg7Q8xQ94GXN9ogCwnDTzn-BkE',
        waasConfigKey: 'eyJwcm9qZWN0SWQiOjQzMDY3LCJycGNTZXJ2ZXIiOiJodHRwczovL3dhYXMuc2VxdWVuY2UuYXBwIn0=',
        network: 'polygon'
      });
    }
    return this.waas;
  }

  /**
   * Create an embedded wallet for the user using email authentication
   * Follows Sequence's seamless wallet creation pattern
   */
  async createEmbeddedWallet(email: string, userId: string): Promise<{ address: string; success: boolean; error?: string }> {
    try {
      console.log('🚀 Creating Sequence Embedded Wallet for:', { userId, email });

      // Check if user already has a wallet
      const { data: existingWallet } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (existingWallet?.wallet_address && existingWallet.wallet_address.startsWith('0x')) {
        console.log('✅ User already has a valid embedded wallet:', existingWallet.wallet_address);
        return {
          address: existingWallet.wallet_address,
          success: true
        };
      }

      const waas = this.initializeWaaS();

      // Get session hash first
      const sessionHash = await waas.getSessionHash();
      
      // Initiate email authentication
      const authResult = await waas.email.initiateAuth({ 
        email
      });

      // Return intermediate state for OTP collection
      if (authResult.instance) {
        return {
          address: '',
          success: false,
          error: 'OTP_REQUIRED',
          authInstance: authResult.instance,
          sessionHash
        } as any;
      }

      throw new Error('Failed to initiate email authentication');

    } catch (error) {
      console.error('💥 Error creating Sequence Embedded Wallet:', error);
      return {
        address: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Complete wallet creation with OTP
   */
  async completeWalletCreation(
    email: string, 
    userId: string, 
    otp: string, 
    authInstance: string, 
    sessionHash: string
  ): Promise<{ address: string; success: boolean; error?: string }> {
    try {
      const waas = this.initializeWaaS();

      // Finalize authentication with OTP
      const authResp = await waas.email.finalizeAuth({ 
        email, 
        answer: otp,
        instance: authInstance,
        sessionHash
      });
      
      // Sign in with the ID token
      await waas.signIn({ idToken: authResp.idToken }, sessionHash);
      
      // Get the wallet address
      const address = await waas.getAddress();

      // Store the wallet in database
      const { error: insertError } = await supabase
        .from('user_wallets')
        .upsert({
          user_id: userId,
          wallet_address: address,
          network: 'polygon',
          wallet_config: {
            provider: 'sequence-embedded',
            non_custodial: true,
            created_at: new Date().toISOString()
          }
        }, {
          onConflict: 'user_id'
        });

      if (insertError) {
        console.error('❌ Failed to save wallet to database:', insertError);
        return {
          address: '',
          success: false,
          error: `Failed to save wallet: ${insertError.message}`
        };
      }

      console.log('✅ Sequence Embedded Wallet created successfully:', address);
      return {
        address: address,
        success: true
      };

    } catch (error) {
      console.error('💥 Error completing wallet creation:', error);
      return {
        address: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get wallet information for a user
   */
  async getWalletInfo(userId: string) {
    const { data, error } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('❌ Error fetching wallet info:', error);
      return null;
    }

    return data;
  }
}

export const sequenceWalletService = new SequenceWalletService();