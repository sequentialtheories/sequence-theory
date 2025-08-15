import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const featureFlags = {
      SIMULATION_MODE: Deno.env.get('SIMULATION_MODE') === '1' || Deno.env.get('SIMULATION_MODE') === 'true',
      DISABLE_METAMASK: Deno.env.get('DISABLE_METAMASK') === '1' || Deno.env.get('DISABLE_METAMASK') === 'true',
      TESTNET_ONLY: Deno.env.get('FEATURE_TESTNET_ONLY') === '1' || Deno.env.get('FEATURE_TESTNET_ONLY') === 'true',
      DEBUG_MODE: Deno.env.get('DEBUG_MODE') === 'true'
    }

    return new Response(
      JSON.stringify(featureFlags),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
