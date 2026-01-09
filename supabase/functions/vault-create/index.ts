import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://vaultclub.io',
  'https://sequence-theory.lovable.app',
  'https://sequencetheory.com'
];

const isAllowedOrigin = (origin: string | null): boolean => {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (origin.endsWith('.lovableproject.com')) return true;
  // Allow localhost for development
  if (origin.startsWith('http://localhost:')) return true;
  return false;
};

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin!,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-vault-club-api-key, x-idempotency-key',
  };
};

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

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Method not allowed',
        data: null,
        ts: new Date().toISOString(),
        version: '1.0'
      }), { status: 405, headers: corsHeaders });
    }

    const { name, rigor, lock_months } = await req.json();

    if (!name || !rigor || !lock_months) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields: name, rigor, lock_months',
        data: null,
        ts: new Date().toISOString(),
        version: '1.0'
      }), { status: 400, headers: corsHeaders });
    }

    if (!['LIGHT', 'MEDIUM', 'HEAVY'].includes(rigor)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid rigor. Must be LIGHT, MEDIUM, or HEAVY',
        data: null,
        ts: new Date().toISOString(),
        version: '1.0'
      }), { status: 400, headers: corsHeaders });
    }

    // Create subclub
    const { data: subclub, error: subclubError } = await supabase
      .from('subclubs')
      .insert({
        name,
        rigor,
        lock_months: parseInt(lock_months),
        created_by: user.id
      })
      .select()
      .single();

    if (subclubError) {
      console.error('Subclub creation error:', subclubError);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to create subclub',
        data: null,
        ts: new Date().toISOString(),
        version: '1.0'
      }), { status: 500, headers: corsHeaders });
    }

    // Insert owner membership
    const { error: membershipError } = await supabase
      .from('memberships')
      .insert({
        subclub_id: subclub.id,
        user_id: user.id,
        role: 'OWNER'
      });

    if (membershipError) {
      console.error('Membership creation error:', membershipError);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to create owner membership',
        data: null,
        ts: new Date().toISOString(),
        version: '1.0'
      }), { status: 500, headers: corsHeaders });
    }

    // Initialize vault state with epoch_week=0, all zeros
    const { error: vaultStateError } = await supabase
      .from('vault_states')
      .insert({
        subclub_id: subclub.id,
        epoch_week: 0,
        tvl_usdc: 0,
        p1_usdc: 0,
        p2_usdc: 0,
        p3_usdc: 0,
        wbtc_sats: 0
      });

    if (vaultStateError) {
      console.error('Vault state creation error:', vaultStateError);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to initialize vault state',
        data: null,
        ts: new Date().toISOString(),
        version: '1.0'
      }), { status: 500, headers: corsHeaders });
    }

    // Log transaction
    const { error: txError } = await supabase
      .from('tx_ledger')
      .insert({
        idempotency_key: `create-${subclub.id}`,
        user_id: user.id,
        subclub_id: subclub.id,
        kind: 'CREATE',
        amount_usdc: null,
        status: 'APPLIED',
        details: { subclub_name: name, rigor, lock_months }
      });

    if (txError) {
      console.error('Transaction log error:', txError);
    }

    console.log(`Subclub created: ${subclub.id} by user ${user.id}`);

    return new Response(JSON.stringify({
      success: true,
      data: {
        subclub_id: subclub.id,
        name: subclub.name,
        rigor: subclub.rigor,
        lock_months: subclub.lock_months,
        created_at: subclub.created_at
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