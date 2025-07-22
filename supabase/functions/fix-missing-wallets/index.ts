import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SequenceWalletResponse {
  wallet: {
    address: string;
    config: Record<string, any>;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Checking for users without wallets...');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all users who don't have wallets
    const { data: usersWithoutWallets, error: queryError } = await supabase
      .from('profiles')
      .select(`
        user_id,
        email,
        name,
        user_wallets!left(user_id)
      `)
      .is('user_wallets.user_id', null);

    if (queryError) {
      throw new Error(`Failed to query users: ${queryError.message}`);
    }

    console.log(`Found ${usersWithoutWallets?.length || 0} users without wallets`);

    if (!usersWithoutWallets || usersWithoutWallets.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'All users already have wallets',
          created_wallets: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Sequence API key
    const sequenceApiKey = Deno.env.get('SEQUENCE_API_KEY');
    if (!sequenceApiKey) {
      throw new Error('Sequence API key not configured');
    }

    let createdWallets = 0;
    const errors: string[] = [];

    // Create wallets for each user
    for (const user of usersWithoutWallets) {
      try {
        console.log(`Creating wallet for user: ${user.user_id}`);

        // Create a new Sequence wallet
        const walletResponse = await fetch('https://api.sequence.app/rpc/Relayer/CreateWallet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sequenceApiKey}`,
          },
          body: JSON.stringify({
            network: 'polygon',
            config: {
              threshold: 1,
              checkpoint: 0
            }
          }),
        });

        if (!walletResponse.ok) {
          const errorText = await walletResponse.text();
          console.error(`Sequence API error for user ${user.user_id}:`, errorText);
          errors.push(`User ${user.user_id}: Failed to create wallet (${walletResponse.status})`);
          continue;
        }

        const walletData: SequenceWalletResponse = await walletResponse.json();
        
        console.log(`Created wallet address for user ${user.user_id}: ${walletData.wallet.address}`);

        // Store wallet in database
        const { error: insertError } = await supabase
          .from('user_wallets')
          .insert({
            user_id: user.user_id,
            wallet_address: walletData.wallet.address,
            wallet_config: walletData.wallet.config,
            network: 'polygon'
          });

        if (insertError) {
          console.error(`Database insert error for user ${user.user_id}:`, insertError);
          errors.push(`User ${user.user_id}: Failed to store wallet (${insertError.message})`);
          continue;
        }

        createdWallets++;
        console.log(`Successfully created wallet for user ${user.user_id}`);

      } catch (error) {
        console.error(`Error creating wallet for user ${user.user_id}:`, error);
        errors.push(`User ${user.user_id}: ${error.message}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Created wallets for ${createdWallets} users`,
        created_wallets: createdWallets,
        total_users_checked: usersWithoutWallets.length,
        errors: errors.length > 0 ? errors : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in fix-missing-wallets function:', error);
    
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