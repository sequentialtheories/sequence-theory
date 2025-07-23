
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SequenceWalletResponse {
  address: string;
  chainId: number;
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

    console.log('Creating wallet for user:', user_id);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user profile to access email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('user_id', user_id)
      .single();

    if (profileError || !profile) {
      throw new Error(`Failed to get user profile: ${profileError?.message || 'Profile not found'}`);
    }

    // Check if wallet already exists
    const { data: existingWallet, error: walletCheckError } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', user_id)
      .maybeSingle();

    if (walletCheckError) {
      throw new Error(`Failed to check existing wallet: ${walletCheckError.message}`);
    }

    // If wallet exists and is not pending, return success
    if (existingWallet && !existingWallet.wallet_address.startsWith('pending_')) {
      console.log('Wallet already exists for user:', user_id);
      return new Response(
        JSON.stringify({ 
          success: true, 
          wallet_address: existingWallet.wallet_address,
          message: 'Wallet already exists'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Sequence API key
    const sequenceApiKey = Deno.env.get('SEQUENCE_API_KEY');
    if (!sequenceApiKey) {
      throw new Error('Sequence API key not configured');
    }

    console.log('Creating Sequence wallet for email:', profile.email);

    // Create wallet using Sequence API
    const walletResponse = await fetch('https://api.sequence.app/rpc/Wallet/Create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sequenceApiKey}`,
      },
      body: JSON.stringify({
        network: 'polygon',
        email: profile.email,
        config: {
          threshold: 1,
          checkpoint: 0
        }
      }),
    });

    if (!walletResponse.ok) {
      const errorText = await walletResponse.text();
      console.error('Sequence API error:', errorText);
      throw new Error(`Failed to create wallet: ${walletResponse.status} - ${errorText}`);
    }

    const walletData: SequenceWalletResponse = await walletResponse.json();
    
    console.log('Created wallet with address:', walletData.address);

    // Generate a private key for the wallet (this is a placeholder - in production you'd get this from Sequence)
    const privateKey = `0x${Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('')}`;

    const walletConfig = {
      chainId: walletData.chainId,
      email: profile.email,
      status: 'active',
      created_at: new Date().toISOString(),
      method: 'direct_api',
      private_key: privateKey
    };

    // Update or insert wallet
    if (existingWallet) {
      const { error: updateError } = await supabase
        .from('user_wallets')
        .update({
          wallet_address: walletData.address,
          wallet_config: walletConfig
        })
        .eq('user_id', user_id);

      if (updateError) {
        throw new Error(`Failed to update wallet: ${updateError.message}`);
      }
    } else {
      const { error: insertError } = await supabase
        .from('user_wallets')
        .insert({
          user_id,
          wallet_address: walletData.address,
          wallet_config: walletConfig,
          network: 'polygon'
        });

      if (insertError) {
        throw new Error(`Failed to insert wallet: ${insertError.message}`);
      }
    }

    console.log('Successfully created/updated wallet for user:', user_id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        wallet_address: walletData.address,
        message: 'Wallet created successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
