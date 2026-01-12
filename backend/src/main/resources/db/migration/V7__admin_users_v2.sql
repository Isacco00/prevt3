ALTER TABLE public.user add column role text;
ALTER TABLE public.user drop column admin;
update public.user set role = 'admin';