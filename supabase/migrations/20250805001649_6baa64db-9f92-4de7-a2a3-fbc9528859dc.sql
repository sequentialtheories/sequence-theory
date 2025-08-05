-- Create learning_progress table for automatic progress tracking
CREATE TABLE public.learning_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  category_index INTEGER NOT NULL,
  module_index INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- Enable RLS
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own progress" 
ON public.learning_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
ON public.learning_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.learning_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_learning_progress_updated_at
  BEFORE UPDATE ON public.learning_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically save progress
CREATE OR REPLACE FUNCTION public.save_learning_progress(
  p_module_id TEXT,
  p_category_index INTEGER,
  p_module_index INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.learning_progress (
    user_id,
    module_id,
    category_index,
    module_index
  ) VALUES (
    auth.uid(),
    p_module_id,
    p_category_index,
    p_module_index
  )
  ON CONFLICT (user_id, module_id) 
  DO UPDATE SET 
    completed_at = now(),
    updated_at = now();
END;
$$;

-- Create function to get user progress
CREATE OR REPLACE FUNCTION public.get_user_progress()
RETURNS TABLE (
  module_id TEXT,
  category_index INTEGER,
  module_index INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    lp.module_id,
    lp.category_index,
    lp.module_index,
    lp.completed_at
  FROM public.learning_progress lp
  WHERE lp.user_id = auth.uid()
  ORDER BY lp.completed_at DESC;
END;
$$;