import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();
    
    if (!user_id) {
      throw new Error('User ID is required');
    }

    console.log('Processing wallet request for user:', user_id);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user email from profiles table
    let userEmail: string;
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('user_id', user_id)
      .maybeSingle();

    if (profile?.email) {
      userEmail = profile.email;
      console.log('Found user email in profiles:', userEmail);
    } else {
      // Fallback: get email from auth.users (using service role)
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(user_id);
      
      if (authError || !authUser.user?.email) {
        throw new Error(`Unable to get user email: ${authError?.message || 'Email not found'}`);
      }
      
      userEmail = authUser.user.email;
      console.log('Found user email in auth:', userEmail);
    }

    // Check if wallet already exists in our database
    const { data: existingWallet } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', user_id)
      .maybeSingle();

    if (existingWallet && !existingWallet.wallet_address.startsWith('pending_')) {
      console.log('Valid wallet already exists:', existingWallet.wallet_address);
      return new Response(
        JSON.stringify({ 
          success: true, 
          wallet_address: existingWallet.wallet_address,
          message: 'Wallet already connected'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const waasConfigKey = Deno.env.get('SEQUENCE_WAAS_CONFIG_KEY');
    if (!waasConfigKey) {
      throw new Error('Sequence WaaS config key not configured');
    }

    let walletAddress: string;
    
    console.log('Using WaaS approach for user:', userEmail);
    
    try {
      // Using the WaaS approach instead of direct API calls
      const waasResponse = await fetch('https://waas.sequence.app/rpc/WaaS/RegisterSession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key': waasConfigKey,
        },
        body: JSON.stringify({
          email: userEmail,
          idToken: '', // For embedded wallets, this can be empty initially
        }),
      });

      const waasText = await waasResponse.text();
      console.log('WaaS response:', waasResponse.status, waasText.substring(0, 200));

      if (waasResponse.ok) {
        try {
          const waasData = JSON.parse(waasText);
          if (waasData.wallet && waasData.wallet.address) {
            walletAddress = waasData.wallet.address;
            console.log('WaaS wallet created/found:', walletAddress);
          } else {
            throw new Error('No wallet address in WaaS response');
          }
        } catch (parseError) {
          console.error('Failed to parse WaaS response:', parseError);
          throw new Error('Invalid response from Sequence WaaS');
        }
      } else {
        throw new Error(`WaaS request failed: ${waasText}`);
      }
    } catch (waasError) {
      console.error('Sequence WaaS error:', waasError);
      throw new Error(`Sequence WaaS error: ${waasError.message}`);
    }

    // Validate wallet address
    if (!walletAddress || walletAddress.length < 10) {
      throw new Error('Invalid wallet address received from Sequence WaaS');
    }

    // Save or update wallet in database
    const walletConfig = {
      email: userEmail,
      network: 'polygon',
      waas_session: true,
      created_at: new Date().toISOString()
    };

    if (existingWallet) {
      // Update existing pending wallet
      const { error: updateError } = await supabase
        .from('user_wallets')
        .update({
          wallet_address: walletAddress,
          wallet_config: walletConfig,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user_id);

      if (updateError) {
        console.error('Failed to update wallet:', updateError);
        throw new Error(`Failed to update wallet: ${updateError.message}`);
      }
      
      console.log('Updated existing wallet record');
    } else {
      // Insert new wallet
      const { error: insertError } = await supabase
        .from('user_wallets')
        .insert({
          user_id,
          wallet_address: walletAddress,
          wallet_config: walletConfig,
          network: 'polygon'
        });

      if (insertError) {
        console.error('Failed to insert wallet:', insertError);
        throw new Error(`Failed to save wallet: ${insertError.message}`);
      }
      
      console.log('Created new wallet record');
    }

    console.log('Wallet successfully connected for user:', user_id, 'Address:', walletAddress);

    return new Response(
      JSON.stringify({ 
        success: true, 
        wallet_address: walletAddress,
        message: 'Wallet connected successfully via WaaS'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in create-wallet-waas function:', error);
    
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