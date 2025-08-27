-- Create table for retroilluminazione costs based on height
CREATE TABLE public.costi_retroilluminazione (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  altezza NUMERIC(3,1) NOT NULL,
  costo_al_metro NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, altezza)
);

-- Enable RLS
ALTER TABLE public.costi_retroilluminazione ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own costi_retroilluminazione" 
ON public.costi_retroilluminazione 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own costi_retroilluminazione" 
ON public.costi_retroilluminazione 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own costi_retroilluminazione" 
ON public.costi_retroilluminazione 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own costi_retroilluminazione" 
ON public.costi_retroilluminazione 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_costi_retroilluminazione_updated_at
BEFORE UPDATE ON public.costi_retroilluminazione
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default values
INSERT INTO public.costi_retroilluminazione (user_id, altezza, costo_al_metro) 
SELECT 
  profiles.user_id,
  unnest(ARRAY[2.5, 3.0, 3.4, 4.0]),
  unnest(ARRAY[270.00, 300.00, 380.00, 450.00])
FROM public.profiles;

-- Add retroilluminazione cost column to preventivi
ALTER TABLE public.preventivi ADD COLUMN IF NOT EXISTS costo_retroilluminazione NUMERIC(10,2) DEFAULT 0;