import React, { useState, useEffect, useRef } from 'react';
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
  AlertCircle,
  Copy,
  Check,
  ArrowLeft
} from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

type VerificationMethod = 'select' | 'email' | 'passkey';
type EmailStep = 'enter_email' | 'enter_otp' | 'verified';

export function TurnkeyWalletSetup() {
  const { user, session } = useAuth();
  const { state, refreshWalletInfo } = useTurnkeyWallet();
  
  // Verification state
  const [isVerified, setIsVerified] = useState(false);
  const [isCheckingVerification, setIsCheckingVerification] = useState(true);
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>('select');
  const [emailStep, setEmailStep] = useState<EmailStep>('enter_email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);
  
  // Wallet creation state
  const [isCreating, setIsCreating] = useState(false);
  const [createdAddress, setCreatedAddress] = useState<string | null>(null);
  
  // UI state
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check verification status on mount
  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (!session?.access_token) {
        setIsCheckingVerification(false);
        return;
      }
      
      try {
        const response = await fetch(`${BACKEND_URL}/api/turnkey/verification-status`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsVerified(data.verified);
          console.log('[Verification] Status:', data.verified);
        }
      } catch (err) {
        console.error('[Verification] Error checking status:', err);
      } finally {
        setIsCheckingVerification(false);
      }
    };
    
    checkVerificationStatus();
    
    // Also set default email from user
    if (user?.email) {
      setEmail(user.email);
    }
  }, [session, user]);

  // Send OTP
  const handleSendOtp = async () => {
    if (!email || !session?.access_token) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('[OTP] Initiating email verification for:', email);
      
      const response = await fetch(`${BACKEND_URL}/api/turnkey/init-email-auth`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      console.log('[OTP] Response:', data);

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to send verification code');
      }

      // Store dev OTP if provided (for testing)
      if (data.dev_otp) {
        setDevOtp(data.dev_otp);
        console.log('[OTP] Dev OTP:', data.dev_otp);
      }
      
      setEmailStep('enter_otp');
    } catch (err) {
      console.error('[OTP] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6 || !session?.access_token) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('[OTP] Verifying code:', otpCode);
      
      const response = await fetch(`${BACKEND_URL}/api/turnkey/verify-email-otp`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ email, otp_code: otpCode })
      });

      const data = await response.json();
      console.log('[OTP] Verify response:', data);

      if (!response.ok) {
        throw new Error(data.detail || 'Invalid verification code');
      }

      if (data.verified) {
        setIsVerified(true);
        setEmailStep('verified');
        setDevOtp(null);
      } else {
        throw new Error('Verification failed');
      }
    } catch (err) {
      console.error('[OTP] Verify error:', err);
      setError(err instanceof Error ? err.message : 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  // Passkey verification
  const handlePasskeyVerify = async () => {
    if (!session?.access_token) {
      setError('Please log in first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Check WebAuthn support
      if (!window.PublicKeyCredential) {
        throw new Error('Passkeys are not supported on this device/browser');
      }

      console.log('[Passkey] Starting WebAuthn ceremony...');

      // Create credential options
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      
      const createOptions: CredentialCreationOptions = {
        publicKey: {
          challenge,
          rp: {
            name: "Sequence Theory",
            id: window.location.hostname
          },
          user: {
            id: new TextEncoder().encode(user?.id || 'user'),
            name: user?.email || 'user@example.com',
            displayName: user?.email?.split('@')[0] || 'User'
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" },  // ES256
            { alg: -257, type: "public-key" } // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
            residentKey: "preferred"
          },
          timeout: 60000
        }
      };

      // Create credential (this triggers biometric prompt)
      const credential = await navigator.credentials.create(createOptions) as PublicKeyCredential;
      
      if (!credential) {
        throw new Error('Failed to create passkey');
      }

      console.log('[Passkey] Credential created:', credential.id);

      // Send to backend for verification
      const response = await fetch(`${BACKEND_URL}/api/turnkey/verify-passkey`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ 
          credential_id: credential.id 
        })
      });

      const data = await response.json();
      console.log('[Passkey] Verify response:', data);

      if (!response.ok) {
        throw new Error(data.detail || 'Passkey verification failed');
      }

      if (data.verified) {
        setIsVerified(true);
      }
    } catch (err) {
      console.error('[Passkey] Error:', err);
      // Handle user cancellation gracefully
      if (err instanceof Error && err.name === 'NotAllowedError') {
        setError('Passkey creation was cancelled. Please try again or use Email verification.');
      } else {
        setError(err instanceof Error ? err.message : 'Passkey verification failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Create wallet (only after verification)
  const handleCreateWallet = async () => {
    if (!user || !session || !isVerified) {
      setError('Please complete verification first');
      return;
    }

    console.log('[Wallet] Creating wallet for:', user.email);
    
    setIsCreating(true);
    setError('');

    try {
      const response = await fetch(`${BACKEND_URL}/api/turnkey/create-wallet`, {
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

      const data = await response.json();
      console.log('[Wallet] Response:', data);

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to create wallet');
      }

      if (data.success && data.wallet_address) {
        console.log('[Wallet] SUCCESS:', data.wallet_address);
        setCreatedAddress(data.wallet_address);
        refreshWalletInfo();
      } else {
        throw new Error('Wallet creation failed');
      }
    } catch (err) {
      console.error('[Wallet] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create wallet');
    } finally {
      setIsCreating(false);
    }
  };

  // Copy address
  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reset to method selection
  const handleBack = () => {
    setVerificationMethod('select');
    setEmailStep('enter_email');
    setOtpCode('');
    setError('');
    setDevOtp(null);
  };

  // Determine display address
  const displayAddress = createdAddress || state.address;
  const showWallet = displayAddress && (createdAddress || state.hasWallet);

  // Loading initial state
  if (isCheckingVerification || (state.isLoading && !createdAddress && !isCreating)) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading...</span>
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
                <Button variant="outline" size="sm" onClick={() => handleCopyAddress(displayAddress!)}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Secured by Turnkey</p>
                  <p className="text-xs text-muted-foreground">Secure Enclaves</p>
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
            Your private keys are secured in Turnkey's secure enclaves.
            No seed phrases to manage or protect.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Creating wallet state
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
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is verified - show wallet creation
  if (isVerified) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Verification Complete</CardTitle>
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

            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Creating wallet for</p>
              <p className="font-medium">{user?.email}</p>
            </div>

            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Secure Enclaves</p>
                  <p className="text-xs text-muted-foreground">
                    Keys protected by Turnkey's secure infrastructure
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

            <Button onClick={handleCreateWallet} className="w-full h-14" size="lg">
              <Wallet className="mr-2 h-5 w-5" />
              Create My Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // VERIFICATION REQUIRED - Show Email/Passkey options
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Method Selection */}
      {verificationMethod === 'select' && (
        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Verify Your Identity</CardTitle>
            <CardDescription>
              Complete verification to create your secure wallet
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
              onClick={() => { setVerificationMethod('passkey'); handlePasskeyVerify(); }}
              className="w-full h-14"
              size="lg"
              disabled={isLoading}
            >
              {isLoading && verificationMethod === 'passkey' ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Fingerprint className="mr-2 h-5 w-5" />
              )}
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
              onClick={() => setVerificationMethod('email')}
              variant="outline"
              className="w-full h-14"
              size="lg"
            >
              <Mail className="mr-2 h-5 w-5" />
              Continue with Email OTP
            </Button>

            <p className="text-xs text-center text-muted-foreground pt-4">
              Verification ensures only you can create and access your wallet.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Email OTP Flow */}
      {verificationMethod === 'email' && (
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
                  {devOtp && (
                    <Alert className="mt-2">
                      <AlertDescription className="text-xs">
                        <strong>Dev Mode:</strong> Your code is <code className="font-bold">{devOtp}</code>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                <Button 
                  onClick={handleVerifyOtp}
                  className="w-full"
                  disabled={isLoading || otpCode.length !== 6}
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
                  onClick={() => { setEmailStep('enter_email'); setOtpCode(''); setDevOtp(null); }}
                >
                  Resend Code
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <Alert className="border-primary/20 bg-primary/5">
        <Shield className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">No Seed Phrase Required</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Your wallet is secured by Turnkey's infrastructure using secure enclaves.
          No seed phrases to write down or protect.
        </AlertDescription>
      </Alert>
    </div>
  );
}

export default TurnkeyWalletSetup;
