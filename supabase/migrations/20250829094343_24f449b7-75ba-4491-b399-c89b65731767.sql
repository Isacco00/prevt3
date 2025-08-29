-- Create desk accessories price list table
CREATE TABLE public.listino_accessori_desk (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  costo_unitario NUMERIC NOT NULL DEFAULT 0,
  attivo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.listino_accessori_desk ENABLE ROW LEVEL SECURITY;

-- Create policies for listino_accessori_desk
CREATE POLICY "Users can view their own listino_accessori_desk" 
ON public.listino_accessori_desk 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own listino_accessori_desk" 
ON public.listino_accessori_desk 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listino_accessori_desk" 
ON public.listino_accessori_desk 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listino_accessori_desk" 
ON public.listino_accessori_desk 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create desk structure costs by layout table
CREATE TABLE public.costi_struttura_desk_layout (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  layout_desk TEXT NOT NULL,
  costo_unitario NUMERIC NOT NULL DEFAULT 0,
  attivo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.costi_struttura_desk_layout ENABLE ROW LEVEL SECURITY;

-- Create policies for costi_struttura_desk_layout
CREATE POLICY "Users can view their own costi_struttura_desk_layout" 
ON public.costi_struttura_desk_layout 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own costi_struttura_desk_layout" 
ON public.costi_struttura_desk_layout 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own costi_struttura_desk_layout" 
ON public.costi_struttura_desk_layout 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own costi_struttura_desk_layout" 
ON public.costi_struttura_desk_layout 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_listino_accessori_desk_updated_at
BEFORE UPDATE ON public.listino_accessori_desk
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_costi_struttura_desk_layout_updated_at
BEFORE UPDATE ON public.costi_struttura_desk_layout
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default desk accessories data
INSERT INTO public.listino_accessori_desk (user_id, nome, costo_unitario) VALUES
('00000000-0000-0000-0000-000000000000', 'Porta scorrevole con chiave', 65.00),
('00000000-0000-0000-0000-000000000000', 'Ripiano Superiore L 100', 40.00),
('00000000-0000-0000-0000-000000000000', 'Ripiano Inferiore L 100', 40.00),
('00000000-0000-0000-0000-000000000000', 'Teca in plexiglass', 130.00),
('00000000-0000-0000-0000-000000000000', 'Fronte luminoso dim. 100x100', 305.00),
('00000000-0000-0000-0000-000000000000', 'Borsa', 31.00);

-- Insert default desk structure costs by layout
INSERT INTO public.costi_struttura_desk_layout (user_id, layout_desk, costo_unitario) VALUES
('00000000-0000-0000-0000-000000000000', '50', 415.00),
('00000000-0000-0000-0000-000000000000', '100', 275.00),
('00000000-0000-0000-0000-000000000000', '150', 250.00),
('00000000-0000-0000-0000-000000000000', '200', 225.00);