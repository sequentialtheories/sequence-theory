import React, { useState, useEffect, useRef } from 'react';
import { useTurnkeyWallet } from '@/hooks/useTurnkeyWallet';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield, 
  Fingerprint, 
  CheckCircle2, 
  Loader2, 
  Wallet, 
  ExternalLink,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

export function TurnkeyWalletSetup() {
  const { user, session } = useAuth();
  const { state, refreshWalletInfo } = useTurnkeyWallet();
  
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [createdAddress, setCreatedAddress] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const hasInitialized = useRef(false);

  // Initial load check
  useEffect(() => {
    if (!hasInitialized.current && !state.isLoading) {
      hasInitialized.current = true;
      console.log('[TurnkeyWalletSetup] Initial state:', {
        hasWallet: state.hasWallet,
        address: state.address,
        isLoading: state.isLoading
      });
    }
  }, [state]);

  // Handle Wallet Creation
  const handleCreateWallet = async () => {
    if (!user || !session) {
      setError('Please log in first');
      return;
    }

    console.log('[TurnkeyWalletSetup] Creating wallet for:', user.email);
    
    setIsCreating(true);
    setError('');

    try {
      const url = `${BACKEND_URL}/api/turnkey/create-wallet`;
      console.log('[TurnkeyWalletSetup] POST', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          email: user.email,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          user_id: user.id
        })
      });

      console.log('[TurnkeyWalletSetup] Response status:', response.status);
      
      const data = await response.json();
      console.log('[TurnkeyWalletSetup] Response:', JSON.stringify(data));

      if (!response.ok) {
        throw new Error(data.detail || data.error || 'Failed to create wallet');
      }

      if (data.success && data.wallet_address) {
        console.log('[TurnkeyWalletSetup] SUCCESS! Address:', data.wallet_address);
        setCreatedAddress(data.wallet_address);
        // Also refresh hook state in background
        refreshWalletInfo();
      } else {
        throw new Error(data.message || 'Wallet creation failed');
      }
    } catch (err) {
      console.error('[TurnkeyWalletSetup] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create wallet');
    } finally {
      setIsCreating(false);
    }
  };

  // Copy address to clipboard
  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get the display address (from creation or from hook state)
  const displayAddress = createdAddress || state.address;
  const showWallet = displayAddress && (createdAddress || state.hasWallet);

  // Loading initial state
  if (state.isLoading && !createdAddress && !isCreating) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading wallet status...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Creating state
  if (isCreating) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-primary/20">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="relative">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <Shield className="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <p className="font-semibold text-lg">Creating Your Secure Wallet</p>
              <p className="text-sm text-muted-foreground">
                Setting up your Turnkey embedded wallet...
              </p>
              <p className="text-xs text-muted-foreground">
                This may take a few seconds
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Wallet exists - show complete state
  if (showWallet) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Wallet Ready!</CardTitle>
            <CardDescription>
              Your Turnkey wallet is set up and ready to use
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Your Wallet Address</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm font-mono bg-background p-2 rounded border break-all">
                  {displayAddress}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyAddress(displayAddress!)}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Secured by Turnkey</p>
                  <p className="text-xs text-muted-foreground">TEE Infrastructure</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <Wallet className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Polygon Network</p>
                  <p className="text-xs text-muted-foreground">Low-cost transactions</p>
                </div>
              </div>
            </div>

            <a
              href={`https://polygonscan.com/address/${displayAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
            >
              View on PolygonScan
              <ExternalLink className="h-4 w-4" />
            </a>
          </CardContent>
        </Card>

        <Alert className="mt-6 border-primary/20 bg-primary/5">
          <Shield className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary">No Seed Phrase Required</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            Your private keys are secured in Turnkey's hardware security modules.
            You never need to worry about seed phrases or key management.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Create wallet state (default)
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card className="border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mb-4">
            <Wallet className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Create Your Wallet</CardTitle>
          <CardDescription>
            Set up your secure embedded wallet in seconds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* User Info */}
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Logged in as</p>
            <p className="font-medium">{user?.email}</p>
          </div>

          {/* Security Features */}
          <div className="grid gap-3">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Hardware Security</p>
                <p className="text-xs text-muted-foreground">
                  Keys stored in Turnkey's secure hardware enclaves
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Fingerprint className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">No Seed Phrases</p>
                <p className="text-xs text-muted-foreground">
                  No 12/24 word phrases to write down or protect
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Wallet className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Polygon Network</p>
                <p className="text-xs text-muted-foreground">
                  Fast, low-cost transactions on Layer 2
                </p>
              </div>
            </div>
          </div>

          {/* Create Button */}
          <Button 
            onClick={handleCreateWallet}
            className="w-full h-14"
            size="lg"
            disabled={!user || !session}
          >
            <Wallet className="mr-2 h-5 w-5" />
            Create My Wallet
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By creating a wallet, you agree to our Terms of Service.
            Your wallet is secured by Turnkey's enterprise-grade infrastructure.
          </p>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert className="border-primary/20 bg-primary/5">
        <Shield className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">Enterprise-Grade Security</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Unlike traditional wallets, you don't need to manage seed phrases.
          Your private keys never leave Turnkey's secure hardware infrastructure.
        </AlertDescription>
      </Alert>
    </div>
  );
}

export default TurnkeyWalletSetup;
