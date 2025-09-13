-- Create preventivi_servizi table
CREATE TABLE public.preventivi_servizi (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  preventivo_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Servizi abilitati
  montaggio_smontaggio BOOLEAN DEFAULT false,
  certificazioni BOOLEAN DEFAULT false,
  istruzioni_assistenza BOOLEAN DEFAULT false,
  
  -- Dati di ingresso montaggio
  personale_mont INTEGER DEFAULT 0,
  costo_orario_mont NUMERIC DEFAULT 20,
  giorni_montaggio INTEGER DEFAULT 0,
  ore_lavoro_cantxper_mont NUMERIC DEFAULT 0,
  km_AR_mont NUMERIC DEFAULT 0,
  conseg_cant BOOLEAN DEFAULT false,
  volo_mont TEXT DEFAULT 'NO', -- NO, Low cost, Last minute, Standard
  treno_mont BOOLEAN DEFAULT false,
  ore_viaggio_trasferta_mont NUMERIC DEFAULT 0,
  viaggio_auto_com_mont BOOLEAN DEFAULT false,
  extra_costi_trasferta_mont TEXT DEFAULT 'NO', -- NO, Basso, Medio, Alto
  extra_km_trasp_furg_mont NUMERIC DEFAULT 0,
  extra_km_trasp_tir_mont NUMERIC DEFAULT 0,
  
  -- Ricarico montaggio
  ricarico_montaggio NUMERIC DEFAULT 30,
  
  -- Calcoli montaggio (salvati per performance)
  tot_cost_ore_mont NUMERIC DEFAULT 0,
  tot_cost_km_mont NUMERIC DEFAULT 0,
  num_vitti INTEGER DEFAULT 0,
  num_alloggi INTEGER DEFAULT 0,
  tot_cost_vittall NUMERIC DEFAULT 0,
  tot_costo_volo_ar NUMERIC DEFAULT 0,
  tot_costo_treno NUMERIC DEFAULT 0,
  tot_costo_trasf_pers NUMERIC DEFAULT 0,
  tot_costi_auto NUMERIC DEFAULT 0,
  tot_costi_extra_trasf_mont NUMERIC DEFAULT 0,
  tot_costi_extra_km_trasp_furg_mont NUMERIC DEFAULT 0,
  tot_costi_extra_km_trasp_tir_mont NUMERIC DEFAULT 0,
  tot_costi_consegna_cantiere NUMERIC DEFAULT 0,
  
  -- Totali
  totale_costo_montaggio NUMERIC DEFAULT 0,
  preventivo_montaggio NUMERIC DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.preventivi_servizi ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own preventivi_servizi" 
ON public.preventivi_servizi 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.preventivi p 
    WHERE p.id = preventivi_servizi.preventivo_id 
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create their own preventivi_servizi" 
ON public.preventivi_servizi 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.preventivi p 
    WHERE p.id = preventivi_servizi.preventivo_id 
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own preventivi_servizi" 
ON public.preventivi_servizi 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.preventivi p 
    WHERE p.id = preventivi_servizi.preventivo_id 
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own preventivi_servizi" 
ON public.preventivi_servizi 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.preventivi p 
    WHERE p.id = preventivi_servizi.preventivo_id 
    AND p.user_id = auth.uid()
  )
);

-- Create costi_volo_AR table
CREATE TABLE public.costi_volo_ar (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipologia TEXT NOT NULL,
  costo_volo_ar NUMERIC NOT NULL DEFAULT 0,
  attivo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.costi_volo_ar ENABLE ROW LEVEL SECURITY;

-- Create policies for costi_volo_ar
CREATE POLICY "Everyone can view costi_volo_ar" 
ON public.costi_volo_ar 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can create costi_volo_ar" 
ON public.costi_volo_ar 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update costi_volo_ar" 
ON public.costi_volo_ar 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete costi_volo_ar" 
ON public.costi_volo_ar 
FOR DELETE 
USING (is_admin(auth.uid()));

-- Insert default values for costi_volo_ar
INSERT INTO public.costi_volo_ar (tipologia, costo_volo_ar) VALUES
('Low cost', 120),
('Last minute', 240),
('Standard', 360);

-- Create costi_extra_trasf_mont table
CREATE TABLE public.costi_extra_trasf_mont (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  livello TEXT NOT NULL,
  costo_extra_mont NUMERIC NOT NULL DEFAULT 0,
  attivo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.costi_extra_trasf_mont ENABLE ROW LEVEL SECURITY;

-- Create policies for costi_extra_trasf_mont
CREATE POLICY "Everyone can view costi_extra_trasf_mont" 
ON public.costi_extra_trasf_mont 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can create costi_extra_trasf_mont" 
ON public.costi_extra_trasf_mont 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update costi_extra_trasf_mont" 
ON public.costi_extra_trasf_mont 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete costi_extra_trasf_mont" 
ON public.costi_extra_trasf_mont 
FOR DELETE 
USING (is_admin(auth.uid()));

-- Insert default values for costi_extra_trasf_mont
INSERT INTO public.costi_extra_trasf_mont (livello, costo_extra_mont) VALUES
('Basso', 20),
('Medio', 30),
('Alto', 40);

-- Add new parameters to parametri_a_costi_unitari
INSERT INTO public.parametri_a_costi_unitari (parametro, unita_misura, valore) VALUES
('Costo per km', '€/km', 0.30),
('Costo pasto', '€/pasto', 25),
('Costo alloggio', '€/notte', 50),
('Costo treno al km', '€/km', 0.15),
('Costo auto al km', '€/km', 0.30),
('Costo fisso consegna', '€', 150);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_preventivi_servizi_updated_at
BEFORE UPDATE ON public.preventivi_servizi
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_costi_volo_ar_updated_at
BEFORE UPDATE ON public.costi_volo_ar
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_costi_extra_trasf_mont_updated_at
BEFORE UPDATE ON public.costi_extra_trasf_mont
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();