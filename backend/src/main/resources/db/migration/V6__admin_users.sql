ALTER TABLE public.user add column admin boolean;
update public.user set admin = true;