import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, AlertTriangle } from 'lucide-react';
import { SEQUENCE_CONFIG, CONFIG_INSTRUCTIONS, validateSequenceConfig } from '@/lib/config';

export function SequenceDebugPanel() {
  const configValidation = validateSequenceConfig();

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Sequence Embedded Wallet Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
            <AlertDescription>
              Sequence Embedded Wallet is properly configured.
            </AlertDescription>
          </Alert>
        )}

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

        <div className="space-y-2 text-xs text-muted-foreground">
          <p><strong>Current Network:</strong> {SEQUENCE_CONFIG.network}</p>
          <p><strong>Chain ID:</strong> {SEQUENCE_CONFIG.chainId}</p>
          <p><strong>Config Status:</strong> {configValidation.isValid ? 'Ready' : 'Needs Configuration'}</p>
        </div>
      </CardContent>
    </Card>
  );
}