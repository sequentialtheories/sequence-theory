-- Drop forum tables
DROP TABLE IF EXISTS public.forum_messages CASCADE;
DROP TABLE IF EXISTS public.forum_replies CASCADE;
DROP TABLE IF EXISTS public.forum_posts CASCADE;
DROP TABLE IF EXISTS public.forum_topics CASCADE;

-- Drop subclub-related tables
DROP TABLE IF EXISTS public.tx_ledger CASCADE;
DROP TABLE IF EXISTS public.vault_states CASCADE;
DROP TABLE IF EXISTS public.memberships CASCADE;
DROP TABLE IF EXISTS public.subclubs CASCADE;

-- Drop tx_events if not needed for contracts
DROP TABLE IF EXISTS public.tx_events CASCADE;