import React, { useState } from 'react';
import { useTurnkeyWallet } from '@/hooks/useTurnkeyWallet';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, Fingerprint, Mail, CheckCircle2, Loader2, Wallet, ExternalLink } from 'lucide-react';

type SetupStep = 'intro' | 'creating' | 'complete';

export function TurnkeyWalletSetup() {
  const { user } = useAuth();
  const { state, createWallet } = useTurnkeyWallet();
  
  const [step, setStep] = useState<SetupStep>('intro');
  const [error, setError] = useState('');

  const handleCreateWallet = async () => {
    setStep('creating');
    setError('');

    const result = await createWallet();
    
    if (result.success) {
      setStep('complete');
    } else {
      setError(result.error || 'Failed to create wallet');
      setStep('intro');
    }
  };

  // If user already has a wallet, show complete state
  if (state.hasWallet && state.address) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Wallet Ready</CardTitle>
            <CardDescription>
              Your Turnkey wallet is set up and ready to use
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Your Wallet Address</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm font-mono bg-background p-2 rounded border break-all">
                  {state.address}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(state.address!)}
                >
                  Copy
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-primary" />
                Secured by Turnkey
              </span>
              <span>•</span>
              <span>Polygon Network</span>
            </div>

            <a
              href={`https://polygonscan.com/address/${state.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
            >
              View on PolygonScan
              <ExternalLink className="h-4 w-4" />
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (state.isLoading) {
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

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {step === 'intro' && (
        <>
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
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Bank-Grade Security</p>
                    <p className="text-sm text-muted-foreground">
                      Your keys are secured in Turnkey hardware security modules
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <Fingerprint className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Passkey Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Use biometrics or device security to access your wallet
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Email Recovery</p>
                    <p className="text-sm text-muted-foreground">
                      Recover access from any device using your email
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleCreateWallet} 
                className="w-full"
                size="lg"
              >
                <Wallet className="mr-2 h-5 w-5" />
                Create My Wallet
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By creating a wallet, you agree to our Terms of Service.
                Your wallet is secured by Turnkey infrastructure.
              </p>
            </CardContent>
          </Card>

          <Alert className="border-primary/20 bg-primary/5">
            <Shield className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary">No Seed Phrase Required</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              Unlike traditional wallets, you do not need to write down a seed phrase.
              Your wallet is secured by Turnkey enterprise-grade infrastructure.
            </AlertDescription>
          </Alert>
        </>
      )}

      {step === 'creating' && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="text-center">
              <p className="font-medium">Creating your wallet...</p>
              <p className="text-sm text-muted-foreground">
                This may take a few seconds
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'complete' && state.address && (
        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Wallet Created!</CardTitle>
            <CardDescription>
              Your secure wallet is ready to use
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Your Wallet Address</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm font-mono bg-background p-2 rounded border break-all">
                  {state.address}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(state.address!)}
                >
                  Copy
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-primary" />
                Secured by Turnkey
              </span>
              <span>•</span>
              <span>Polygon Network</span>
            </div>

            <a
              href={`https://polygonscan.com/address/${state.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
            >
              View on PolygonScan
              <ExternalLink className="h-4 w-4" />
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default TurnkeyWalletSetup;
