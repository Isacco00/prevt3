-- Create table for altri_beni_servizi
CREATE TABLE public.altri_beni_servizi (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  preventivo_id UUID NOT NULL,
  descrizione TEXT NOT NULL DEFAULT '',
  costo_unitario NUMERIC NOT NULL DEFAULT 0,
  marginalita NUMERIC NOT NULL DEFAULT 0,
  prezzo_unitario NUMERIC NOT NULL DEFAULT 0,
  quantita NUMERIC NOT NULL DEFAULT 0,
  totale NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.altri_beni_servizi ENABLE ROW LEVEL SECURITY;

-- Create policies for user access through preventivo relationship
CREATE POLICY "Users can view their own altri_beni_servizi" 
ON public.altri_beni_servizi 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.preventivi p 
  WHERE p.id = altri_beni_servizi.preventivo_id 
  AND p.user_id = auth.uid()
));

CREATE POLICY "Users can create their own altri_beni_servizi" 
ON public.altri_beni_servizi 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.preventivi p 
  WHERE p.id = altri_beni_servizi.preventivo_id 
  AND p.user_id = auth.uid()
));

CREATE POLICY "Users can update their own altri_beni_servizi" 
ON public.altri_beni_servizi 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.preventivi p 
  WHERE p.id = altri_beni_servizi.preventivo_id 
  AND p.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own altri_beni_servizi" 
ON public.altri_beni_servizi 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.preventivi p 
  WHERE p.id = altri_beni_servizi.preventivo_id 
  AND p.user_id = auth.uid()
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_altri_beni_servizi_updated_at
BEFORE UPDATE ON public.altri_beni_servizi
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();