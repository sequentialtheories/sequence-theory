// Test script to debug RPC calls
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://qldjhlnsphlixmzzrdwi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsZGpobG5zcGhsaXhtenpyZHdpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzAxNDI2OCwiZXhwIjoyMDY4NTkwMjY4fQ.dHNmZbHpOY6RxW_m5nNXQyqiUH7w3gd1R0BSHjh7a48'
)

async function testRPC() {
  console.log('Testing generate_api_key...')
  const { data: apiKey, error: genError } = await supabase.rpc('generate_api_key')
  console.log('API Key:', apiKey, 'Error:', genError)
  
  if (apiKey) {
    console.log('Testing hash_api_key...')
    const { data: hashedKey, error: hashError } = await supabase.rpc('hash_api_key', { api_key: apiKey })
    console.log('Hashed Key:', hashedKey, 'Error:', hashError)
  }
}

testRPC()