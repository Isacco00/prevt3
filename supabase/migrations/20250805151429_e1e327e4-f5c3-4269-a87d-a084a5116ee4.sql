-- Rename lunghezza column to profondita and increase numeric precision
ALTER TABLE public.preventivi 
RENAME COLUMN lunghezza TO profondita;

-- Increase precision for numeric columns to handle larger values
ALTER TABLE public.preventivi 
ALTER COLUMN costo_mq TYPE NUMERIC(15,4),
ALTER COLUMN costo_mc TYPE NUMERIC(15,4),
ALTER COLUMN costo_struttura TYPE NUMERIC(15,2),
ALTER COLUMN costo_grafica TYPE NUMERIC(15,2),
ALTER COLUMN costo_premontaggio TYPE NUMERIC(15,2),
ALTER COLUMN costo_totale TYPE NUMERIC(15,2),
ALTER COLUMN superficie_stampa TYPE NUMERIC(15,2),
ALTER COLUMN sviluppo_lineare TYPE NUMERIC(15,2),
ALTER COLUMN numero_pezzi TYPE NUMERIC(15,2);