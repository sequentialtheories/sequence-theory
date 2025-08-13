import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.0";

const corsHeaders = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-vault-club-api-key, idempotency-key, Idempotency-Key, x-idempotency-key, X-Idempotency-Key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

serve(async (req) => {
  const origin = req.headers.get("origin") || "";
  const allowedOrigins = new Set([
    "https://staging.sequencetheory.com",
    "https://staging.vaultclub.app",
    "http://localhost:5173",
    "http://localhost:3000",
  ]);
  const allowOrigin = allowedOrigins.has(origin) ? origin : "null";
  const headers = { ...corsHeaders, "Access-Control-Allow-Origin": allowOrigin, Vary: "Origin" };
  const request_id = crypto.randomUUID();

  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const vaultClubApiKey = Deno.env.get("VAULT_CLUB_API_KEY");

    const apiKey = req.headers.get("x-vault-club-api-key");
    if (!vaultClubApiKey || apiKey !== vaultClubApiKey) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized: Invalid Vault Club API key", request_id }), {
        status: 401,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    if (req.method !== "GET") {
      return new Response(JSON.stringify({ success: false, error: "Method not allowed", request_id }), {
        status: 405,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const wallet = url.searchParams.get("wallet") || "";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const idk = req.headers.get("idempotency-key") || req.headers.get("Idempotency-Key") || req.headers.get("x-idempotency-key") || req.headers.get("X-Idempotency-Key") || null;
    const endpoint = "vault-club-balance";
    const method = "GET";

    if (idk) {
      const { data: idem } = await supabase.from("api_idempotency").select("*").eq("idempotency_key", idk).eq("endpoint", endpoint).eq("method", method).limit(1).maybeSingle();
      if (idem) {
        return new Response(JSON.stringify({ ...idem.response_body, request_id }), { status: idem.status_code, headers: { ...headers, "Content-Type": "application/json" } });
      }
    }

    const balance = "0";
    const responsePayload = { success: true, request_id, data: { wallet, balance } };

    if (idk) {
      await supabase.from("api_idempotency").insert({ idempotency_key: idk, user_id: null, endpoint, method, status_code: 200, response_body: responsePayload });
    }
    await supabase.from("api_audit_logs").insert({ user_id: null, api_key_id: null, endpoint, method, status_code: 200, idempotency_key: idk, request_meta: {}, response_meta: responsePayload });

    return new Response(JSON.stringify(responsePayload), {
      headers: { ...headers, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message, request_id }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }
});
