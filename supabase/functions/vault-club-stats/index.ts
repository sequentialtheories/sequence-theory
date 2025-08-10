import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-vault-club-api-key",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const vaultClubApiKey = Deno.env.get("VAULT_CLUB_API_KEY");

    const apiKey = req.headers.get("x-vault-club-api-key");
    if (!vaultClubApiKey || apiKey !== vaultClubApiKey) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized: Invalid Vault Club API key" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method !== "GET") {
      return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { count: membersCount } = await supabase
      .from("contract_participants")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    const totalMembers = membersCount || 0;

    const data = {
      totalMembers,
      totalDeposits: "0",
      systemHealth: 100,
      transactions: 0,
      strand1Balance: "0",
      strand2Balance: "0",
      strand3Balance: "0",
    };

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
