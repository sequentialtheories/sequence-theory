import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Wallet, Copy, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface UserWallet {
  id: string;
  wallet_address: string;
  network: string;
  created_at: string;
}

export const WalletInfo = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWallet();
    }
  }, [user]);

  const fetchWallet = async () => {
    try {
      const { data, error } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching wallet:', error);
        return;
      }

      setWallet(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = async () => {
    if (wallet?.wallet_address) {
      await navigator.clipboard.writeText(wallet.wallet_address);
      setCopied(true);
      toast({
        title: "Address copied!",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Your Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading wallet information...</p>
        </CardContent>
      </Card>
    );
  }

  if (!wallet) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Your Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-2 text-orange-600 mb-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Creating your Sequence wallet...</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              This usually takes a few moments. Your wallet will appear automatically.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              size="sm"
            >
              Check Status
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if wallet is still pending
  const isPending = wallet.wallet_address.startsWith('pending_');

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Your Sequence Wallet
        </CardTitle>
        {!isPending && (
          <CardDescription>
            Created on {new Date(wallet.created_at).toLocaleDateString()}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Network</Label>
          <div className="mt-1">
            <Badge variant="outline" className="capitalize">
              {wallet.network}
            </Badge>
          </div>
        </div>
        
        {isPending ? (
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-2 text-orange-600 mb-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Creating your Sequence wallet...</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Your wallet is being processed. This usually takes a few moments.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              size="sm"
            >
              Check Status
            </Button>
          </div>
        ) : (
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Wallet Address</Label>
            <div className="mt-1 flex items-center gap-2">
              <code className="flex-1 p-2 bg-muted rounded text-sm font-mono break-all">
                {wallet.wallet_address}
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
              <span className="text-xs text-green-600">Wallet ready</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};