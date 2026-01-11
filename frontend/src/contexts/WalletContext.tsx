/**
 * WALLET CONTEXT
 * 
 * Provides non-custodial wallet functionality throughout the app.
 * 
 * SECURITY NOTICE:
 * - This wallet is 100% non-custodial
 * - Sequence Theory has NO access to your private keys
 * - Only YOU control your funds
 * - Your seed phrase is your ONLY backup - keep it safe!
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useNonCustodialWallet, UseNonCustodialWalletReturn } from '@/hooks/useNonCustodialWallet';

const WalletContext = createContext<UseNonCustodialWalletReturn | null>(null);

export const useWallet = (): UseNonCustodialWalletReturn => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const { session } = useAuth();
  const wallet = useNonCustodialWallet(session);

  return (
    <WalletContext.Provider value={wallet}>
      {children}
    </WalletContext.Provider>
  );
};
