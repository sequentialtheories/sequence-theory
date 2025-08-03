import { supabase } from '@/integrations/supabase/client'
import { validateEmail, sanitizeInput } from '@/utils/validation'

/**
 * Secure Sequence Embedded Wallet Service
 * Implements secure, non-custodial wallet creation using backend edge functions
 * All sensitive operations are handled server-side for maximum security
 */
export class SequenceWalletService {

  /**
   * Create an embedded wallet for the user using secure backend authentication
   * All sensitive operations are handled server-side for maximum security
   */
  async createEmbeddedWallet(email: string, userId: string): Promise<{ address: string; success: boolean; error?: string }> {
    try {
      // Input validation and sanitization
      if (!email || !userId) {
        return {
          address: '',
          success: false,
          error: 'Email and userId are required'
        };
      }

      // Validate email format
      if (!validateEmail(email)) {
        return {
          address: '',
          success: false,
          error: 'Invalid email format'
        };
      }

      // Sanitize email
      const sanitizedEmail = sanitizeInput(email.toLowerCase());

      console.log('🚀 Creating Sequence Embedded Wallet for:', { userId, email: sanitizedEmail });

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

      // Call secure backend edge function
      const { data, error } = await supabase.functions.invoke('create-sequence-wallet', {
        body: {
          email: sanitizedEmail,
          userId,
          action: 'initiate'
        }
      });

      if (error) {
        console.error('Backend wallet creation error:', error);
        return {
          address: '',
          success: false,
          error: error.message || 'Failed to initiate wallet creation'
        };
      }

      if (data.action === 'otp_required') {
        return {
          address: '',
          success: false,
          error: 'OTP_REQUIRED',
          authInstance: data.authInstance,
          sessionHash: data.sessionHash
        } as any;
      }

      return {
        address: data.walletAddress || '',
        success: data.success || false,
        error: data.error
      };

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
   * Complete wallet creation with OTP using secure backend
   */
  async completeWalletCreation(
    email: string, 
    userId: string, 
    otp: string, 
    authInstance: string, 
    sessionHash: string
  ): Promise<{ address: string; success: boolean; error?: string }> {
    try {
      // Input validation and sanitization
      if (!email || !userId || !otp || !authInstance || !sessionHash) {
        return {
          address: '',
          success: false,
          error: 'All parameters are required'
        };
      }

      // Validate email format
      if (!validateEmail(email)) {
        return {
          address: '',
          success: false,
          error: 'Invalid email format'
        };
      }

      // Validate OTP format (6 digits)
      const otpRegex = /^\d{6}$/;
      if (!otpRegex.test(otp)) {
        return {
          address: '',
          success: false,
          error: 'Invalid OTP format. Must be 6 digits.'
        };
      }

      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(email.toLowerCase());

      console.log('🔐 Completing wallet creation with OTP for:', { userId, email: sanitizedEmail });

      // Call secure backend edge function
      const { data, error } = await supabase.functions.invoke('create-sequence-wallet', {
        body: {
          email: sanitizedEmail,
          userId,
          otp,
          authInstance,
          sessionHash,
          action: 'complete'
        }
      });

      if (error) {
        console.error('Backend wallet completion error:', error);
        return {
          address: '',
          success: false,
          error: error.message || 'Failed to complete wallet creation'
        };
      }

      if (data.success) {
        console.log('✅ Sequence Embedded Wallet created successfully:', data.walletAddress);
      }

      return {
        address: data.walletAddress || '',
        success: data.success || false,
        error: data.error
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