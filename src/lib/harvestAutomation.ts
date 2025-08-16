import { CFG } from './config';
import { sequenceWaas, sendSequenceTransaction } from './sequenceWaas';
import { getVault } from './contracts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const HARVEST_COOLDOWN_LOCAL_MS = 10 * 60 * 1000; // 10 minutes local
const HARVEST_COOLDOWN_GLOBAL_MS = 6 * 60 * 60 * 1000; // 6 hours global
const HARVEST_LOCK_KEY = 'tvc_harvest_lock';
const HARVEST_LAST_KEY = 'tvc_harvest_last';
const MIN_PROFIT_USD = 25; // Minimum $25 profit
const GAS_PROFIT_RATIO = 10; // Profit must be 10x gas cost

export async function runHarvestIfEligible(): Promise<boolean> {
  if (CFG.SIMULATION_MODE || !CFG.FEATURE_TESTNET_ONLY) {
    return false;
  }

  const lastHarvest = Number(localStorage.getItem(HARVEST_LAST_KEY) || '0');
  if (Date.now() - lastHarvest < HARVEST_COOLDOWN_LOCAL_MS) {
    return false;
  }

  const lockTime = Number(localStorage.getItem(HARVEST_LOCK_KEY) || '0');
  if (Date.now() - lockTime < HARVEST_COOLDOWN_LOCAL_MS) {
    return false;
  }

  try {
    localStorage.setItem(HARVEST_LOCK_KEY, String(Date.now()));

    const vault = getVault();
    
    try {
      const signer = await sequenceWaas.getAddress();
      if (signer) {
        const canHarvest = await vault.canHarvest(signer);
        if (!canHarvest) {
          console.log('Harvest not authorized for current signer');
          return false;
        }
      }
    } catch (error) {
      console.log('canHarvest method not available, proceeding to dry-run');
    }

    try {
      const lastHarvestTimestamp = await vault.lastHarvest();
      const lastHarvestMs = Number(lastHarvestTimestamp) * 1000;
      if (Date.now() - lastHarvestMs < HARVEST_COOLDOWN_GLOBAL_MS) {
        console.log('Global harvest cooldown active');
        return false;
      }
    } catch (error) {
      try {
        const { data: lastTx } = await supabase
          .from('tx_ledger')
          .select('created_at')
          .eq('kind', 'HARVEST')
          .eq('status', 'APPLIED')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (lastTx) {
          const lastHarvestMs = new Date(lastTx.created_at).getTime();
          if (Date.now() - lastHarvestMs < HARVEST_COOLDOWN_GLOBAL_MS) {
            console.log('Global harvest cooldown active (from database)');
            return false;
          }
        }
      } catch (dbError) {
        console.log('Could not check global cooldown, proceeding');
      }
    }

    let gasEstimate: bigint;
    try {
      await vault.harvestAndRoute.staticCall();
      gasEstimate = await vault.harvestAndRoute.estimateGas();
    } catch (error) {
      console.log('Harvest dry-run failed - not profitable or not allowed:', error);
      return false;
    }

    try {
      const provider = vault.runner?.provider;
      if (!provider || !('getGasPrice' in provider)) throw new Error('Provider not available');
      
      const gasPrice = await (provider as { getGasPrice(): Promise<bigint> }).getGasPrice();
      const gasCostWei = gasEstimate * gasPrice;
      const gasCostEth = Number(gasCostWei) / 1e18;
      
      const ethUsdPrice = 2000; // Approximate - in production use price feed
      const gasCostUsd = gasCostEth * ethUsdPrice;
      
      console.log(`Estimated gas cost: $${gasCostUsd.toFixed(2)}`);
      
      if (gasCostUsd > MIN_PROFIT_USD / 2) {
        console.log('Gas cost too high relative to expected profit');
        return false;
      }
    } catch (error) {
      console.log('Could not estimate gas cost, proceeding with dry-run only');
    }

    const harvestTx = {
      to: CFG.VAULT_ADDRESS,
      data: vault.interface.encodeFunctionData('harvestAndRoute'),
      value: '0'
    };

    toast({
      title: "Harvest in progress",
      description: "Submitting harvest transaction...",
    });

    const result = await sendSequenceTransaction([harvestTx]);
    
    if (!result.success) {
      throw new Error(result.error || 'Transaction failed');
    }

    const txHash = (result.transaction as { txHash?: string })?.txHash;
    if (!txHash) {
      throw new Error('Transaction hash not available');
    }
    
    await updateHarvestDatabase(txHash);
    
    localStorage.setItem(HARVEST_LAST_KEY, String(Date.now()));
    
    toast({
      title: "Harvest successful",
      description: `TX: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`,
    });

    return true;

  } catch (error) {
    console.error('Harvest failed:', error);
    if (error instanceof Error && !error.message.includes('not authorized')) {
      toast({
        title: "Harvest skipped",
        description: "Not profitable or network issue",
      });
    }
    return false;
  } finally {
    localStorage.removeItem(HARVEST_LOCK_KEY);
  }
}

async function updateHarvestDatabase(txHash: string): Promise<void> {
  const authHeader = `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`;
  const apiKey = 'vault-club-test-key';
  const idempotencyKey = `harvest-global-${Date.now()}`;

  const response = await fetch(`https://qldjhlnsphlixmzzrdwi.supabase.co/functions/v1/vault-harvest`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'x-vault-club-api-key': apiKey,
      'x-idempotency-key': idempotencyKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      subclub_id: 'global', // Vault-level, not per-subclub
      tx_hash: txHash
    })
  });

  if (!response.ok) {
    throw new Error(`Database update failed: ${response.statusText}`);
  }
}
