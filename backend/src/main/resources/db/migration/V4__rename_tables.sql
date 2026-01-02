-- 1. Crea users applicativi

ALTER TABLE public.users RENAME TO "user";
ALTER TABLE public.preventivi RENAME TO "preventivo";
ALTER TABLE public.prospects RENAME TO "prospect";

ALTER TABLE public.user add column first_name text;
ALTER TABLE public.user add column last_name text;
ALTER TABLE public.user add column avatar_url text;
