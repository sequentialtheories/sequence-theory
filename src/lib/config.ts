/**
 * Runtime configuration system with localStorage overrides
 * 
 * Priorities:
 * 1. localStorage (runtime toggles with prefix tvc_)
 * 2. Hardcoded defaults for Amoy testnet
 * 
 * Example runtime override:
 * localStorage.setItem('tvc_SIMULATION_MODE', '0')
 * localStorage.setItem('tvc_CHAIN_ID', '80002')
 */

const get = (key: string, defaultValue = '') => {
  // Check localStorage first with tvc_ prefix
  const localValue = localStorage.getItem(`tvc_${key}`);
  if (localValue !== null) {
    return localValue;
  }
  
  // Fallback to defaults
  return defaultValue;
};

export const CFG = {
  // Network configuration (Polygon mainnet)
  CHAIN_ID: Number(get('CHAIN_ID', '137')),
  RPC_URL: get('RPC_URL', 'https://polygon-rpc.com'),
  
  // Feature flags (runtime overridable)
  SIMULATION_MODE: get('SIMULATION_MODE', '1') === '1',
  FEATURE_TESTNET_ONLY: get('FEATURE_TESTNET_ONLY', '0') === '1',
  
  // Contract addresses (will be set by user in Phase B)
  VAULT_ADDRESS: get('VAULT_ADDRESS', ''),
  STABLE_TOKEN_ADDRESS: get('STABLE_TOKEN_ADDRESS', ''),
  STABLE_TOKEN_DECIMALS: Number(get('STABLE_TOKEN_DECIMALS', '6')),
  
  // Sequence WaaS configuration
  SEQUENCE_PROJECT_ID: get('SEQUENCE_PROJECT_ID', ''),
  SEQUENCE_NETWORK: get('SEQUENCE_NETWORK', 'polygon'),
  
  // Legacy Sequence config (keep for now during migration)
  SEQUENCE_PROJECT_ACCESS_KEY: get('SEQUENCE_PROJECT_ACCESS_KEY', 'AQAAAAAAAKg7Q8xQ94GXN9ogCwnDTzn-BkE'),
  SEQUENCE_WAAS_CONFIG_KEY: get('SEQUENCE_WAAS_CONFIG_KEY', 'eyJwcm9qZWN0SWQiOjQzMDY3LCJycGNTZXJ2ZXIiOiJodHRwczovL3dhYXMuc2VxdWVuY2UuYXBwIn0='),
};

/**
 * Get current config as formatted string for debugging
 */
export const getConfigString = () => {
  const config = { ...CFG };
  // Redact sensitive keys for logging
  if (config.SEQUENCE_PROJECT_ACCESS_KEY) {
    config.SEQUENCE_PROJECT_ACCESS_KEY = `${config.SEQUENCE_PROJECT_ACCESS_KEY.slice(0, 8)}...`;
  }
  if (config.SEQUENCE_WAAS_CONFIG_KEY) {
    config.SEQUENCE_WAAS_CONFIG_KEY = `${config.SEQUENCE_WAAS_CONFIG_KEY.slice(0, 8)}...`;
  }
  
  return JSON.stringify(config, null, 2);
};

/**
 * Runtime configuration helpers
 */
export const toggleSimulationMode = () => {
  const current = CFG.SIMULATION_MODE;
  localStorage.setItem('tvc_SIMULATION_MODE', current ? '0' : '1');
  window.location.reload(); // Simple way to apply config changes
};

export const toggleTestnetMode = () => {
  const current = CFG.FEATURE_TESTNET_ONLY;
  localStorage.setItem('tvc_FEATURE_TESTNET_ONLY', current ? '0' : '1');
  window.location.reload();
};
