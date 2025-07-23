
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

    if (checkError) {
      console.error('Error checking existing wallet:', checkError);
      throw new Error(`Failed to check existing wallet: ${checkError.message}`);
    }

    if (existingWallet && !existingWallet.wallet_address.startsWith('pending_')) {
      console.log(`User ${user_id} already has a wallet: ${existingWallet.wallet_address}`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Wallet already exists',
          wallet_address: existingWallet.wallet_address
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user's email from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('user_id', user_id)
      .single();

    if (profileError || !profile) {
      console.error('Error fetching user profile:', profileError);
      throw new Error('Failed to fetch user profile');
    }

    const userEmail = profile.email;
    console.log(`Creating wallet for email: ${userEmail}`);

    // Get Sequence API key
    const sequenceApiKey = Deno.env.get('SEQUENCE_API_KEY');
    if (!sequenceApiKey) {
      throw new Error('Sequence API key not configured');
    }

    // Create wallet using Sequence's email-based approach
    const walletResponse = await fetch('https://api.sequence.app/rpc/Wallet/SendIntent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sequenceApiKey}`,
      },
      body: JSON.stringify({
        network: 'polygon',
        intent: {
          type: 'openSession',
          sessionId: `vault_club_${user_id}`,
        },
        wallet: {
          type: 'email',
          email: userEmail,
        }
      }),
    });

    if (!walletResponse.ok) {
      const errorText = await walletResponse.text();
      console.error('Sequence API error:', errorText);
      
      // Try alternative approach - direct wallet creation
      const createWalletResponse = await fetch('https://api.sequence.app/rpc/Wallet/Create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sequenceApiKey}`,
        },
        body: JSON.stringify({
          network: 'polygon',
          email: userEmail,
          config: {
            threshold: 1,
            checkpoint: 0
          }
        }),
      });

      if (!createWalletResponse.ok) {
        const createErrorText = await createWalletResponse.text();
        console.error('Sequence Create API error:', createErrorText);
        throw new Error(`Failed to create wallet: ${createWalletResponse.status} - ${createErrorText}`);
      }

      const createWalletData: SequenceWalletResponse = await createWalletResponse.json();
      
      console.log(`Created wallet address: ${createWalletData.address}`);

      // Store or update wallet in database
      const walletConfig = {
        chainId: createWalletData.chainId,
        email: userEmail,
        status: 'active',
        created_at: new Date().toISOString(),
        method: 'email_direct'
      };

      const { error: upsertError } = await supabase
        .from('user_wallets')
        .upsert({
          user_id,
          wallet_address: createWalletData.address,
          wallet_config: walletConfig,
          network: 'polygon'
        });

      if (upsertError) {
        console.error('Database upsert error:', upsertError);
        throw new Error(`Failed to store wallet: ${upsertError.message}`);
      }

      console.log(`Successfully created and stored wallet for user ${user_id}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          wallet_address: createWalletData.address,
          message: 'Wallet created successfully' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    const walletData: SequenceWalletResponse = await walletResponse.json();
    
    console.log(`Created wallet address: ${walletData.address}`);

    // Store or update wallet in database
    const walletConfig = {
      chainId: walletData.chainId,
      email: userEmail,
      status: 'active',
      created_at: new Date().toISOString(),
      method: 'email_intent'
    };

    const { error: upsertError } = await supabase
      .from('user_wallets')
      .upsert({
        user_id,
        wallet_address: walletData.address,
        wallet_config: walletConfig,
        network: 'polygon'
      });

    if (upsertError) {
      console.error('Database upsert error:', upsertError);
      throw new Error(`Failed to store wallet: ${upsertError.message}`);
    }

    console.log(`Successfully created and stored wallet for user ${user_id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        wallet_address: walletData.address,
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
