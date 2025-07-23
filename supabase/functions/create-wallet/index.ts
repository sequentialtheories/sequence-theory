
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();
    
    if (!user_id) {
      throw new Error('User ID is required');
    }

    console.log('Processing wallet request for user:', user_id);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('user_id', user_id)
      .single();

    if (profileError || !profile) {
      throw new Error(`User profile not found: ${profileError?.message}`);
    }

    console.log('User email:', profile.email);

    // Check if wallet already exists in our database
    const { data: existingWallet } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', user_id)
      .maybeSingle();

    if (existingWallet && !existingWallet.wallet_address.startsWith('pending_')) {
      console.log('Wallet already exists:', existingWallet.wallet_address);
      return new Response(
        JSON.stringify({ 
          success: true, 
          wallet_address: existingWallet.wallet_address,
          message: 'Wallet already connected'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sequenceApiKey = Deno.env.get('SEQUENCE_API_KEY');
    if (!sequenceApiKey) {
      throw new Error('Sequence API key not configured');
    }

    // Try to create wallet with Sequence
    console.log('Calling Sequence API to create/connect wallet for:', profile.email);
    
    const walletResponse = await fetch('https://api.sequence.app/rpc/Wallet/Create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sequenceApiKey}`,
      },
      body: JSON.stringify({
        network: 'polygon',
        email: profile.email
      }),
    });

    const responseText = await walletResponse.text();
    console.log('Sequence API response:', walletResponse.status, responseText);

    let walletAddress: string;
    
    if (walletResponse.ok) {
      // Successfully created new wallet
      const walletData = JSON.parse(responseText);
      walletAddress = walletData.address;
      console.log('New wallet created:', walletAddress);
    } else if (responseText.includes('already exists') || responseText.includes('duplicate')) {
      // Wallet already exists - need to get the existing wallet address
      // This is where we'd typically make another API call to get the existing wallet
      // For now, we'll extract from error or make a separate call
      console.log('Wallet already exists for this email, connecting to existing wallet');
      
      // Try to get existing wallet info (this might need a different API endpoint)
      // For now, we'll use a placeholder approach
      throw new Error('Email already has a Sequence wallet. Please contact support to link existing wallet.');
    } else {
      throw new Error(`Sequence API error: ${responseText}`);
    }

    // Save or update wallet in database
    const walletConfig = {
      email: profile.email,
      network: 'polygon',
      created_at: new Date().toISOString()
    };

    if (existingWallet) {
      // Update existing pending wallet
      const { error: updateError } = await supabase
        .from('user_wallets')
        .update({
          wallet_address: walletAddress,
          wallet_config: walletConfig
        })
        .eq('user_id', user_id);

      if (updateError) {
        throw new Error(`Failed to update wallet: ${updateError.message}`);
      }
    } else {
      // Insert new wallet
      const { error: insertError } = await supabase
        .from('user_wallets')
        .insert({
          user_id,
          wallet_address: walletAddress,
          wallet_config: walletConfig,
          network: 'polygon'
        });

      if (insertError) {
        throw new Error(`Failed to save wallet: ${insertError.message}`);
      }
    }

    console.log('Wallet successfully connected for user:', user_id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        wallet_address: walletAddress,
        message: 'Wallet connected successfully'
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
