import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SequenceWalletResponse {
  wallet: {
    address: string;
    config: Record<string, any>;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();
    
    if (!user_id) {
      throw new Error('User ID is required');
    }

    console.log(`Creating wallet for user: ${user_id}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user already has a wallet
    const { data: existingWallet, error: checkError } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', user_id)
      .maybeSingle();

    if (existingWallet) {
      console.log(`User ${user_id} already has a wallet`);
      return new Response(
        JSON.stringify({ success: true, message: 'Wallet already exists' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create wallet using Sequence API
    const sequenceApiKey = Deno.env.get('SEQUENCE_API_KEY');
    if (!sequenceApiKey) {
      throw new Error('Sequence API key not configured');
    }

    // Create a new Sequence wallet
    const walletResponse = await fetch('https://api.sequence.app/rpc/Relayer/CreateWallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sequenceApiKey}`,
      },
      body: JSON.stringify({
        network: 'polygon',
        config: {
          threshold: 1,
          checkpoint: 0
        }
      }),
    });

    if (!walletResponse.ok) {
      const errorText = await walletResponse.text();
      console.error('Sequence API error:', errorText);
      throw new Error(`Failed to create wallet: ${walletResponse.status}`);
    }

    const walletData: SequenceWalletResponse = await walletResponse.json();
    
    console.log(`Created wallet address: ${walletData.wallet.address}`);

    // Store wallet in database
    const { error: insertError } = await supabase
      .from('user_wallets')
      .insert({
        user_id,
        wallet_address: walletData.wallet.address,
        wallet_config: walletData.wallet.config,
        network: 'polygon'
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error(`Failed to store wallet: ${insertError.message}`);
    }

    console.log(`Successfully created and stored wallet for user ${user_id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        wallet_address: walletData.wallet.address,
        message: 'Wallet created successfully' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in create-wallet function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});