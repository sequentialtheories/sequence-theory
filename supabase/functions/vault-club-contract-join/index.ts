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
      return new Response(JSON.stringify({ success: false, error: "Unauthorized", request_id }), {
        status: 401,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ success: false, error: "Method not allowed", request_id }), {
        status: 405,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    const idk = req.headers.get("idempotency-key") || req.headers.get("Idempotency-Key") || req.headers.get("x-idempotency-key") || req.headers.get("X-Idempotency-Key") || null;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const endpoint = "vault-club-contract-join";
    const method = "POST";

    if (idk) {
      const { data: idemLegacy } = await supabase.from("api_idempotency").select("*").eq("idempotency_key", idk).eq("endpoint", endpoint).eq("method", method).limit(1).maybeSingle();
      if (idemLegacy) {
        return new Response(JSON.stringify({ ...idemLegacy.response_body, request_id }), { status: idemLegacy.status_code, headers: { ...headers, "Content-Type": "application/json" } });
      }
    }

    const { data: authUser, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authUser?.user) {
      const body = { success: false, error: "Unauthorized", request_id };
      await supabase.from("api_audit_logs").insert({ user_id: null, api_key_id: null, endpoint, method, status_code: 401, idempotency_key: idk, request_meta: {}, response_meta: body });
      return new Response(JSON.stringify(body), {
        status: 401,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    const enc = new TextEncoder();
    const { contract_id, contribution_amount, wallet_address } = await req.json();

    if (idk) {
      const hashInput = `${authUser.user.id}:${contract_id}:${contribution_amount || ""}:${wallet_address || ""}`;
      const digest = await crypto.subtle.digest("SHA-256", enc.encode(hashInput));
      const request_hash = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");

      const { data: idemRow } = await supabase
        .from("idempotency_keys")
        .select("status, response_snapshot")
        .eq("function_name", endpoint)
        .eq("key", idk)
        .eq("request_hash", request_hash)
        .maybeSingle();

      if (idemRow && (idemRow as any).status === "in_flight") {
        return new Response(JSON.stringify({ success: false, error: "conflict_idempotency_in_flight", request_id }), { status: 409, headers: { ...headers, "Content-Type": "application/json" } });
      }
      if (idemRow && (idemRow as any).status === "success" && (idemRow as any).response_snapshot) {
        return new Response(JSON.stringify((idemRow as any).response_snapshot), { headers: { ...headers, "Content-Type": "application/json" } });
      }

      await supabase.from("idempotency_keys").upsert({
        function_name: endpoint,
        key: idk,
        user_id: authUser.user.id,
        request_hash,
        status: "in_flight",
      }, { onConflict: "function_name,key" });
    }

    const { data, error } = await supabase.rpc("join_contract", {
      p_contract_id: contract_id,
      p_contribution_amount: contribution_amount,
      p_wallet_address: wallet_address || null,
    });

    if (error) {
      const body = { success: false, error: error.message, request_id };
      await supabase.from("api_audit_logs").insert({ user_id: authUser.user.id, api_key_id: null, endpoint, method, status_code: 400, idempotency_key: idk, request_meta: {}, response_meta: body });
      return new Response(JSON.stringify(body), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    const responsePayload = { success: true, request_id, data };

    if (idk) {
      const hashInput2 = `${authUser.user.id}:${data?.contract_id || contract_id}:${contribution_amount || ""}:${wallet_address || ""}`;
      const digest2 = await crypto.subtle.digest("SHA-256", enc.encode(hashInput2));
      const request_hash2 = Array.from(new Uint8Array(digest2)).map(b => b.toString(16).padStart(2, "0")).join("");

      await supabase.from("api_idempotency").insert({ idempotency_key: idk, user_id: authUser.user.id, endpoint, method, status_code: 200, response_body: responsePayload });
      await supabase.from("idempotency_keys").upsert({
        function_name: endpoint,
        key: idk,
        user_id: authUser.user.id,
        request_hash: request_hash2,
        status: "success",
        response_snapshot: responsePayload
      }, { onConflict: "function_name,key" });
    }

    await supabase.from("api_audit_logs").insert({ user_id: authUser.user.id, api_key_id: null, endpoint, method, status_code: 200, idempotency_key: idk, request_meta: {}, response_meta: responsePayload });

    return new Response(JSON.stringify(responsePayload), {
      headers: { ...headers, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: String(error && error.message || error), request_id }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }
});
