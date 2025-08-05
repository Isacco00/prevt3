-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  ruolo TEXT NOT NULL DEFAULT 'user' CHECK (ruolo IN ('admin', 'user')),
  attivo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prospects table
CREATE TABLE public.prospects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partita_iva TEXT NOT NULL UNIQUE,
  ragione_sociale TEXT NOT NULL,
  indirizzo TEXT,
  cap TEXT,
  citta TEXT,
  provincia TEXT,
  nazione TEXT DEFAULT 'Italia',
  telefono TEXT,
  email TEXT,
  referente TEXT,
  tipo_cliente TEXT NOT NULL DEFAULT 'prospect' CHECK (tipo_cliente IN ('prospect', 'cliente_attivo')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create preventivi table
CREATE TABLE public.preventivi (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codice_univoco TEXT NOT NULL UNIQUE,
  prospect_id UUID NOT NULL REFERENCES public.prospects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titolo TEXT NOT NULL,
  descrizione TEXT,
  revisione INTEGER NOT NULL DEFAULT 0,
  stato TEXT NOT NULL DEFAULT 'in_preparazione' CHECK (stato IN ('in_preparazione', 'pronto', 'emesso', 'accettato', 'rifiutato', 'in_attesa')),
  
  -- Dati input
  larghezza DECIMAL(3,1),
  profondita DECIMAL(3,1),
  altezza DECIMAL(3,1),
  layout TEXT CHECK (layout IN ('4_lati', '3_lati', '2_lati', '1_lato')),
  distribuzione INTEGER CHECK (distribuzione IN (1, 2, 3, 4)),
  struttura_complicata BOOLEAN DEFAULT false,
  
  -- Calcoli
  superficie_stampa DECIMAL(10,2),
  superficie_mq DECIMAL(10,2),
  sviluppo_lineari DECIMAL(10,2),
  numero_pezzi INTEGER,
  
  -- Costi
  costo_struttura DECIMAL(10,2),
  costo_grafica DECIMAL(10,2),
  costo_premontaggio DECIMAL(10,2),
  importo_finale DECIMAL(10,2),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create parametri table
CREATE TABLE public.parametri (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chiave TEXT NOT NULL UNIQUE,
  valore JSONB NOT NULL,
  descrizione TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preventivi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parametri ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND ruolo = 'admin'
    )
  );

CREATE POLICY "Admins can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND ruolo = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND ruolo = 'admin'
    )
  );

-- RLS Policies for prospects (all authenticated users can access)
CREATE POLICY "Authenticated users can view prospects" ON public.prospects
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert prospects" ON public.prospects
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update prospects" ON public.prospects
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete prospects" ON public.prospects
  FOR DELETE TO authenticated USING (true);

-- RLS Policies for preventivi (all authenticated users can access)
CREATE POLICY "Authenticated users can view preventivi" ON public.preventivi
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert preventivi" ON public.preventivi
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update preventivi" ON public.preventivi
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete preventivi" ON public.preventivi
  FOR DELETE TO authenticated USING (true);

-- RLS Policies for parametri (all authenticated users can view, only admins can modify)
CREATE POLICY "Authenticated users can view parametri" ON public.parametri
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert parametri" ON public.parametri
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND ruolo = 'admin'
    )
  );

CREATE POLICY "Admins can update parametri" ON public.parametri
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND ruolo = 'admin'
    )
  );

CREATE POLICY "Admins can delete parametri" ON public.parametri
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND ruolo = 'admin'
    )
  );

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prospects_updated_at
  BEFORE UPDATE ON public.prospects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_preventivi_updated_at
  BEFORE UPDATE ON public.preventivi
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_parametri_updated_at
  BEFORE UPDATE ON public.parametri
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nome, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'nome', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert default parametri
INSERT INTO public.parametri (chiave, valore, descrizione) VALUES
('altezze_disponibili', '["2.5", "3", "3.5", "4"]', 'Opzioni disponibili per altezza'),
('dimensioni_disponibili', '["0", "0.5", "0.75", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5", "13", "13.5", "14", "14.5", "15"]', 'Opzioni disponibili per larghezza e profondità'),
('costo_stampa_al_mq', '19.50', 'Costo stampa grafica al metro quadro'),
('costo_premontaggio_al_pezzo', '7.20', 'Costo premontaggio al pezzo'),
('profili_per_distribuzione', '{"1": 6, "2": 10, "3": 14, "4": 18}', 'Numero di profili m/l in base alla distribuzione'),
('costo_struttura_per_altezza', '{"2.5": 184.00, "3": 207.00, "3.4": 247.25, "4": 287.50}', 'Costo struttura al m/l in funzione dell\'altezza');