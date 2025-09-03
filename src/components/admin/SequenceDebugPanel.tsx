import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { sequenceDebug } from '@/services/sequenceDebug';
import { Loader2 } from 'lucide-react';

export function SequenceDebugPanel() {
  const [email, setEmail] = useState(`test_${Date.now()}@example.com`);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testWalletCreation = async () => {
    setLoading(true);
    setResult(null);
    try {
      const debugResult = await sequenceDebug.createWallet(email);
      setResult(debugResult);
    } catch (error: any) {
      setResult({ error: error?.message || 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const setTestKeys = () => {
    const projectKey = window.prompt('Enter Project Access Key:');
    const waasKey = window.prompt('Enter WaaS Config Key:');
    if (projectKey) localStorage.setItem('tvc_SEQUENCE_PROJECT_ACCESS_KEY', projectKey.trim());
    if (waasKey) localStorage.setItem('tvc_SEQUENCE_WAAS_CONFIG_KEY', waasKey.trim());
    localStorage.setItem('tvc_SEQUENCE_NETWORK', 'amoy');
    alert('Keys set! Reload the page to apply.');
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Sequence WaaS Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Test email"
          />
          <Button onClick={testWalletCreation} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Test Wallet Creation
          </Button>
        </div>
        <Button variant="outline" onClick={setTestKeys} className="w-full">
          Set Test Keys in LocalStorage
        </Button>
        {result && (
          <div className="mt-4 rounded-lg bg-muted p-4">
            <pre className="text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
