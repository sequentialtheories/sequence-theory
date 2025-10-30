import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Wallet, Shield, CheckCircle, AlertCircle, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { WebauthnStamper } from '@turnkey/webauthn-stamper';

interface WalletSetupProps {
  userEmail: string;
  onComplete: () => void;
}

export const WalletSetup = ({ userEmail, onComplete }: WalletSetupProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingDormant, setIsCreatingDormant] = useState(false);
  const { toast } = useToast();

  // Check if we're in an iframe or dev environment
  const isInIframe = window.self !== window.top;
  const isDev = window.location.hostname === 'localhost' || window.location.hostname.includes('lovable.app');

  const createWallet = async () => {
    setIsCreating(true);
    
    try {
      console.log('Starting wallet creation for:', userEmail);

      // Initialize WebAuthn stamper
      const stamper = new WebauthnStamper({
        rpId: window.location.hostname,
      });

      // Generate challenge
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      const challengeBase64 = btoa(String.fromCharCode(...challenge));

      console.log('Creating WebAuthn credential...');

      // Create credential
      const credential = await navigator.credentials.create({
        publicKey: {
          rp: {
            name: "Sequence Theory",
            id: window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode(userEmail),
            name: userEmail,
            displayName: userEmail.split('@')[0],
          },
          challenge: challenge,
          pubKeyCredParams: [
            { type: "public-key", alg: -7 }, // ES256
            { type: "public-key", alg: -257 }, // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            requireResidentKey: true,
            residentKey: "required",
            userVerification: "required",
          },
          timeout: 60000,
          attestation: "direct",
        },
      }) as PublicKeyCredential;

      if (!credential || !credential.response) {
        throw new Error('Failed to create credential');
      }

      const attestationResponse = credential.response as AuthenticatorAttestationResponse;

      // Prepare attestation data
      const attestation = {
        credentialId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
        clientDataJson: btoa(String.fromCharCode(...new Uint8Array(attestationResponse.clientDataJSON))),
        attestationObject: btoa(String.fromCharCode(...new Uint8Array(attestationResponse.attestationObject))),
        transports: attestationResponse.getTransports ? attestationResponse.getTransports() : ['internal'],
      };

      console.log('Calling edge function...');

      // Get session for auth header
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Call edge function
      const { data, error } = await supabase.functions.invoke('turnkey-wallet-create', {
        body: {
          email: userEmail,
          attestation: attestation,
          challenge: challengeBase64,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data || !data.success) {
        throw new Error(data?.error || 'Failed to create wallet');
      }

      console.log('Wallet created successfully:', data);

      toast({
        title: "Wallet Created! 🎉",
        description: `Your Polygon wallet is ready: ${data.wallet_address.slice(0, 6)}...${data.wallet_address.slice(-4)}`,
      });

      onComplete();
    } catch (error: any) {
      console.error('Wallet creation error:', error);
      
      let errorMessage = error.message || "Please try again or contact support.";
      
      // Handle specific WebAuthn errors
      if (error.name === 'NotAllowedError') {
        if (error.message?.includes('publickey-credentials-create')) {
          errorMessage = "WebAuthn is blocked in this context. Please open the app in a new tab or test the deployed version.";
        } else {
          errorMessage = "Biometric authentication was cancelled. Please try again.";
        }
      } else if (error.name === 'NotSupportedError') {
        errorMessage = "Your device doesn't support biometric authentication. Please use a different device.";
      }

      toast({
        title: "Wallet Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const createDormantWallet = async () => {
    setIsCreatingDormant(true);
    try {
      console.log('Creating dormant wallet for dev/preview...');

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const { data, error } = await supabase.functions.invoke('dev-create-dormant-wallet', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Dev Wallet Created",
          description: `Dormant wallet created: ${data.wallet_address.slice(0, 6)}...${data.wallet_address.slice(-4)}`,
        });
        onComplete();
      } else {
        throw new Error(data.error || 'Failed to create dormant wallet');
      }
    } catch (error) {
      console.error('Error creating dormant wallet:', error);
      toast({
        variant: "destructive",
        title: "Wallet Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create dormant wallet",
      });
    } finally {
      setIsCreatingDormant(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>Secure Your Wallet</CardTitle>
            <CardDescription>Set up your non-custodial Polygon wallet</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isInIframe && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You're in preview mode. WebAuthn may not work in iframes. Use the dev wallet option below or test in a new tab/deployed version.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Enterprise-Grade Security</p>
              <p className="text-xs text-muted-foreground">
                Your private keys are stored in secure hardware enclaves, never exposed.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">True Ownership</p>
              <p className="text-xs text-muted-foreground">
                Only you control your wallet using biometric authentication (Face ID/Touch ID).
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Polygon Network</p>
              <p className="text-xs text-muted-foreground">
                Fast, low-cost transactions on Polygon's Layer 2 network.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={createWallet} 
            disabled={isCreating || isCreatingDormant}
            className="w-full"
            size="lg"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Secure Wallet...
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                Create My Wallet
              </>
            )}
          </Button>

          {isDev && (
            <Button 
              onClick={createDormantWallet} 
              disabled={isCreating || isCreatingDormant}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {isCreatingDormant ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Dev Wallet...
                </>
              ) : (
                <>
                  <Key className="h-4 w-4 mr-2" />
                  Create Dormant Wallet (Dev)
                </>
              )}
            </Button>
          )}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          {isDev ? "Use the dev wallet for testing in preview mode." : "You'll be prompted to use your device's biometric authentication."}
        </p>
      </CardContent>
    </Card>
  );
};
