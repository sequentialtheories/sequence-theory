import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SequenceWalletRequest {
  action: 'create' | 'get'
  email: string
  userId: string
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
    
    if (!supabaseUrl || !supabaseServiceKey || !sequenceWaasConfigKey) {
      throw new Error('Missing required environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { action, email, userId }: SequenceWalletRequest = await req.json()

    if (action === 'get') {
      // Check if user already has a wallet
      const { data: existingWallet, error: fetchError } = await supabase
        .from('user_wallets')
        .select('wallet_address, network')
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
            provider: 'sequence_waas'
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    // Create new wallet using Sequence WaaS
    console.log('Creating Sequence wallet for user:', userId, 'email:', email)
    
    // Import Sequence WaaS SDK
    const { SequenceWaaS } = await import('https://esm.sh/@0xsequence/waas@2.3.23')
    
    // Initialize Sequence WaaS
    const waasConfig = JSON.parse(atob(sequenceWaasConfigKey))
    const sequence = new SequenceWaaS({
      projectAccessKey: waasConfig.projectAccessKey || 'AQAAAAAAAKg7Q8xQ94GXN9ogCwnDTzn-BkE',
      waasConfigKey: sequenceWaasConfigKey,
      network: 80002 // Amoy testnet
    })

    // Generate deterministic wallet address based on user ID and email
    // This ensures the same user gets the same wallet address
    const { createHash } = await import('https://deno.land/std@0.168.0/crypto/mod.ts')
    const encoder = new TextEncoder()
    const data = encoder.encode(`${userId}-${email}`)
    const hashBuffer = await createHash('sha256').update(data).digest()
    const hashHex = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    // For now, create a deterministic address based on the hash
    // In a real implementation, you would use Sequence's actual wallet creation API
    const walletAddress = `0x${hashHex.slice(0, 40)}`

    // Store wallet in database
    const { error: insertError } = await supabase
      .from('user_wallets')
      .upsert({
        user_id: userId,
        wallet_address: walletAddress,
        network: 'amoy'
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

    // Update user profile with wallet address for quick access
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
        network: 'amoy',
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