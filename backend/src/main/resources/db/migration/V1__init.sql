-- Flyway migration: initial schema (ported from Supabase export)
-- NOTE:
-- 1) This migration creates schema "auth" and table "auth.users" as a minimal placeholder to satisfy FKs.
--    If you already have a users table elsewhere, adjust the FK targets accordingly.
-- 2) Uses pgcrypto for gen_random_uuid(). If you prefer uuid-ossp, swap the extension + default.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS auth;

-- Minimal users table to replace Supabase auth.users (customize as needed)
CREATE TABLE IF NOT EXISTS auth.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  first_name text,
  last_name text,
  email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  role text NOT NULL DEFAULT 'user' CHECK (role = ANY (ARRAY['admin','user'])),
  active boolean NOT NULL DEFAULT true,
  avatar_url text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- PROSPECTS
CREATE TABLE IF NOT EXISTS public.prospects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  ragione_sociale text NOT NULL,
  partita_iva text NOT NULL,
  codice_fiscale text,
  indirizzo text,
  citta text,
  cap text,
  provincia text,
  telefono text,
  email text,
  tipo text NOT NULL DEFAULT 'prospect' CHECK (tipo = ANY (ARRAY['prospect','cliente'])),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  tipo_prospect text DEFAULT 'Professional' CHECK (tipo_prospect = ANY (ARRAY['Professional','Finale'])),
  CONSTRAINT prospects_pkey PRIMARY KEY (id),
  CONSTRAINT prospects_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- PREVENTIVI
CREATE TABLE IF NOT EXISTS public.preventivi (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  prospect_id uuid,
  numero_preventivo text NOT NULL,
  titolo text NOT NULL,
  descrizione text,
  larghezza numeric NOT NULL,
  altezza numeric NOT NULL,
  costo_mq numeric NOT NULL DEFAULT 0,
  costo_mc numeric NOT NULL DEFAULT 0,
  costo_fisso numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'bozza' CHECK (status = ANY (ARRAY['bozza','inviato','accettato','rifiutato'])),
  data_scadenza date,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  profondita numeric,
  layout text,
  distribuzione integer,
  complessita text,
  superficie_stampa numeric,
  sviluppo_lineare numeric,
  numero_pezzi numeric,
  costo_struttura numeric DEFAULT 0,
  costo_grafica numeric DEFAULT 0,
  costo_premontaggio numeric DEFAULT 0,
  costo_totale numeric DEFAULT 0,
  totale numeric DEFAULT 0,
  bifaccialita numeric DEFAULT 0,
  retroilluminazione numeric DEFAULT 0,
  larg_storage numeric DEFAULT 0,
  prof_storage numeric DEFAULT 0,
  alt_storage numeric DEFAULT 2.5,
  layout_storage text DEFAULT '0',
  numero_porte text DEFAULT '0',
  desk_qta integer DEFAULT 0,
  layout_desk text DEFAULT '',
  porta_scorrevole integer DEFAULT 0,
  ripiano_superiore integer DEFAULT 0,
  ripiano_inferiore integer DEFAULT 0,
  teca_plexiglass integer DEFAULT 0,
  fronte_luminoso integer DEFAULT 0,
  borsa integer DEFAULT 0,
  superficie_stampa_storage numeric DEFAULT 0,
  sviluppo_metri_lineari_storage numeric DEFAULT 0,
  numero_pezzi_storage numeric DEFAULT 0,
  superficie_stampa_desk numeric DEFAULT 0,
  numero_pezzi_desk numeric DEFAULT 0,
  espositori_config text DEFAULT '{}',
  complementi_config text DEFAULT '{}',
  borsa_stand integer DEFAULT 0,
  baule_trolley integer DEFAULT 0,
  staffa_monitor integer DEFAULT 0,
  mensola integer DEFAULT 0,
  spot_light integer DEFAULT 0,
  kit_faro_50w integer DEFAULT 0,
  kit_faro_100w integer DEFAULT 0,
  quadro_elettrico_16a integer DEFAULT 0,
  nicchia integer DEFAULT 0,
  pedana integer DEFAULT 0,
  qta_tipo30 integer DEFAULT 0,
  qta_tipo50 integer DEFAULT 0,
  qta_tipo100 integer DEFAULT 0,
  numero_pezzi_espositori numeric DEFAULT 0,
  superficie_stampa_espositori numeric DEFAULT 0,
  ripiano_30x30 integer DEFAULT 0,
  ripiano_50x50 integer DEFAULT 0,
  ripiano_100x50 integer DEFAULT 0,
  teca_plexiglass_30x30x30 integer DEFAULT 0,
  teca_plexiglass_50x50x50 integer DEFAULT 0,
  teca_plexiglass_100x50x30 integer DEFAULT 0,
  retroilluminazione_30x30x100h integer DEFAULT 0,
  retroilluminazione_50x50x100h integer DEFAULT 0,
  retroilluminazione_100x50x100h integer DEFAULT 0,
  servizio_montaggio_smontaggio boolean DEFAULT false,
  servizio_certificazioni boolean DEFAULT false,
  servizio_istruzioni_assistenza boolean DEFAULT false,
  extra_perc_complex numeric DEFAULT 0,
  extra_stand_complesso numeric DEFAULT 0,
  costo_retroilluminazione numeric DEFAULT 0,
  accessori_stand_config text DEFAULT '{}',
  borsa_espositori integer DEFAULT 0,
  premontaggio boolean DEFAULT true,
  marginalita_struttura numeric DEFAULT 50,
  marginalita_grafica numeric DEFAULT 50,
  marginalita_retroilluminazione numeric DEFAULT 50,
  marginalita_accessori numeric DEFAULT 50,
  marginalita_premontaggio numeric DEFAULT 50,
  marginalita_struttura_storage numeric DEFAULT 50,
  marginalita_grafica_storage numeric DEFAULT 50,
  marginalita_premontaggio_storage numeric DEFAULT 50,
  marginalita_struttura_desk numeric DEFAULT 50,
  marginalita_grafica_desk numeric DEFAULT 50,
  marginalita_premontaggio_desk numeric DEFAULT 50,
  marginalita_accessori_desk numeric DEFAULT 50,
  marginalita_struttura_espositori numeric DEFAULT 50,
  marginalita_grafica_espositori numeric DEFAULT 50,
  marginalita_premontaggio_espositori numeric DEFAULT 50,
  marginalita_accessori_espositori numeric DEFAULT 50,
  totale_preventivo numeric DEFAULT 0,
  totale_costi numeric DEFAULT 0,
  CONSTRAINT preventivi_pkey PRIMARY KEY (id),
  CONSTRAINT preventivi_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT preventivi_prospect_id_fkey FOREIGN KEY (prospect_id) REFERENCES public.prospects(id)
);

CREATE INDEX IF NOT EXISTS idx_preventivi_user_id ON public.preventivi(user_id);
CREATE INDEX IF NOT EXISTS idx_preventivi_prospect_id ON public.preventivi(prospect_id);

-- ALTRI_BENI_SERVIZI
CREATE TABLE IF NOT EXISTS public.altri_beni_servizi (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  preventivo_id uuid NOT NULL,
  descrizione text NOT NULL DEFAULT '',
  costo_unitario numeric NOT NULL DEFAULT 0,
  marginalita numeric NOT NULL DEFAULT 0,
  prezzo_unitario numeric NOT NULL DEFAULT 0,
  quantita numeric NOT NULL DEFAULT 0,
  totale numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT altri_beni_servizi_pkey PRIMARY KEY (id),
  CONSTRAINT altri_beni_servizi_preventivo_id_fkey FOREIGN KEY (preventivo_id) REFERENCES public.preventivi(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_altri_beni_servizi_preventivo_id ON public.altri_beni_servizi(preventivo_id);

-- CONDIZIONI_STANDARD_FORNITURA
CREATE TABLE IF NOT EXISTS public.condizioni_standard_fornitura (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  voce text NOT NULL,
  testo_standard text NOT NULL DEFAULT 'Inserisci testo',
  ordine integer NOT NULL DEFAULT 0,
  attivo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT condizioni_standard_fornitura_pkey PRIMARY KEY (id)
);

-- CONDIZIONI_FORNITURA_PREVENTIVI
CREATE TABLE IF NOT EXISTS public.condizioni_fornitura_preventivi (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  preventivo_id uuid NOT NULL,
  voce text NOT NULL,
  testo text NOT NULL DEFAULT 'Inserisci testo',
  selezionato boolean NOT NULL DEFAULT true,
  ordine integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT condizioni_fornitura_preventivi_pkey PRIMARY KEY (id),
  CONSTRAINT condizioni_fornitura_preventivi_preventivo_id_fkey FOREIGN KEY (preventivo_id) REFERENCES public.preventivi(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_cond_forn_prev_preventivo_id ON public.condizioni_fornitura_preventivi(preventivo_id);

-- COSTI_EXTRA_TRASF_MONT
CREATE TABLE IF NOT EXISTS public.costi_extra_trasf_mont (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  livello text NOT NULL,
  costo_extra_mont numeric NOT NULL DEFAULT 0,
  attivo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT costi_extra_trasf_mont_pkey PRIMARY KEY (id)
);

-- COSTI_RETROILLUMINAZIONE
CREATE TABLE IF NOT EXISTS public.costi_retroilluminazione (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  altezza numeric NOT NULL,
  costo_al_metro numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT costi_retroilluminazione_pkey PRIMARY KEY (id)
);

-- COSTI_STRUTTURA_DESK_LAYOUT
CREATE TABLE IF NOT EXISTS public.costi_struttura_desk_layout (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  layout_desk text NOT NULL,
  costo_unitario numeric NOT NULL DEFAULT 0,
  attivo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT costi_struttura_desk_layout_pkey PRIMARY KEY (id)
);

-- COSTI_STRUTTURA_ESPOSITORI_LAYOUT
CREATE TABLE IF NOT EXISTS public.costi_struttura_espositori_layout (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  layout_espositore text NOT NULL,
  costo_unitario numeric NOT NULL DEFAULT 0,
  attivo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT costi_struttura_espositori_layout_pkey PRIMARY KEY (id)
);

-- COSTI_VOLO_AR
CREATE TABLE IF NOT EXISTS public.costi_volo_ar (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tipologia text NOT NULL,
  costo_volo_ar numeric NOT NULL DEFAULT 0,
  attivo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT costi_volo_ar_pkey PRIMARY KEY (id)
);

-- LISTINI
CREATE TABLE IF NOT EXISTS public.listino_accessori_desk (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  costo_unitario numeric NOT NULL DEFAULT 0,
  attivo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT listino_accessori_desk_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.listino_accessori_espositori (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  costo_unitario numeric NOT NULL DEFAULT 0,
  attivo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT listino_accessori_espositori_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.listino_accessori_stand (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  costo_unitario numeric NOT NULL DEFAULT 0,
  attivo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT listino_accessori_stand_pkey PRIMARY KEY (id)
);

-- MARGINALITA_PER_PROSPECT
CREATE TABLE IF NOT EXISTS public.marginalita_per_prospect (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tipo_prospect text NOT NULL UNIQUE,
  marginalita numeric NOT NULL DEFAULT 0,
  attivo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT marginalita_per_prospect_pkey PRIMARY KEY (id)
);

-- PARAMETRI
CREATE TABLE IF NOT EXISTS public.parametri (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tipo text NOT NULL,
  nome text NOT NULL,
  valore numeric,
  valore_testo text,
  descrizione text,
  attivo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  valore_chiave text,
  ordine integer DEFAULT 0,
  CONSTRAINT parametri_pkey PRIMARY KEY (id)
);

-- PARAMETRI_A_COSTI_UNITARI
CREATE TABLE IF NOT EXISTS public.parametri_a_costi_unitari (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  parametro text NOT NULL,
  unita_misura text NOT NULL,
  valore numeric NOT NULL DEFAULT 0,
  attivo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT parametri_a_costi_unitari_pkey PRIMARY KEY (id)
);

-- PREVENTIVI_SERVIZI
CREATE TABLE IF NOT EXISTS public.preventivi_servizi (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  preventivo_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  montaggio_smontaggio boolean DEFAULT false,
  certificazioni boolean DEFAULT false,
  istruzioni_assistenza boolean DEFAULT false,
  personale_mont integer DEFAULT 0,
  costo_orario_mont numeric DEFAULT 20,
  giorni_montaggio integer DEFAULT 0,
  ore_lavoro_cantxper_mont numeric DEFAULT 0,
  km_ar_mont numeric DEFAULT 0,
  conseg_cant boolean DEFAULT false,
  volo_mont text DEFAULT 'NO',
  treno_mont boolean DEFAULT false,
  ore_viaggio_trasferta_mont numeric DEFAULT 0,
  viaggio_auto_com_mont boolean DEFAULT false,
  extra_costi_trasferta_mont text DEFAULT 'NO',
  extra_km_trasp_furg_mont numeric DEFAULT 0,
  extra_km_trasp_tir_mont numeric DEFAULT 0,
  ricarico_montaggio numeric DEFAULT 30,
  tot_cost_ore_mont numeric DEFAULT 0,
  tot_cost_km_mont numeric DEFAULT 0,
  num_vitti integer DEFAULT 0,
  num_alloggi integer DEFAULT 0,
  tot_cost_vittall numeric DEFAULT 0,
  tot_costo_volo_ar numeric DEFAULT 0,
  tot_costo_treno numeric DEFAULT 0,
  tot_costo_trasf_pers numeric DEFAULT 0,
  tot_costi_auto numeric DEFAULT 0,
  tot_costi_extra_trasf_mont numeric DEFAULT 0,
  tot_costi_extra_km_trasp_furg_mont numeric DEFAULT 0,
  tot_costi_extra_km_trasp_tir_mont numeric DEFAULT 0,
  tot_costi_consegna_cantiere numeric DEFAULT 0,
  totale_costo_montaggio numeric DEFAULT 0,
  preventivo_montaggio numeric DEFAULT 0,
  personale_smon integer DEFAULT 0,
  costo_orario_smon numeric DEFAULT 20,
  giorni_smontaggio_viaggio integer DEFAULT 0,
  ore_lavoro_cantxper_smon numeric DEFAULT 0,
  km_ar_smon numeric DEFAULT 0,
  volo_smon text DEFAULT 'NO',
  treno_smon boolean DEFAULT false,
  ore_viaggio_trasferta_smon numeric DEFAULT 0,
  viaggio_auto_com_smon boolean DEFAULT false,
  extra_costi_trasferta_smon text DEFAULT 'NO',
  extra_km_trasp_furg_smon numeric DEFAULT 0,
  extra_km_trasp_tir_smon numeric DEFAULT 0,
  tot_cost_ore_smon numeric DEFAULT 0,
  tot_cost_km_smon numeric DEFAULT 0,
  num_vitti_smon integer DEFAULT 0,
  num_alloggi_smon integer DEFAULT 0,
  tot_cost_vittall_smon numeric DEFAULT 0,
  tot_costo_volo_ar_smon numeric DEFAULT 0,
  tot_costo_treno_smon numeric DEFAULT 0,
  tot_costo_trasf_pers_smon numeric DEFAULT 0,
  tot_costi_auto_smon numeric DEFAULT 0,
  tot_costi_extra_trasf_smon numeric DEFAULT 0,
  tot_costi_extra_km_trasp_furg_smon numeric DEFAULT 0,
  tot_costi_extra_km_trasp_tir_smon numeric DEFAULT 0,
  totale_costo_smontaggio numeric DEFAULT 0,
  preventivo_smontaggio numeric DEFAULT 0,
  CONSTRAINT preventivi_servizi_pkey PRIMARY KEY (id),
  CONSTRAINT preventivi_servizi_preventivo_id_fkey FOREIGN KEY (preventivo_id) REFERENCES public.preventivi(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_preventivi_servizi_preventivo_id ON public.preventivi_servizi(preventivo_id);
