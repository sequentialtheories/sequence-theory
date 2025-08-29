import { createContext, useContext } from 'react';
import { useSequenceWallet } from '@/hooks/useSequenceWallet';

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
  createWallet: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  loading: true,
  error: null,
  refetchWallet: async () => {},
  isConnected: false,
  createWallet: async () => {},
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
  const { 
    wallet: sequenceWallet, 
    loading, 
    error, 
    createWallet, 
    refetchWallet,
    signMessage
  } = useSequenceWallet();

  const wallet = sequenceWallet ? {
    address: sequenceWallet.address,
    network: sequenceWallet.network,
  } : null;

  const isConnected = !!wallet;

  return (
    <WalletContext.Provider value={{ 
      wallet, 
      loading, 
      error, 
      refetchWallet, 
      isConnected,
      createWallet,
      signMessage
    }}>
      {children}
    </WalletContext.Provider>
  );
};