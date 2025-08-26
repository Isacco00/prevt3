-- Aggiungiamo le colonne per i parametri dello Storage
ALTER TABLE public.preventivi 
ADD COLUMN larg_storage numeric DEFAULT 0,
ADD COLUMN prof_storage numeric DEFAULT 0,
ADD COLUMN alt_storage numeric DEFAULT 2.5,
ADD COLUMN layout_storage text DEFAULT '0',
ADD COLUMN numero_porte text DEFAULT '0';

-- Aggiungiamo le colonne per i parametri del Desk
ALTER TABLE public.preventivi 
ADD COLUMN desk_qta integer DEFAULT 0,
ADD COLUMN layout_desk text DEFAULT '',
ADD COLUMN porta_scorrevole integer DEFAULT 0,
ADD COLUMN ripiano_superiore integer DEFAULT 0,
ADD COLUMN ripiano_inferiore integer DEFAULT 0,
ADD COLUMN teca_plexiglass integer DEFAULT 0,
ADD COLUMN fronte_luminoso integer DEFAULT 0,
ADD COLUMN borsa integer DEFAULT 0;

-- Aggiungiamo colonne per i calcoli dello Storage
ALTER TABLE public.preventivi 
ADD COLUMN superficie_stampa_storage numeric DEFAULT 0,
ADD COLUMN sviluppo_metri_lineari_storage numeric DEFAULT 0,
ADD COLUMN numero_pezzi_storage numeric DEFAULT 0;

-- Aggiungiamo colonne per i calcoli del Desk
ALTER TABLE public.preventivi 
ADD COLUMN superficie_stampa_desk numeric DEFAULT 0,
ADD COLUMN numero_pezzi_desk numeric DEFAULT 0;

-- Aggiungiamo colonne per le sezioni future (Espositori/Plinto e Complementi)
-- Queste saranno utili quando implementeremo le altre sezioni
ALTER TABLE public.preventivi 
ADD COLUMN espositori_config text DEFAULT '{}',
ADD COLUMN complementi_config text DEFAULT '{}';

-- Commenti per documentare le nuove colonne
COMMENT ON COLUMN public.preventivi.larg_storage IS 'Larghezza dello storage in metri';
COMMENT ON COLUMN public.preventivi.prof_storage IS 'Profondità dello storage in metri';
COMMENT ON COLUMN public.preventivi.alt_storage IS 'Altezza pareti dello storage in metri';
COMMENT ON COLUMN public.preventivi.layout_storage IS 'Tipo layout dello storage (0,1,2)';
COMMENT ON COLUMN public.preventivi.numero_porte IS 'Numero pareti da configurare (0,1,2)';
COMMENT ON COLUMN public.preventivi.desk_qta IS 'Quantità desk (1-10)';
COMMENT ON COLUMN public.preventivi.layout_desk IS 'Layout desk (50,100,150,200)';
COMMENT ON COLUMN public.preventivi.espositori_config IS 'Configurazione espositori/plinto in JSON';
COMMENT ON COLUMN public.preventivi.complementi_config IS 'Configurazione complementi in JSON';