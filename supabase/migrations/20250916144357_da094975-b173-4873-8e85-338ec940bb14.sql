-- Add tipo_prospect column to prospects table
ALTER TABLE public.prospects 
ADD COLUMN tipo_prospect text DEFAULT 'Professional' CHECK (tipo_prospect IN ('Professional', 'Finale'));