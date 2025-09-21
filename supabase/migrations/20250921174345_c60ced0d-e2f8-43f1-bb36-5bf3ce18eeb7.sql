-- Create table for standard supply conditions (default texts)
CREATE TABLE public.condizioni_standard_fornitura (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  voce TEXT NOT NULL,
  testo_standard TEXT NOT NULL DEFAULT 'Inserisci testo',
  ordine INTEGER NOT NULL DEFAULT 0,
  attivo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for preventivo supply conditions
CREATE TABLE public.condizioni_fornitura_preventivi (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  preventivo_id UUID NOT NULL,
  voce TEXT NOT NULL,
  testo TEXT NOT NULL DEFAULT 'Inserisci testo',
  selezionato BOOLEAN NOT NULL DEFAULT true,
  ordine INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.condizioni_standard_fornitura ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.condizioni_fornitura_preventivi ENABLE ROW LEVEL SECURITY;

-- RLS policies for condizioni_standard_fornitura
CREATE POLICY "Everyone can view condizioni_standard_fornitura" 
ON public.condizioni_standard_fornitura 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can create condizioni_standard_fornitura" 
ON public.condizioni_standard_fornitura 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update condizioni_standard_fornitura" 
ON public.condizioni_standard_fornitura 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete condizioni_standard_fornitura" 
ON public.condizioni_standard_fornitura 
FOR DELETE 
USING (is_admin(auth.uid()));

-- RLS policies for condizioni_fornitura_preventivi
CREATE POLICY "Users can view their own condizioni_fornitura_preventivi" 
ON public.condizioni_fornitura_preventivi 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM preventivi p 
  WHERE p.id = condizioni_fornitura_preventivi.preventivo_id 
  AND p.user_id = auth.uid()
));

CREATE POLICY "Users can create their own condizioni_fornitura_preventivi" 
ON public.condizioni_fornitura_preventivi 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM preventivi p 
  WHERE p.id = condizioni_fornitura_preventivi.preventivo_id 
  AND p.user_id = auth.uid()
));

CREATE POLICY "Users can update their own condizioni_fornitura_preventivi" 
ON public.condizioni_fornitura_preventivi 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM preventivi p 
  WHERE p.id = condizioni_fornitura_preventivi.preventivo_id 
  AND p.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own condizioni_fornitura_preventivi" 
ON public.condizioni_fornitura_preventivi 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM preventivi p 
  WHERE p.id = condizioni_fornitura_preventivi.preventivo_id 
  AND p.user_id = auth.uid()
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_condizioni_standard_fornitura_updated_at
BEFORE UPDATE ON public.condizioni_standard_fornitura
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_condizioni_fornitura_preventivi_updated_at
BEFORE UPDATE ON public.condizioni_fornitura_preventivi
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default standard conditions
INSERT INTO public.condizioni_standard_fornitura (voce, testo_standard, ordine) VALUES
('Condizioni generali', 'Inserisci testo', 1),
('Pagamenti', 'Inserisci testo', 2),
('Tempi di consegna', 'Inserisci testo', 3),
('Consegna', 'Inserisci testo', 4),
('Resa', 'Inserisci testo', 5),
('Validità offerta', 'Inserisci testo', 6);