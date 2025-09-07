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

// Validation to prevent using placeholder keys in production
export function validateSequenceConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (SEQUENCE_CONFIG.projectAccessKey.includes('REPLACE_WITH_YOUR')) {
    errors.push('Project Access Key is not configured. Get it from Sequence Builder.');
  }
  
  if (SEQUENCE_CONFIG.waasConfigKey.includes('REPLACE_WITH_YOUR')) {
    errors.push('WaaS Config Key is not configured. Get it from your Embedded Wallet configuration in Builder.');
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