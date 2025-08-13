import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { signInWithSequence, submitOtpCode } from '@/lib/sequenceWaas';
import { Loader2 } from 'lucide-react';

interface SequenceAuthProps {
  email: string;
  onSuccess: (walletAddress: string) => void;
  onError: (error: string) => void;
}

export const SequenceAuth = ({ email, onSuccess, onError }: SequenceAuthProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [otpRequired, setOtpRequired] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpResolver, setOtpResolver] = useState<((code: string) => Promise<void>) | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSequenceSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signInWithSequence(email);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to sign in with Sequence');
      }
      
      if (result.otpResolver) {
        setOtpRequired(true);
        setOtpResolver(result.otpResolver);
      } else {
        // Success without OTP
        onSuccess(result.wallet);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otpCode.trim() || !otpResolver) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await submitOtpCode(otpResolver, otpCode);
      
      if (!result.success) {
        throw new Error(result.error || 'Invalid OTP code');
      }
      
      // OTP was successful, wallet should be created
      // Note: In a real implementation, you'd get the wallet from the resolved promise
      onSuccess('Wallet created successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (otpRequired) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Enter Verification Code</CardTitle>
          <CardDescription>
            We've sent a verification code to {email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="Enter 6-digit code"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            maxLength={6}
            className="text-center text-lg tracking-wider"
          />
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button 
            onClick={handleOtpSubmit} 
            disabled={isLoading || otpCode.length !== 6}
            className="w-full"
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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Sequence Wallet</CardTitle>
        <CardDescription>
          Create a secure wallet for {email}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Button 
          onClick={handleSequenceSignIn} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Wallet...
            </>
          ) : (
            'Create Sequence Wallet'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};