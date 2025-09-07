import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, AlertTriangle } from 'lucide-react';
import { useWallet } from '@/components/WalletProvider';

export const WalletVerificationDialog = () => {
  const { 
    isVerificationRequired, 
    verificationEmail, 
    verificationError, 
    verifyEmailCode, 
    resendVerificationCode,
    loading 
  } = useWallet();
  
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (!code.trim()) return;
    
    try {
      setIsVerifying(true);
      await verifyEmailCode(code.trim());
      setCode(''); // Clear code on success
    } catch (err) {
      console.error('Verification failed:', err);
      // Error is handled by the hook and displayed in verificationError
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendVerificationCode();
      setCode(''); // Clear any entered code
    } catch (err) {
      console.error('Resend failed:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isVerifying && code.trim()) {
      handleVerify();
    }
  };

  return (
    <Dialog open={isVerificationRequired} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Verification Required
          </DialogTitle>
          <DialogDescription>
            We've sent a verification code to{' '}
            <span className="font-medium">{verificationEmail}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {verificationError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{verificationError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="verification-code" className="text-sm font-medium">
              Verification Code
            </label>
            <Input
              id="verification-code"
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyPress={handleKeyPress}
              maxLength={6}
              className="text-center text-lg tracking-widest"
              disabled={isVerifying || loading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleVerify}
              disabled={!code.trim() || isVerifying || loading}
              className="w-full"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleResend}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Resend Code'  
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Check your spam folder if you don't see the email within a few minutes.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};