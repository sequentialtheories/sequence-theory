import { useAccount, useDisconnect } from 'wagmi';
import { useOpenConnectModal } from '@0xsequence/connect';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, ExternalLink } from 'lucide-react';

/**
 * Shows current Sequence Web SDK wallet connection status
 * and allows users to connect/disconnect manually
 */
export const WalletConnectionStatus = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { setOpenConnectModal } = useOpenConnectModal();

  if (isConnected && address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-green-600" />
            <span>Sequence Wallet Connected</span>
          </CardTitle>
          <CardDescription>
            Your Sequence embedded wallet is active and ready for transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 mb-2">
              <strong>Connected Address:</strong>
            </p>
            <p className="font-mono text-xs text-green-700 break-all">
              {address}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setOpenConnectModal(true)}
              size="sm"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Manage Wallet
            </Button>
            <Button 
              variant="outline" 
              onClick={() => disconnect()}
              size="sm"
            >
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wallet className="h-5 w-5 text-orange-600" />
          <span>No Wallet Connected</span>
        </CardTitle>
        <CardDescription>
          Connect your Sequence embedded wallet to manage assets and transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={() => setOpenConnectModal(true)}
          className="w-full"
        >
          <Wallet className="h-4 w-4 mr-2" />
          Connect Sequence Wallet
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Your wallet will be created automatically using your authenticated session
        </p>
      </CardContent>
    </Card>
  );
};