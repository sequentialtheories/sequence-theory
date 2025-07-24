import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, Loader2 } from 'lucide-react';

export const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && !authLoading) {
      checkAdminStatus();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const checkAdminStatus = async () => {
    try {
      // Use the secure has_role function instead of hardcoded emails
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: user?.id,
        _role: 'admin'
      });

      if (error) throw error;
      setIsAdmin(data === true);
    } catch (error) {
      console.error('Error checking admin status:', error);
    } finally {
      setLoading(false);
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
            <p className="text-muted-foreground">
              Admin tools for managing The Vault Club platform.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};