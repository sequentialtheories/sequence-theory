import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { SEQUENCE_CONFIG, CONFIG_INSTRUCTIONS, validateSequenceConfig, decodeWaasConfigKey } from '@/lib/config';
import { useWallet } from '@/components/WalletProvider';

export function SequenceDebugPanel() {
  const configValidation = validateSequenceConfig();
  const { wallet, loading, error, signIn, autoCreateWallet } = useWallet();
  const waasConfig = decodeWaasConfigKey(SEQUENCE_CONFIG.waasConfigKey);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Sequence Embedded Wallet Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Configuration Status */}
        {!configValidation.isValid ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">Configuration Required</p>
                <p>You need to configure your Sequence Embedded Wallet before it can be used:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {configValidation.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Sequence Embedded Wallet is properly configured.
            </AlertDescription>
          </Alert>
        )}

        {/* Wallet Status */}
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            Wallet Status
            {loading && <Clock className="h-4 w-4 animate-spin" />}
            {autoCreateWallet && <Badge variant="secondary">Auto-creating...</Badge>}
          </h4>
          
          {wallet ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Wallet Connected</span>
              </div>
              <div className="text-sm space-y-1">
                <p><strong>Address:</strong> <code className="text-xs">{wallet.address}</code></p>
                <p><strong>Network:</strong> {wallet.network}</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="font-medium text-red-800">Wallet Error</span>
              </div>
              <p className="text-sm text-red-700">{error}</p>
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-2"
                onClick={() => signIn().catch(console.error)}
              >
                Retry Connection
              </Button>
            </div>
          ) : (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">
                  {loading ? 'Initializing Wallet...' : 'Wallet Not Connected'}
                </span>
              </div>
              {!loading && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => signIn().catch(console.error)}
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Configuration Steps:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
            {CONFIG_INSTRUCTIONS.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          
          <a 
            href={CONFIG_INSTRUCTIONS.builderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-primary hover:underline"
          >
            <span>Open Sequence Builder</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Decoded Configuration */}
        <div className="space-y-2">
          <h4 className="font-medium">Configuration Details</h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p><strong>Network:</strong> {SEQUENCE_CONFIG.network}</p>
              <p><strong>Chain ID:</strong> {SEQUENCE_CONFIG.chainId}</p>
              <p><strong>Config Status:</strong> 
                <Badge variant={configValidation.isValid ? "default" : "destructive"} className="ml-2">
                  {configValidation.isValid ? 'Ready' : 'Needs Configuration'}
                </Badge>
              </p>
            </div>
            <div>
              {waasConfig ? (
                <>
                  <p><strong>Project ID:</strong> {waasConfig.projectId}</p>
                  <p><strong>RPC Server:</strong> {waasConfig.rpcServer}</p>
                  <p><strong>Config Valid:</strong> 
                    <Badge variant="default" className="ml-2">✓</Badge>
                  </p>
                </>
              ) : (
                <p className="text-red-600"><strong>WaaS Config:</strong> Invalid/Corrupted</p>
              )}
            </div>
          </div>
        </div>

        {/* SDK Self-Test */}
        <div className="space-y-2">
          <h4 className="font-medium">SDK Connectivity</h4>
          <div className="text-sm space-y-1">
            <p>✅ Sequence SDK Imported</p>
            <p>✅ Configuration Loaded</p>
            <p>{configValidation.isValid ? '✅' : '❌'} Keys Configured</p>
            <p>{wallet ? '✅' : '⏳'} Wallet {wallet ? 'Connected' : 'Pending'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}