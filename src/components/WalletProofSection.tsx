import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWallet } from '@/components/WalletProvider';
import { Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const WalletProofSection = () => {
  const { wallet, signMessage } = useWallet();
  const { toast } = useToast();
  const [message, setMessage] = useState('I own this wallet and can prove it');
  const [signature, setSignature] = useState('');
  const [isSigningMessage, setIsSigningMessage] = useState(false);

  const handleSignMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Invalid Message",
        description: "Please enter a message to sign",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSigningMessage(true);
      const sig = await signMessage(message);
      setSignature(sig);
      toast({
        title: "Message Signed",
        description: "Your ownership proof has been generated successfully"
      });
    } catch (error) {
      toast({
        title: "Signing Failed",
        description: error instanceof Error ? error.message : "Failed to sign message",
        variant: "destructive"
      });
    } finally {
      setIsSigningMessage(false);
    }
  };

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
          <CheckCircle className="h-5 w-5 text-green-500" />
          Prove Wallet Ownership
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 p-4 rounded-lg border">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="font-medium">Non-Custodial Wallet Proof</p>
              <p className="text-muted-foreground">
                Your wallet is non-custodial, meaning you have full control over your private keys. 
                Use the signing feature below to prove ownership of your wallet address without exposing sensitive information.
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

          <div>
            <Label htmlFor="message" className="text-sm font-medium">
              Message to Sign
            </Label>
            <Input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message to prove ownership..."
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This message will be signed with your private key to prove ownership
            </p>
          </div>

          <Button
            onClick={handleSignMessage}
            disabled={isSigningMessage || !message.trim()}
            className="w-full"
          >
            {isSigningMessage ? "Signing..." : "Sign Message & Prove Ownership"}
          </Button>

          {signature && (
            <div>
              <Label className="text-sm font-medium">Ownership Proof (Signature)</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  value={signature}
                  readOnly
                  className="font-mono text-xs bg-muted"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(signature, 'Signature')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                This signature proves you control the private key for your wallet address
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};