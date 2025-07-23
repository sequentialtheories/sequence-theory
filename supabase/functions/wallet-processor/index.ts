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
    console.log('Processing wallet creation...');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get users with pending wallets
    const { data: pendingWallets, error: queryError } = await supabase
      .from('user_wallets')
      .select('*')
      .like('wallet_address', 'pending_%');

    if (queryError) {
      throw new Error(`Failed to query pending wallets: ${queryError.message}`);
    }

    console.log(`Found ${pendingWallets?.length || 0} pending wallets`);

    if (!pendingWallets || pendingWallets.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No pending wallets to process',
          processed: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Sequence API key
    const sequenceApiKey = Deno.env.get('SEQUENCE_API_KEY');
    if (!sequenceApiKey) {
      throw new Error('Sequence API key not configured');
    }

    let processedWallets = 0;
    const errors: string[] = [];

    // Process each pending wallet
    for (const wallet of pendingWallets) {
      try {
        console.log(`Creating Sequence wallet for user: ${wallet.user_id}`);

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
          console.error(`Sequence API error for user ${wallet.user_id}:`, errorText);
          errors.push(`User ${wallet.user_id}: Failed to create wallet (${walletResponse.status})`);
          continue;
        }

        const walletData: SequenceWalletResponse = await walletResponse.json();
        
        console.log(`Created wallet address for user ${wallet.user_id}: ${walletData.wallet.address}`);

        // Update wallet in database
        const { error: updateError } = await supabase
          .from('user_wallets')
          .update({
            wallet_address: walletData.wallet.address,
            wallet_config: {
              ...walletData.wallet.config,
              status: 'active',
              created_at: new Date().toISOString()
            }
          })
          .eq('id', wallet.id);

        if (updateError) {
          console.error(`Database update error for user ${wallet.user_id}:`, updateError);
          errors.push(`User ${wallet.user_id}: Failed to update wallet (${updateError.message})`);
          continue;
        }

        processedWallets++;
        console.log(`Successfully processed wallet for user ${wallet.user_id}`);

      } catch (error) {
        console.error(`Error processing wallet for user ${wallet.user_id}:`, error);
        errors.push(`User ${wallet.user_id}: ${error.message}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${processedWallets} wallets`,
        processed: processedWallets,
        total_pending: pendingWallets.length,
        errors: errors.length > 0 ? errors : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in wallet-processor function:', error);
    
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