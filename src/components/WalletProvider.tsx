import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { useAccount } from 'wagmi';
import { upsertUserWallet } from '@/lib/wallet-utils';
import { supabase } from '@/integrations/supabase/client';

interface WalletInfo {
  address: string;
  network: string;
}

interface WalletContextType {
  wallet: WalletInfo | null;
  loading: boolean;
  error: string | null;
  refetchWallet: () => Promise<void>;
  isConnected: boolean;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  loading: true,
  error: null,
  refetchWallet: async () => {},
  isConnected: false,
});

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { address, isConnected } = useAccount();
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Store wallet when connected via Sequence Connect
  useEffect(() => {
    if (user && address && isConnected && !wallet) {
      const storeConnectedWallet = async () => {
        try {
          console.log('Storing connected wallet:', address);
          const result = await upsertUserWallet(user.id, address, 'polygon');
          
          if (result.success) {
            setWallet({
              address,
              network: 'polygon',
            });
          }
        } catch (error) {
          console.error('Error storing connected wallet:', error);
        }
      };

      storeConnectedWallet();
    }
  }, [user, address, isConnected, wallet]);

  const fetchWallet = async () => {
    if (!user) {
      setWallet(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check if there's a connected wallet first
      if (address && isConnected) {
        setWallet({
          address,
          network: 'polygon',
        });
        setLoading(false);
        return;
      }

      // Otherwise fetch from database
      const { data, error: fetchError } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching wallet:', fetchError);
        setError('Failed to fetch wallet information');
      } else if (data) {
        setWallet({
          address: data.wallet_address,
          network: data.network,
        });
      } else {
        setWallet(null);
      }
    } catch (err) {
      console.error('Unexpected error fetching wallet:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [user, address, isConnected]);

  const refetchWallet = async () => {
    await fetchWallet();
  };

  return (
    <WalletContext.Provider value={{ wallet, loading, error, refetchWallet, isConnected }}>
      {children}
    </WalletContext.Provider>
  );
};