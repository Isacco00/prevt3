-- Aggiungere colonna per configurazione accessori stand
ALTER TABLE public.preventivi 
ADD COLUMN accessori_stand_config text DEFAULT '{}'::text;