-- Add new columns for bifaccialita and retroilluminazione to preventivi table
ALTER TABLE public.preventivi 
ADD COLUMN bifaccialita NUMERIC(10,2) DEFAULT 0,
ADD COLUMN retroilluminazione NUMERIC(10,2) DEFAULT 0;