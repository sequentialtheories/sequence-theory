import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Copy, Check, Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useQuery } from '@tanstack/react-query';

interface VaultAddressDisplayProps {
  compact?: boolean;
}

export const VaultAddressDisplay = ({ compact = false }: VaultAddressDisplayProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Fetch wallet address from profile
  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['profile-wallet', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('eth_address, name, email')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    // Refetch every 5 seconds if wallet not provisioned yet
    refetchInterval: (data) => {
      if (!data?.eth_address) return 5000;
      return false;
    },
  });

  const walletAddress = profile?.eth_address;
  const isProvisioning = !walletAddress && !isLoading;

  const copyToClipboard = async () => {
    if (!walletAddress) return;
    
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy address to clipboard",
        variant: "destructive",
      });
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Compact version for headers/nav
  if (compact) {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Loading...</span>
        </div>
      );
    }

    if (isProvisioning) {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Provisioning vault...</span>
        </div>
      );
    }

    if (walletAddress) {
      return (
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 text-sm font-mono bg-secondary/50 px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors"
        >
          <Wallet className="h-3 w-3" />
          <span>{formatAddress(walletAddress)}</span>
          {copied ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <Copy className="h-3 w-3 opacity-50" />
          )}
        </button>
      );
    }

    return null;
  }

  // Full card version for profile/dashboard
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <span>Your Vault</span>
        </CardTitle>
        <CardDescription>
          Your secure, non-custodial Polygon wallet
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading wallet information...</span>
          </div>
        ) : isProvisioning ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <div>
                <p className="font-medium text-foreground">Provisioning vault...</p>
                <p className="text-sm text-muted-foreground">
                  Your secure wallet is being created automatically. This usually takes a few seconds.
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Your wallet will be ready momentarily. No action needed.
            </p>
          </div>
        ) : walletAddress ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Polygon Address</p>
                  <p className="font-mono text-sm">{formatAddress(walletAddress)}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Shield className="h-3 w-3" />
                Non-custodial
              </Badge>
              <Badge variant="outline" className="gap-1">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Polygon Network
              </Badge>
            </div>
            
            <p className="text-xs text-muted-foreground">
              This wallet is secured by Turnkey's enterprise-grade infrastructure. 
              Only you can authorize transactions.
            </p>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Unable to load wallet information. Please refresh the page or contact support.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VaultAddressDisplay;
