import React, { useState } from 'react';
import { useTurnkeyWallet } from '@/hooks/useTurnkeyWallet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Copy, 
  CheckCircle2, 
  ExternalLink, 
  Wallet, 
  Shield, 
  RefreshCw,
  Loader2,
  PenTool,
  FileSignature,
  AlertCircle
} from 'lucide-react';

export function TurnkeyWalletManager() {
  const { state, refreshWalletInfo, signMessage, signTransaction } = useTurnkeyWallet();
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [signingMessage, setSigningMessage] = useState(false);
  const [signingTx, setSigningTx] = useState(false);
  const [lastSignature, setLastSignature] = useState<string | null>(null);
  const [lastSignedTx, setLastSignedTx] = useState<string | null>(null);
  const [signError, setSignError] = useState<string | null>(null);

  const handleCopyAddress = async () => {
    if (state.address) {
      await navigator.clipboard.writeText(state.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshWalletInfo();
    setRefreshing(false);
  };

  // Test Sign Message
  const handleTestSignMessage = async () => {
    setSigningMessage(true);
    setSignError(null);
    setLastSignature(null);

    const result = await signMessage('Sequence Theory Turnkey signing test');
    
    if (result.success && result.signature) {
      setLastSignature(result.signature);
    } else {
      setSignError(result.error || 'Failed to sign message');
    }
    
    setSigningMessage(false);
  };

  // Test Sign Transaction (Dry Run)
  const handleTestSignTransaction = async () => {
    setSigningTx(true);
    setSignError(null);
    setLastSignedTx(null);

    // Build a minimal test transaction (won't be broadcast)
    const result = await signTransaction({
      to: '0x0000000000000000000000000000000000000000',
      value: '0',
      data: '0x',
      chainId: 137 // Polygon
    });
    
    if (result.success && result.signedTx) {
      setLastSignedTx(result.signedTx);
    } else {
      setSignError(result.error || 'Failed to sign transaction');
    }
    
    setSigningTx(false);
  };

  if (state.isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading wallet...</span>
        </CardContent>
      </Card>
    );
  }

  if (!state.hasWallet || !state.address) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <Wallet className="h-12 w-12 text-muted-foreground" />
          <div className="text-center">
            <p className="font-medium">No Wallet Found</p>
            <p className="text-sm text-muted-foreground">
              Create a wallet to get started
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">My Wallet</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  Secured by Turnkey
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-primary border-primary/30">
              {state.network === 'polygon' ? 'Polygon' : state.network}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Wallet Address
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted/50 rounded-lg p-3 border">
                <code className="text-sm font-mono break-all">
                  {state.address}
                </code>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyAddress}
                className="shrink-0"
              >
                {copied ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={`https://polygonscan.com/address/${state.address}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-4 w-4" />
                View on PolygonScan
              </Button>
            </a>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Enterprise-Grade Security</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your wallet is secured by Turnkey hardware security modules.
                  Private keys never leave the secure enclave.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Network</span>
            <span className="font-medium">
              {state.network === 'polygon' ? 'Polygon Mainnet' : state.network}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Provider</span>
            <span className="font-medium capitalize">{state.provider}</span>
          </div>
        </CardContent>
      </Card>

      {/* Test Signing Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            Test Signing
          </CardTitle>
          <CardDescription>
            Verify your wallet can sign messages and transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {signError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{signError}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Button 
                onClick={handleTestSignMessage}
                variant="outline"
                className="w-full"
                disabled={signingMessage}
              >
                {signingMessage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing...
                  </>
                ) : (
                  <>
                    <FileSignature className="mr-2 h-4 w-4" />
                    Test Sign Message
                  </>
                )}
              </Button>
              {lastSignature && (
                <div className="p-2 bg-muted rounded text-xs font-mono break-all">
                  <p className="text-muted-foreground mb-1">Signature:</p>
                  {lastSignature.slice(0, 42)}...
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Button 
                onClick={handleTestSignTransaction}
                variant="outline"
                className="w-full"
                disabled={signingTx}
              >
                {signingTx ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing...
                  </>
                ) : (
                  <>
                    <PenTool className="mr-2 h-4 w-4" />
                    Test Sign Transaction
                  </>
                )}
              </Button>
              {lastSignedTx && (
                <div className="p-2 bg-muted rounded text-xs font-mono break-all">
                  <p className="text-muted-foreground mb-1">Signed TX:</p>
                  {lastSignedTx.slice(0, 42)}...
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            These are test operations. No actual transactions will be broadcast.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default TurnkeyWalletManager;
