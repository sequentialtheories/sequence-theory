import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { getOrCreateWallet } from '@/lib/sequenceWaas';

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

      // Try to get or create wallet
      const result = await getOrCreateWallet(user.id, user.email!);
      // If wallet creation failed, handle error early
      if ('error' in result) {
        console.error('Failed to get or create wallet:', result.error);
        setError(result.error || 'Failed to create wallet');
        return;
      }

      // Fetch the wallet data from database
      const { data, error: fetchError } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching wallet after creation:', fetchError);
        setError('Failed to fetch wallet information');
      } else if (data) {
        setWallet({
          address: data.wallet_address,
          network: data.network,
          email: data.email || user.email!,
        });
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