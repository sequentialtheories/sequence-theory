import { supabase } from "@/integrations/supabase/client";
import { configService } from '@/lib/config';
import { logger } from '@/lib/logger';

export default function TestApiCreation() {
  const testApiKeyCreation = async () => {
    try {
      const config = configService.getConfig();
      const response = await fetch(`${config.supabaseUrl}/functions/v1/create-test-api-key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      logger.info('API Key Creation Response received', { success: data.success });
      
      if (data.success) {
        alert('SUCCESS! API Key created: [REDACTED]');
        logger.info('API Key created successfully', { keyPrefix: data.data.key_prefix });
      } else {
        alert('ERROR: ' + data.error);
        logger.error('API Key creation failed', { error: data.error });
      }
    } catch (error) {
      logger.error('Test failed', error);
      alert('Test failed: ' + error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">API Key Creation Test</h2>
      <button 
        onClick={testApiKeyCreation}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test Create API Key
      </button>
      <p className="mt-4 text-sm text-gray-600">
        This will test the complete edge function workflow including hash_api_key.
        Check the console and alert for results.
      </p>
    </div>
  );
}
