import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-vault-club-api-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const vaultClubApiKey = Deno.env.get('VAULT_CLUB_API_KEY');
    
    // Validate Vault Club API key
    const requestApiKey = req.headers.get('x-vault-club-api-key');
    if (!vaultClubApiKey || requestApiKey !== vaultClubApiKey) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Unauthorized: Invalid Vault Club API key' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { 
      creator, 
      maxMembers, 
      lockupPeriod, 
      rigorLevel, 
      isPrivate, 
      isChargedContract, 
      customWeeklyAmount, 
      customSchedule 
    } = await req.json();

    if (!creator) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Creator wallet address is required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Creating Vault Club contract for:', creator);

    const { data: wallet, error: walletError } = await supabase
      .from('user_wallets')
      .select('user_id')
      .eq('wallet_address', creator)
      .single();

    if (walletError || !wallet) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'User not found for wallet address' 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const weeklyAmounts = {
      'Low': 25,
      'Medium': 50, 
      'High': 100
    };
    const weeklyAmount = customWeeklyAmount || weeklyAmounts[rigorLevel] || 50;
    const targetAmount = weeklyAmount * maxMembers * 52; // 1 year target

    const { data: contract, error: contractError } = await supabase
      .from('contracts')
      .insert({
        user_id: wallet.user_id,
        contract_type: 'vault_club',
        name: `Vault Club - ${rigorLevel} Rigor`,
        description: `${rigorLevel} rigor vault club with ${maxMembers} max members, ${lockupPeriod} lockup period`,
        target_amount: targetAmount,
        current_amount: 0,
        minimum_contribution: weeklyAmount,
        maximum_participants: maxMembers,
        current_participants: 1, // Creator is first participant
        status: 'pending',
        start_date: new Date().toISOString(),
        end_date: lockupPeriod ? new Date(Date.now() + parseInt(lockupPeriod) * 24 * 60 * 60 * 1000).toISOString() : null
      })
      .select()
      .single();

    if (contractError) {
      console.error('Contract creation error:', contractError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: `Failed to create contract: ${contractError.message}` 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { error: participantError } = await supabase
      .from('contract_participants')
      .insert({
        contract_id: contract.id,
        user_id: wallet.user_id,
        contribution_amount: weeklyAmount,
        wallet_address: creator,
        status: 'active'
      });

    if (participantError) {
      console.error('Participant creation error:', participantError);
      // Don't fail the entire request if participant creation fails
    }

    const contractAddress = `0x${contract.id.replace(/-/g, '').substring(0, 40).padEnd(40, '0')}`;

    console.log('✅ Contract created successfully:', {
      contractId: contract.id,
      contractAddress,
      creator,
      targetAmount
    });

    return new Response(JSON.stringify({ 
      success: true,
      data: {
        contractId: contract.id,
        contractAddress,
        creator,
        maxMembers,
        lockupPeriod,
        rigorLevel,
        targetAmount,
        weeklyAmount,
        status: 'pending'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in vault-club-contract-creation:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
