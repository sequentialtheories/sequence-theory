import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, Key, Download, Unlink, Info, Eye } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useWallet } from '@/components/WalletProvider';
import { exportUserKeys, disconnectWallet, getPrivateKeyForDisplay } from '@/lib/sequenceWaas';
import { useToast } from '@/hooks/use-toast';
import { PrivateKeyViewer } from '@/components/PrivateKeyViewer';

export const NonCustodialWalletManager = () => {
  const { user } = useAuth();
  const { wallet, refetchWallet } = useWallet();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showPrivateKeyViewer, setShowPrivateKeyViewer] = useState(false);

  const handleExportKeys = async () => {
    setIsExporting(true);
    try {
      const result = await exportUserKeys();
      if (result.success) {
        toast({
          title: "Key Export Information",
          description: result.message,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Failed to export keys",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDisconnectWallet = async () => {
    if (!user) return;
    
    setIsDisconnecting(true);
    try {
      const result = await disconnectWallet(user.id);
      if (result.success) {
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet reference has been removed. You maintain full control of your keys.",
        });
        await refetchWallet();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Disconnect Failed",
        description: error instanceof Error ? error.message : "Failed to disconnect wallet",
        variant: "destructive"
      });
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (!wallet) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Non-Custodial Wallet
          </CardTitle>
          <CardDescription>
            No wallet connected. Create a wallet to get started.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Non-Custodial Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Non-Custodial Wallet Status
          </CardTitle>
          <CardDescription>
            Your wallet is fully non-custodial. You maintain complete control over your private keys.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Wallet Type:</span>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Non-Custodial
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Private Key Control:</span>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              User Controlled
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Network:</span>
            <Badge variant="outline">{wallet.network}</Badge>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> We only store your public wallet address for reference. 
              Your private keys remain under your full control at all times. This ensures our service 
              is legally non-custodial.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Wallet Information */}
      <Card>
        <CardHeader>
          <CardTitle>Wallet Details</CardTitle>
          <CardDescription>
            Public information about your wallet (no private data stored)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Public Address</label>
            <div className="font-mono text-sm bg-muted p-2 rounded mt-1 break-all">
              {wallet.address}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Network</label>
              <div className="text-sm font-medium mt-1">{wallet.network}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email Reference</label>
              <div className="text-sm font-medium mt-1">{wallet.email}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Key Management
          </CardTitle>
          <CardDescription>
            Manage your private keys and wallet connection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your private keys are managed by Sequence's non-custodial infrastructure. 
              You have full control and access to your keys at all times.
            </AlertDescription>
          </Alert>

          <Separator />

          <div className="space-y-3">
            <Button 
              variant="outline" 
              onClick={() => setShowPrivateKeyViewer(true)} 
              className="w-full justify-start text-orange-600 hover:text-orange-700 border-orange-200 hover:border-orange-300"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Private Key (Secure Display)
            </Button>

            <Button 
              variant="outline" 
              onClick={handleExportKeys} 
              disabled={isExporting}
              className="w-full justify-start"
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? 'Checking Export Options...' : 'Key Export Information'}
            </Button>

            <Button 
              variant="outline" 
              onClick={handleDisconnectWallet} 
              disabled={isDisconnecting}
              className="w-full justify-start text-destructive hover:text-destructive"
            >
              <Unlink className="mr-2 h-4 w-4" />
              {isDisconnecting ? 'Disconnecting...' : 'Disconnect Wallet Reference'}
            </Button>
          </div>
          
          <PrivateKeyViewer
            isOpen={showPrivateKeyViewer}
            onClose={() => setShowPrivateKeyViewer(false)}
            walletAddress={wallet.address}
            onViewPrivateKey={getPrivateKeyForDisplay}
          />

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Legal Compliance:</strong> This service is non-custodial as we never store, 
              access, or control your private keys. You maintain full ownership and control of your 
              cryptocurrency assets at all times.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};