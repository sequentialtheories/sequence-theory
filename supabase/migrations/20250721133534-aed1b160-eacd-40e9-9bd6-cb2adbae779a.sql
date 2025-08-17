-- Update the handle_new_user function to ensure explicit search_path for security
-- This function already has the correct search_path set, but we're ensuring it's explicit
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data ->> 'name', ''),
    new.email
  );
  RETURN new;
END;
$$;
