import { useTurnkeyWallet } from '@/hooks/useTurnkeyWallet';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export const TurnkeyWalletManager = () => {
  const { user } = useAuth();
  const { wallet, loading, error, createWallet } = useTurnkeyWallet();

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Wallet className="h-8 w-8 text-primary" />
        </div>
        <CardTitle>Your Embedded Wallet</CardTitle>
        <CardDescription>
          Automatically created for secure transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <div className="flex items-center justify-center space-x-2 p-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Creating wallet...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-destructive">{error}</span>
          </div>
        )}

        {wallet && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">Wallet ready</span>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Wallet Address:</div>
              <div className="text-xs font-mono bg-muted p-2 rounded break-all">
                {wallet.wallet_address}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Network:</div>
              <div className="text-sm text-muted-foreground capitalize">
                {wallet.network}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Provider:</div>
              <div className="text-sm text-muted-foreground capitalize">
                {wallet.provider} ({wallet.provenance.replace('_', ' ')})
              </div>
            </div>
          </div>
        )}

        {!wallet && !loading && !error && (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              No wallet found. Create one to get started.
            </p>
            <Button onClick={createWallet} className="w-full">
              Create Wallet
            </Button>
          </div>
        )}

        {error && !loading && (
          <Button onClick={createWallet} variant="outline" className="w-full">
            Retry
          </Button>
        )}
      </CardContent>
    </Card>
  );
};