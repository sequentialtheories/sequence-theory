import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user from the request
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      console.error('User authentication failed:', userError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Creating Turnkey wallet for user:', user.id, 'email:', user.email)

    // Get Turnkey credentials from environment
    const organizationId = Deno.env.get('TURNKEY_ORGANIZATION_ID')
    const apiPublicKey = Deno.env.get('TURNKEY_API_PUBLIC_KEY')
    const apiPrivateKey = Deno.env.get('TURNKEY_API_PRIVATE_KEY')

    if (!organizationId || !apiPublicKey || !apiPrivateKey) {
      console.error('Missing Turnkey credentials:', { organizationId: !!organizationId, apiPublicKey: !!apiPublicKey, apiPrivateKey: !!apiPrivateKey })
      return new Response(
        JSON.stringify({ error: 'Server configuration error - missing Turnkey credentials' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if user already has a Turnkey wallet
    const { data: existingWallet } = await supabaseClient
      .from('user_wallets')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', 'turnkey')
      .maybeSingle()

    if (existingWallet) {
      console.log('User already has Turnkey wallet:', existingWallet.wallet_address)
      return new Response(
        JSON.stringify({ 
          success: true, 
          wallet_address: existingWallet.wallet_address,
          sub_org_id: existingWallet.turnkey_sub_org_id,
          message: 'Wallet already exists'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create a minimal test connection to Turnkey first
    console.log('Testing Turnkey API connection...')
    
    const testPayload = {
      type: "ACTIVITY_TYPE_GET_ORGANIZATION",
      organizationId,
      timestampMs: Date.now().toString()
    }

    const testResponse = await fetch('https://api.turnkey.com/public/v1/submit/get_organization', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    })

    const testResult = await testResponse.text()
    console.log('Turnkey test connection result:', testResponse.status, testResult)

    // For now, create a simulated wallet response since we need proper WebAuthn setup
    // This is a temporary solution until proper Turnkey SDK integration
    const mockWalletAddress = '0x' + Array.from(crypto.getRandomValues(new Uint8Array(20)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    const mockSubOrgId = crypto.randomUUID()

    console.log('Creating simulated wallet for testing:', mockWalletAddress)

    // Store wallet in database
    const { error: insertError } = await supabaseClient
      .from('user_wallets')
      .insert({
        user_id: user.id,
        wallet_address: mockWalletAddress,
        provider: 'turnkey',
        provenance: 'turnkey_embedded',
        network: 'ethereum',
        created_via: 'turnkey',
        turnkey_sub_org_id: mockSubOrgId
      })

    if (insertError) {
      console.error('Failed to store wallet in database:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to store wallet in database', details: insertError }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Successfully created simulated Turnkey wallet:', mockWalletAddress)

    return new Response(
      JSON.stringify({ 
        success: true, 
        wallet_address: mockWalletAddress,
        sub_org_id: mockSubOrgId,
        message: 'Simulated non-custodial wallet created for testing'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error creating Turnkey wallet:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})