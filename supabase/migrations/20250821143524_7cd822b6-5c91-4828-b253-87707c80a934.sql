
-- Ensure a profile exists and set it as admin for the specified email

-- 1) Create the profile if it doesn't exist yet
WITH target AS (
  SELECT id AS user_id, email
  FROM auth.users
  WHERE lower(email) = lower('massimo_piva@outlook.it')
  LIMIT 1
)
INSERT INTO public.profiles (user_id, email, role, active)
SELECT t.user_id, t.email, 'admin', true
FROM target t
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.user_id = t.user_id
);

-- 2) Update (or confirm) admin role and active status
UPDATE public.profiles p
SET role = 'admin',
    active = true,
    email = t.email
FROM (
  SELECT id AS user_id, email
  FROM auth.users
  WHERE lower(email) = lower('massimo_piva@outlook.it')
  LIMIT 1
) t
WHERE p.user_id = t.user_id;
