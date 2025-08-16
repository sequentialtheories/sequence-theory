import { JsonRpcProvider, BrowserProvider } from 'ethers';
import { CFG } from './config';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

export function getRequiredChainId(): number {
  return CFG.CHAIN_ID;
}

export function getReadProvider(): JsonRpcProvider {
  const rpcUrl = CFG.RPC_URL;
  if (!rpcUrl) {
    throw new Error('RPC_URL configuration is required');
  }
  return new JsonRpcProvider(rpcUrl);
}

export function getSignerProvider(): BrowserProvider | null {
  if (CFG.DISABLE_METAMASK || CFG.WALLET_PROVIDER !== 'metamask') {
    return null;
  }
  if (!window.ethereum) {
    return null;
  }
  return new BrowserProvider(window.ethereum);
}

export async function switchToRequiredNetwork(): Promise<boolean> {
  const provider = getSignerProvider();
  if (!provider || !window.ethereum || CFG.WALLET_PROVIDER !== 'metamask') return false;
  
  const requiredChainId = getRequiredChainId();
  const chainIdHex = `0x${requiredChainId.toString(16)}`;
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
    return true;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 4902) {
      const rpcUrl = CFG.RPC_URL;
      if (rpcUrl) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: chainIdHex,
              chainName: 'Polygon Amoy',
              nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
              rpcUrls: [rpcUrl],
              blockExplorerUrls: ['https://amoy.polygonscan.com/'],
            }],
          });
          return true;
        } catch (addError) {
          console.error('Failed to add network:', addError);
        }
      }
    }
    return false;
  }
}

export async function getCurrentChainId(): Promise<number | null> {
  const provider = getSignerProvider();
  if (!provider) return null;
  
  try {
    const network = await provider.getNetwork();
    return Number(network.chainId);
  } catch (error) {
    console.error('Failed to get current chain ID:', error);
    return null;
  }
}

export async function isOnCorrectNetwork(): Promise<boolean> {
  const currentChainId = await getCurrentChainId();
  const requiredChainId = getRequiredChainId();
  return currentChainId === requiredChainId;
}
