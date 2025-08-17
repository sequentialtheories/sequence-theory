

CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email text,
    name text,
    eth_address text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id)
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'profiles' 
        AND indexname = 'profiles_eth_address_unique_idx'
    ) THEN
        CREATE UNIQUE INDEX profiles_eth_address_unique_idx 
        ON public.profiles(eth_address) 
        WHERE eth_address IS NOT NULL;
    END IF;
END $$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.ensure_profile(p_user_id uuid, user_email text DEFAULT NULL, user_name text DEFAULT NULL)
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    profile_record public.profiles;
BEGIN
    SELECT * INTO profile_record 
    FROM public.profiles 
    WHERE user_id = p_user_id;
    
    IF NOT FOUND THEN
        INSERT INTO public.profiles (user_id, email, name, created_at, updated_at)
        VALUES (p_user_id, user_email, user_name, now(), now())
        RETURNING * INTO profile_record;
    ELSE
        IF (user_email IS NOT NULL AND profile_record.email != user_email) OR 
           (user_name IS NOT NULL AND profile_record.name != user_name) THEN
            UPDATE public.profiles 
            SET email = COALESCE(user_email, email),
                name = COALESCE(user_name, name),
                updated_at = now()
            WHERE user_id = p_user_id
            RETURNING * INTO profile_record;
        END IF;
    END IF;
    
    RETURN profile_record;
END;
$$;

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_profile(uuid, text, text) TO authenticated;
