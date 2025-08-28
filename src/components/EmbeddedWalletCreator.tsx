import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { useWallet } from './WalletProvider';
import { useOpenConnectModal } from '@0xsequence/connect';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Loader2 } from 'lucide-react';

/**
 * EmbeddedWalletCreator handles embedded wallet creation using Sequence Connect
 */
export const EmbeddedWalletCreator = () => {
  const { user } = useAuth();
  const { wallet, loading: walletLoading, isConnected } = useWallet();
  const { setOpenConnectModal } = useOpenConnectModal();
  const { toast } = useToast();
  
  const [showCreationPrompt, setShowCreationPrompt] = useState(false);

  // Show creation prompt for authenticated users without wallets
  useEffect(() => {
    if (user && !walletLoading && !wallet && !isConnected) {
      setShowCreationPrompt(true);
    } else {
      setShowCreationPrompt(false);
    }
  }, [user, wallet, walletLoading, isConnected]);

  // Success notification when wallet is created
  useEffect(() => {
    if (user && wallet && isConnected) {
      toast({
        title: "Wallet Connected Successfully",
        description: "Your secure embedded wallet is ready to use!",
      });
    }
  }, [user, wallet, isConnected, toast]);

  const handleCreateWallet = () => {
    console.log('Opening Sequence Connect modal for wallet creation');
    setOpenConnectModal(true);
  };

  // Show creation prompt if user needs a wallet
  if (showCreationPrompt) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Wallet className="h-5 w-5 text-primary" />
            <span>Create Your Wallet</span>
          </CardTitle>
          <CardDescription>
            Create a secure embedded wallet to get started with Vault Club
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            onClick={handleCreateWallet}
            className="w-full"
            size="lg"
          >
            Create Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
};