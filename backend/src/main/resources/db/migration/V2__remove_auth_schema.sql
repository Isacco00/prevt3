-- 1. Crea users applicativi
CREATE TABLE IF NOT EXISTS public.users (
                                            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
    );

-- 2. Droppa FK verso auth.users
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

ALTER TABLE public.prospects
DROP CONSTRAINT IF EXISTS prospects_user_id_fkey;

ALTER TABLE public.preventivi
DROP CONSTRAINT IF EXISTS preventivi_user_id_fkey;

-- 3. Ricrea FK verso public.users
ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE public.prospects
    ADD CONSTRAINT prospects_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE public.preventivi
    ADD CONSTRAINT preventivi_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES public.users(id);

-- 4. Elimina schema auth (CASCADE sicuro perché FK già tolte)
DROP SCHEMA IF EXISTS auth CASCADE;
