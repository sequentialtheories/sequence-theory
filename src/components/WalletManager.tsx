import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wallet, User } from 'lucide-react';

interface UserWallet {
  user_id: string;
  email: string;
  name: string;
  wallet_status: string;
  wallet_address?: string;
}

export const WalletManager = () => {
  const [users, setUsers] = useState<UserWallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          user_id,
          email,
          name,
          user_wallets!left(wallet_address)
        `);

      if (error) throw error;

      const usersWithWalletStatus = data.map(user => ({
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        wallet_status: Array.isArray(user.user_wallets) && user.user_wallets.length > 0 ? 'Has Wallet' : 'No Wallet',
        wallet_address: Array.isArray(user.user_wallets) && user.user_wallets.length > 0 ? user.user_wallets[0].wallet_address : undefined
      }));

      setUsers(usersWithWalletStatus);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createWalletForUser = async (userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-wallet', {
        body: { user_id: userId },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Wallet created successfully`,
      });

      // Refresh the user list
      fetchUsers();
    } catch (error) {
      console.error('Error creating wallet:', error);
      toast({
        title: "Error",
        description: `Failed to create wallet: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const fixMissingWallets = async () => {
    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke('fix-missing-wallets');

      if (error) throw error;

      toast({
        title: "Success",
        description: `Wallet creation process completed`,
      });

      // Refresh the user list
      fetchUsers();
    } catch (error) {
      console.error('Error fixing missing wallets:', error);
      toast({
        title: "Error",
        description: `Failed to fix missing wallets: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Manager - The Vault Club
        </CardTitle>
        <CardDescription>
          Manage user wallets and ensure all accounts have associated wallet addresses.
          The Vault Club service uses email/password login to automatically handle wallet transfers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button onClick={fetchUsers} disabled={loading} variant="outline">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <User className="h-4 w-4 mr-2" />}
            Load Users
          </Button>
          <Button onClick={fixMissingWallets} disabled={creating}>
            {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Wallet className="h-4 w-4 mr-2" />}
            Create Missing Wallets
          </Button>
        </div>

        {users.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">User Account & Wallet Status</h3>
            {users.map((user) => (
              <Card key={user.user_id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    {user.wallet_address && (
                      <div className="text-xs font-mono bg-muted p-1 rounded">
                        {user.wallet_address}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.wallet_status === 'Has Wallet' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {user.wallet_status}
                    </span>
                    {user.wallet_status === 'No Wallet' && (
                      <Button 
                        size="sm" 
                        onClick={() => createWalletForUser(user.user_id)}
                      >
                        Create Wallet
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};