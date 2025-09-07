/**
 * Sequence Embedded Wallet Configuration
 * 
 * IMPORTANT: Before using this configuration, you must:
 * 1. Configure your Embedded Wallet in Sequence Builder: https://sequence.build/project/default/embedded-wallet
 * 2. Set up Login Providers (Google, Apple, email, etc.)
 * 3. Configure Allowed Origins for your domain
 * 4. Set up Recovery Wallet address
 * 5. Create Initial Configuration Password
 * 6. Get your actual waasConfigKey from Builder
 * 
 * The current placeholder keys will NOT work and need to be replaced with real keys from Builder.
 */

// These are PLACEHOLDER values - replace with actual keys from Sequence Builder
export const SEQUENCE_CONFIG = {
  // Get this from your Sequence Builder project
  projectAccessKey: process.env.NODE_ENV === 'development' 
    ? localStorage.getItem('sequence_project_access_key') || 'AQAAAAAAAKg7Q8xQ94GXN9ogCwnDTzn-BkE'
    : 'AQAAAAAAAKg7Q8xQ94GXN9ogCwnDTzn-BkE',
  
  // Get this from your Embedded Wallet configuration in Builder  
  waasConfigKey: process.env.NODE_ENV === 'development'
    ? localStorage.getItem('sequence_waas_config_key') || 'eyJwcm9qZWN0SWQiOjQzMDY3LCJycGNTZXJ2ZXIiOiJodHRwczovL3dhYXMuc2VxdWVuY2UuYXBwIn0='
    : 'eyJwcm9qZWN0SWQiOjQzMDY3LCJycGNTZXJ2ZXIiOiJodHRwczovL3dhYXMuc2VxdWVuY2UuYXBwIn0=',
    
  // Network configuration
  network: 'amoy', // or your preferred network
  chainId: '80002' // Polygon Amoy testnet
} as const;

// Decode and validate WaaS Config Key
export function decodeWaasConfigKey(waasConfigKey: string): { projectId: number; rpcServer: string } | null {
  try {
    const decoded = atob(waasConfigKey);
    const config = JSON.parse(decoded);
    
    if (typeof config.projectId === 'number' && typeof config.rpcServer === 'string') {
      return config;
    }
    return null;
  } catch {
    return null;
  }
}

// Enhanced validation with actual key format checking
export function validateSequenceConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for placeholder values
  if (SEQUENCE_CONFIG.projectAccessKey.includes('REPLACE_WITH_YOUR')) {
    errors.push('Project Access Key is not configured. Get it from Sequence Builder.');
  }
  
  if (SEQUENCE_CONFIG.waasConfigKey.includes('REPLACE_WITH_YOUR')) {
    errors.push('WaaS Config Key is not configured. Get it from your Embedded Wallet configuration in Builder.');
  }
  
  // Validate project access key format (should start with 'AQAAAAAAA')
  if (!SEQUENCE_CONFIG.projectAccessKey.startsWith('AQAAAAAAA')) {
    errors.push('Project Access Key format appears invalid. Should start with "AQAAAAAAA".');
  }
  
  // Validate WaaS config key by attempting to decode it
  const waasConfig = decodeWaasConfigKey(SEQUENCE_CONFIG.waasConfigKey);
  if (!waasConfig) {
    errors.push('WaaS Config Key is invalid or corrupted. Should be a valid base64-encoded JSON.');
  } else if (!waasConfig.projectId || !waasConfig.rpcServer) {
    errors.push('WaaS Config Key is missing required fields (projectId or rpcServer).');
  }
  
  // Network configuration checks
  if (!SEQUENCE_CONFIG.network) {
    errors.push('Network configuration is missing.');
  }
  
  if (!SEQUENCE_CONFIG.chainId) {
    errors.push('Chain ID configuration is missing.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Configuration instructions for developers
export const CONFIG_INSTRUCTIONS = {
  builderUrl: 'https://sequence.build/project/default/embedded-wallet',
  steps: [
    'Go to Sequence Builder and create/configure your Embedded Wallet',
    'Set up Login Providers (Google, Apple, email)',
    'Configure Allowed Origins with your domain URLs',
    'Set up Recovery Wallet address (use a secure multisig)',
    'Create Initial Configuration Password',
    'Copy your waasConfigKey from Builder and replace the placeholder'
  ]
};