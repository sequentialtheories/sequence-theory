import { supabase } from "@/integrations/supabase/client";

export default function TestApiCreation() {
  const testApiKeyCreation = async () => {
    try {
      const response = await fetch('https://qldjhlnsphlixmzzrdwi.supabase.co/functions/v1/create-test-api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('API Key Creation Response:', data);
      
      if (data.success) {
        alert('SUCCESS! API Key created: ' + data.data.api_key);
      } else {
        alert('ERROR: ' + data.error);
      }
    } catch (error) {
      console.error('Test failed:', error);
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