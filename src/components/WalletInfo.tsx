
import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Wallet, Copy, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface UserWallet {
  id: string;
  wallet_address: string;
  network: string;
  created_at: string;
  wallet_config: any;
}

export const WalletInfo = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);

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
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error fetching wallet:', error);
        return;
      }

      // Set the first wallet if any exist, otherwise null
      setWallet(data && data.length > 0 ? data[0] : null);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createWallet = async () => {
    setCreating(true);
    try {
      console.log('Creating wallet for user:', user?.id);
      const { data, error } = await supabase.functions.invoke('create-wallet', {
        body: { user_id: user?.id },
      });

      console.log('Create wallet response:', { data, error });
      if (error) throw error;

      if (data.success) {
        toast({
          title: "Success",
          description: data.message || "Wallet connected successfully!",
        });
        
        // Refresh wallet info
        await fetchWallet();
      } else {
        throw new Error(data.error || 'Failed to connect wallet');
      }
    } catch (error) {
      console.error('Error creating wallet:', error);
      toast({
        title: "Error",
        description: `Failed to connect wallet: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setCreating(false);
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
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-muted-foreground">Loading wallet information...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No wallet exists yet
  if (!wallet) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Your Wallet
          </CardTitle>
          <CardDescription>
            Connect to your secure Sequence wallet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={createWallet} disabled={creating} className="w-full">
            {creating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Connecting Wallet...
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Check if wallet is still pending
  const isPending = wallet.wallet_address.startsWith('pending_');
  
  if (isPending) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Connection
          </CardTitle>
          <CardDescription>
            There seems to be an issue with your wallet connection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Wallet connection incomplete</span>
          </div>
          <Button onClick={createWallet} disabled={creating} className="w-full">
            {creating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Reconnecting...
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                Reconnect Wallet
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Wallet is ready
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Your Sequence Wallet
        </CardTitle>
        <CardDescription>
          Connected on {new Date(wallet.created_at).toLocaleDateString()}
        </CardDescription>
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
            <span className="text-xs text-green-600">Wallet connected</span>
          </div>
        </div>

        {wallet.wallet_config?.email && (
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Linked Email</Label>
            <div className="mt-1 text-sm text-muted-foreground">
              {wallet.wallet_config.email}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
