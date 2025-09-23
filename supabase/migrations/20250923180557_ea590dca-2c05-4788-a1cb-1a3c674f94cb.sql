-- Add totale_preventivo column to preventivi table
ALTER TABLE public.preventivi 
ADD COLUMN totale_preventivo numeric DEFAULT 0;