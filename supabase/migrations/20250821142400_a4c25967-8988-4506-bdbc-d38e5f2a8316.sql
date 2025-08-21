-- Ensure the specified user is admin and active (case-insensitive match)
UPDATE public.profiles 
SET role = 'admin', active = true 
WHERE lower(email) = lower('massimo_piva@outlook.it');

-- Fallback: set by joining auth.users in case profiles.email differs or is null
UPDATE public.profiles p
SET role = 'admin', active = true, email = u.email
FROM auth.users u
WHERE p.user_id = u.id AND lower(u.email) = lower('massimo_piva@outlook.it');