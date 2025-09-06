import { useWallet } from './WalletProvider';
import { useAuth } from './AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Shows embedded wallet status - displays wallet info when available
 * No manual connection options since wallets are created automatically
 */
export const WalletConnectionStatus = () => {
  const { user } = useAuth();
  const { wallet, loading, error, signIn } = useWallet();

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-muted-foreground" />
            <span>Embedded Wallet</span>
          </CardTitle>
          <CardDescription>
            Sign in to access your embedded wallet
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-muted-foreground animate-spin" />
            <span>Loading Wallet...</span>
          </CardTitle>
          <CardDescription>
            Setting up your embedded wallet securely
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error && !wallet) {
    return (
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            <span>Wallet Setup Required</span>
          </CardTitle>
          <CardDescription>
            There was an issue setting up your wallet automatically
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {error}
            </p>
            <Button onClick={signIn} variant="outline" className="w-full">
              Connect Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (wallet) {
    return (
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <span>Embedded Wallet Active</span>
          </CardTitle>
          <CardDescription>
            Your non-custodial wallet is ready
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium">Address</p>
              <p className="text-xs font-mono text-muted-foreground break-all">
                {wallet.address}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Network</p>
              <p className="text-xs text-muted-foreground">
                {wallet.network.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Provider</p>
              <p className="text-xs text-muted-foreground">
                Sequence WaaS (Non-custodial)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wallet className="h-5 w-5 text-muted-foreground" />
          <span>Wallet Being Created</span>
        </CardTitle>
        <CardDescription>
          Your embedded wallet is being set up in the background
        </CardDescription>
      </CardHeader>
    </Card>
  );
};