import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { configService } from '@/lib/config';
import { logger } from '@/lib/logger';

export default function ApiKeyTester() {
  const [apiKey, setApiKey] = useState('');
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testApiKey = async () => {
    if (!apiKey.trim()) {
      setTestResult('Please enter an API key');
      return;
    }

    setIsLoading(true);
    setTestResult('');

    try {
      logger.info('Testing API key', { keyPrefix: apiKey.substring(0, 8) + '...' });
      
      const config = configService.getConfig();
      const response = await fetch(`${config.supabaseUrl}/functions/v1/external-api/user-wallets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey.trim()
        }
      });

      const data = await response.json();
      
      setTestResult(`Status: ${response.status}\nResponse: ${JSON.stringify(data, null, 2)}`);
      
      logger.info('API test completed', {
        status: response.status,
        hasData: !!data
      });
      
    } catch (error) {
      logger.error('API test error', error);
      setTestResult(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createTestKey = async () => {
    setIsLoading(true);
    setTestResult('Creating test API key...');

    try {
      const config = configService.getConfig();
      const response = await fetch(`${config.supabaseUrl}/functions/v1/create-test-api-key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setApiKey(data.data.api_key);
        setTestResult(`✅ Test API key created!\nKey: [REDACTED]\nPrefix: ${data.data.key_prefix}\n\nYou can now test this key using the "Test API Key" button.`);
        logger.info('Test API key created successfully', { keyPrefix: data.data.key_prefix });
      } else {
        setTestResult(`❌ Failed to create test key: ${data.error}`);
        logger.error('Failed to create test key', { error: data.error });
      }
      
    } catch (error) {
      logger.error('Test key creation error', error);
      setTestResult(`❌ Error creating test key: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>API Key Tester</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">API Key:</label>
            <Input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key (starts with st_)"
              className="font-mono"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={testApiKey} 
              disabled={isLoading || !apiKey.trim()}
            >
              {isLoading ? 'Testing...' : 'Test API Key'}
            </Button>
            
            <Button 
              onClick={createTestKey} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? 'Creating...' : 'Create Test Key'}
            </Button>
          </div>
          
          {testResult && (
            <Alert>
              <AlertDescription>
                <pre className="whitespace-pre-wrap text-xs">{testResult}</pre>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
