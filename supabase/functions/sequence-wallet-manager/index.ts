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

    if (!supabaseUrl || !supabaseServiceKey) {
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

  // Only handle 'get' action - wallet creation now happens client-side
  if (action === 'get') {
    // Fetch existing wallet from database
    const { data: existingWallet, error: fetchError } = await supabase
      .from('user_wallets')
      .select('wallet_address, network, provider')
      .eq('user_id', userId)
      .maybeSingle()

    if (fetchError) {
      console.error('Error fetching wallet:', fetchError)
      return new Response(JSON.stringify({
        success: false,
        error: `Failed to fetch wallet: ${fetchError.message}`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      })
    }

    if (existingWallet) {
      return new Response(JSON.stringify({
        success: true,
        wallet: {
          address: existingWallet.wallet_address,
          network: existingWallet.network,
          provider: existingWallet.provider || 'sequence_waas'
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // No wallet found
    return new Response(JSON.stringify({
      success: false,
      error: 'No wallet found for user'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 404
    })
  }

  // Unsupported action
  return new Response(JSON.stringify({
    success: false,
    error: 'Wallet creation moved to client-side. Use the frontend SDK.'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 400
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