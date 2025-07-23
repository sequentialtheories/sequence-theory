
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

    // Check if wallet already exists for this user
    const { data: existingWallet, error: walletCheckError } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', user_id)
      .maybeSingle();

    if (walletCheckError) {
      throw new Error(`Failed to check existing wallet: ${walletCheckError.message}`);
    }

    if (existingWallet) {
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

    // Create wallet using Sequence API with just the email
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

    if (!walletResponse.ok) {
      const errorText = await walletResponse.text();
      console.error('Sequence API error:', errorText);
      
      // Check if wallet already exists for this email
      if (errorText.includes('already exists') || errorText.includes('duplicate')) {
        throw new Error('A wallet already exists for this email address');
      }
      
      throw new Error(`Failed to create wallet: ${walletResponse.status} - ${errorText}`);
    }

    const walletData: SequenceWalletResponse = await walletResponse.json();
    console.log('Created wallet with address:', walletData.address);

    // Insert wallet into database
    const { error: insertError } = await supabase
      .from('user_wallets')
      .insert({
        user_id,
        wallet_address: walletData.address,
        wallet_config: {
          email: profile.email,
          chainId: walletData.chainId,
          created_at: new Date().toISOString()
        },
        network: 'polygon'
      });

    if (insertError) {
      throw new Error(`Failed to save wallet: ${insertError.message}`);
    }

    console.log('Successfully created wallet for user:', user_id);

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
