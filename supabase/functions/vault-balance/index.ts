import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-vault-club-api-key, x-idempotency-key',
};

function redactToken(value?: string | null): string {
  if (!value) return '';
  const s = String(value);
  if (s.length <= 8) return '****';
  return s.slice(0,4) + '****' + s.slice(-4);
}

function audit(evt: string, meta: Record<string,unknown> = {}) {
  console.log(JSON.stringify({ evt, ts: new Date().toISOString(), ...meta }));
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

    if (req.method !== 'GET') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Method not allowed',
        data: null,
        ts: new Date().toISOString(),
        version: '1.0'
      }), { status: 405, headers: corsHeaders });
    }

    const url = new URL(req.url);
    const subclub_id = url.searchParams.get('subclub_id');

    if (!subclub_id) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required parameter: subclub_id',
        data: null,
        ts: new Date().toISOString(),
        version: '1.0'
      }), { status: 400, headers: corsHeaders });
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
    const { data: vaultState, error: vaultError } = await supabase
      .from('vault_states')
      .select('*')
      .eq('subclub_id', subclub_id)
      .order('epoch_week', { ascending: false })
      .limit(1)
      .single();

    if (vaultError || !vaultState) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Vault state not found',
        data: null,
        ts: new Date().toISOString(),
        version: '1.0'
      }), { status: 404, headers: corsHeaders });
    }

    // Get total member count for per-user share calculation
    const { count: memberCount, error: countError } = await supabase
      .from('memberships')
      .select('*', { count: 'exact', head: true })
      .eq('subclub_id', subclub_id);

    if (countError) {
      console.error('Member count error:', countError);
    }

    // Calculate per-user derived share (optional)
    const perUserShare = memberCount && memberCount > 0 ? {
      p1_usdc_share: parseFloat(vaultState.p1_usdc) / memberCount,
      p2_usdc_share: parseFloat(vaultState.p2_usdc) / memberCount,
      p3_usdc_share: parseFloat(vaultState.p3_usdc) / memberCount,
      tvl_usdc_share: parseFloat(vaultState.tvl_usdc) / memberCount,
    } : null;

    audit('vault.balance.request', { subclub_id, user_id: redactToken(user.id) });

    return new Response(JSON.stringify({
      success: true,
      data: {
        subclub_id: vaultState.subclub_id,
        epoch_week: vaultState.epoch_week,
        tvl_usdc: vaultState.tvl_usdc,
        p1_usdc: vaultState.p1_usdc,
        p2_usdc: vaultState.p2_usdc,
        p3_usdc: vaultState.p3_usdc,
        wbtc_sats: vaultState.wbtc_sats,
        member_count: memberCount || 0,
        user_role: membership.role,
        ...(perUserShare && { per_user_share: perUserShare })
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
