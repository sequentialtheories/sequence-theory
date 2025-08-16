import { useQuery } from '@tanstack/react-query';
import { getVaultStats, getVaultBalance, VaultStats, VaultBalance } from '../lib/vaultData';
import { useAuth } from '../components/AuthProvider';
import { useWallet } from '../components/WalletProvider';
import { CFG } from '../lib/config';

export function useVaultStats(subclub_id?: string) {
  return useQuery({
    queryKey: ['vault-stats', subclub_id, CFG.SIMULATION_MODE, CFG.VAULT_ADDRESS],
    queryFn: () => getVaultStats(subclub_id),
    enabled: CFG.SIMULATION_MODE ? !!subclub_id : !!CFG.VAULT_ADDRESS,
    staleTime: 30000, // 30 seconds
    refetchInterval: CFG.SIMULATION_MODE ? false : 60000, // Refetch every minute for live data
  });
}

export function useVaultBalance(subclub_id: string) {
  const { user } = useAuth();
  const { wallet } = useWallet();
  
  return useQuery({
    queryKey: ['vault-balance', subclub_id, user?.id, wallet?.address, CFG.SIMULATION_MODE],
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      return getVaultBalance(subclub_id, user.id, wallet?.address);
    },
    enabled: !!user?.id && (CFG.SIMULATION_MODE || !!wallet?.address),
    staleTime: 30000, // 30 seconds
    refetchInterval: CFG.SIMULATION_MODE ? false : 60000, // Refetch every minute for live data
  });
}
