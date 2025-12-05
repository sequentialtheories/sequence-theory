import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://vaultclub.io',
  'https://sequence-theory.lovable.app',
  'https://sequencetheory.com'
];

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-vault-club-api-key, x-idempotency-key',
  };
};

// Helper function to calculate deposit split (60/10/30)
function calculateDepositSplit(amount: number) {
  return {
    p1_amount: amount * 0.6,  // 60%
    p2_amount: amount * 0.1,  // 10%
    p3_amount: amount * 0.3,  // 30%
  };
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const vaultClubApiKey = Deno.env.get('VAULT_CLUB_EDGE_KEY')!;

    // Validate headers
    const authHeader = req.headers.get('authorization');
    const apiKey = req.headers.get('x-vault-club-api-key');
    const idempotencyKey = req.headers.get('x-idempotency-key');

    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing or invalid authorization header',
        data: null,
        ts: new Date().toISOString(),
        version: '1.0'
      }), { status: 401, headers: corsHeaders });
    }

    if (apiKey !== vaultClubApiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid vault club API key',
        data: null,
        ts: new Date().toISOString(),
        version: '1.0'
      }), { status: 403, headers: corsHeaders });
    }

    if (!idempotencyKey) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required header: x-idempotency-key',
        data: null,
        ts: new Date().toISOString(),
        version: '1.0'
      }), { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid authentication token',
        data: null,
        ts: new Date().toISOString(),
        version: '1.0'
      }), { status: 401, headers: corsHeaders });
    }

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Method not allowed',
        data: null,
        ts: new Date().toISOString(),
        version: '1.0'
      }), { status: 405, headers: corsHeaders });
    }

    const { subclub_id, amount_usdc } = await req.json();

    if (!subclub_id || !amount_usdc) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields: subclub_id, amount_usdc',
        data: null,
        ts: new Date().toISOString(),
        version: '1.0'
      }), { status: 400, headers: corsHeaders });
    }

    const amount = parseFloat(amount_usdc);
    if (amount <= 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Amount must be positive',
        data: null,
        ts: new Date().toISOString(),
        version: '1.0'
      }), { status: 400, headers: corsHeaders });
    }

    // Check for existing transaction with same idempotency key
    const { data: existingTx, error: existingTxError } = await supabase
      .from('tx_ledger')
      .select('*')
      .eq('idempotency_key', idempotencyKey)
      .single();

    if (existingTx) {
      console.log(`Idempotent request detected: ${idempotencyKey}`);
      return new Response(JSON.stringify({
        success: true,
        data: {
          transaction_id: existingTx.id,
          status: existingTx.status,
          amount_usdc: existingTx.amount_usdc,
          idempotent: true
        },
        error: null,
        ts: new Date().toISOString(),
        version: '1.0'
      }), { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verify user is a member of this subclub
    const { data: membership, error: membershipError } = await supabase
      .from('memberships')
      .select('role')
      .eq('subclub_id', subclub_id)
      .eq('user_id', user.id)
      .single();

    if (membershipError || !membership) {
      return new Response(JSON.stringify({
        success: false,
        error: 'User is not a member of this subclub',
        data: null,
        ts: new Date().toISOString(),
        version: '1.0'
      }), { status: 403, headers: corsHeaders });
    }

    // Get latest vault state
    const { data: currentState, error: currentStateError } = await supabase
      .from('vault_states')
      .select('*')
      .eq('subclub_id', subclub_id)
      .order('epoch_week', { ascending: false })
      .limit(1)
      .single();

    if (currentStateError || !currentState) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Vault state not found',
        data: null,
        ts: new Date().toISOString(),
        version: '1.0'
      }), { status: 404, headers: corsHeaders });
    }

    // Calculate deposit split
    const split = calculateDepositSplit(amount);

    // Create new vault state for next epoch
    const nextEpochWeek = currentState.epoch_week + 1;
    const newState = {
      subclub_id: subclub_id,
      epoch_week: nextEpochWeek,
      tvl_usdc: parseFloat(currentState.tvl_usdc) + amount,
      p1_usdc: parseFloat(currentState.p1_usdc) + split.p1_amount,
      p2_usdc: parseFloat(currentState.p2_usdc) + split.p2_amount,
      p3_usdc: parseFloat(currentState.p3_usdc) + split.p3_amount,
      wbtc_sats: currentState.wbtc_sats,
    };

    // Insert new vault state
    const { error: newStateError } = await supabase
      .from('vault_states')
      .insert(newState);

    if (newStateError) {
      console.error('New state creation error:', newStateError);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to update vault state',
        data: null,
        ts: new Date().toISOString(),
        version: '1.0'
      }), { status: 500, headers: corsHeaders });
    }

    // Log transaction
    const { data: txRecord, error: txError } = await supabase
      .from('tx_ledger')
      .insert({
        idempotency_key: idempotencyKey,
        user_id: user.id,
        subclub_id: subclub_id,
        kind: 'DEPOSIT',
        amount_usdc: amount,
        status: 'APPLIED',
        details: {
          before_epoch: currentState.epoch_week,
          after_epoch: nextEpochWeek,
          split: split,
          before_tvl: currentState.tvl_usdc,
          after_tvl: newState.tvl_usdc
        }
      })
      .select()
      .single();

    if (txError) {
      console.error('Transaction log error:', txError);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to log transaction',
        data: null,
        ts: new Date().toISOString(),
        version: '1.0'
      }), { status: 500, headers: corsHeaders });
    }

    console.log(`Deposit of ${amount} USDC processed for subclub ${subclub_id} by user ${user.id}`);

    return new Response(JSON.stringify({
      success: true,
      data: {
        transaction_id: txRecord.id,
        amount_usdc: amount,
        new_epoch_week: nextEpochWeek,
        new_tvl_usdc: newState.tvl_usdc,
        split: split,
        status: 'APPLIED'
      },
      error: null,
      ts: new Date().toISOString(),
      version: '1.0'
    }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      data: null,
      ts: new Date().toISOString(),
      version: '1.0'
    }), { status: 500, headers: corsHeaders });
  }
});