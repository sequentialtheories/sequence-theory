import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Private keys are no longer stored in wallet_config for security
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Wallet, LogOut, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { useWallet } from './WalletProvider';

export const ProfileDropdown = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const { wallet, loading: walletLoading } = useWallet();

  // Fetch user profile
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });


  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: `${label} has been copied to your clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  // Debug logging
  console.log('ProfileDropdown - State:', { 
    hasUser: !!user, 
    userId: user?.id, 
    hasProfile: !!profile, 
    profileLoading: profile === undefined 
  });
  
  if (!user || !profile) {
    console.log('ProfileDropdown - Not rendering because:', { noUser: !user, noProfile: !profile });
    return null;
  }

  const userInitials = profile.name 
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : profile.email[0].toUpperCase();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end">
          <div className="flex items-center space-x-2 p-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1 leading-none">
              {profile.name && (
                <p className="font-medium">{profile.name}</p>
              )}
              <p className="text-xs text-muted-foreground truncate">
                {profile.email}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowWalletDialog(true)}>
            <Wallet className="mr-2 h-4 w-4" />
            <span>Wallet Details</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showWalletDialog} onOpenChange={setShowWalletDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Wallet Details</DialogTitle>
            <DialogDescription>
              Your wallet information and private key. Keep this information secure.
            </DialogDescription>
          </DialogHeader>
          
          {walletLoading ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Loading wallet information...</p>
            </div>
          ) : wallet ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Wallet Address</label>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 p-2 bg-muted rounded text-xs break-all">
                    {wallet.address}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(wallet.address, 'Wallet address')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Network</label>
                <p className="text-sm text-muted-foreground capitalize">{wallet.network}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Provider</label>
                <p className="text-sm text-muted-foreground capitalize">Sequence WaaS</p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-blue-800">Sequence Embedded Wallet</span>
                </div>
                <p className="text-xs text-blue-700">
                  Your wallet is secured by Sequence's infrastructure and created deterministically from your user data.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">No wallet found for your account.</p>
              <p className="text-xs text-muted-foreground">
                A wallet should have been created automatically. Try refreshing the page or contact support.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};