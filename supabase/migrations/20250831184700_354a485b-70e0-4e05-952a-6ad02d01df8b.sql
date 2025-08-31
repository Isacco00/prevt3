-- Create listino_accessori_espositori table
CREATE TABLE public.listino_accessori_espositori (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  costo_unitario NUMERIC NOT NULL DEFAULT 0,
  attivo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.listino_accessori_espositori ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own listino_accessori_espositori" 
ON public.listino_accessori_espositori 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own listino_accessori_espositori" 
ON public.listino_accessori_espositori 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listino_accessori_espositori" 
ON public.listino_accessori_espositori 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listino_accessori_espositori" 
ON public.listino_accessori_espositori 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_listino_accessori_espositori_updated_at
BEFORE UPDATE ON public.listino_accessori_espositori
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default accessories for each existing user
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN SELECT DISTINCT user_id FROM public.profiles WHERE active = true
    LOOP
        INSERT INTO public.listino_accessori_espositori (user_id, nome, costo_unitario) VALUES
            (user_record.user_id, 'Ripiano 30x30', 15.00),
            (user_record.user_id, 'Ripiano 50x50', 25.00),
            (user_record.user_id, 'Ripiano 100x50', 40.00),
            (user_record.user_id, 'Teca in plexiglass 30x30x30', 75.00),
            (user_record.user_id, 'Teca in plexiglass 50x50x50', 100.00),
            (user_record.user_id, 'Teca in plexiglass 100x50x30', 130.00),
            (user_record.user_id, 'Retroilluminazione 30x30x100 H', 90.00),
            (user_record.user_id, 'Retroilluminazione 50x50x100 H', 132.00),
            (user_record.user_id, 'Retroilluminazione 100x50x100 H', 130.00),
            (user_record.user_id, 'Borsa', 190.00);
    END LOOP;
END $$;

-- Add borsa field to preventivi table if it doesn't exist
ALTER TABLE public.preventivi ADD COLUMN IF NOT EXISTS borsa_espositori INTEGER DEFAULT 0;