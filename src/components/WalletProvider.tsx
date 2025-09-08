import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WalletContextType {
  walletAddress: string | null;
  subOrganizationId: string | null;
  isLoading: boolean;
  createWallet: () => Promise<void>;
  refreshWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [subOrganizationId, setSubOrganizationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createWallet = async () => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    if (walletAddress) {
      console.log('User already has a wallet:', walletAddress);
      return;
    }

    setIsLoading(true);
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
        const errorMessage = `Failed to create wallet: ${error.message || 'Unknown error'}`;
        toast({
          title: "Wallet Creation Failed",
          description: errorMessage,
          variant: "destructive",
        });
        throw new Error(errorMessage);
      }

      if (data?.success) {
        const { wallet_address, sub_org_id } = data;
        setWalletAddress(wallet_address);
        setSubOrganizationId(sub_org_id);
        
        // Store wallet info in localStorage for persistence
        localStorage.setItem('sequenceTheoryWallet', JSON.stringify({
          address: wallet_address,
          subOrganizationId: sub_org_id,
          userId: user.id,
        }));
        
        console.log('Wallet created successfully:', wallet_address);
        
        toast({
          title: "Wallet Created",
          description: "Your non-custodial wallet has been created successfully!",
        });
      } else {
        throw new Error('Wallet creation failed - no success response');
      }
    } catch (err) {
      console.error('Error creating wallet:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create wallet';
      toast({
        title: "Wallet Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshWallet = async () => {
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
        return;
      }

      if (data) {
        setWalletAddress(data.wallet_address);
        setSubOrganizationId(data.turnkey_sub_org_id);
        
        // Update localStorage
        localStorage.setItem('sequenceTheoryWallet', JSON.stringify({
          address: data.wallet_address,
          subOrganizationId: data.turnkey_sub_org_id,
          userId: user.id,
        }));
      }
    } catch (err) {
      console.error('Error refreshing wallet:', err);
    }
  };

  // Auto-create wallet when user becomes available (after email verification)
  useEffect(() => {
    if (user?.id && user?.email_confirmed_at && !walletAddress && !isLoading) {
      console.log('User confirmed email, auto-creating wallet...');
      createWallet().catch(console.error);
    }
  }, [user?.id, user?.email_confirmed_at, walletAddress, isLoading]);

  // Check for existing wallet on mount and fetch from DB
  useEffect(() => {
    if (user?.id) {
      // First check localStorage for quick load
      const stored = localStorage.getItem('sequenceTheoryWallet');
      if (stored) {
        try {
          const { address, subOrganizationId: subOrgId, userId } = JSON.parse(stored);
          if (userId === user.id) {
            setWalletAddress(address);
            setSubOrganizationId(subOrgId);
          }
        } catch (e) {
          console.error('Error parsing stored wallet:', e);
        }
      }
      
      // Then refresh from database
      refreshWallet();
    }
  }, [user?.id]);

  const contextValue: WalletContextType = {
    walletAddress,
    subOrganizationId,
    isLoading,
    createWallet,
    refreshWallet,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};