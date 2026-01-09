// SECURITY: This function has been disabled for security reasons
// Public API key creation is a critical security vulnerability

import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://id-preview--902c4709-595e-47f5-b881-6247d8b5fbf9.lovable.app', // Restrict to your domain
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // SECURITY: This endpoint is now disabled to prevent unauthorized API key creation
  console.log('⚠️ SECURITY: Attempt to access disabled test API key creation endpoint')
  
  return new Response(
    JSON.stringify({
      success: false,
      error: 'This endpoint has been disabled for security reasons. API keys must be created through authenticated user accounts.',
      code: 'ENDPOINT_DISABLED'
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 403,
    }
  )
})