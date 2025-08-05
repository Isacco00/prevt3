-- Add missing cost columns to preventivi table
ALTER TABLE public.preventivi 
ADD COLUMN costo_struttura NUMERIC DEFAULT 0,
ADD COLUMN costo_grafica NUMERIC DEFAULT 0, 
ADD COLUMN costo_premontaggio NUMERIC DEFAULT 0,
ADD COLUMN costo_totale NUMERIC DEFAULT 0;