-- Create marginalita_per_prospect table
CREATE TABLE public.marginalita_per_prospect (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo_prospect TEXT NOT NULL UNIQUE,
  marginalita NUMERIC NOT NULL DEFAULT 0,
  attivo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.marginalita_per_prospect ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Everyone can view marginalita_per_prospect" 
ON public.marginalita_per_prospect 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can create marginalita_per_prospect" 
ON public.marginalita_per_prospect 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update marginalita_per_prospect" 
ON public.marginalita_per_prospect 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete marginalita_per_prospect" 
ON public.marginalita_per_prospect 
FOR DELETE 
USING (is_admin(auth.uid()));

-- Insert default values
INSERT INTO public.marginalita_per_prospect (tipo_prospect, marginalita) VALUES 
('Professional', 50),
('Finale', 70);

-- Add margin fields to preventivi table
ALTER TABLE public.preventivi 
ADD COLUMN marginalita_struttura NUMERIC DEFAULT 50,
ADD COLUMN marginalita_grafica NUMERIC DEFAULT 50,
ADD COLUMN marginalita_retroilluminazione NUMERIC DEFAULT 50,
ADD COLUMN marginalita_accessori NUMERIC DEFAULT 50,
ADD COLUMN marginalita_premontaggio NUMERIC DEFAULT 50;

-- Add trigger for timestamp updates
CREATE TRIGGER update_marginalita_per_prospect_updated_at
BEFORE UPDATE ON public.marginalita_per_prospect
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();