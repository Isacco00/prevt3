-- Fix the function search path security issue
CREATE OR REPLACE FUNCTION public.create_user_by_admin(
  email TEXT,
  password TEXT,
  first_name TEXT,
  last_name TEXT,
  user_role TEXT DEFAULT 'user'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Check if the calling user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can create users';
  END IF;

  -- Validate role
  IF user_role NOT IN ('admin', 'user') THEN
    RAISE EXCEPTION 'Invalid role. Must be admin or user';
  END IF;

  -- Create the user account (this bypasses normal signup)
  INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    email,
    crypt(password, gen_salt('bf')),
    now(),
    jsonb_build_object(
      'first_name', first_name,
      'last_name', last_name
    ),
    now(),
    now()
  ) RETURNING id INTO new_user_id;

  -- Create profile with specified role
  INSERT INTO public.profiles (user_id, first_name, last_name, email, role, active)
  VALUES (new_user_id, first_name, last_name, email, user_role, true);

  RETURN new_user_id;
END;
$$;