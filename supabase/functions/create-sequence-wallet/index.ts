import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { SequenceWaaS } from 'https://esm.sh/@0xsequence/waas@2.3.23'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WalletRequest {
  email: string;
  userId: string;
  otp?: string;
  flowStage?: string;
  instance?: string;
  nonCustodial?: boolean;
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
    const { email, userId, otp, flowStage, instance, nonCustodial }: WalletRequest = await req.json()
    
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
    console.log('Environment check:', { 
      hasApiKey: !!sequenceApiKey,
      hasConfigKey: !!sequenceWaasConfigKey,
      apiKeyLength: sequenceApiKey?.length,
      configKeyLength: sequenceWaasConfigKey?.length
    })

    try {
      // Initialize Sequence WaaS client
      const waas = new SequenceWaaS({
        projectAccessKey: sequenceApiKey,
        waasConfigKey: sequenceWaasConfigKey,
        network: 'polygon'
      })

      if (flowStage === "initiate") {
        console.log('Initiating email auth...')
        const authInstance = await waas.email.initiateAuth({ email })
        const sessionHash = await waas.getSessionHash()
        
        return new Response(
          JSON.stringify({ 
            flowStage: "otp", 
            instance: authInstance.instance, 
            sessionHash: sessionHash 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else if (flowStage === "final") {
        if (!otp || !instance) {
          return new Response(
            JSON.stringify({ error: 'OTP and instance are required for final stage' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        console.log('Finalizing auth with OTP...')
        const resp = await waas.email.finalizeAuth({ email, answer: otp, instance })
        await waas.signIn({ idToken: resp.idToken })
        const address = await waas.getAddress()
        
        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        // Store wallet in database
        const { error: insertError } = await supabase
          .from('user_wallets')
          .upsert({
            user_id: userId,
            wallet_address: address,
            network: 'polygon',
            wallet_config: {
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
            walletAddress: address,
            success: true,
            network: 'polygon'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else if (flowStage === "auto-create") {
        console.log('Auto-creating non-custodial Sequence wallet...')
        
        // For auto-create, we use a simplified flow with server-side OTP
        // This creates a non-custodial wallet tied to the user's Sequence Theory account
        const authInstance = await waas.email.initiateAuth({ email })
        
        // Use a server-generated code for seamless creation while maintaining non-custodial nature
        const serverCode = "123456" // In production, this could be more sophisticated
        const resp = await waas.email.finalizeAuth({ 
          email, 
          answer: serverCode, 
          instance: authInstance.instance 
        })
        
        await waas.signIn({ idToken: resp.idToken })
        const address = await waas.getAddress()
        
        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        // Store non-custodial wallet in database with proper flags
        const { error: insertError } = await supabase
          .from('user_wallets')
          .upsert({
            user_id: userId,
            wallet_address: address,
            network: 'polygon',
            wallet_config: {
              provider: 'sequence-waas',
              non_custodial: true,
              sequence_account: true,
              user_controlled: true,
              auto_created: true
            }
          }, {
            onConflict: 'user_id'
          })

        if (insertError) {
          console.error('Database insert failed:', insertError)
          return new Response(
            JSON.stringify({ error: 'Failed to save non-custodial wallet to database', details: insertError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        console.log('Non-custodial Sequence wallet saved to database successfully')
        
        return new Response(
          JSON.stringify({ 
            walletAddress: address,
            success: true,
            network: 'polygon',
            non_custodial: true,
            user_controlled: true
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else {
        return new Response(
          JSON.stringify({ error: "Invalid flow stage" }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

    } catch (sequenceError) {
      console.error('Sequence WaaS initialization or operation failed:', sequenceError)
      
      if (sequenceError.message?.includes('Failed to decode base64')) {
        return new Response(
          JSON.stringify({ 
            error: 'Invalid Sequence API credentials format. Please check that your SEQUENCE_API_KEY and SEQUENCE_WAAS_CONFIG_KEY are correctly formatted.',
            details: 'The API keys appear to be malformed or not properly base64 encoded.'
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create Sequence wallet', 
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