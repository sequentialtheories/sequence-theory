import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { WalletManager } from '@/components/WalletManager';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Shield, Loader2 } from 'lucide-react';

const ADMIN_EMAILS = ['deathrider1215@gmail.com']; // Add admin emails here

export const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      checkAdminStatus();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const checkAdminStatus = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('user_id', user?.id)
        .single();

      if (profile && ADMIN_EMAILS.includes(profile.email)) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    } finally {
      setLoading(false);
    }
  };

  const processWallets = async () => {
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('wallet-processor');

      if (error) throw error;

      toast({
        title: "Success",
        description: `Processed ${data.processed} wallets`,
      });
    } catch (error) {
      console.error('Error processing wallets:', error);
      toast({
        title: "Error",
        description: `Failed to process wallets: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Dashboard
            </CardTitle>
            <CardDescription>
              Administrative tools for managing The Vault Club
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button 
                onClick={processWallets} 
                disabled={processing}
                variant="outline"
              >
                {processing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Shield className="h-4 w-4 mr-2" />
                )}
                Process Pending Wallets
              </Button>
            </div>
          </CardContent>
        </Card>

        <WalletManager />
      </div>
    </div>
  );
};