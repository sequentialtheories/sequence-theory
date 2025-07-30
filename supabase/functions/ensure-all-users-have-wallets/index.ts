import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 Starting mass wallet creation for all users...')

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get all users from profiles who don't have wallets
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, email')

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user profiles' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No users found', created: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Found ${profiles.length} user profiles`)

    // Check which users already have wallets
    const { data: existingWallets, error: walletsError } = await supabase
      .from('user_wallets')
      .select('user_id')

    if (walletsError) {
      console.error('Error fetching existing wallets:', walletsError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch existing wallets' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const existingWalletUserIds = new Set(existingWallets?.map(w => w.user_id) || [])
    const usersWithoutWallets = profiles.filter(p => !existingWalletUserIds.has(p.user_id))

    console.log(`${usersWithoutWallets.length} users need wallets`)

    let successCount = 0
    let errorCount = 0

    // Create wallets for all users who don't have them
    for (const user of usersWithoutWallets) {
      try {
        console.log(`Creating wallet for user ${user.user_id}...`)
        
        // Generate deterministic wallet address
        const walletAddress = `0x${user.user_id.replace(/-/g, '').substring(0, 40)}`
        
        // Insert wallet directly
        const { error: insertError } = await supabase
          .from('user_wallets')
          .upsert({
            user_id: user.user_id,
            wallet_address: walletAddress,
            network: 'arbitrum-nova',
            wallet_config: {
              provider: 'auto-generated',
              mass_created: true,
              created_at: new Date().toISOString()
            }
          }, {
            onConflict: 'user_id'
          })

        if (insertError) {
          console.error(`Failed to create wallet for user ${user.user_id}:`, insertError)
          errorCount++
        } else {
          console.log(`✅ Created wallet for user ${user.user_id}: ${walletAddress}`)
          successCount++
        }
      } catch (error) {
        console.error(`Error creating wallet for user ${user.user_id}:`, error)
        errorCount++
      }
    }

    // Also fix any pending wallets
    const { data: pendingWallets, error: pendingError } = await supabase
      .from('user_wallets')
      .select('user_id, wallet_config')
      .eq('wallet_address', 'pending')

    if (!pendingError && pendingWallets && pendingWallets.length > 0) {
      console.log(`Fixing ${pendingWallets.length} pending wallets...`)
      
      for (const wallet of pendingWallets) {
        try {
          const walletAddress = `0x${wallet.user_id.replace(/-/g, '').substring(0, 40)}`
          
          const { error: updateError } = await supabase
            .from('user_wallets')
            .update({
              wallet_address: walletAddress,
              wallet_config: {
                ...wallet.wallet_config,
                provider: 'auto-generated',
                fixed_pending: true,
                updated_at: new Date().toISOString()
              }
            })
            .eq('user_id', wallet.user_id)

          if (updateError) {
            console.error(`Failed to fix pending wallet for user ${wallet.user_id}:`, updateError)
            errorCount++
          } else {
            console.log(`✅ Fixed pending wallet for user ${wallet.user_id}: ${walletAddress}`)
            successCount++
          }
        } catch (error) {
          console.error(`Error fixing pending wallet for user ${wallet.user_id}:`, error)
          errorCount++
        }
      }
    }

    console.log(`🎉 Mass wallet creation completed. Success: ${successCount}, Errors: ${errorCount}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Mass wallet creation completed',
        walletsCreated: successCount,
        errors: errorCount,
        totalProcessed: successCount + errorCount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in ensure-all-users-have-wallets function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})