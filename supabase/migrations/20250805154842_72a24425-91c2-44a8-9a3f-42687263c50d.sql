-- Prima rimuovo le colonne generate che dipendono da lunghezza
ALTER TABLE public.preventivi DROP COLUMN IF EXISTS superficie CASCADE;
ALTER TABLE public.preventivi DROP COLUMN IF EXISTS volume CASCADE;
ALTER TABLE public.preventivi DROP COLUMN IF EXISTS totale CASCADE;

-- Ora posso rimuovere lunghezza
ALTER TABLE public.preventivi DROP COLUMN IF EXISTS lunghezza CASCADE;

-- Ricreo totale come colonna semplice
ALTER TABLE public.preventivi ADD COLUMN totale numeric DEFAULT 0;