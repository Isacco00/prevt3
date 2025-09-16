-- Add premontaggio column to preventivi table
ALTER TABLE public.preventivi 
ADD COLUMN premontaggio boolean DEFAULT true;