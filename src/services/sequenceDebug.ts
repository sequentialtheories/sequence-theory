import { SequenceWaaS } from '@0xsequence/waas';
import { sequenceConfig } from '@/lib/config';

interface DebugResult {
  success: boolean;
  address?: string;
  error?: any;
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

  private logStep(step: string, status: 'success' | 'error', details: any) {
    const entry = {
      step,
      status,
      details,
      timestamp: new Date().toISOString()
    };
    this.debugSteps.push(entry);
    if (status === 'error') console.error(`🔴 [${step}]`, details);
    else console.log(`🟢 [${step}]`, details);
  }

  private validateConfiguration(): boolean {
    console.group('🔍 Sequence Configuration Validation');
    
    const projectKey = sequenceConfig.projectAccessKey;
    const waasKey = sequenceConfig.waasConfigKey;
    
    // Check if keys exist
    if (!projectKey || !waasKey) {
      this.logStep('CONFIG_VALIDATION', 'error', {
        error: 'Missing required keys',
        projectKeySource: sequenceConfig.projectAccessKeySource,
        waasKeySource: sequenceConfig.waasConfigKeySource,
        isConfigured: sequenceConfig.isConfigured
      });
      console.groupEnd();
      return false;
    }

    // Validate key formats
    const projectKeyValid = /^[A-Za-z0-9_-]+$/.test(projectKey);
    const waasKeyValid = /^[A-Za-z0-9_-]+$/.test(waasKey);

    this.logStep('CONFIG_VALIDATION', 'success', {
      projectKey: {
        source: sequenceConfig.projectAccessKeySource,
        length: projectKey.length,
        valid: projectKeyValid,
        preview: projectKey.substring(0, 10) + '...'
      },
      waasKey: {
        source: sequenceConfig.waasConfigKeySource,
        length: waasKey.length,
        valid: waasKeyValid,
        preview: waasKey.substring(0, 10) + '...'
      },
      network: sequenceConfig.network,
      networkSource: sequenceConfig.networkSource
    });

    console.groupEnd();
    return projectKeyValid && waasKeyValid;
  }

  async initializeSequence(): Promise<boolean> {
    try {
      if (!this.validateConfiguration()) throw new Error('Invalid configuration');

      this.sequence = new SequenceWaaS({
        projectAccessKey: sequenceConfig.projectAccessKey,
        waasConfigKey: sequenceConfig.waasConfigKey,
        network: sequenceConfig.network as any
      });

      this.logStep('SEQUENCE_INIT', 'success', { initialized: true, network: sequenceConfig.network });
      return true;
    } catch (error) {
      this.logStep('SEQUENCE_INIT', 'error', error);
      return false;
    }
  }

  async createWallet(email: string): Promise<DebugResult> {
    console.group(`🚀 Creating Wallet for ${email}`);
    this.debugSteps = [];

    try {
      if (!this.sequence) {
        const initialized = await this.initializeSequence();
        if (!initialized) throw new Error('Failed to initialize Sequence');
      }

      try {
        const isSignedIn = await this.sequence!.isSignedIn();
        this.logStep('SESSION_CHECK', 'success', { isSignedIn });
        if (isSignedIn) {
          const address = await this.sequence!.getAddress();
          if (address) {
            this.logStep('EXISTING_WALLET', 'success', { address });
            console.groupEnd();
            return { success: true, address, debugSteps: this.debugSteps };
          }
        }
      } catch (e) {
        this.logStep('SESSION_CHECK', 'error', e);
      }

      this.logStep('SIGNIN_START', 'success', { email });
      const signInResponse = await this.sequence!.signIn({ email }, `TVC_Session_${Date.now()}`);
      this.logStep('SIGNIN_COMPLETE', 'success', {
        hasSession: !!(signInResponse as any)?.sessionId,
        hasWallet: !!(signInResponse as any)?.wallet
      });

      const address = await this.sequence!.getAddress();
      if (!address) throw new Error('No address returned after sign in');
      this.logStep('WALLET_CREATED', 'success', { address });

      console.groupEnd();
      return { success: true, address, debugSteps: this.debugSteps };
    } catch (error) {
      this.logStep('WALLET_CREATION_FAILED', 'error', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined
      });
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