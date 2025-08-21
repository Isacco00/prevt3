-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update the create_user_by_admin function to use proper password hashing
CREATE OR REPLACE FUNCTION public.create_user_by_admin(
  email text, 
  password text, 
  first_name text, 
  last_name text, 
  user_role text DEFAULT 'user'::text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_user_id uuid;
BEGIN
  -- Check if the calling user is an admin
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can create users';
  END IF;

  -- Validate role
  IF user_role NOT IN ('admin', 'user') THEN
    RAISE EXCEPTION 'Invalid role. Must be admin or user';
  END IF;

  -- Create the user account using Supabase auth
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    email,
    crypt(password, gen_salt('bf')),
    now(),
    jsonb_build_object(
      'first_name', first_name,
      'last_name', last_name
    ),
    now(),
    now(),
    '',
    '',
    '',
    ''
  ) RETURNING id INTO new_user_id;

  -- Create profile with specified role
  INSERT INTO public.profiles (user_id, first_name, last_name, email, role, active)
  VALUES (new_user_id, first_name, last_name, email, user_role, true);

  RETURN new_user_id;
END;
$function$;