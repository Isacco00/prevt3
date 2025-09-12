-- Create the new parametri_a_costi_unitari table
CREATE TABLE public.parametri_a_costi_unitari (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parametro TEXT NOT NULL,
  unita_misura TEXT NOT NULL,
  valore NUMERIC NOT NULL DEFAULT 0,
  attivo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.parametri_a_costi_unitari ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (read) and admin management
CREATE POLICY "Everyone can view parametri_a_costi_unitari" 
ON public.parametri_a_costi_unitari 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can create parametri_a_costi_unitari" 
ON public.parametri_a_costi_unitari 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update parametri_a_costi_unitari" 
ON public.parametri_a_costi_unitari 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete parametri_a_costi_unitari" 
ON public.parametri_a_costi_unitari 
FOR DELETE 
USING (is_admin(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_parametri_a_costi_unitari_updated_at
BEFORE UPDATE ON public.parametri_a_costi_unitari
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the initial data from the existing parametri table
INSERT INTO public.parametri_a_costi_unitari (parametro, unita_misura, valore) VALUES
('Costo Stampa Grafica', '€/mq', 19.5),
('Costo Premontaggio', '€/pz', 7.2);

-- Remove the old parameters from the parametri table
DELETE FROM public.parametri WHERE nome IN ('Costo Stampa Grafica', 'Costo Premontaggio');