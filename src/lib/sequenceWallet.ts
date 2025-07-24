import { supabase } from '@/integrations/supabase/client'

export class SequenceWalletService {
  async createWalletForUser(email: string, userId: string): Promise<{ address: string; success: boolean; error?: string }> {
    try {
      console.log('Creating real Sequence wallet for user:', { userId, email });

      // Call the edge function to create a real Sequence wallet
      const { data, error } = await supabase.functions.invoke('create-sequence-wallet', {
        body: {
          email,
          userId
        }
      });

      if (error) {
        console.error('Error calling create-sequence-wallet function:', error);
        return {
          address: '',
          success: false,
          error: error.message
        };
      }

      if (!data.success) {
        console.error('Wallet creation failed:', data.error);
        return {
          address: '',
          success: false,
          error: data.error
        };
      }

      console.log('Successfully created Sequence wallet:', data.walletAddress);
      return {
        address: data.walletAddress,
        success: true
      };
    } catch (error) {
      console.error('Error creating Sequence wallet:', error);
      return {
        address: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const sequenceWalletService = new SequenceWalletService();