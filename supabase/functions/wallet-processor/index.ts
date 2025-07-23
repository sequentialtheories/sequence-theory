
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SequenceWalletResponse {
  address: string;
  chainId: number;
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

    // Get users with pending wallets and their email addresses
    const { data: pendingWallets, error: queryError } = await supabase
      .from('user_wallets')
      .select(`
        *,
        profiles!inner(email)
      `)
      .like('wallet_address', 'pending_%');

    if (queryError) {
      throw new Error(`Failed to query pending wallets: ${queryError.message}`);
    }

    console.log(`Found ${pendingWallets?.length || 0} pending wallets`);

    // Also check for wallets that might be created but missing private keys
    const { data: walletsWithoutKeys, error: keysError } = await supabase
      .from('user_wallets')
      .select(`
        *,
        profiles!inner(email)
      `)
      .not('wallet_address', 'like', 'pending_%')
      .or('wallet_config->>private_key.is.null,wallet_config->>private_key.eq.""');

    if (keysError) {
      console.warn('Error querying wallets without private keys:', keysError);
    }

    const allWalletsToProcess = [
      ...(pendingWallets || []),
      ...(walletsWithoutKeys || [])
    ];

    console.log(`Total wallets to process: ${allWalletsToProcess.length}`);

    if (allWalletsToProcess.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No wallets need processing',
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

    // Process each wallet that needs attention
    for (const wallet of allWalletsToProcess) {
      try {
        const userEmail = wallet.profiles.email;
        const isPending = wallet.wallet_address.startsWith('pending_');
        
        console.log(`${isPending ? 'Creating' : 'Updating'} Sequence wallet for user: ${wallet.user_id} with email: ${userEmail}`);

        // Create wallet using Sequence's email-based approach
        const walletResponse = await fetch('https://api.sequence.app/rpc/Wallet/Create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sequenceApiKey}`,
          },
          body: JSON.stringify({
            network: 'polygon',
            email: userEmail,
            config: {
              threshold: 1,
              checkpoint: 0
            }
          }),
        });

        if (!walletResponse.ok) {
          const errorText = await walletResponse.text();
          console.error(`Sequence API error for user ${wallet.user_id}:`, errorText);
          errors.push(`User ${wallet.user_id}: Failed to create/update wallet (${walletResponse.status})`);
          continue;
        }

        const walletData: SequenceWalletResponse = await walletResponse.json();
        
        console.log(`${isPending ? 'Created' : 'Updated'} wallet address for user ${wallet.user_id}: ${walletData.address}`);

        // Generate a private key for the wallet (this is a placeholder - in production you'd get this from Sequence)
        const privateKey = `0x${Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('')}`;

        // Update wallet in database with both address and private key
        const { error: updateError } = await supabase
          .from('user_wallets')
          .update({
            wallet_address: walletData.address,
            wallet_config: {
              chainId: walletData.chainId,
              email: userEmail,
              status: 'active',
              created_at: new Date().toISOString(),
              method: 'email_batch',
              private_key: privateKey
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
        total_needing_processing: allWalletsToProcess.length,
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
