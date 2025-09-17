-- Add margin fields for Storage section
ALTER TABLE public.preventivi 
ADD COLUMN marginalita_struttura_storage numeric DEFAULT 50,
ADD COLUMN marginalita_grafica_storage numeric DEFAULT 50,
ADD COLUMN marginalita_premontaggio_storage numeric DEFAULT 50;

-- Add margin fields for Desk section  
ALTER TABLE public.preventivi
ADD COLUMN marginalita_struttura_desk numeric DEFAULT 50,
ADD COLUMN marginalita_grafica_desk numeric DEFAULT 50,
ADD COLUMN marginalita_premontaggio_desk numeric DEFAULT 50,
ADD COLUMN marginalita_accessori_desk numeric DEFAULT 50;