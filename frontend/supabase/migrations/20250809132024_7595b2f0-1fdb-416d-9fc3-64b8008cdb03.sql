-- Performance index for learning progress lookups by user and sorting by time
CREATE INDEX IF NOT EXISTS idx_learning_progress_user_time
  ON public.learning_progress (user_id, completed_at DESC);
