-- 1) Deduplicate user_wallets by user_id, keeping the most recent row
WITH ranked AS (
  SELECT 
    id,
    user_id,
    created_at,
    updated_at,
    ROW_NUMBER() OVER (
      PARTITION BY user_id 
      ORDER BY COALESCE(updated_at, created_at) DESC, id DESC
    ) AS rn
  FROM public.user_wallets
),

to_delete AS (
  SELECT id FROM ranked WHERE rn > 1
)
DELETE FROM public.user_wallets
WHERE id IN (SELECT id FROM to_delete);

-- 2) Enforce one wallet per user going forward
CREATE UNIQUE INDEX IF NOT EXISTS user_wallets_user_id_unique
  ON public.user_wallets(user_id);
