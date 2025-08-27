-- Add columns for Servizi (Services) section
ALTER TABLE public.preventivi 
ADD COLUMN servizio_montaggio_smontaggio boolean DEFAULT false,
ADD COLUMN servizio_certificazioni boolean DEFAULT false,
ADD COLUMN servizio_istruzioni_assistenza boolean DEFAULT false;