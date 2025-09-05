/**
 * Simple configuration for Sequence WaaS integration
 * Based on Sequence documentation requirements
 */

function getConfigValue(key: string, defaultValue: string = ''): string {
  const override = localStorage.getItem(`tvc_${key}`);
  return override !== null ? override : defaultValue;
}

// Main configuration object
export const config = {
  projectAccessKey: getConfigValue('SEQUENCE_PROJECT_ACCESS_KEY', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9'),
  waasConfigKey: getConfigValue('SEQUENCE_WAAS_CONFIG_KEY', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9'),
  chainId: getConfigValue('CHAIN_ID', '80002'),
  network: getConfigValue('SEQUENCE_NETWORK', 'amoy'),
};

// Backward compatibility exports (for existing code that uses CFG)
export const CFG = {
  FEATURE_TESTNET_ONLY: getConfigValue('FEATURE_TESTNET_ONLY', '0') === '1',
  SIMULATION_MODE: getConfigValue('SIMULATION_MODE', '0') === '1',
  CHAIN_ID: config.chainId,
  RPC_URL: getConfigValue('RPC_URL', 'https://rpc-amoy.polygon.technology/'),
  SEQUENCE_NETWORK: config.network,
};

// Minimal utility functions for compatibility
export function getConfigString(): string {
  return JSON.stringify(config, null, 2);
}

export function toggleSimulationMode(): void {
  const current = localStorage.getItem('tvc_SIMULATION_MODE') === '1';
  localStorage.setItem('tvc_SIMULATION_MODE', current ? '0' : '1');
  window.location.reload();
}

export function toggleTestnetMode(): void {
  const current = localStorage.getItem('tvc_FEATURE_TESTNET_ONLY') === '1';
  localStorage.setItem('tvc_FEATURE_TESTNET_ONLY', current ? '0' : '1');
  window.location.reload();
}