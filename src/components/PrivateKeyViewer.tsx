import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Copy, AlertTriangle, Shield, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PrivateKeyViewerProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
  onViewPrivateKey: () => Promise<{ privateKey?: string; error?: string }>;
}

export const PrivateKeyViewer = ({ isOpen, onClose, walletAddress, onViewPrivateKey }: PrivateKeyViewerProps) => {
  const [step, setStep] = useState<'warning' | 'confirmation' | 'display'>('warning');
  const [confirmText, setConfirmText] = useState('');
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleClose = () => {
    setStep('warning');
    setConfirmText('');
    setPrivateKey(null);
    setShowKey(false);
    onClose();
  };

  const handleContinue = () => {
    setStep('confirmation');
  };

  const handleConfirm = async () => {
    if (confirmText.toLowerCase() !== 'i understand the risks') {
      toast({
        title: "Confirmation Required",
        description: "Please type the exact confirmation text",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await onViewPrivateKey();
      if (result.privateKey) {
        setPrivateKey(result.privateKey);
        setStep('display');
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to retrieve private key",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to retrieve private key",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Private key copied securely"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        {step === 'warning' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Security Warning - Private Key Access
              </DialogTitle>
              <DialogDescription>
                You are about to view your private key. Please read and understand the security implications.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>CRITICAL SECURITY WARNING:</strong> Your private key provides complete control over your wallet and funds.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Security Guidelines:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    Never share your private key with anyone, including support teams
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    Store it securely offline (hardware wallet, encrypted file, paper backup)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    Don't screenshot, email, or store it in cloud services
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    Anyone with this key can access and transfer all your funds
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    This action is for backup and recovery purposes only
                  </li>
                </ul>
              </div>

              <Alert className="border-blue-200 bg-blue-50">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Non-Custodial Compliance:</strong> This private key is displayed to ensure you maintain full control of your assets. We do not store or have access to your private keys.
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleContinue} className="bg-red-600 hover:bg-red-700">
                I Understand, Continue
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'confirmation' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Confirmation Required
              </DialogTitle>
              <DialogDescription>
                Please confirm that you understand the security risks by typing the confirmation text below.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="confirmation">
                  Type: <code className="bg-muted px-2 py-1 rounded text-sm">I understand the risks</code>
                </Label>
                <Input
                  id="confirmation"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type the confirmation text exactly..."
                  autoComplete="off"
                />
              </div>

              <div className="text-sm text-muted-foreground">
                <strong>Wallet Address:</strong>
                <div className="font-mono bg-muted p-2 rounded mt-1 break-all">
                  {walletAddress}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirm} 
                disabled={confirmText.toLowerCase() !== 'i understand the risks' || isLoading}
              >
                {isLoading ? 'Retrieving...' : 'View Private Key'}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'display' && privateKey && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-green-600" />
                Private Key - Handle With Extreme Care
              </DialogTitle>
              <DialogDescription>
                Your private key is displayed below. Copy it to a secure location immediately.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <Shield className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Non-Custodial Verification:</strong> This private key proves you have complete control over your wallet. We cannot access or recover this key.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Wallet Address</Label>
                  <Badge variant="outline">Non-Custodial</Badge>
                </div>
                <div className="font-mono text-sm bg-muted p-2 rounded break-all">
                  {walletAddress}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-red-600 font-semibold">Private Key</Label>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowKey(!showKey)}
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {showKey ? 'Hide' : 'Show'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(privateKey)}
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="font-mono text-sm bg-red-50 border border-red-200 p-3 rounded">
                  {showKey ? privateKey : '•'.repeat(64)}
                </div>
              </div>

              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Final Warning:</strong> Store this private key securely offline. Anyone with this key can control your wallet and funds.
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button onClick={handleClose} className="w-full">
                I've Saved My Private Key Securely
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};