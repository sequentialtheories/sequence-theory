import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { SequenceWaaS } from 'https://esm.sh/@0xsequence/waas@2.3.23'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate request body
    const contentType = req.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({ error: 'Content-Type must be application/json' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.json()
    const { email, userId, otp, authInstance, sessionHash, action } = body
    
    // Input validation and sanitization
    if (!email || !userId) {
      return new Response(
        JSON.stringify({ error: 'Email and userId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate UUID format for userId
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid userId format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Sanitize email
    const sanitizedEmail = email.trim().toLowerCase()

    // Get secure environment variables
    const sequenceApiKey = Deno.env.get('SEQUENCE_API_KEY')
    const sequenceWaasConfigKey = Deno.env.get('SEQUENCE_WAAS_CONFIG_KEY')
    
    if (!sequenceApiKey || !sequenceWaasConfigKey) {
      console.error('Missing Sequence credentials')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if user already has a wallet
    const { data: existingWallet } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (existingWallet?.wallet_address && existingWallet.wallet_address.startsWith('0x')) {
      return new Response(
        JSON.stringify({ 
          walletAddress: existingWallet.wallet_address,
          success: true,
          network: existingWallet.network || 'polygon'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Sequence WaaS client with secure credentials
    const waas = new SequenceWaaS({
      projectAccessKey: sequenceApiKey,
      waasConfigKey: sequenceWaasConfigKey,
      network: 'polygon'
    })

    try {
      if (action === 'initiate') {
        // Initiate email authentication
        const sessionHash = await waas.getSessionHash()
        const authResult = await waas.email.initiateAuth({ 
          email: sanitizedEmail
        })

        if (!authResult.instance) {
          throw new Error('Failed to initiate email authentication')
        }

        return new Response(
          JSON.stringify({ 
            success: true,
            action: 'otp_required',
            authInstance: authResult.instance,
            sessionHash
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else if (action === 'complete') {
        // Validate OTP input
        if (!otp || !authInstance || !sessionHash) {
          return new Response(
            JSON.stringify({ error: 'OTP, authInstance, and sessionHash are required for completion' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Validate OTP format (should be 6 digits)
        const otpRegex = /^\d{6}$/
        if (!otpRegex.test(otp)) {
          return new Response(
            JSON.stringify({ error: 'Invalid OTP format. Must be 6 digits.' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Complete authentication with OTP
        const authResp = await waas.email.finalizeAuth({ 
          email: sanitizedEmail, 
          answer: otp,
          instance: authInstance,
          sessionHash
        })
        
        // Sign in with the ID token
        await waas.signIn({ idToken: authResp.idToken }, sessionHash)
        
        // Get the wallet address
        const address = await waas.getAddress()

        if (!address || !address.startsWith('0x')) {
          throw new Error('Invalid wallet address generated')
        }

        // Store wallet in database with secure configuration
        const { error: insertError } = await supabase
          .from('user_wallets')
          .upsert({
            user_id: userId,
            wallet_address: address,
            network: 'polygon',
            wallet_config: {
              provider: 'sequence-embedded',
              non_custodial: true,
              secure: true,
              created_at: new Date().toISOString()
            }
          }, {
            onConflict: 'user_id'
          })

        if (insertError) {
          console.error('Database insert failed:', insertError)
          return new Response(
            JSON.stringify({ error: 'Failed to save wallet to database' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ 
            walletAddress: address,
            success: true,
            network: 'polygon'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else {
        return new Response(
          JSON.stringify({ error: 'Invalid action. Must be "initiate" or "complete"' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    } catch (sequenceError) {
      console.error('Sequence wallet creation failed:', sequenceError)
      return new Response(
        JSON.stringify({ 
          error: 'Wallet creation failed',
          details: sequenceError.message 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

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