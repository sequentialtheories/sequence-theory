import { SequenceWaaS } from '@0xsequence/waas';
import { config } from '@/lib/config';

interface DebugResult {
  success: boolean;
  message?: string;
  address?: string;
  error?: any;
  details?: any;
  debugSteps: Array<{
    step: string;
    status: 'success' | 'error';
    details: any;
    timestamp: string;
  }>;
}

export class SequenceDebugService {
  private static instance: SequenceDebugService;
  private sequence: SequenceWaaS | null = null;
  private debugSteps: DebugResult['debugSteps'] = [];

  static getInstance(): SequenceDebugService {
    if (!this.instance) {
      this.instance = new SequenceDebugService();
    }
    return this.instance;
  }

  async initializeSequence(): Promise<DebugResult> {
    try {
      console.log('=== SEQUENCE INITIALIZATION ===');
      console.log('Config:', {
        projectAccessKey: config.projectAccessKey.substring(0, 20) + '...',
        waasConfigKey: config.waasConfigKey.substring(0, 20) + '...',
        network: config.network
      });

      const waasConfig = {
        projectAccessKey: config.projectAccessKey,
        waasConfigKey: config.waasConfigKey,
        network: config.network
      };

      this.sequence = new SequenceWaaS(waasConfig);
      
      return {
        success: true,
        message: 'Sequence initialized successfully',
        details: waasConfig,
        debugSteps: []
      };
    } catch (error: any) {
      console.error('Sequence initialization failed:', error);
      return {
        success: false,
        message: `Initialization failed: ${error.message}`,
        details: { error: error.message },
        debugSteps: []
      };
    }
  }

  async createWallet(email: string): Promise<DebugResult> {
    console.group(`🚀 Creating Wallet for ${email}`);
    this.debugSteps = [];

    try {
      if (!this.sequence) {
        const initResult = await this.initializeSequence();
        if (!initResult.success) throw new Error(initResult.message);
      }

      try {
        const isSignedIn = await this.sequence!.isSignedIn();
        console.log('Session check:', { isSignedIn });
        if (isSignedIn) {
          const address = await this.sequence!.getAddress();
          if (address) {
            console.log('Existing wallet found:', { address });
            console.groupEnd();
            return { success: true, address, debugSteps: this.debugSteps };
          }
        }
      } catch (e) {
        console.log('Session check failed:', e);
      }

      console.log('Starting sign in process...');
      const signInResponse = await this.sequence!.signIn({ email }, `TVC_Session_${Date.now()}`);
      console.log('Sign in completed:', {
        hasSession: !!(signInResponse as any)?.sessionId,
        hasWallet: !!(signInResponse as any)?.wallet
      });

      const address = await this.sequence!.getAddress();
      if (!address) throw new Error('No address returned after sign in');
      console.log('Wallet created successfully:', { address });

      console.groupEnd();
      return { success: true, address, debugSteps: this.debugSteps };
    } catch (error) {
      console.error('Wallet creation failed:', error);
      console.groupEnd();
      return { success: false, error, debugSteps: this.debugSteps };
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.sequence) {
      throw new Error('Sequence not initialized');
    }

    try {
      console.log('Signing message:', message);
      const signatureResponse = await this.sequence.signMessage({
        message: message
      });
      
      if (!signatureResponse?.data?.signature) {
        throw new Error('No signature returned from Sequence WaaS');
      }

      console.log('Message signed successfully');
      return signatureResponse.data.signature;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  }

  enableNetworkMonitoring() {
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const [url, options] = args;
      if (typeof url === 'string' && url.includes('sequence')) {
        console.group(`📡 Sequence API: ${url}`);
        console.log('Request:', options);
        try {
          const response = await originalFetch(...args);
          console.log('Response Status:', response.status);
          if (!response.ok) {
            const clone = response.clone();
            const body = await clone.text();
            console.error('Error Response:', body);
          }
          console.groupEnd();
          return response;
        } catch (error) {
          console.error('Request Failed:', error);
          console.groupEnd();
          throw error;
        }
      }
      return originalFetch(...args);
    };
  }
}

export const sequenceDebug = SequenceDebugService.getInstance();