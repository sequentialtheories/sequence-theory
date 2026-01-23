import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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

// Deterministic states for reliability
type AppState = 
  | 'LOADING'
  | 'NOT_VERIFIED'
  | 'VERIFYING_EMAIL_INIT'
  | 'VERIFYING_EMAIL_OTP'
  | 'VERIFYING_PASSKEY'
  | 'VERIFIED_CREATING_WALLET'
  | 'WALLET_READY'
  | 'ERROR';

// Parse error codes from backend
function parseError(detail: string): { code: string; message: string } {
  if (detail.includes(':')) {
    const [code, ...rest] = detail.split(':');
    return { code, message: rest.join(':') };
  }
  return { code: detail, message: getErrorMessage(detail) };
}

function getErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    'NOT_VERIFIED': 'Please verify your identity first',
    'INVALID_OTP': 'Incorrect verification code',
    'OTP_EXPIRED': 'Code expired. Please request a new one.',
    'OTP_NOT_FOUND': 'No code found. Please request a new one.',
    'RATE_LIMITED': 'Too many requests. Please wait and try again.',
    'INVALID_TOKEN': 'Session expired. Please log in again.',
    'PASSKEY_FAILED': 'Passkey verification failed',
    'INTERNAL_ERROR': 'Something went wrong. Please try again.',
    'USER_MISMATCH': 'Authentication error. Please log in again.'
  };
  return messages[code] || code;
}

export function TurnkeyWalletSetup() {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { state: walletState, refreshWalletInfo } = useTurnkeyWallet();
  
  // Main state
  const [appState, setAppState] = useState<AppState>('LOADING');
  const [error, setError] = useState<{ code: string; message: string } | null>(null);
  
  // Email OTP state
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  // Wallet state
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Create wallet function
  const createWallet = useCallback(async () => {
    if (!user || !session?.access_token) return;
    
    setAppState('VERIFIED_CREATING_WALLET');
    setError(null);

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

      if (!response.ok) {
        throw new Error(data.detail || 'INTERNAL_ERROR');
      }

      if (data.success && data.wallet_address) {
        setWalletAddress(data.wallet_address);
        setAppState('WALLET_READY');
        refreshWalletInfo();
        
        // Auto-redirect to home after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        throw new Error('INTERNAL_ERROR');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'INTERNAL_ERROR';
      setError(parseError(msg));
      setAppState('ERROR');
    }
  }, [user, session, navigate, refreshWalletInfo]);

  // Check verification and wallet status on mount
  useEffect(() => {
    const checkStatus = async () => {
      if (!session?.access_token) {
        setAppState('NOT_VERIFIED');
        return;
      }

      try {
        // Check wallet first
        const walletRes = await fetch(`${BACKEND_URL}/api/turnkey/wallet-info`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        
        if (walletRes.ok) {
          const walletData = await walletRes.json();
          if (walletData.hasWallet && walletData.wallet?.address) {
            setWalletAddress(walletData.wallet.address);
            setAppState('WALLET_READY');
            return;
          }
        }

        // Check verification status
        const verifyRes = await fetch(`${BACKEND_URL}/api/turnkey/verification-status`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        
        if (verifyRes.ok) {
          const verifyData = await verifyRes.json();
          if (verifyData.verified) {
            // Auto-create wallet after verification
            await createWallet();
            return;
          }
        }

        // Not verified
        setAppState('NOT_VERIFIED');
      } catch (err) {
        console.error('[TurnkeyWalletSetup] Error checking status:', err);
        setAppState('NOT_VERIFIED');
      }
    };

    if (user?.email) {
      setEmail(user.email);
    }
    
    checkStatus();
  }, [session, user, createWallet]);

  // Send OTP
  const handleSendOtp = async () => {
    if (!email || !session?.access_token) return;

    setAppState('VERIFYING_EMAIL_INIT');
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/turnkey/init-email-auth`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'INTERNAL_ERROR');
      }

      setAppState('VERIFYING_EMAIL_OTP');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'INTERNAL_ERROR';
      setError(parseError(msg));
      setAppState('ERROR');
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6 || !session?.access_token) return;

    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/turnkey/verify-email-otp`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ email, otp_code: otpCode })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'INVALID_OTP');
      }

      if (data.verified) {
        // Auto-create wallet
        await createWallet();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'INVALID_OTP';
      const parsed = parseError(msg);
      setError(parsed);
      // Stay on OTP screen for retry unless rate limited
      if (parsed.code !== 'RATE_LIMITED') {
        setAppState('VERIFYING_EMAIL_OTP');
      } else {
        setAppState('ERROR');
      }
    }
  };

  // Passkey verification
  const handlePasskeyVerify = async () => {
    if (!session?.access_token) return;

    setAppState('VERIFYING_PASSKEY');
    setError(null);

    try {
      if (!window.PublicKeyCredential) {
        throw new Error('PASSKEY_FAILED:Passkeys not supported on this device');
      }

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
            { alg: -7, type: "public-key" },
            { alg: -257, type: "public-key" }
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
            residentKey: "preferred"
          },
          timeout: 60000
        }
      };

      const credential = await navigator.credentials.create(createOptions) as PublicKeyCredential;
      
      if (!credential) {
        throw new Error('PASSKEY_FAILED:Failed to create passkey');
      }

      const response = await fetch(`${BACKEND_URL}/api/turnkey/verify-passkey`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ credential_id: credential.id })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'PASSKEY_FAILED');
      }

      if (data.verified) {
        // Auto-create wallet
        await createWallet();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'PASSKEY_FAILED';
      
      // Handle user cancellation gracefully
      if (err instanceof Error && err.name === 'NotAllowedError') {
        setError({ code: 'PASSKEY_CANCELLED', message: 'Passkey cancelled. Use Email verification instead.' });
      } else {
        setError(parseError(msg));
      }
      setAppState('NOT_VERIFIED');
    }
  };

  // Copy address
  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Reset to method selection
  const handleBack = () => {
    setAppState('NOT_VERIFIED');
    setOtpCode('');
    setError(null);
  };

  // Retry from error
  const handleRetry = () => {
    setError(null);
    setAppState('NOT_VERIFIED');
    setOtpCode('');
  };

  // RENDER STATES

  // Loading
  if (appState === 'LOADING') {
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

  // Wallet Ready - Auto-redirecting
  if (appState === 'WALLET_READY' && walletAddress) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Wallet Ready!</CardTitle>
            <CardDescription>
              Redirecting to home in a moment...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Your Wallet Address</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm font-mono bg-background p-2 rounded border break-all">
                  {walletAddress}
                </code>
                <Button variant="outline" size="sm" onClick={handleCopyAddress}>
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
              href={`https://polygonscan.com/address/${walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
            >
              View on PolygonScan
              <ExternalLink className="h-4 w-4" />
            </a>

            <Button onClick={() => navigate('/')} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Creating Wallet
  if (appState === 'VERIFIED_CREATING_WALLET') {
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
                This will only take a moment...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error State
  if (appState === 'ERROR') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-destructive/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-xl">Something Went Wrong</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}
            <Button onClick={handleRetry} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verifying Passkey
  if (appState === 'VERIFYING_PASSKEY') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-primary/20">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <Fingerprint className="h-16 w-16 text-primary animate-pulse" />
            <div className="text-center space-y-2">
              <p className="font-semibold text-lg">Waiting for Passkey</p>
              <p className="text-sm text-muted-foreground">
                Complete the biometric verification on your device...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Email OTP Flow - Enter Code
  if (appState === 'VERIFYING_EMAIL_OTP') {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-xl">Enter Verification Code</CardTitle>
                <CardDescription>
                  Check your email at {email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}

            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Don't see the email? Check your <strong>spam</strong> or <strong>promotions</strong> folder.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Input
                type="text"
                placeholder="000000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="text-center text-2xl tracking-widest h-14"
                autoFocus
              />
            </div>

            <Button 
              onClick={handleVerifyOtp}
              className="w-full"
              disabled={otpCode.length !== 6}
            >
              Verify & Create Wallet
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => { setOtpCode(''); setError(null); handleSendOtp(); }}
            >
              Resend Code
            </Button>
          </CardContent>
        </Card>

        <Alert className="border-primary/20 bg-primary/5">
          <Shield className="h-4 w-4 text-primary" />
          <AlertDescription className="text-muted-foreground">
            Your wallet will be created automatically after verification.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Email OTP Flow - Sending
  if (appState === 'VERIFYING_EMAIL_INIT') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-primary/20">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Sending verification code...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // NOT_VERIFIED - Method Selection (Default)
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
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
            <Alert variant={error.code === 'PASSKEY_CANCELLED' ? 'default' : 'destructive'}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handlePasskeyVerify}
            className="w-full h-14"
            size="lg"
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
            onClick={handleSendOtp}
            variant="outline"
            className="w-full h-14"
            size="lg"
          >
            <Mail className="mr-2 h-5 w-5" />
            Continue with Email
          </Button>

          <p className="text-xs text-center text-muted-foreground pt-4">
            Verification ensures only you can create and access your wallet.
          </p>
        </CardContent>
      </Card>

      <Alert className="border-primary/20 bg-primary/5">
        <Shield className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">No Seed Phrase Required</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Your wallet is secured by Turnkey's infrastructure using secure enclaves.
          No seed phrases to manage.
        </AlertDescription>
      </Alert>
    </div>
  );
}

export default TurnkeyWalletSetup;
