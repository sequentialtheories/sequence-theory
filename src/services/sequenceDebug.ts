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
      // Only log in debug mode - removed key exposure
      if (window.location.hostname === 'localhost' || window.location.hostname.includes('preview')) {
        console.log('=== SEQUENCE INITIALIZATION ===');
        console.log('Config network:', config.network);
      }

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
    // Only log in debug mode for security
    const isDebugMode = window.location.hostname === 'localhost' || window.location.hostname.includes('preview');
    if (isDebugMode) {
      console.group(`🚀 Creating Wallet for ${email.replace(/@.*/, '@***')}`);
    }
    this.debugSteps = [];

    try {
      if (!this.sequence) {
        const initResult = await this.initializeSequence();
        if (!initResult.success) throw new Error(initResult.message);
      }

      try {
        const isSignedIn = await this.sequence!.isSignedIn();
        const isDebugMode = window.location.hostname === 'localhost' || window.location.hostname.includes('preview');
        if (isDebugMode) console.log('Session check:', { isSignedIn });
        
        if (isSignedIn) {
          const address = await this.sequence!.getAddress();
          if (address) {
            if (isDebugMode) {
              console.log('Existing wallet found:', { address });
              console.groupEnd();
            }
            return { success: true, address, debugSteps: this.debugSteps };
          }
        }
      } catch (e) {
        if (window.location.hostname === 'localhost' || window.location.hostname.includes('preview')) {
          console.log('Session check failed:', e);
        }
      }

      const isDebugMode = window.location.hostname === 'localhost' || window.location.hostname.includes('preview');
      if (isDebugMode) console.log('Starting sign in process...');
      
      const signInResponse = await this.sequence!.signIn({ email }, `TVC_Session_${Date.now()}`);
      
      if (isDebugMode) {
        console.log('Sign in completed:', {
          hasSession: !!(signInResponse as any)?.sessionId,
          hasWallet: !!(signInResponse as any)?.wallet
        });
      }

      const address = await this.sequence!.getAddress();
      if (!address) throw new Error('No address returned after sign in');
      
      if (isDebugMode) {
        console.log('Wallet created successfully:', { address });
        console.groupEnd();
      }
      return { success: true, address, debugSteps: this.debugSteps };
    } catch (error) {
      if (window.location.hostname === 'localhost' || window.location.hostname.includes('preview')) {
        console.error('Wallet creation failed:', error);
        console.groupEnd();
      }
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
    // Only enable network monitoring in development/debug environments for security
    const isDebugMode = window.location.hostname === 'localhost' || 
                       window.location.hostname.includes('preview') ||
                       new URLSearchParams(window.location.search).has('debug');
    
    if (!isDebugMode) {
      console.warn('Network monitoring disabled in production for security');
      return;
    }

    const originalFetch = window.fetch.bind(window);
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const [url, options] = args;
      if (typeof url === 'string' && url.includes('sequence')) {
        console.group(`📡 Sequence API: ${url.replace(/\/[a-f0-9]{8,}/g, '/***')}`); // Redact potential keys
        // Don't log full request options to prevent key exposure
        console.log('Request method:', (options as any)?.method || 'GET');
        try {
          const response = await originalFetch(...args);
          console.log('Response Status:', response.status);
          if (!response.ok) {
            const clone = response.clone();
            const body = await clone.text();
            console.error('Error Response:', body.length > 500 ? body.substring(0, 500) + '...' : body);
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