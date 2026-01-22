import React, { useState } from 'react';
import { useTurnkeyWallet } from '@/hooks/useTurnkeyWallet';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield, 
  Fingerprint, 
  Mail, 
  CheckCircle2, 
  Loader2, 
  Wallet, 
  ExternalLink,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

type AuthMethod = 'select' | 'passkey' | 'email';
type EmailStep = 'enter_email' | 'enter_otp' | 'verified';
type WalletStep = 'auth' | 'create' | 'creating' | 'complete';

export function TurnkeyWalletSetup() {
  const { user, session } = useAuth();
  const { state, createWallet, signMessage, refreshWalletInfo } = useTurnkeyWallet();
  
  const [walletStep, setWalletStep] = useState<WalletStep>('auth');
  const [authMethod, setAuthMethod] = useState<AuthMethod>('select');
  const [emailStep, setEmailStep] = useState<EmailStep>('enter_email');
  const [email, setEmail] = useState(user?.email || '');
  const [otpCode, setOtpCode] = useState('');
  const [activityId, setActivityId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // If user already has a wallet, show complete state
  if (state.hasWallet && state.address) {
    return <WalletComplete address={state.address} />;
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

  // Handle Email OTP Init
  const handleSendOtp = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Generate a temporary public key for this auth session
      const tempKey = `tk_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      const response = await fetch(`${BACKEND_URL}/api/turnkey/init-email-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          target_public_key: tempKey
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to send verification email');
      }

      const data = await response.json();
      setActivityId(data.activity_id);
      setEmailStep('enter_otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification email');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length < 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${BACKEND_URL}/api/turnkey/verify-email-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity_id: activityId,
          otp_code: otpCode
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Invalid verification code');
      }

      const data = await response.json();
      if (data.verified || data.success) {
        setEmailStep('verified');
        setIsAuthenticated(true);
        setWalletStep('create');
      } else {
        throw new Error('Verification failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Passkey Authentication
  const handlePasskeyAuth = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        throw new Error('Passkeys are not supported on this device/browser');
      }

      // For now, simulate passkey auth success for demo
      // In production, this would use Turnkey's passkey flow
      setIsAuthenticated(true);
      setWalletStep('create');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Passkey authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Wallet Creation
  const handleCreateWallet = async () => {
    if (!isAuthenticated) {
      setError('Please authenticate first');
      return;
    }

    setWalletStep('creating');
    setError('');

    const result = await createWallet();
    
    if (result.success) {
      setWalletStep('complete');
      await refreshWalletInfo();
    } else {
      setError(result.error || 'Failed to create wallet');
      setWalletStep('create');
    }
  };

  // Reset to auth selection
  const handleBack = () => {
    setAuthMethod('select');
    setEmailStep('enter_email');
    setOtpCode('');
    setError('');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Auth Selection */}
      {walletStep === 'auth' && authMethod === 'select' && (
        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mb-4">
              <Wallet className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Create Your Wallet</CardTitle>
            <CardDescription>
              Choose how you'd like to authenticate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={() => { setAuthMethod('passkey'); handlePasskeyAuth(); }}
              className="w-full h-14"
              size="lg"
              disabled={isLoading}
            >
              <Fingerprint className="mr-2 h-5 w-5" />
              Continue with Passkey
              <span className="ml-2 text-xs opacity-70">(Recommended)</span>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <Button 
              onClick={() => setAuthMethod('email')}
              variant="outline"
              className="w-full h-14"
              size="lg"
            >
              <Mail className="mr-2 h-5 w-5" />
              Continue with Email OTP
            </Button>

            <p className="text-xs text-center text-muted-foreground pt-4">
              Your wallet is secured by Turnkey's enterprise-grade infrastructure.
              No seed phrases or private keys to manage.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Email OTP Flow */}
      {walletStep === 'auth' && authMethod === 'email' && (
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-xl">Email Verification</CardTitle>
                <CardDescription>
                  {emailStep === 'enter_email' && 'Enter your email to receive a verification code'}
                  {emailStep === 'enter_otp' && 'Enter the 6-digit code sent to your email'}
                  {emailStep === 'verified' && 'Email verified successfully!'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {emailStep === 'enter_email' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  onClick={handleSendOtp}
                  className="w-full"
                  disabled={isLoading || !email}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Verification Code'
                  )}
                </Button>
              </>
            )}

            {emailStep === 'enter_otp' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Verification Code</label>
                  <Input
                    type="text"
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="text-center text-2xl tracking-widest"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Check your email at {email}
                  </p>
                </div>
                <Button 
                  onClick={handleVerifyOtp}
                  className="w-full"
                  disabled={isLoading || otpCode.length < 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => { setEmailStep('enter_email'); setOtpCode(''); }}
                >
                  Resend Code
                </Button>
              </>
            )}

            {emailStep === 'verified' && (
              <div className="flex items-center justify-center gap-2 py-4 text-primary">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Email Verified</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Wallet Step */}
      {walletStep === 'create' && (
        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Authentication Complete</CardTitle>
            <CardDescription>
              You're ready to create your secure wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Hardware Security</p>
                  <p className="text-xs text-muted-foreground">
                    Keys stored in Turnkey's secure enclaves
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Wallet className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Polygon Network</p>
                  <p className="text-xs text-muted-foreground">
                    Fast, low-cost transactions
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleCreateWallet}
              className="w-full"
              size="lg"
            >
              <Wallet className="mr-2 h-5 w-5" />
              Create My Wallet
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Creating Wallet */}
      {walletStep === 'creating' && (
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

      {/* Wallet Complete */}
      {walletStep === 'complete' && state.address && (
        <WalletComplete address={state.address} />
      )}

      {/* No Seed Phrase Notice */}
      {walletStep === 'auth' && (
        <Alert className="border-primary/20 bg-primary/5">
          <Shield className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary">No Seed Phrase Required</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            Unlike traditional wallets, you don't need to write down a seed phrase.
            Your wallet is secured by Turnkey's enterprise-grade infrastructure.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Wallet Complete Component
function WalletComplete({ address }: { address: string }) {
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
                {address}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(address)}
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
            href={`https://polygonscan.com/address/${address}`}
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

export default TurnkeyWalletSetup;
