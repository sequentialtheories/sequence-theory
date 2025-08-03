import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface WalletInfo {
  address: string;
  network: string;
  provider: string;
  autoCreated: boolean;
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

      const { data, error: fetchError } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // No wallet found, this is normal
          setWallet(null);
        } else {
          console.error('Error fetching wallet:', fetchError);
          setError('Failed to fetch wallet information');
        }
      } else if (data) {
        const walletConfig = data.wallet_config as any;
        setWallet({
          address: data.wallet_address,
          network: data.network,
          provider: walletConfig?.provider || 'unknown',
          autoCreated: walletConfig?.auto_created || false,
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