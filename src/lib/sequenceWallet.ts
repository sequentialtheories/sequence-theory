// For now, let's create a simplified wallet service that creates deterministic wallets
// until we get the proper Sequence WaaS configuration sorted out

export class SequenceWalletService {
  async createWalletForUser(email: string, userId: string): Promise<{ address: string; success: boolean; error?: string }> {
    try {
      // Create a deterministic wallet address based on user info
      // This is temporary until proper Sequence integration
      const combined = email + userId;
      const encoder = new TextEncoder();
      const data = encoder.encode(combined);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      const walletAddress = '0x' + hashHex.substring(0, 40);

      console.log('Generated wallet address for', email, ':', walletAddress);
      return {
        address: walletAddress,
        success: true
      };
    } catch (error) {
      console.error('Error creating wallet:', error);
      return {
        address: '',
        success: false,
        error: error.message
      };
    }
  }
}

export const sequenceWalletService = new SequenceWalletService();