-- Add marginality columns for espositori section to preventivi table
ALTER TABLE public.preventivi 
ADD COLUMN marginalita_struttura_espositori numeric DEFAULT 50,
ADD COLUMN marginalita_grafica_espositori numeric DEFAULT 50,
ADD COLUMN marginalita_premontaggio_espositori numeric DEFAULT 50,
ADD COLUMN marginalita_accessori_espositori numeric DEFAULT 50;