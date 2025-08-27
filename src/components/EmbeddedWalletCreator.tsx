import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { useWallet } from './WalletProvider';
import { signInWithSequence, submitOtpCode } from '@/lib/sequenceWaas';
import { upsertUserWallet } from '@/lib/wallet-utils';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Wallet, Loader2, Shield } from 'lucide-react';

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
  const [needsOtp, setNeedsOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpResolver, setOtpResolver] = useState<((code: string) => Promise<void>) | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Automatically create wallet for authenticated users without one
  useEffect(() => {
    if (!user?.email || walletLoading || wallet || creatingWallet || needsOtp) return;

    const createEmbeddedWallet = async () => {
      try {
        setCreatingWallet(true);
        console.log('Creating embedded wallet for user:', user.email);
        
        const result = await signInWithSequence(user.email);
        
        if (result.success && result.wallet) {
          // Check if OTP is needed
          if (result.otpResolver) {
            setOtpResolver(result.otpResolver);
            setWalletAddress(result.wallet);
            setNeedsOtp(true);
            setCreatingWallet(false);
          } else {
            // No OTP needed, complete wallet creation
            await completeWalletCreation(result.wallet);
          }
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
  }, [user, wallet, walletLoading, creatingWallet, needsOtp, refetchWallet, toast]);

  const completeWalletCreation = async (address: string) => {
    try {
      // Store wallet address in database
      const upsertResult = await upsertUserWallet(user!.id, address, 'amoy', user!.email);
      
      if (upsertResult.success) {
        await refetchWallet();
        setCreatingWallet(false);
        setNeedsOtp(false);
        
        toast({
          title: "Wallet Created Successfully",
          description: "Your secure embedded wallet has been created and is ready to use!",
        });
      } else {
        throw new Error(upsertResult.error || 'Failed to store wallet');
      }
    } catch (error) {
      console.error('Error completing wallet creation:', error);
      setCreatingWallet(false);
      setNeedsOtp(false);
      
      toast({
        title: "Wallet Creation Failed", 
        description: "Failed to complete wallet setup. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOtpSubmit = async () => {
    if (!otpCode || !otpResolver || !walletAddress) return;

    try {
      setCreatingWallet(true);
      const result = await submitOtpCode(otpResolver, otpCode);
      
      if (result.success) {
        await completeWalletCreation(walletAddress);
      } else {
        toast({
          title: "OTP Verification Failed",
          description: result.error || "Invalid OTP code. Please try again.",
          variant: "destructive",
        });
        setCreatingWallet(false);
      }
    } catch (error) {
      console.error('Error submitting OTP:', error);
      setCreatingWallet(false);
      
      toast({
        title: "OTP Verification Failed",
        description: "Failed to verify OTP code. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show OTP input if needed
  if (needsOtp && !creatingWallet) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>Verify Your Email</span>
          </CardTitle>
          <CardDescription>
            Please enter the verification code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter 6-digit code"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              maxLength={6}
              className="text-center text-lg tracking-wider"
            />
          </div>
          <Button 
            onClick={handleOtpSubmit}
            disabled={otpCode.length !== 6}
            className="w-full"
          >
            Verify & Create Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show loading state while creating wallet
  if (creatingWallet) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Wallet className="h-5 w-5 text-primary" />
            <span>Creating Your Wallet</span>
          </CardTitle>
          <CardDescription>
            Setting up your secure embedded wallet...
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
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