-- Add new column for totale_costi
ALTER TABLE public.preventivi 
ADD COLUMN totale_costi numeric DEFAULT 0;