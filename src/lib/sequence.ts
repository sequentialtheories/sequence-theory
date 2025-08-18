/**
 * Sequence WaaS integration for Amoy testnet
 * 
 * Provides ethers-compatible signers and read providers
 * for client-side transaction signing (no server-side keys)
 */

import { CFG } from './config';
import { sequenceWaas } from './sequenceWaas';

/**
 * Get ethers-compatible Sequence signer for client-side transaction signing
 * Returns signer configured for the target network (Amoy)
 */
export const getSequenceSigner = async () => {
  try {
    // Get the current wallet/session from unified instance
    const wallet = await sequenceWaas.getAddress();
    if (!wallet) {
      throw new Error('No Sequence wallet session found. Please sign in first.');
    }
    
    // Return the WaaS instance as signer for now
    // Note: Sequence WaaS provides transaction signing capabilities
    return sequenceWaas;
  } catch (error) {
    console.error('Failed to get Sequence signer:', error);
    throw error;
  }
};

/**
 * Get read-only provider for blockchain queries
 * Uses the configured RPC URL for the target network
 */
export const getReadProvider = async () => {
  const { JsonRpcProvider } = await import('ethers');
  
  if (!CFG.RPC_URL) {
    throw new Error('RPC_URL not configured. Please set tvc_RPC_URL in localStorage or update config.');
  }
  
  return new JsonRpcProvider(CFG.RPC_URL);
};

/**
 * Get Sequence wallet balance (native MATIC and ERC-20 tokens)
 */
export const getSequenceWalletBalance = async (address: string) => {
  try {
    const provider = await getReadProvider();
    
    // Get native MATIC balance
    const maticBalance = await provider.getBalance(address);
    const maticFormatted = (parseFloat(maticBalance.toString()) / 1e18).toFixed(4);
    
    // Get USDC balance (if contract address is configured)
    let usdcBalance = '0';
    if (CFG.STABLE_TOKEN_ADDRESS) {
      try {
        const { Contract } = await import('ethers');
        const usdcContract = new Contract(
          CFG.STABLE_TOKEN_ADDRESS,
          ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'],
          provider
        );
        const balance = await usdcContract.balanceOf(address);
        const decimals = await usdcContract.decimals();
        usdcBalance = (parseFloat(balance.toString()) / Math.pow(10, decimals)).toFixed(2);
      } catch (usdcError) {
        console.warn('Failed to fetch USDC balance:', usdcError);
      }
    }
    
    return {
      matic: maticFormatted,
      usdc: usdcBalance,
      address
    };
  } catch (error) {
    console.error('Failed to get wallet balance:', error);
    throw error;
  }
};

/**
 * Get current network information from signer and provider
 */
export const getNetworkInfo = async () => {
  try {
    const [signer, provider] = await Promise.all([
      getSequenceSigner().catch(() => null),
      getReadProvider()
    ]);
    
    const [signerNetwork, providerNetwork] = await Promise.all([
      signer?.provider?.getNetwork().catch(() => null),
      provider.getNetwork().catch(() => null)
    ]);
    
    return {
      signerChainId: signerNetwork?.chainId?.toString() || 'N/A',
      providerChainId: providerNetwork?.chainId?.toString() || 'N/A',
      expectedChainId: CFG.CHAIN_ID.toString(),
      rpcUrl: CFG.RPC_URL
    };
  } catch (error) {
    console.error('Failed to get network info:', error);
    return {
      signerChainId: 'Error',
      providerChainId: 'Error',
      expectedChainId: CFG.CHAIN_ID.toString(),
      rpcUrl: CFG.RPC_URL,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Check RPC latency
 */
export const checkRpcLatency = async () => {
  try {
    const provider = await getReadProvider();
    const start = Date.now();
    await provider.getBlockNumber();
    const latency = Date.now() - start;
    return { latency, error: null };
  } catch (error) {
    console.error('RPC latency check failed:', error);
    return { 
      latency: -1, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};