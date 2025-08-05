import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-vault-club-api-key',
};

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(identifier: string, limit: number = 1000, windowMs: number = 3600000): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return false;
  }
  
  if (entry.count >= limit) {
    return true;
  }
  
  entry.count++;
  return false;
}

function getClientIP(req: Request): string {
  return req.headers.get('cf-connecting-ip') || 
         req.headers.get('x-forwarded-for')?.split(',')[0] || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const vaultClubApiKey = Deno.env.get('VAULT_CLUB_API_KEY');
    
    const apiKey = req.headers.get('x-vault-club-api-key');
    if (!vaultClubApiKey || apiKey !== vaultClubApiKey) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Unauthorized: Invalid Vault Club API key' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const clientIP = getClientIP(req);
    
    if (isRateLimited(clientIP, 1000, 3600000)) {
      await logAccess(supabase, 'vault-operations', req.url, clientIP, req.headers.get('user-agent'), null, 429);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Rate limit exceeded' 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let requestData = null;
    try {
      if (req.body) {
        requestData = await req.json();
      }
    } catch (e) {
      // Body parsing failed, continue without request data
    }

    const url = new URL(req.url);
    const endpoint = url.pathname;

    if (endpoint === '/vault-operations/init-subclub' && req.method === 'POST') {
      return await handleInitSubclub(supabase, requestData, clientIP, req.headers.get('user-agent'));
    }
    
    if (endpoint === '/vault-operations/deposit' && req.method === 'POST') {
      return await handleDeposit(supabase, requestData, clientIP, req.headers.get('user-agent'));
    }
    
    if (endpoint === '/vault-operations/progress' && req.method === 'GET') {
      const userId = url.searchParams.get('user_id');
      return await handleProgress(supabase, userId, clientIP, req.headers.get('user-agent'));
    }
    
    if (endpoint === '/vault-operations/wbtc-balance' && req.method === 'GET') {
      const userId = url.searchParams.get('user_id');
      return await handleWbtcBalance(supabase, userId, clientIP, req.headers.get('user-agent'));
    }
    
    if (endpoint === '/vault-operations/history' && req.method === 'GET') {
      const userId = url.searchParams.get('user_id');
      return await handleHistory(supabase, userId, clientIP, req.headers.get('user-agent'));
    }
    
    if (endpoint === '/vault-operations/emergency/withdraw' && req.method === 'POST') {
      return await handleEmergencyWithdraw(supabase, requestData, clientIP, req.headers.get('user-agent'));
    }
    
    if (endpoint === '/vault-operations/emergency/status' && req.method === 'GET') {
      return await handleEmergencyStatus(supabase, clientIP, req.headers.get('user-agent'));
    }

    await logAccess(supabase, 'vault-operations', endpoint, clientIP, req.headers.get('user-agent'), requestData, 404);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Endpoint not found' 
    }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in vault-operations function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleInitSubclub(supabase: any, requestData: any, clientIP: string, userAgent: string | null) {
  try {
    const { user_id, members, lock_duration, rigor_level } = requestData;
    
    if (!user_id || !members || !lock_duration || !rigor_level) {
      await logAccess(supabase, 'vault-operations', '/init-subclub', clientIP, userAgent, requestData, 400);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required parameters: user_id, members, lock_duration, rigor_level' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const subclubData = {
      user_id,
      members: JSON.stringify(members),
      lock_duration,
      rigor_level,
      status: 'pending_deployment',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('vault_subclubs')
      .insert(subclubData)
      .select()
      .single();

    if (error) {
      console.error('Error creating subclub:', error);
      await logAccess(supabase, 'vault-operations', '/init-subclub', clientIP, userAgent, requestData, 500);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to create subclub' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await logAccess(supabase, 'vault-operations', '/init-subclub', clientIP, userAgent, requestData, 200);
    return new Response(JSON.stringify({ 
      success: true, 
      data: {
        subclub_id: data.id,
        status: data.status,
        members: JSON.parse(data.members),
        lock_duration: data.lock_duration,
        rigor_level: data.rigor_level
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in handleInitSubclub:', error);
    await logAccess(supabase, 'vault-operations', '/init-subclub', clientIP, userAgent, requestData, 500);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleDeposit(supabase: any, requestData: any, clientIP: string, userAgent: string | null) {
  try {
    const { user_id, amount, token_address, transaction_hash } = requestData;
    
    if (!user_id || !amount || !transaction_hash) {
      await logAccess(supabase, 'vault-operations', '/deposit', clientIP, userAgent, requestData, 400);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required parameters: user_id, amount, transaction_hash' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const depositData = {
      user_id,
      amount: parseFloat(amount),
      token_address: token_address || 'USDC',
      transaction_hash,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('vault_deposits')
      .insert(depositData)
      .select()
      .single();

    if (error) {
      console.error('Error recording deposit:', error);
      await logAccess(supabase, 'vault-operations', '/deposit', clientIP, userAgent, requestData, 500);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to record deposit' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await logAccess(supabase, 'vault-operations', '/deposit', clientIP, userAgent, requestData, 200);
    return new Response(JSON.stringify({ 
      success: true, 
      data: {
        deposit_id: data.id,
        amount: data.amount,
        status: data.status,
        transaction_hash: data.transaction_hash
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in handleDeposit:', error);
    await logAccess(supabase, 'vault-operations', '/deposit', clientIP, userAgent, requestData, 500);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleProgress(supabase: any, userId: string | null, clientIP: string, userAgent: string | null) {
  try {
    if (!userId) {
      await logAccess(supabase, 'vault-operations', '/progress', clientIP, userAgent, { user_id: userId }, 400);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required parameter: user_id' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: deposits, error: depositsError } = await supabase
      .from('vault_deposits')
      .select('amount, status, created_at')
      .eq('user_id', userId)
      .eq('status', 'confirmed');

    if (depositsError) {
      console.error('Error fetching deposits:', depositsError);
      await logAccess(supabase, 'vault-operations', '/progress', clientIP, userAgent, { user_id: userId }, 500);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch progress data' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const totalDeposited = deposits?.reduce((sum: number, deposit: any) => sum + deposit.amount, 0) || 0;
    const phase1Target = 1000; // $1000 USDC
    const phase2Target = 5000; // $5000 USDC
    
    let currentPhase = 1;
    let progress = 0;
    
    if (totalDeposited >= phase2Target) {
      currentPhase = 2;
      progress = 100;
    } else if (totalDeposited >= phase1Target) {
      currentPhase = 2;
      progress = ((totalDeposited - phase1Target) / (phase2Target - phase1Target)) * 100;
    } else {
      currentPhase = 1;
      progress = (totalDeposited / phase1Target) * 100;
    }

    await logAccess(supabase, 'vault-operations', '/progress', clientIP, userAgent, { user_id: userId }, 200);
    return new Response(JSON.stringify({ 
      success: true, 
      data: {
        user_id: userId,
        current_phase: currentPhase,
        progress_percentage: Math.round(progress * 100) / 100,
        total_deposited: totalDeposited,
        phase1_target: phase1Target,
        phase2_target: phase2Target,
        deposits_count: deposits?.length || 0
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in handleProgress:', error);
    await logAccess(supabase, 'vault-operations', '/progress', clientIP, userAgent, { user_id: userId }, 500);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleWbtcBalance(supabase: any, userId: string | null, clientIP: string, userAgent: string | null) {
  try {
    if (!userId) {
      await logAccess(supabase, 'vault-operations', '/wbtc-balance', clientIP, userAgent, { user_id: userId }, 400);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required parameter: user_id' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: allocations, error } = await supabase
      .from('vault_allocations')
      .select('asset_type, amount, percentage')
      .eq('user_id', userId)
      .eq('asset_type', 'WBTC');

    if (error) {
      console.error('Error fetching WBTC allocations:', error);
      await logAccess(supabase, 'vault-operations', '/wbtc-balance', clientIP, userAgent, { user_id: userId }, 500);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch WBTC balance data' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const wbtcAllocation = allocations?.[0] || { amount: 0, percentage: 0 };

    await logAccess(supabase, 'vault-operations', '/wbtc-balance', clientIP, userAgent, { user_id: userId }, 200);
    return new Response(JSON.stringify({ 
      success: true, 
      data: {
        user_id: userId,
        wbtc_amount: wbtcAllocation.amount,
        allocation_percentage: wbtcAllocation.percentage,
        asset_type: 'WBTC'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in handleWbtcBalance:', error);
    await logAccess(supabase, 'vault-operations', '/wbtc-balance', clientIP, userAgent, { user_id: userId }, 500);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleHistory(supabase: any, userId: string | null, clientIP: string, userAgent: string | null) {
  try {
    if (!userId) {
      await logAccess(supabase, 'vault-operations', '/history', clientIP, userAgent, { user_id: userId }, 400);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required parameter: user_id' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: transactions, error } = await supabase
      .from('vault_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching transaction history:', error);
      await logAccess(supabase, 'vault-operations', '/history', clientIP, userAgent, { user_id: userId }, 500);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch transaction history' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await logAccess(supabase, 'vault-operations', '/history', clientIP, userAgent, { user_id: userId }, 200);
    return new Response(JSON.stringify({ 
      success: true, 
      data: {
        user_id: userId,
        transactions: transactions || [],
        total_count: transactions?.length || 0
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in handleHistory:', error);
    await logAccess(supabase, 'vault-operations', '/history', clientIP, userAgent, { user_id: userId }, 500);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleEmergencyWithdraw(supabase: any, requestData: any, clientIP: string, userAgent: string | null) {
  try {
    const { user_id, reason } = requestData;
    
    if (!user_id) {
      await logAccess(supabase, 'vault-operations', '/emergency/withdraw', clientIP, userAgent, requestData, 400);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required parameter: user_id' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const emergencyData = {
      user_id,
      action_type: 'emergency_withdraw',
      reason: reason || 'User initiated emergency withdrawal',
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('vault_emergency_actions')
      .insert(emergencyData)
      .select()
      .single();

    if (error) {
      console.error('Error initiating emergency withdrawal:', error);
      await logAccess(supabase, 'vault-operations', '/emergency/withdraw', clientIP, userAgent, requestData, 500);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to initiate emergency withdrawal' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await logAccess(supabase, 'vault-operations', '/emergency/withdraw', clientIP, userAgent, requestData, 200);
    return new Response(JSON.stringify({ 
      success: true, 
      data: {
        emergency_id: data.id,
        status: data.status,
        message: 'Emergency withdrawal initiated. No profits will be distributed.',
        estimated_processing_time: '24-48 hours'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in handleEmergencyWithdraw:', error);
    await logAccess(supabase, 'vault-operations', '/emergency/withdraw', clientIP, userAgent, requestData, 500);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleEmergencyStatus(supabase: any, clientIP: string, userAgent: string | null) {
  try {
    const { data: emergencyActions, error } = await supabase
      .from('vault_emergency_actions')
      .select('status, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching emergency status:', error);
      await logAccess(supabase, 'vault-operations', '/emergency/status', clientIP, userAgent, null, 500);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch emergency status' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const activeEmergencies = emergencyActions?.filter(action => action.status === 'pending' || action.status === 'processing') || [];
    
    await logAccess(supabase, 'vault-operations', '/emergency/status', clientIP, userAgent, null, 200);
    return new Response(JSON.stringify({ 
      success: true, 
      data: {
        emergency_module_active: true,
        active_emergencies_count: activeEmergencies.length,
        recent_actions: emergencyActions || [],
        system_status: 'operational'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in handleEmergencyStatus:', error);
    await logAccess(supabase, 'vault-operations', '/emergency/status', clientIP, userAgent, null, 500);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function logAccess(
  supabase: any, 
  functionName: string,
  endpoint: string, 
  ipAddress: string, 
  userAgent: string | null, 
  requestData: any, 
  responseStatus: number
) {
  try {
    await supabase
      .from('api_access_logs')
      .insert({
        api_key_id: functionName,
        endpoint,
        ip_address: ipAddress,
        user_agent: userAgent,
        request_data: requestData,
        response_status: responseStatus
      });
  } catch (error) {
    console.error('Failed to log access:', error);
  }
}
