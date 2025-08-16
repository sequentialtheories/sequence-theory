const get = (k: string, def: string) =>
  (localStorage.getItem(`tvc_${k}`) ?? (import.meta as { env: Record<string, string | undefined> }).env[k] ?? def);

export const CFG = {
  CHAIN_ID: Number(get('VITE_CHAIN_ID', get('CHAIN_ID', '80002'))),
  SIMULATION_MODE: get('VITE_SIMULATION_MODE', get('SIMULATION_MODE','1')) === '1',
  FEATURE_TESTNET_ONLY: get('VITE_FEATURE_TESTNET_ONLY', get('FEATURE_TESTNET_ONLY','1')) === '1',
  DISABLE_METAMASK: get('VITE_DISABLE_METAMASK','1') === '1',
  WALLET_PROVIDER: get('VITE_WALLET_PROVIDER', get('WALLET_PROVIDER','sequence')) as 'sequence' | 'metamask',
  RPC_URL: get('VITE_RPC_URL',''),
  VAULT_ADDRESS: get('VITE_VAULT_ADDRESS',''),
  STABLE_TOKEN_ADDRESS: get('VITE_STABLE_TOKEN_ADDRESS',''),
  STABLE_TOKEN_DECIMALS: Number(get('VITE_STABLE_TOKEN_DECIMALS','6')),
};

export const setConfig = (key: keyof typeof CFG, value: string | boolean | number) => {
  const stringValue = typeof value === 'boolean' ? (value ? '1' : '0') : String(value);
  localStorage.setItem(`tvc_VITE_${key}`, stringValue);
};

export const getConfig = (key: keyof typeof CFG) => CFG[key];
