-- Add smontaggio fields to preventivi_servizi table
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS personale_smon integer DEFAULT 0;
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS costo_orario_smon numeric DEFAULT 20;
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS giorni_smontaggio_viaggio integer DEFAULT 0;
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS ore_lavoro_cantxper_smon numeric DEFAULT 0;
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS km_ar_smon numeric DEFAULT 0;
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS volo_smon text DEFAULT 'NO';
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS treno_smon boolean DEFAULT false;
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS ore_viaggio_trasferta_smon numeric DEFAULT 0;
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS viaggio_auto_com_smon boolean DEFAULT false;
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS extra_costi_trasferta_smon text DEFAULT 'NO';
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS extra_km_trasp_furg_smon numeric DEFAULT 0;
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS extra_km_trasp_tir_smon numeric DEFAULT 0;

-- Add calculated fields for smontaggio
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS tot_cost_ore_smon numeric DEFAULT 0;
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS tot_cost_km_smon numeric DEFAULT 0;
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS num_vitti_smon integer DEFAULT 0;
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS num_alloggi_smon integer DEFAULT 0;
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS tot_cost_vittall_smon numeric DEFAULT 0;
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS tot_costo_volo_ar_smon numeric DEFAULT 0;
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS tot_costo_treno_smon numeric DEFAULT 0;
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS tot_costo_trasf_pers_smon numeric DEFAULT 0;
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS tot_costi_auto_smon numeric DEFAULT 0;
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS tot_costi_extra_trasf_smon numeric DEFAULT 0;
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS tot_costi_extra_km_trasp_furg_smon numeric DEFAULT 0;
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS tot_costi_extra_km_trasp_tir_smon numeric DEFAULT 0;
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS totale_costo_smontaggio numeric DEFAULT 0;
ALTER TABLE preventivi_servizi ADD COLUMN IF NOT EXISTS preventivo_smontaggio numeric DEFAULT 0;