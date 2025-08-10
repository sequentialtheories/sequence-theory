CREATE TABLE IF NOT EXISTS public.api_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NULL,
  api_key_id uuid NULL,
  endpoint text NOT NULL,
  method text NOT NULL,
  status_code integer NOT NULL,
  idempotency_key text NULL,
  request_hash text NULL,
  request_meta jsonb NULL,
  response_meta jsonb NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.api_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_see_own_audit_logs ON public.api_audit_logs;
CREATE POLICY users_see_own_audit_logs
ON public.api_audit_logs FOR SELECT
USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.api_idempotency (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key text UNIQUE NOT NULL,
  user_id uuid NULL,
  endpoint text NOT NULL,
  method text NOT NULL,
  status_code integer NOT NULL,
  response_body jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.api_idempotency ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS deny_all_idem_select ON public.api_idempotency;
CREATE POLICY deny_all_idem_select ON public.api_idempotency FOR SELECT USING (false);

DROP POLICY IF EXISTS deny_all_idem_write ON public.api_idempotency;
CREATE POLICY deny_all_idem_write ON public.api_idempotency FOR ALL USING (false);
