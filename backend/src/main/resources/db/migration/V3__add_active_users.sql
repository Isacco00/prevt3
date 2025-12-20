-- 1. Crea users applicativi

ALTER TABLE public.users
add column active boolean;

ALTER TABLE public.users
    add column password_hash varchar(255);
