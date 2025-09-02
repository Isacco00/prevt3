-- Create table for expositor structure layout costs
CREATE TABLE public.costi_struttura_espositori_layout (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  layout_espositore TEXT NOT NULL,
  costo_unitario NUMERIC NOT NULL DEFAULT 0,
  attivo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.costi_struttura_espositori_layout ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Everyone can view costi_struttura_espositori_layout" 
ON public.costi_struttura_espositori_layout 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can create costi_struttura_espositori_layout" 
ON public.costi_struttura_espositori_layout 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update costi_struttura_espositori_layout" 
ON public.costi_struttura_espositori_layout 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete costi_struttura_espositori_layout" 
ON public.costi_struttura_espositori_layout 
FOR DELETE 
USING (is_admin(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_costi_struttura_espositori_layout_updated_at
BEFORE UPDATE ON public.costi_struttura_espositori_layout
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data
INSERT INTO public.costi_struttura_espositori_layout (layout_espositore, costo_unitario) VALUES
('30', 193.00),
('50', 223.00),
('100', 252.00);