import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { sequenceWalletService } from '@/lib/sequenceWallet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, CheckCircle, AlertCircle, Clock, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const WalletManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  

  // Query wallet data
  const { data: wallet, isLoading, error } = useQuery({
    queryKey: ['user-wallet', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    refetchInterval: 10000 // Refetch every 10 seconds
  });

  // Query user profile for email
  const { data: profile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Mutation to create embedded wallet
  const createWalletMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !profile?.email) {
        throw new Error('Missing user ID or email');
      }

      console.log('🔄 Creating Sequence Embedded Wallet...');
      const result = await sequenceWalletService.createEmbeddedWallet(profile.email, user.id);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create wallet');
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-wallet'] });
      toast({
        title: 'Wallet Created Successfully',
        description: 'Your Sequence Embedded Wallet has been created and is ready to use.',
      });
    },
    onError: (error) => {
      console.error('❌ Wallet creation failed:', error);
      toast({
        title: 'Wallet Creation Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  });

  const getWalletStatus = () => {
    if (!wallet) return { status: 'none', color: 'secondary', icon: AlertCircle };
    
    if (wallet.wallet_address.startsWith('0x')) {
      return { status: 'active', color: 'default', icon: CheckCircle };
    }
    
    return { status: 'error', color: 'destructive', icon: AlertCircle };
  };

  const { status, color, icon: StatusIcon } = getWalletStatus();

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Please sign in to manage your wallet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <StatusIcon className="h-5 w-5" />
          Wallet Management
        </CardTitle>
        <CardDescription>
          Manage your Sequence wallet and check creation status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading wallet information...</span>
          </div>
        ) : error ? (
          <div className="text-destructive">
            Error loading wallet: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Status:</span>
              <Badge variant={color as any} className="capitalize">
                {status}
              </Badge>
            </div>

            {wallet && (
              <>
                <div className="space-y-2">
                  <span className="font-medium">Address:</span>
                  <code className="block p-2 bg-muted rounded text-sm break-all">
                    {wallet.wallet_address}
                  </code>
                </div>

                <div className="space-y-2">
                  <span className="font-medium">Network:</span>
                  <span className="capitalize">{wallet.network}</span>
                </div>

                {wallet.wallet_config && (
                  <div className="space-y-2">
                    <span className="font-medium">Configuration:</span>
                    <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                      {JSON.stringify(wallet.wallet_config, null, 2)}
                    </pre>
                  </div>
                )}
              </>
            )}

            <div className="flex gap-2 pt-4">
              {status === 'error' || status === 'none' ? (
                <Button
                  onClick={() => createWalletMutation.mutate()}
                  disabled={createWalletMutation.isPending}
                  className="flex items-center gap-2"
                >
                  {createWalletMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wallet className="h-4 w-4" />
                  )}
                  Create Embedded Wallet
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};