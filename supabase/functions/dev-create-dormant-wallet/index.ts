import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate a random Ethereum-compatible address
function generateEthAddress(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return '0x' + hex;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[dev-create-dormant-wallet] Starting request');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify JWT and get user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('[dev-create-dormant-wallet] No authorization header');
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('[dev-create-dormant-wallet] Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[dev-create-dormant-wallet] User authenticated:', user.id);

    // Check if user already has a wallet
    const { data: existingWallet } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingWallet) {
      console.log('[dev-create-dormant-wallet] User already has a wallet');
      return new Response(
        JSON.stringify({ 
          success: true, 
          wallet_address: existingWallet.wallet_address,
          message: 'Wallet already exists'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate a new Ethereum address
    const walletAddress = generateEthAddress();
    console.log('[dev-create-dormant-wallet] Generated address:', walletAddress);

    // Insert into user_wallets
    const { data: walletData, error: walletError } = await supabase
      .from('user_wallets')
      .upsert({
        user_id: user.id,
        wallet_address: walletAddress,
        provider: 'local_dev',
        provenance: 'server_generated',
        network: 'polygon',
        created_via: 'dev_dormant',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (walletError) {
      console.error('[dev-create-dormant-wallet] Wallet insert error:', walletError);
      return new Response(
        JSON.stringify({ error: 'Failed to create wallet', details: walletError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update user profile with wallet address
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ eth_address: walletAddress })
      .eq('user_id', user.id);

    if (profileError) {
      console.warn('[dev-create-dormant-wallet] Profile update warning:', profileError);
    }

    console.log('[dev-create-dormant-wallet] Dormant wallet created successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        wallet_address: walletAddress,
        message: 'Dormant wallet created for development'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[dev-create-dormant-wallet] Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
