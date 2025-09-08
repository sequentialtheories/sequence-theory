import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TurnkeyWallet {
  wallet_address: string;
  sub_org_id: string;
  provider: string;
  provenance: string;
  network: string;
}

interface UseTurnkeyWalletReturn {
  wallet: TurnkeyWallet | null;
  loading: boolean;
  error: string | null;
  createWallet: () => Promise<void>;
  refreshWallet: () => Promise<void>;
}

export const useTurnkeyWallet = (): UseTurnkeyWalletReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<TurnkeyWallet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserWallet = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'turnkey')
        .maybeSingle();

      if (error) {
        console.error('Error fetching wallet:', error);
        setError('Failed to fetch wallet');
        return;
      }

      if (data) {
        setWallet({
          wallet_address: data.wallet_address,
          sub_org_id: data.turnkey_sub_org_id || '',
          provider: data.provider,
          provenance: data.provenance,
          network: data.network
        });
      }
    } catch (err) {
      console.error('Error fetching wallet:', err);
      setError('Failed to fetch wallet');
    }
  };

  const createWallet = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    if (wallet) {
      console.log('User already has a wallet:', wallet.wallet_address);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Creating Turnkey wallet for user:', user.id);

      const { data, error } = await supabase.functions.invoke('create-turnkey-wallet', {
        body: { user_id: user.id }
      });

      console.log('Turnkey function response:', { data, error });

      if (error) {
        console.error('Supabase function error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        setError(`Failed to create wallet: ${error.message || 'Unknown error'}`);
        toast({
          title: "Wallet Creation Failed",
          description: `Error: ${error.message || 'Unknown error'}`,
          variant: "destructive",
        });
        return;
      }

      if (data?.success) {
        const newWallet = {
          wallet_address: data.wallet_address,
          sub_org_id: data.sub_org_id,
          provider: 'turnkey',
          provenance: 'turnkey_embedded',
          network: 'ethereum'
        };
        
        setWallet(newWallet);
        console.log('Wallet created successfully:', data.wallet_address);
        
        toast({
          title: "Wallet Created",
          description: "Your embedded wallet has been created successfully!",
        });
      }
    } catch (err) {
      console.error('Error creating wallet:', err);
      setError('Failed to create wallet');
      toast({
        title: "Wallet Creation Failed",
        description: "There was an error creating your wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshWallet = async () => {
    await fetchUserWallet();
  };

  // Auto-create wallet when user becomes available (after email verification)
  useEffect(() => {
    if (user?.id && user?.email_confirmed_at && !wallet && !loading) {
      console.log('User confirmed email, auto-creating wallet...');
      createWallet();
    }
  }, [user?.id, user?.email_confirmed_at, wallet, loading]);

  // Fetch existing wallet on mount
  useEffect(() => {
    if (user?.id) {
      fetchUserWallet();
    }
  }, [user?.id]);

  return {
    wallet,
    loading,
    error,
    createWallet,
    refreshWallet
  };
};