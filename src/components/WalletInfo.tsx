import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Wallet, Copy, CheckCircle, Loader2, Clock, AlertCircle } from 'lucide-react';
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

  useEffect(() => {
    if (user) {
      fetchWallet();
      // Set up real-time updates
      const interval = setInterval(fetchWallet, 3000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchWallet = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

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
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-muted-foreground">Setting up your wallet...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if wallet is pending
  const isPending = wallet?.wallet_address?.startsWith('pending_');
  const hasError = wallet?.wallet_config?.error;

  // No wallet exists yet - wallet is being created
  if (!wallet) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Setting Up Your Wallet
          </CardTitle>
          <CardDescription>
            Your wallet is being created automatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Creating wallet for {user.email}...</span>
          </div>
          <p className="text-sm text-muted-foreground">
            This happens automatically when you sign up. Please wait a moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Wallet is pending
  if (isPending) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            Wallet Creation Pending
          </CardTitle>
          <CardDescription>
            Your wallet creation is in progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm">Wallet creation is pending for {user.email}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Please visit your profile page to retry wallet creation if this persists.
          </p>
          {hasError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Error:</strong> {wallet.wallet_config.error}
              </p>
            </div>
          )}
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
          Your Wallet
        </CardTitle>
        <CardDescription>
          Auto-created on {new Date(wallet.created_at).toLocaleDateString()}
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
            <span className="text-xs text-green-600">Wallet ready to use</span>
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