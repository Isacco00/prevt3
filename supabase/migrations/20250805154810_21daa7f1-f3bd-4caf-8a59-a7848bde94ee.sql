-- Rimuovo la colonna lunghezza che non viene utilizzata
ALTER TABLE public.preventivi DROP COLUMN IF EXISTS lunghezza;