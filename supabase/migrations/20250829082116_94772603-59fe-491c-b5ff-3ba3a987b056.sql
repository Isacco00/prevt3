-- Create a table for listino accessori stand
CREATE TABLE public.listino_accessori_stand (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  costo_unitario NUMERIC NOT NULL DEFAULT 0,
  attivo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.listino_accessori_stand ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own listino_accessori_stand" 
ON public.listino_accessori_stand 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own listino_accessori_stand" 
ON public.listino_accessori_stand 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listino_accessori_stand" 
ON public.listino_accessori_stand 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listino_accessori_stand" 
ON public.listino_accessori_stand 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_listino_accessori_stand_updated_at
BEFORE UPDATE ON public.listino_accessori_stand
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default accessories for existing users
INSERT INTO public.listino_accessori_stand (user_id, nome, costo_unitario) 
SELECT DISTINCT user_id, 'Porta', 416.50 FROM public.profiles WHERE user_id IS NOT NULL;

INSERT INTO public.listino_accessori_stand (user_id, nome, costo_unitario) 
SELECT DISTINCT user_id, 'Borsa', 31.00 FROM public.profiles WHERE user_id IS NOT NULL;

INSERT INTO public.listino_accessori_stand (user_id, nome, costo_unitario) 
SELECT DISTINCT user_id, 'Staffa monitor', 66.67 FROM public.profiles WHERE user_id IS NOT NULL;

INSERT INTO public.listino_accessori_stand (user_id, nome, costo_unitario) 
SELECT DISTINCT user_id, 'Mensola', 75.00 FROM public.profiles WHERE user_id IS NOT NULL;

INSERT INTO public.listino_accessori_stand (user_id, nome, costo_unitario) 
SELECT DISTINCT user_id, 'Spot light', 48.00 FROM public.profiles WHERE user_id IS NOT NULL;

INSERT INTO public.listino_accessori_stand (user_id, nome, costo_unitario) 
SELECT DISTINCT user_id, 'Kit Faro 50 W', 65.50 FROM public.profiles WHERE user_id IS NOT NULL;

INSERT INTO public.listino_accessori_stand (user_id, nome, costo_unitario) 
SELECT DISTINCT user_id, 'Kit Faro 100 W', 76.00 FROM public.profiles WHERE user_id IS NOT NULL;

INSERT INTO public.listino_accessori_stand (user_id, nome, costo_unitario) 
SELECT DISTINCT user_id, 'Quadro elettrico 16A', 245.00 FROM public.profiles WHERE user_id IS NOT NULL;

INSERT INTO public.listino_accessori_stand (user_id, nome, costo_unitario) 
SELECT DISTINCT user_id, 'Nicchia', 125.25 FROM public.profiles WHERE user_id IS NOT NULL;

INSERT INTO public.listino_accessori_stand (user_id, nome, costo_unitario) 
SELECT DISTINCT user_id, 'Baule trolley', 100.00 FROM public.profiles WHERE user_id IS NOT NULL;