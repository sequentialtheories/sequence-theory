import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WalletRequest {
  email: string;
  userId: string;
}

interface SequenceWalletResponse {
  address: string;
  session?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, userId }: WalletRequest = await req.json()
    
    if (!email || !userId) {
      return new Response(
        JSON.stringify({ error: 'Email and userId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get environment variables
    const sequenceApiKey = Deno.env.get('SEQUENCE_API_KEY')
    const sequenceWaasConfigKey = Deno.env.get('SEQUENCE_WAAS_CONFIG_KEY')
    
    if (!sequenceApiKey || !sequenceWaasConfigKey) {
      console.error('Missing required environment variables:', { 
        hasApiKey: !!sequenceApiKey, 
        hasConfigKey: !!sequenceWaasConfigKey 
      })
      return new Response(
        JSON.stringify({ error: 'Server configuration error: Missing Sequence credentials' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Creating Sequence wallet for user:', { userId, email })

    // Create wallet using Sequence WaaS API
    // First, create a session for the user
    const sessionResponse = await fetch('https://waas.sequence.app/rpc/WaaS/CreateSession', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': sequenceApiKey,
      },
      body: JSON.stringify({
        projectId: sequenceWaasConfigKey,
        email: email,
        externalUserId: userId
      })
    })

    if (!sessionResponse.ok) {
      const errorText = await sessionResponse.text()
      console.error('Session creation failed:', { 
        status: sessionResponse.status, 
        statusText: sessionResponse.statusText,
        error: errorText
      })
      return new Response(
        JSON.stringify({ 
          error: `Failed to create session: ${sessionResponse.status} ${sessionResponse.statusText}`,
          details: errorText
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const sessionData = await sessionResponse.json()
    console.log('Session created successfully:', { sessionId: sessionData.sessionId })

    // Now create/get the wallet for this session
    const walletResponse = await fetch('https://waas.sequence.app/rpc/WaaS/GetWallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': sequenceApiKey,
        'X-Session-Token': sessionData.sessionToken
      },
      body: JSON.stringify({})
    })

    if (!walletResponse.ok) {
      const errorText = await walletResponse.text()
      console.error('Wallet retrieval failed:', { 
        status: walletResponse.status, 
        statusText: walletResponse.statusText,
        error: errorText
      })
      return new Response(
        JSON.stringify({ 
          error: `Failed to get wallet: ${walletResponse.status} ${walletResponse.statusText}`,
          details: errorText
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const walletData: SequenceWalletResponse = await walletResponse.json()
    console.log('Wallet retrieved successfully:', { address: walletData.address })

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Store wallet in database
    const { error: insertError } = await supabase
      .from('user_wallets')
      .upsert({
        user_id: userId,
        wallet_address: walletData.address,
        network: 'polygon',
        wallet_config: {
          sessionToken: sessionData.sessionToken,
          sessionId: sessionData.sessionId,
          provider: 'sequence-waas'
        }
      }, {
        onConflict: 'user_id'
      })

    if (insertError) {
      console.error('Database insert failed:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to save wallet to database', details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Wallet saved to database successfully')

    return new Response(
      JSON.stringify({ 
        walletAddress: walletData.address,
        success: true,
        network: 'polygon'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in create-sequence-wallet function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})