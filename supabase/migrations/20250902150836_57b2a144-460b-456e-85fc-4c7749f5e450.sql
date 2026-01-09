-- Fix remaining functions with mutable search_path for security

-- Fix save_learning_progress function
CREATE OR REPLACE FUNCTION public.save_learning_progress(p_module_id text, p_category_index integer, p_module_index integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, extensions
AS $function$
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
$function$;

-- Fix get_user_progress function
CREATE OR REPLACE FUNCTION public.get_user_progress()
 RETURNS TABLE(module_id text, category_index integer, module_index integer, completed_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, extensions
AS $function$
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
$function$;

-- Fix can_access_api_keys function
CREATE OR REPLACE FUNCTION public.can_access_api_keys()
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 STABLE
 SET search_path = public, extensions
AS $function$
  SELECT auth.uid() IS NOT NULL;
$function$;

-- Fix sync_user_email function
CREATE OR REPLACE FUNCTION public.sync_user_email()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, extensions
AS $function$
BEGIN
  UPDATE public.profiles 
  SET email = au.email
  FROM auth.users au
  WHERE profiles.user_id = au.id
  AND profiles.email IS NULL;
END;
$function$;

-- Fix check_contract_owner function
CREATE OR REPLACE FUNCTION public.check_contract_owner(p_contract_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public, extensions
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.contracts
    WHERE id = p_contract_id AND user_id = auth.uid()
  );
$function$;

-- Fix validate_contract_security function
CREATE OR REPLACE FUNCTION public.validate_contract_security()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, extensions
AS $function$
BEGIN
  -- Validate target amount is positive
  IF NEW.target_amount <= 0 THEN
    RAISE EXCEPTION 'Target amount must be positive';
  END IF;
  
  -- Validate maximum participants is reasonable
  IF NEW.maximum_participants < 1 OR NEW.maximum_participants > 10000 THEN
    RAISE EXCEPTION 'Maximum participants must be between 1 and 10000';
  END IF;
  
  -- Validate minimum contribution is not negative
  IF NEW.minimum_contribution < 0 THEN
    RAISE EXCEPTION 'Minimum contribution cannot be negative';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix is_contract_participant function
CREATE OR REPLACE FUNCTION public.is_contract_participant(p_contract_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public, extensions
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.contract_participants cp
    WHERE cp.contract_id = p_contract_id AND cp.user_id = auth.uid()
  );
$function$;

-- Fix log_api_key_changes function
CREATE OR REPLACE FUNCTION public.log_api_key_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, extensions
AS $function$
BEGIN
  -- Log API key creation/updates for security monitoring
  INSERT INTO api_access_logs (
    api_key_id,
    endpoint,
    request_data,
    response_status,
    ip_address
  ) VALUES (
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'API_KEY_CREATED'
      WHEN TG_OP = 'UPDATE' THEN 'API_KEY_UPDATED'
      WHEN TG_OP = 'DELETE' THEN 'API_KEY_DELETED'
    END,
    jsonb_build_object(
      'operation', TG_OP,
      'permissions', COALESCE(NEW.permissions, OLD.permissions),
      'is_active', COALESCE(NEW.is_active, OLD.is_active)
    ),
    200,
    '127.0.0.1'::inet
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Fix get_current_user_role function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
 RETURNS app_role
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public, extensions
AS $function$
  SELECT role
  FROM public.user_roles
  WHERE user_id = auth.uid()
  ORDER BY CASE WHEN role = 'admin' THEN 1 ELSE 2 END
  LIMIT 1
$function$;

-- Fix has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public, extensions
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;