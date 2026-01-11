/**
 * WALLET SETUP PAGE
 * 
 * Dedicated page for wallet creation after registration.
 * Users are redirected here immediately after signup.
 * 
 * SECURITY: 100% non-custodial - all operations happen client-side.
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { useWallet } from '@/contexts/WalletContext';
import { WalletSetup } from '@/components/wallet/WalletSetup';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle2, ArrowRight } from 'lucide-react';

const WalletSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { state } = useWallet();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // If wallet already exists, show completion and redirect option
  if (state.hasWallet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold mb-2">Wallet Ready!</h1>
                <p className="text-muted-foreground">
                  Your secure, non-custodial wallet has been set up.
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Your Wallet Address</p>
                <code className="text-sm font-mono break-all">{state.address}</code>
              </div>

              <div className="space-y-3">
                <Button onClick={() => navigate('/')} className="w-full" size="lg">
                  Start Exploring
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button onClick={() => navigate('/profile')} variant="outline" className="w-full">
                  Go to Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (authLoading || !state.isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show wallet setup
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">One More Step!</h1>
          <p className="text-muted-foreground">
            Set up your secure wallet to access all features.
          </p>
        </div>
        <WalletSetup />
      </div>
    </div>
  );
};

export default WalletSetupPage;
