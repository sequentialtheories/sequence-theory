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
    const idk = req.headers.get("Idempotency-Key") || null;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const endpoint = "vault-club-harvest";
    const method = "POST";

    if (idk) {
      const { data: idem } = await supabase.from("api_idempotency").select("*").eq("idempotency_key", idk).eq("endpoint", endpoint).eq("method", method).limit(1).maybeSingle();
      if (idem) {
        return new Response(JSON.stringify(idem.response_body), { status: idem.status_code, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    const { data: authUser, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authUser?.user) {
      const body = { success: false, error: "Unauthorized" };
      await supabase.from("api_audit_logs").insert({ user_id: null, api_key_id: null, endpoint, method, status_code: 401, idempotency_key: idk, request_meta: {}, response_meta: body });
      return new Response(JSON.stringify(body), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const nowIso = new Date().toISOString();
    const { data: epoch } = await supabase
      .from("vault_epochs")
      .select("*")
      .lt("ends_at", nowIso)
      .order("ends_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let epochNumber = epoch?.epoch_number || null;
    if (!epochNumber) {
      return new Response(JSON.stringify({ success: false, error: "No epoch to harvest", request_id }), { status: 400, headers: { ...headers, "Content-Type": "application/json" } });
    }

    if (idk) {
      const { data: idemRow } = await supabase
        .from("idempotency_keys")
        .select("status, response_snapshot")
        .eq("function_name", endpoint)
        .eq("key", idk)
        .eq("request_hash", String(epochNumber))
        .maybeSingle();

      if (idemRow && (idemRow as any).status === "in_flight") {
        return new Response(JSON.stringify({ success: false, error: "conflict_idempotency_in_flight", request_id }), { status: 409, headers: { ...headers, "Content-Type": "application/json" } });
      }
      if (idemRow && (idemRow as any).status === "success" && (idemRow as any).response_snapshot) {
        return new Response(JSON.stringify((idemRow as any).response_snapshot), { headers: { ...headers, "Content-Type": "application/json" } });
      }

      await supabase
        .from("idempotency_keys")
        .upsert({ function_name: endpoint, key: idk, user_id: authUser.user.id, request_hash: String(epochNumber), status: "in_flight" }, { onConflict: "function_name,key" });
    }

    const { data: depositsAgg } = await supabase
      .from("vault_epoch_deposits")
      .select("amount")
      .eq("epoch_number", epochNumber);

    let total = 0;
    for (const row of depositsAgg || []) {
      const val = typeof row.amount === "string" ? parseFloat(row.amount) : Number(row.amount || 0);
      if (!Number.isNaN(val)) total += val;
    }

    const yieldAmount = String(total * 0.01);

    await supabase.from("vault_epoch_harvests").insert({
      epoch_number: epochNumber,
      executed_by: authUser.user.id,
      yield_amount: yieldAmount,
    });

    await supabase.from("vault_epochs").update({ status: "harvested" }).eq("epoch_number", epochNumber);

    const start = new Date();
    start.setUTCHours(0,0,0,0);
    const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    await supabase.from("vault_epochs").insert({
      epoch_number: Math.floor(Date.now() / 1000),
      starts_at: start.toISOString(),
      ends_at: end.toISOString(),
      status: "open",
    });

    const request_id = crypto.randomUUID();
    const body = { success: true, data: { accepted: true, executed: true, epoch_number: epochNumber, yield_amount: yieldAmount, network: "testnet" } };
    const responsePayload = { ...body, request_id };

    if (idk) {
      await supabase.from("api_idempotency").insert({ idempotency_key: idk, user_id: authUser.user.id, endpoint, method, status_code: 200, response_body: responsePayload });
      await supabase
        .from("idempotency_keys")
        .upsert(
          {
            function_name: "vault-club-harvest",
            key: idk,
            user_id: authUser.user.id,
            request_hash: String(epochNumber),
            status: "success",
            response_snapshot: responsePayload,
          },
          { onConflict: "function_name,key" }
        );
    }

    await supabase.from("api_audit_logs").insert({ user_id: authUser.user.id, api_key_id: null, endpoint, method, status_code: 200, idempotency_key: idk, request_meta: {}, response_meta: responsePayload });

    return new Response(JSON.stringify(responsePayload), { headers: { ...headers, "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: String(error && error.message || error), request_id }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }
});
