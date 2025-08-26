import { useWallet } from './WalletProvider';
import { useAuth } from './AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, CheckCircle2, Clock } from 'lucide-react';

/**
 * Shows embedded wallet status - displays wallet info when available
 * No manual connection options since wallets are created automatically
 */
export const WalletConnectionStatus = () => {
  const { user } = useAuth();
  const { wallet, loading } = useWallet();

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-gray-400" />
            <span>Authentication Required</span>
          </CardTitle>
          <CardDescription>
            Please sign in to access your embedded wallet
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
            <Clock className="h-5 w-5 text-blue-600 animate-pulse" />
            <span>Loading Wallet...</span>
          </CardTitle>
          <CardDescription>
            Checking your embedded wallet status
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (wallet) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span>Embedded Wallet Active</span>
          </CardTitle>
          <CardDescription>
            Your secure embedded wallet is ready for transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 mb-2">
              <strong>Wallet Address:</strong>
            </p>
            <p className="font-mono text-xs text-green-700 break-all">
              {wallet.address}
            </p>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Network:</strong> {wallet.network}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-orange-600" />
          <span>Wallet Being Created</span>
        </CardTitle>
        <CardDescription>
          Your embedded wallet is being set up automatically
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          A secure wallet will be created for your account. This happens automatically and requires no external wallet connections.
        </p>
      </CardContent>
    </Card>
  );
};