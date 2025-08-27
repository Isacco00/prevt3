-- Add columns for Espositore configuration
ALTER TABLE public.preventivi 
ADD COLUMN qta_tipo30 integer DEFAULT 0,
ADD COLUMN qta_tipo50 integer DEFAULT 0,
ADD COLUMN qta_tipo100 integer DEFAULT 0,
ADD COLUMN numero_pezzi_espositori numeric DEFAULT 0,
ADD COLUMN superficie_stampa_espositori numeric DEFAULT 0,
ADD COLUMN ripiano_30x30 integer DEFAULT 0,
ADD COLUMN ripiano_50x50 integer DEFAULT 0,
ADD COLUMN ripiano_100x50 integer DEFAULT 0,
ADD COLUMN teca_plexiglass_30x30x30 integer DEFAULT 0,
ADD COLUMN teca_plexiglass_50x50x50 integer DEFAULT 0,
ADD COLUMN teca_plexiglass_100x50x30 integer DEFAULT 0,
ADD COLUMN retroilluminazione_30x30x100h integer DEFAULT 0,
ADD COLUMN retroilluminazione_50x50x100h integer DEFAULT 0,
ADD COLUMN retroilluminazione_100x50x100h integer DEFAULT 0;