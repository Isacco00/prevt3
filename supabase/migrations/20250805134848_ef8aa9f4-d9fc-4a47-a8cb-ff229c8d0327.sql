-- Aggiungere i nuovi campi alla tabella preventivi
ALTER TABLE public.preventivi 
ADD COLUMN profondita numeric,
ADD COLUMN layout text,
ADD COLUMN distribuzione integer,
ADD COLUMN complessita text,
ADD COLUMN superficie_stampa numeric,
ADD COLUMN sviluppo_lineare numeric,
ADD COLUMN numero_pezzi numeric;

-- Rinominare lunghezza in profondità (per mantenere il dato esistente)
-- Prima copiamo i dati di lunghezza in profondità
UPDATE public.preventivi SET profondita = lunghezza WHERE profondita IS NULL;

-- Ora possiamo rimuovere la colonna lunghezza se necessario
-- ALTER TABLE public.preventivi DROP COLUMN lunghezza;