import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SequenceWalletRequest {
  action: 'create' | 'get'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const sequenceWaasConfigKey = Deno.env.get('SEQUENCE_WAAS_CONFIG_KEY')!
    const sequenceProjectAccessKey = Deno.env.get('SEQUENCE_PROJECT_ACCESS_KEY')!

    if (!supabaseUrl || !supabaseServiceKey || !sequenceWaasConfigKey || !sequenceProjectAccessKey) {
      throw new Error('Missing required environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get authenticated user from JWT
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.split(' ')[1])
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Rate limiting
    const { data: rateLimitData, error: rateLimitError } = await supabase.rpc('check_rate_limit', {
      p_identifier: `wallet_create:${user.id}`,
      p_limit: 5,
      p_window_minutes: 60
    })

    if (rateLimitError) {
      console.warn('Rate limit check failed:', rateLimitError)
    } else if (!rateLimitData) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { action }: SequenceWalletRequest = await req.json()
    const userId = user.id
    const email = user.email!

    if (action === 'get') {
      // Check if user already has a wallet
      const { data: existingWallet, error: fetchError } = await supabase
        .from('user_wallets')
        .select('wallet_address, network, provider')
        .eq('user_id', userId)
        .maybeSingle()

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching wallet:', fetchError)
        return new Response(JSON.stringify({ error: 'Failed to fetch wallet' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      if (existingWallet) {
        return new Response(JSON.stringify({
          success: true,
          wallet: {
            address: existingWallet.wallet_address,
            network: existingWallet.network,
            provider: existingWallet.provider
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    // Create new wallet using Sequence WaaS
    console.log('Creating Sequence wallet for user:', userId, 'email:', email)

    let walletAddress: string

    try {
      // Import Sequence WaaS SDK
      const { SequenceWaaS } = await import('https://esm.sh/@0xsequence/waas@2.3.23')

      // Initialize Sequence WaaS
      const sequence = new SequenceWaaS({
        projectAccessKey: sequenceProjectAccessKey,
        waasConfigKey: sequenceWaasConfigKey,
        network: 'polygon'
      })

      // Use signIn method to create/retrieve wallet
      const signInResponse = await sequence.signIn({ 
        email: email 
      })

      walletAddress = signInResponse.wallet
      console.log('Sequence wallet created/retrieved:', walletAddress)

    } catch (sequenceError) {
      console.error('Sequence WaaS authentication failed:', sequenceError)
      return new Response(JSON.stringify({ 
        error: 'Wallet creation failed: ' + sequenceError.message,
        details: 'Sequence WaaS authentication error'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Store wallet in database
    const { error: insertError } = await supabase
      .from('user_wallets')
      .upsert({
        user_id: userId,
        wallet_address: walletAddress,
        network: 'polygon',
        provider: 'sequence_waas'
      }, {
        onConflict: 'user_id'
      })

    if (insertError) {
      console.error('Error storing wallet:', insertError)
      return new Response(JSON.stringify({ error: 'Failed to store wallet' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Update user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ eth_address: walletAddress })
      .eq('user_id', userId)

    if (profileError) {
      console.warn('Error updating profile with wallet address:', profileError)
    }

    console.log('Successfully created wallet for user:', userId)

    return new Response(JSON.stringify({
      success: true,
      wallet: {
        address: walletAddress,
        network: 'polygon',
        provider: 'sequence_waas'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Sequence wallet manager error:', error)
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})