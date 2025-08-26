import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { useAccount, useDisconnect } from 'wagmi';
import { useOpenConnectModal } from '@0xsequence/connect';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * AutoWalletBootstrapper handles automatic wallet creation for users
 * It shows the Sequence connect modal automatically for users without wallets
 * and persists the wallet address to Supabase once connected
 */
export const AutoWalletBootstrapper = () => {
  const { user } = useAuth();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { setOpenConnectModal } = useOpenConnectModal();
  const { toast } = useToast();
  const [hasCheckedWallet, setHasCheckedWallet] = useState(false);
  const [userHasWallet, setUserHasWallet] = useState<boolean | null>(null);

  // Check if user already has a wallet in Supabase
  useEffect(() => {
    if (!user?.id || hasCheckedWallet) return;

    const checkExistingWallet = async () => {
      try {
        const { data, error } = await supabase
          .from('user_wallets')
          .select('wallet_address')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error checking existing wallet:', error);
        }

        setUserHasWallet(!!data?.wallet_address);
        setHasCheckedWallet(true);
      } catch (err) {
        console.error('Unexpected error checking wallet:', err);
        setHasCheckedWallet(true);
      }
    };

    checkExistingWallet();
  }, [user?.id, hasCheckedWallet]);

  // Remove auto-opening of connect modal - we'll handle wallet creation differently
  // No longer automatically opening the connect modal for users without wallets

  // Persist wallet to Supabase when connected
  useEffect(() => {
    if (!user?.id || !address || !isConnected || userHasWallet) return;

    const persistWallet = async () => {
      try {
        const { error } = await supabase
          .from('user_wallets')
          .upsert({
            user_id: user.id,
            wallet_address: address,
            network: 'amoy',
            email: user.email || null,
          }, {
            onConflict: 'user_id'
          });

        if (error) {
          console.error('Error persisting wallet:', error);
          toast({
            title: "Wallet Connection Issue",
            description: "Your wallet was connected but couldn't be saved. Please try again.",
            variant: "destructive",
          });
          return;
        }

        console.log('Wallet persisted successfully:', address);
        setUserHasWallet(true);
        
        toast({
          title: "Wallet Connected",
          description: "Your Sequence wallet has been created and connected successfully!",
        });

      } catch (err) {
        console.error('Unexpected error persisting wallet:', err);
        toast({
          title: "Connection Error",
          description: "Failed to save wallet connection. Please try again.",
          variant: "destructive",
        });
      }
    };

    persistWallet();
  }, [user?.id, address, isConnected, userHasWallet, toast]);

  // Debug logging
  useEffect(() => {
    console.log('AutoWalletBootstrapper state:', {
      hasUser: !!user,
      hasCheckedWallet,
      userHasWallet,
      isConnected,
      address
    });
  }, [user, hasCheckedWallet, userHasWallet, isConnected, address]);

  // This component doesn't render anything - it's just for side effects
  return null;
};