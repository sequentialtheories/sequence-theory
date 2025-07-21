-- Fix the update_updated_at_column function to include explicit search_path for security
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$;