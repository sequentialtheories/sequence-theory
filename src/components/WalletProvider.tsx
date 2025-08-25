import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface WalletInfo {
  address: string;
  network: string;
  email: string;
}

interface WalletContextType {
  wallet: WalletInfo | null;
  loading: boolean;
  error: string | null;
  refetchWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  loading: true,
  error: null,
  refetchWallet: async () => {},
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
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = async () => {
    if (!user) {
      setWallet(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Only fetch existing wallet data from database - no automatic creation
      const { data, error: fetchError } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching wallet:', fetchError);
        setError('Failed to fetch wallet information');
      } else if (data) {
        setWallet({
          address: data.wallet_address,
          network: data.network,
          email: data.email || user.email!,
        });
      } else {
        // No wallet found - this is handled by AutoWalletBootstrapper
        console.log('No wallet found for user, AutoWalletBootstrapper will handle creation');
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
  }, [user]);

  const refetchWallet = async () => {
    await fetchWallet();
  };

  return (
    <WalletContext.Provider value={{ wallet, loading, error, refetchWallet }}>
      {children}
    </WalletContext.Provider>
  );
};