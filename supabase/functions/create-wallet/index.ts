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

    let walletAddress: string;
    
    // First, try to get existing wallet using Sequence API
    console.log('Checking for existing wallet with Sequence API for:', profile.email);
    
    try {
      const getWalletResponse = await fetch('https://api.sequence.app/rpc/Wallet/GetWallet', {
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

      const getWalletText = await getWalletResponse.text();
      console.log('Get wallet response:', getWalletResponse.status, getWalletText);

      if (getWalletResponse.ok) {
        // Existing wallet found
        const existingWalletData = JSON.parse(getWalletText);
        walletAddress = existingWalletData.address;
        console.log('Found existing wallet:', walletAddress);
      } else {
        // No existing wallet, create a new one
        console.log('No existing wallet found, creating new one');
        
        const createWalletResponse = await fetch('https://api.sequence.app/rpc/Wallet/Create', {
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

        const createWalletText = await createWalletResponse.text();
        console.log('Create wallet response:', createWalletResponse.status, createWalletText);

        if (createWalletResponse.ok) {
          const walletData = JSON.parse(createWalletText);
          walletAddress = walletData.address;
          console.log('New wallet created:', walletAddress);
        } else if (createWalletText.includes('already exists') || createWalletText.includes('duplicate')) {
          // Wallet was created between our get and create calls, try to get it again
          console.log('Wallet was created concurrently, attempting to retrieve it');
          
          const retryResponse = await fetch('https://api.sequence.app/rpc/Wallet/GetWallet', {
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

          if (retryResponse.ok) {
            const retryData = JSON.parse(await retryResponse.text());
            walletAddress = retryData.address;
            console.log('Retrieved wallet after concurrent creation:', walletAddress);
          } else {
            throw new Error('Failed to retrieve wallet after concurrent creation');
          }
        } else {
          throw new Error(`Failed to create wallet: ${createWalletText}`);
        }
      }
    } catch (apiError) {
      console.error('Sequence API error:', apiError);
      throw new Error(`Sequence API error: ${apiError.message}`);
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
