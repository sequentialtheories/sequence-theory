import { Contract } from 'ethers';
import { getReadProvider, getSignerProvider } from './chain';
import { CFG } from './config';

const VAULT_ABI = [
  "function totalDeposits() view returns (uint256)",
  "function getTotalMembers() view returns (uint256)", 
  "function balanceOf(address account) view returns (uint256)",
  "function deposit(uint256 amount) external",
  "function harvestAndRoute() external",
  "function getVaultStats() view returns (uint256 totalValue, uint256 memberCount, uint256 weeklyDeposits)"
];

export function getVault(): Contract {
  const address = CFG.VAULT_ADDRESS;
  if (!address) {
    throw new Error('VAULT_ADDRESS configuration is required');
  }
  return new Contract(address, VAULT_ABI, getReadProvider());
}

export function getVaultWithSigner(): Contract | null {
  const signer = getSignerProvider();
  if (!signer) return null;
  
  const address = CFG.VAULT_ADDRESS;
  if (!address) {
    throw new Error('VAULT_ADDRESS configuration is required');
  }
  return new Contract(address, VAULT_ABI, signer);
}

export async function healthCheck(): Promise<{
  success: boolean;
  data?: {
    totalDeposits: string;
    totalMembers: string;
    contractAddress: string;
    chainId: number;
    rpcLatency: number;
  };
  error?: string;
}> {
  try {
    const startTime = Date.now();
    const vault = getVault();
    
    const [totalDeposits, totalMembers] = await Promise.all([
      vault.totalDeposits(),
      vault.getTotalMembers()
    ]);
    
    const rpcLatency = Date.now() - startTime;
    
    return {
      success: true,
      data: {
        totalDeposits: totalDeposits.toString(),
        totalMembers: totalMembers.toString(),
        contractAddress: CFG.VAULT_ADDRESS,
        chainId: CFG.CHAIN_ID,
        rpcLatency
      }
    };
  } catch (error) {
    console.error('Health check failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
