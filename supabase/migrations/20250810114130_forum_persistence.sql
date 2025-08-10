CREATE TABLE IF NOT EXISTS public.forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.forum_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS read_posts ON public.forum_posts;
CREATE POLICY read_posts ON public.forum_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS write_own_posts ON public.forum_posts;
CREATE POLICY write_own_posts ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS update_own_posts ON public.forum_posts;
CREATE POLICY update_own_posts ON public.forum_posts FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS read_replies ON public.forum_replies;
CREATE POLICY read_replies ON public.forum_replies FOR SELECT USING (true);

DROP POLICY IF EXISTS write_own_replies ON public.forum_replies;
CREATE POLICY write_own_replies ON public.forum_replies FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS update_own_replies ON public.forum_replies;
CREATE POLICY update_own_replies ON public.forum_replies FOR UPDATE USING (auth.uid() = user_id);
