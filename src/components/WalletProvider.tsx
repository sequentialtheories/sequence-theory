import { createContext, useContext } from 'react';
import { useSequenceWallet } from '@/hooks/useSequenceWallet';

interface WalletInfo {
  address: string;
  network: string;
  isConnected: boolean;
}

interface WalletContextType {
  wallet: WalletInfo | null;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  loading: false,
  error: null,
  signIn: async () => {},
  signOut: async () => {},
  signMessage: async () => '',
});

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const walletState = useSequenceWallet();

  return (
    <WalletContext.Provider value={walletState}>
      {children}
    </WalletContext.Provider>
  );
};