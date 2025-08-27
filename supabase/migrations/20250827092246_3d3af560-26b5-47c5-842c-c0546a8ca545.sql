-- Add fields for complexity extra cost calculation
ALTER TABLE public.preventivi 
ADD COLUMN extra_perc_complex numeric DEFAULT 0,
ADD COLUMN extra_stand_complesso numeric DEFAULT 0;