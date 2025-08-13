import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-vault-club-api-key, idempotency-key",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const vaultClubApiKey = Deno.env.get("VAULT_CLUB_API_KEY");
    const apiKey = req.headers.get("x-vault-club-api-key");
    if (!vaultClubApiKey || apiKey !== vaultClubApiKey) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (req.method !== "GET") {
      return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const idk = req.headers.get("Idempotency-Key") || null;
    const endpoint = "forum-post-list";
    const method = "GET";

    if (idk) {
      const { data: idem } = await supabase.from("api_idempotency").select("*").eq("idempotency_key", idk).eq("endpoint", endpoint).eq("method", method).limit(1).maybeSingle();
      if (idem) return new Response(JSON.stringify(idem.response_body), { status: idem.status_code, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    let q = supabase.from("forum_posts").select("*").order("created_at", { ascending: false });
    if (category) q = q.eq("category", category);
    const { data, error } = await q;
    if (error) {
      const body = { success: false, error: error.message };
      await supabase.from("api_audit_logs").insert({ user_id: null, api_key_id: null, endpoint, method, status_code: 400, idempotency_key: idk, request_meta: {}, response_meta: body });
      return new Response(JSON.stringify(body), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const request_id = crypto.randomUUID();
    const responsePayload = { success: true, request_id, data };
    if (idk) await supabase.from("api_idempotency").insert({ idempotency_key: idk, user_id: null, endpoint, method, status_code: 200, response_body: responsePayload });
    await supabase.from("api_audit_logs").insert({ user_id: null, api_key_id: null, endpoint, method, status_code: 200, idempotency_key: idk, request_meta: {}, response_meta: responsePayload });
    return new Response(JSON.stringify(responsePayload), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: String(error && error.message || error) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
