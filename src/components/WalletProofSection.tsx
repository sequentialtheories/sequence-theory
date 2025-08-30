import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWallet } from '@/components/WalletProvider';
import { Copy, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const WalletProofSection = () => {
  const { wallet } = useWallet();
  const { toast } = useToast();

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: `${label} copied to clipboard`
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  if (!wallet) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Message Signing (Development)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-amber-700 dark:text-amber-300">Feature In Development</p>
              <p className="text-amber-600 dark:text-amber-400">
                Real cryptographic message signing is not yet implemented. This feature will be available 
                once the Sequence WaaS integration is fully configured with proper signing capabilities.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Your Wallet Address</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                value={wallet.address}
                readOnly
                className="font-mono text-sm bg-muted"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(wallet.address, 'Wallet address')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Network: {wallet.network.toUpperCase()}
            </p>
          </div>

          <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/50 rounded-md">
            <p><strong>When implemented, you'll be able to:</strong></p>
            <p>• Sign messages with your wallet's private key</p>
            <p>• Prove ownership without exposing sensitive information</p>
            <p>• Create verifiable signatures for authentication</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};