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

    // Verify subclub exists
    const { data: subclub, error: subclubError } = await supabase
      .from('subclubs')
      .select('id, name')
      .eq('id', subclub_id)
      .single();

    if (subclubError || !subclub) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Subclub not found',
        data: null,
        ts: new Date().toISOString(),
        version: '1.0'
      }), { status: 404, headers: corsHeaders });
    }

    // Insert membership (will fail if already exists due to PK constraint)
    const { data: membership, error: membershipError } = await supabase
      .from('memberships')
      .insert({
        subclub_id: subclub_id,
        user_id: user.id,
        role: 'MEMBER'
      })
      .select()
      .single();

    if (membershipError) {
      if (membershipError.code === '23505') { // unique constraint violation
        return new Response(JSON.stringify({
          success: false,
          error: 'User is already a member of this subclub',
          data: null,
          ts: new Date().toISOString(),
          version: '1.0'
        }), { status: 409, headers: corsHeaders });
      }
      
      console.error('Membership creation error:', membershipError);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to join subclub',
        data: null,
        ts: new Date().toISOString(),
        version: '1.0'
      }), { status: 500, headers: corsHeaders });
    }

    // Log transaction
    const { error: txError } = await supabase
      .from('tx_ledger')
      .insert({
        idempotency_key: `join-${subclub_id}-${user.id}`,
        user_id: user.id,
        subclub_id: subclub_id,
        kind: 'JOIN',
        amount_usdc: null,
        status: 'APPLIED',
        details: { subclub_name: subclub.name }
      });

    if (txError) {
      console.error('Transaction log error:', txError);
    }

    audit('vault.join.ok', { subclub_id, user_id: redactToken(user.id) });

    return new Response(JSON.stringify({
      success: true,
      data: {
        subclub_id: subclub_id,
        user_id: user.id,
        role: membership.role,
        joined_at: membership.joined_at
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
