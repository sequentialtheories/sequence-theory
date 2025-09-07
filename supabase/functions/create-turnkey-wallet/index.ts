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

    console.log('Creating Turnkey wallet for user:', user.id)

    // Get Turnkey credentials from environment
    const organizationId = Deno.env.get('TURNKEY_ORGANIZATION_ID')
    const apiPublicKey = Deno.env.get('TURNKEY_API_PUBLIC_KEY')
    const apiPrivateKey = Deno.env.get('TURNKEY_API_PRIVATE_KEY')

    if (!organizationId || !apiPublicKey || !apiPrivateKey) {
      console.error('Missing Turnkey credentials')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
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
      .single()

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

    // Create sub-organization with wallet for the user
    const subOrgName = `user-${user.id}`
    const walletName = `wallet-${user.id}`

    const createSubOrgPayload = {
      type: "ACTIVITY_TYPE_CREATE_SUB_ORGANIZATION_V4",
      organizationId,
      parameters: {
        subOrganizationName: subOrgName,
        rootUsers: [],
        rootQuorumThreshold: 1,
        wallet: {
          walletName,
          accounts: [
            {
              curve: "CURVE_SECP256K1",
              pathFormat: "PATH_FORMAT_BIP32",
              path: "m/44'/60'/0'/0/0",
              addressFormat: "ADDRESS_FORMAT_ETHEREUM"
            }
          ]
        }
      },
      timestampMs: Date.now().toString()
    }

    console.log('Creating Turnkey sub-organization with payload:', JSON.stringify(createSubOrgPayload, null, 2))

    // Make request to Turnkey API
    const turnkeyResponse = await fetch('https://api.turnkey.com/public/v1/submit/create_sub_organization', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Stamp': JSON.stringify({
          publicKey: apiPublicKey,
          scheme: "SIGNATURE_SCHEME_TK_API_P256",
          signature: "placeholder" // In production, this would be properly signed
        })
      },
      body: JSON.stringify(createSubOrgPayload)
    })

    if (!turnkeyResponse.ok) {
      const errorText = await turnkeyResponse.text()
      console.error('Turnkey API error:', errorText)
      return new Response(
        JSON.stringify({ error: 'Failed to create Turnkey wallet' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const turnkeyResult = await turnkeyResponse.json()
    console.log('Turnkey response:', JSON.stringify(turnkeyResult, null, 2))

    // Extract wallet address and sub-org ID from response
    const subOrgId = turnkeyResult.activity?.result?.createSubOrganizationResultV4?.subOrganizationId
    const walletAddress = turnkeyResult.activity?.result?.createSubOrganizationResultV4?.wallet?.addresses?.[0]

    if (!subOrgId || !walletAddress) {
      console.error('Missing sub-org ID or wallet address in Turnkey response')
      return new Response(
        JSON.stringify({ error: 'Invalid response from Turnkey' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Store wallet in database
    const { error: insertError } = await supabaseClient
      .from('user_wallets')
      .insert({
        user_id: user.id,
        wallet_address: walletAddress,
        provider: 'turnkey',
        provenance: 'turnkey_embedded',
        network: 'ethereum',
        created_via: 'turnkey',
        turnkey_sub_org_id: subOrgId
      })

    if (insertError) {
      console.error('Failed to store wallet in database:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to store wallet' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Successfully created Turnkey wallet:', walletAddress)

    return new Response(
      JSON.stringify({ 
        success: true, 
        wallet_address: walletAddress,
        sub_org_id: subOrgId,
        message: 'Wallet created successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error creating Turnkey wallet:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})