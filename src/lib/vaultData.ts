import { CFG } from './config';
import { getVault } from './contracts';
import { supabase } from '../integrations/supabase/client';
import { PoolBalances, calculateTVL } from './rrl';

export interface VaultStats {
  totalValue: number;
  memberCount: number;
  weeklyDeposits: number;
  p1_usdc: number;
  p2_usdc: number;
  p3_usdc: number;
  tvl_usdc: number;
}

export interface VaultBalance {
  subclub_id: string;
  epoch_week: number;
  tvl_usdc: number;
  p1_usdc: number;
  p2_usdc: number;
  p3_usdc: number;
  wbtc_sats: number;
  member_count: number;
  user_role: string;
  per_user_share?: {
    p1_usdc_share: number;
    p2_usdc_share: number;
    p3_usdc_share: number;
    tvl_usdc_share: number;
  };
}

async function getVaultStatsFromContract(): Promise<VaultStats> {
  const vault = getVault();
  
  try {
    const [totalDeposits, totalMembers, vaultStats] = await Promise.all([
      vault.totalDeposits(),
      vault.getTotalMembers(),
      vault.getVaultStats()
    ]);

    const totalValue = Number(vaultStats[0]);
    const memberCount = Number(vaultStats[1]);
    const weeklyDeposits = Number(vaultStats[2]);

    const poolBalances: PoolBalances = {
      p1_usdc: totalValue * 0.6,
      p2_usdc: totalValue * 0.1, 
      p3_usdc: totalValue * 0.3
    };

    return {
      totalValue,
      memberCount,
      weeklyDeposits,
      p1_usdc: poolBalances.p1_usdc,
      p2_usdc: poolBalances.p2_usdc,
      p3_usdc: poolBalances.p3_usdc,
      tvl_usdc: calculateTVL(poolBalances)
    };
  } catch (error) {
    console.error('Failed to fetch vault stats from contract:', error);
    throw error;
  }
}

async function getVaultStatsFromDatabase(subclub_id: string): Promise<VaultStats> {
  const { data: vaultState, error } = await supabase
    .from('vault_states')
    .select('*')
    .eq('subclub_id', subclub_id)
    .order('epoch_week', { ascending: false })
    .limit(1)
    .single();

  if (error || !vaultState) {
    throw new Error('Vault state not found in database');
  }

  const { count: memberCount } = await supabase
    .from('memberships')
    .select('*', { count: 'exact', head: true })
    .eq('subclub_id', subclub_id);

  return {
    totalValue: vaultState.tvl_usdc,
    memberCount: memberCount || 0,
    weeklyDeposits: 0,
    p1_usdc: vaultState.p1_usdc,
    p2_usdc: vaultState.p2_usdc,
    p3_usdc: vaultState.p3_usdc,
    tvl_usdc: vaultState.tvl_usdc
  };
}

export async function getVaultStats(subclub_id?: string): Promise<VaultStats> {
  if (CFG.SIMULATION_MODE || !CFG.VAULT_ADDRESS) {
    if (!subclub_id) {
      throw new Error('subclub_id required for simulation mode');
    }
    return getVaultStatsFromDatabase(subclub_id);
  }
  
  return getVaultStatsFromContract();
}

async function getVaultBalanceFromContract(userAddress: string): Promise<number> {
  const vault = getVault();
  
  try {
    const balance = await vault.balanceOf(userAddress);
    return Number(balance);
  } catch (error) {
    console.error('Failed to fetch vault balance from contract:', error);
    throw error;
  }
}

async function getVaultBalanceFromDatabase(subclub_id: string, user_id: string): Promise<VaultBalance> {
  const authHeader = `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`;
  const apiKey = 'vault-club-test-key';

  const response = await fetch(`https://qldjhlnsphlixmzzrdwi.supabase.co/functions/v1/vault-balance?subclub_id=${subclub_id}`, {
    method: 'GET',
    headers: {
      'Authorization': authHeader,
      'x-vault-club-api-key': apiKey,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch vault balance: ${response.statusText}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch vault balance');
  }

  return result.data;
}

export async function getVaultBalance(subclub_id: string, user_id: string, userAddress?: string): Promise<VaultBalance | number> {
  if (CFG.SIMULATION_MODE || !CFG.VAULT_ADDRESS) {
    return getVaultBalanceFromDatabase(subclub_id, user_id);
  }
  
  if (!userAddress) {
    throw new Error('User address required for contract balance lookup');
  }
  
  return getVaultBalanceFromContract(userAddress);
}
