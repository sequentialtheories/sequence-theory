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

/**
 * Validates if a string is properly base64 encoded
 */
const isValidBase64 = (str: string): boolean => {
  if (!str || typeof str !== 'string') return false;
  const cleaned = str.trim();
  // base64url (Sequence uses this)
  const base64urlRegex = /^[A-Za-z0-9_-]+$/;
  if (base64urlRegex.test(cleaned)) return true;
  // standard base64
  const base64Regex = /^[A-Za-z0-9+/]+=*$/;
  return base64Regex.test(cleaned);
};

/**
 * Sanitizes and validates localStorage overrides
 */
const get = (key: string, defaultValue = '') => {
  // Check localStorage first with tvc_ prefix
  const localValue = localStorage.getItem(`tvc_${key}`);
  if (localValue !== null) {
    // Trim whitespace
    const trimmed = localValue.trim();
    
    // Special validation for Sequence keys
    if (key === 'SEQUENCE_WAAS_CONFIG_KEY' || key === 'SEQUENCE_PROJECT_ACCESS_KEY') {
      if (!isValidBase64(trimmed)) {
        console.warn(`Config override for ${key} may not be standard base64. Keeping override as-is.`);
      }
    }
    
    return trimmed;
  }
  
  // Fallback to defaults
  return defaultValue;
};

export const getWithSource = (key: string, defaultValue = '') => {
  const localValue = localStorage.getItem(`tvc_${key}`);
  if (localValue !== null) {
    return { value: localValue.trim(), source: 'localStorage' as const };
  }
  return { value: defaultValue, source: 'default' as const };
};

export const CFG = {
  // Network configuration (Amoy testnet)
  CHAIN_ID: Number(get('CHAIN_ID', '80002')),
  RPC_URL: get('RPC_URL', 'https://rpc-amoy.polygon.technology'),
  
  // Feature flags (runtime overridable)
  SIMULATION_MODE: get('SIMULATION_MODE', '1') === '1',
  FEATURE_TESTNET_ONLY: get('FEATURE_TESTNET_ONLY', '1') === '1',
  
  // Contract addresses (will be set by user in Phase B)
  VAULT_ADDRESS: get('VAULT_ADDRESS', ''),
  STABLE_TOKEN_ADDRESS: get('STABLE_TOKEN_ADDRESS', ''),
  STABLE_TOKEN_DECIMALS: Number(get('STABLE_TOKEN_DECIMALS', '6')),
  
  // Sequence WaaS configuration
  SEQUENCE_PROJECT_ID: get('SEQUENCE_PROJECT_ID', ''),
  SEQUENCE_NETWORK: get('SEQUENCE_NETWORK', 'amoy'),
  
  // Legacy Sequence config (keep for now during migration)
  SEQUENCE_PROJECT_ACCESS_KEY: get('SEQUENCE_PROJECT_ACCESS_KEY', 'AQAAAAAAAKg7Q8xQ94GXN9ogCwnDTzn-BkE'),
  SEQUENCE_WAAS_CONFIG_KEY: get('SEQUENCE_WAAS_CONFIG_KEY', 'eyJwcm9qZWN0SWQiOjQzMDY3LCJycGNTZXJ2ZXIiOiJodHRwczovL3dhYXMuc2VxdWVuY2UuYXBwIn0='),
};

// Runtime config accessor with source tracking (Lovable note: env vars not supported)
export const getConfigValue = (
  key: string,
  defaultValue: string = ''
): { value: string; source: 'localStorage' | 'default' } => {
  const localStorageKey = `tvc_${key}`;
  const localValue = localStorage.getItem(localStorageKey);
  if (localValue && localValue.trim()) {
    console.log(`Config ${key} loaded from localStorage`);
    return { value: localValue.trim(), source: 'localStorage' };
  }
  console.warn(`Config ${key} using default value`);
  return { value: defaultValue, source: 'default' };
};

export const sequenceConfig = {
  projectAccessKey: getConfigValue('SEQUENCE_PROJECT_ACCESS_KEY', ''),
  waasConfigKey: getConfigValue('SEQUENCE_WAAS_CONFIG_KEY', ''),
  network: getConfigValue('SEQUENCE_NETWORK', 'amoy').value,
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

/**
 * Reset all Sequence-related localStorage overrides
 */
export const resetSequenceOverrides = () => {
  const sequenceKeys = [
    'tvc_SEQUENCE_PROJECT_ID',
    'tvc_SEQUENCE_NETWORK', 
    'tvc_SEQUENCE_PROJECT_ACCESS_KEY',
    'tvc_SEQUENCE_WAAS_CONFIG_KEY'
  ];
  
  sequenceKeys.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log('Sequence overrides cleared');
  window.location.reload();
};

/**
 * Force bypass cache reload (unregister service workers, clear cache)
 */
export const forceBypassCacheReload = async () => {
  try {
    // Unregister service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log('Service worker unregistered');
      }
    }
    
    // Clear caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => caches.delete(name))
      );
      console.log('Browser caches cleared');
    }
    
    // Force reload with cache bypass
    window.location.reload();
  } catch (error) {
    console.warn('Cache clear failed:', error);
    // Fallback to regular reload
    window.location.reload();
  }
};
