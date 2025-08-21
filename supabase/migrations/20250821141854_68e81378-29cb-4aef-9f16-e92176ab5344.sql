-- Update user role to admin for massimo_piva@outlook.it
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'massimo_piva@outlook.it';