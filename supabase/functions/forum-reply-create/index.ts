import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-vault-club-api-key, idempotency-key",
};

function sanitizeText(s: string) {
  return (s || "").replace(/<[^>]*>/g, "").slice(0, 5000);
}

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
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const idk = req.headers.get("Idempotency-Key") || null;
    const endpoint = "forum-reply-create";
    const method = "POST";

    if (idk) {
      const { data: idem } = await supabase.from("api_idempotency").select("*").eq("idempotency_key", idk).eq("endpoint", endpoint).eq("method", method).limit(1).maybeSingle();
      if (idem) return new Response(JSON.stringify(idem.response_body), { status: idem.status_code, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    const { data: authUser, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authUser?.user) {
      const body = { success: false, error: "Unauthorized" };
      await supabase.from("api_audit_logs").insert({ user_id: null, api_key_id: null, endpoint, method, status_code: 401, idempotency_key: idk, request_meta: {}, response_meta: body });
      return new Response(JSON.stringify(body), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { post_id, content } = await req.json();
    const c = sanitizeText(String(content || ""));
    if (!post_id || !c) {
      const body = { success: false, error: "Missing post_id or content" };
      await supabase.from("api_audit_logs").insert({ user_id: authUser.user.id, api_key_id: null, endpoint, method, status_code: 400, idempotency_key: idk, request_meta: {}, response_meta: body });
      return new Response(JSON.stringify(body), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data, error } = await supabase.from("forum_replies").insert({ post_id, user_id: authUser.user.id, content: c }).select().single();
    if (error) {
      const body = { success: false, error: error.message };
      await supabase.from("api_audit_logs").insert({ user_id: authUser.user.id, api_key_id: null, endpoint, method, status_code: 400, idempotency_key: idk, request_meta: {}, response_meta: body });
      return new Response(JSON.stringify(body), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const request_id = crypto.randomUUID();
    const responsePayload = { success: true, request_id, data };
    if (idk) {
      const enc = new TextEncoder();
      const raw = `${post_id}:${c}:${authUser.user.id}`;
      const digest = await crypto.subtle.digest('SHA-256', enc.encode(raw));
      const hashHex = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
      await supabase.from('idempotency_keys').upsert({
        function_name: endpoint,
        key: idk,
        user_id: authUser.user.id,
        request_hash: hashHex,
        status: 'success',
        response_snapshot: responsePayload
      }, { onConflict: 'function_name,key' });
    }
    await supabase.from("api_audit_logs").insert({ user_id: authUser.user.id, api_key_id: null, endpoint, method, status_code: 200, idempotency_key: idk, request_meta: {}, response_meta: responsePayload });
    return new Response(JSON.stringify(responsePayload), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: String(error && error.message || error) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
