/**
 * Sequence WaaS integration for Amoy testnet
 * 
 * Provides ethers-compatible signers and read providers
 * for client-side transaction signing (no server-side keys)
 */

import { CFG } from './config';
import { SequenceWaaS } from '@0xsequence/waas';

let sequenceInstance: SequenceWaaS | null = null;

/**
 * Initialize Sequence WaaS instance for Amoy testnet
 */
const getSequenceInstance = () => {
  if (!sequenceInstance) {
    // Use runtime config for network targeting
    sequenceInstance = new SequenceWaaS({
      projectAccessKey: CFG.SEQUENCE_PROJECT_ACCESS_KEY,
      waasConfigKey: CFG.SEQUENCE_WAAS_CONFIG_KEY,
      network: CFG.SEQUENCE_NETWORK // 'amoy' for testnet
    });
  }
  return sequenceInstance;
};

/**
 * Get ethers-compatible Sequence signer for client-side transaction signing
 * Returns signer configured for the target network (Amoy)
 */
export const getSequenceSigner = async () => {
  try {
    const sequence = getSequenceInstance();
    
    // Get the current wallet/session
    const wallet = await sequence.getAddress();
    if (!wallet) {
      throw new Error('No Sequence wallet session found. Please sign in first.');
    }
    
    // Return the sequence instance for now (Phase B will implement proper signer)
    return sequence;
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