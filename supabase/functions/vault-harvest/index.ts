import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-vault-club-api-key, x-idempotency-key',
}

// RRL constants
const APY_RATES = {
  p1: 0.052,  // 5.2%
  p2: 0.102,  // 10.2%
  p3: 0.125,  // 12.5%
};

// Helper function to calculate weekly profits
function calculateWeeklyProfits(p1_usdc: number, p2_usdc: number, p3_usdc: number) {
  return {
    p1_profit: p1_usdc * (APY_RATES.p1 / 52),
    p2_profit: p2_usdc * (APY_RATES.p2 / 52),
    p3_profit: p3_usdc * (APY_RATES.p3 / 52),
  };
}

// Helper function to apply RRL routing
function applyRRL(profits: { p1_profit: number; p2_profit: number; p3_profit: number }) {
  const { p1_profit, p2_profit, p3_profit } = profits;

  // P1: 50% reinvest, 40%→P2, 10%→P3
  const p1_reinvest = p1_profit * 0.5;
  const p1_to_p2 = p1_profit * 0.4;
  const p1_to_p3 = p1_profit * 0.1;

  // P2: 50% reinvest, 20%→P1, 30%→P3
  const p2_reinvest = p2_profit * 0.5;
  const p2_to_p1 = p2_profit * 0.2;
  const p2_to_p3 = p2_profit * 0.3;

  // P3: 70% reinvest, 30%→P1
  const p3_reinvest = p3_profit * 0.7;
  const p3_to_p1 = p3_profit * 0.3;

  return {
    p1_net_change: p1_reinvest + p2_to_p1 + p3_to_p1,
    p2_net_change: p2_reinvest + p1_to_p2,
    p3_net_change: p3_reinvest + p1_to_p3 + p2_to_p3,
    routing_details: {
      p1: { reinvest: p1_reinvest, to_p2: p1_to_p2, to_p3: p1_to_p3 },
      p2: { reinvest: p2_reinvest, to_p1: p2_to_p1, to_p3: p2_to_p3 },
      p3: { reinvest: p3_reinvest, to_p1: p3_to_p1 },
    }
  };
}

Deno.serve(async (req) => {
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

    const { subclub_id } = await req.json();

    if (!subclub_id) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required field: subclub_id',
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

    const p1_usdc = parseFloat(currentState.p1_usdc);
    const p2_usdc = parseFloat(currentState.p2_usdc);
    const p3_usdc = parseFloat(currentState.p3_usdc);

    // Calculate weekly profits
    const profits = calculateWeeklyProfits(p1_usdc, p2_usdc, p3_usdc);
    
    // Apply RRL routing
    const rrlResult = applyRRL(profits);

    // Calculate new balances
    const nextEpochWeek = currentState.epoch_week + 1;
    const newState = {
      subclub_id: subclub_id,
      epoch_week: nextEpochWeek,
      p1_usdc: p1_usdc + rrlResult.p1_net_change,
      p2_usdc: p2_usdc + rrlResult.p2_net_change,
      p3_usdc: p3_usdc + rrlResult.p3_net_change,
      tvl_usdc: parseFloat(currentState.tvl_usdc) + profits.p1_profit + profits.p2_profit + profits.p3_profit,
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

    const totalYield = profits.p1_profit + profits.p2_profit + profits.p3_profit;

    // Log transaction
    const { data: txRecord, error: txError } = await supabase
      .from('tx_ledger')
      .insert({
        idempotency_key: idempotencyKey,
        user_id: user.id,
        subclub_id: subclub_id,
        kind: 'HARVEST',
        amount_usdc: totalYield,
        status: 'APPLIED',
        details: {
          before_epoch: currentState.epoch_week,
          after_epoch: nextEpochWeek,
          profits: profits,
          rrl_routing: rrlResult.routing_details,
          before_balances: { p1_usdc, p2_usdc, p3_usdc, tvl_usdc: currentState.tvl_usdc },
          after_balances: { p1_usdc: newState.p1_usdc, p2_usdc: newState.p2_usdc, p3_usdc: newState.p3_usdc, tvl_usdc: newState.tvl_usdc }
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

    console.log(`Harvest of ${totalYield} USDC yield processed for subclub ${subclub_id} by user ${user.id}`);

    return new Response(JSON.stringify({
      success: true,
      data: {
        transaction_id: txRecord.id,
        total_yield_usdc: totalYield,
        new_epoch_week: nextEpochWeek,
        new_tvl_usdc: newState.tvl_usdc,
        profits: profits,
        rrl_changes: {
          p1_change: rrlResult.p1_net_change,
          p2_change: rrlResult.p2_net_change,
          p3_change: rrlResult.p3_net_change,
        },
        new_balances: {
          p1_usdc: newState.p1_usdc,
          p2_usdc: newState.p2_usdc,
          p3_usdc: newState.p3_usdc,
        },
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