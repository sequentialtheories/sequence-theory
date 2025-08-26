import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { useWallet } from './WalletProvider';
import { getOrCreateSequenceWallet } from '@/lib/sequenceWaas';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Loader2 } from 'lucide-react';

/**
 * EmbeddedWalletCreator handles automatic creation of Sequence embedded wallets
 * for authenticated users. It creates a non-custodial wallet tied to the user's email
 * with a one-time OTP verification for key security.
 */
export const EmbeddedWalletCreator = () => {
  const { user } = useAuth();
  const { wallet, loading: walletLoading, refetchWallet } = useWallet();
  const { toast } = useToast();
  
  const [creatingWallet, setCreatingWallet] = useState(false);

  // Automatically create wallet for authenticated users without one
  useEffect(() => {
    if (!user?.email || walletLoading || wallet || creatingWallet) return;

    const createEmbeddedWallet = async () => {
      try {
        setCreatingWallet(true);
        console.log('Creating embedded wallet for user:', user.email);
        
        const result = await getOrCreateSequenceWallet(user.id, user.email);
        
        if (result.success && result.walletAddress) {
          // Wallet created successfully
          console.log('Embedded wallet created:', result.walletAddress);
          await refetchWallet();
          setCreatingWallet(false);
          
          toast({
            title: "Wallet Created Successfully",
            description: "Your secure embedded wallet has been created and is ready to use!",
          });
        } else if (result.error) {
          console.error('Error creating wallet:', result.error);
          setCreatingWallet(false);
          
          toast({
            title: "Wallet Creation Failed",
            description: result.error,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error creating embedded wallet:', error);
        setCreatingWallet(false);
        
        toast({
          title: "Wallet Creation Failed",
          description: "There was an issue creating your wallet. Please try again.",
          variant: "destructive",
        });
      }
    };

    createEmbeddedWallet();
  }, [user, wallet, walletLoading, creatingWallet, refetchWallet, toast]);

  // Show loading state while creating wallet
  if (creatingWallet) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Wallet className="h-5 w-5 text-blue-600" />
            <span>Creating Your Wallet</span>
          </CardTitle>
          <CardDescription>
            Setting up your secure embedded wallet...
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-sm text-muted-foreground mt-4">
            This may take a few moments
          </p>
        </CardContent>
      </Card>
    );
  }

  // Don't render anything if user has a wallet or is not authenticated
  if (!user || wallet) {
    return null;
  }

  return null;
};