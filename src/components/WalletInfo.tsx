import { useState } from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { useAddFundsModal } from '@0xsequence/react-checkout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Wallet, Copy, CheckCircle, Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const WalletInfo = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // Wagmi hooks for wallet connection
  const { connect, connectors } = useConnect();
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  
  // Sequence checkout for adding funds
  const { triggerAddFunds } = useAddFundsModal();

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast({
        title: "Address copied!",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnect = () => {
    const sequenceConnector = connectors.find(c => c.name.includes('Sequence'));
    if (sequenceConnector) {
      connect({ connector: sequenceConnector });
    }
  };

  const handleAddFunds = () => {
    if (address) {
      triggerAddFunds({
        walletAddress: address,
      });
    }
  };

  // Not connected state
  if (!isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Your Wallet
          </CardTitle>
          <CardDescription>
            Connect your Sequence wallet to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleConnect} className="w-full">
            <Wallet className="h-4 w-4 mr-2" />
            Connect Sequence Wallet
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            New to crypto? Don't worry - Sequence will create a wallet for you automatically!
          </p>
        </CardContent>
      </Card>
    );
  }

  // Connected state
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Your Sequence Wallet
        </CardTitle>
        <CardDescription>
          Connected and ready to use
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Network</Label>
          <div className="mt-1">
            <Badge variant="outline" className="capitalize">
              {chain?.name || 'Unknown'}
            </Badge>
          </div>
        </div>
        
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Wallet Address</Label>
          <div className="mt-1 flex items-center gap-2">
            <code className="flex-1 p-2 bg-muted rounded text-sm font-mono break-all">
              {address}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={copyAddress}
              className="shrink-0"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span className="text-xs text-green-600">Wallet connected successfully</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleAddFunds} variant="outline" className="flex-1">
            <Plus className="h-4 w-4 mr-2" />
            Add Funds
          </Button>
          <Button onClick={() => disconnect()} variant="outline" className="flex-1">
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};