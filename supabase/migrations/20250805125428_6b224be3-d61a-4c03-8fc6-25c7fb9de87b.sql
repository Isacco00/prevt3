-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create prospects table for managing client/prospect records
CREATE TABLE public.prospects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ragione_sociale TEXT NOT NULL,
  partita_iva TEXT NOT NULL,
  codice_fiscale TEXT,
  indirizzo TEXT,
  citta TEXT,
  cap TEXT,
  provincia TEXT,
  telefono TEXT,
  email TEXT,
  tipo TEXT NOT NULL DEFAULT 'prospect' CHECK (tipo IN ('prospect', 'cliente')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on prospects
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;

-- Create preventivi table for managing quotes
CREATE TABLE public.preventivi (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prospect_id UUID REFERENCES public.prospects(id) ON DELETE CASCADE,
  numero_preventivo TEXT NOT NULL,
  titolo TEXT NOT NULL,
  descrizione TEXT,
  lunghezza NUMERIC(10,2) NOT NULL,
  larghezza NUMERIC(10,2) NOT NULL,
  altezza NUMERIC(10,2) NOT NULL,
  superficie NUMERIC(10,2) GENERATED ALWAYS AS (lunghezza * larghezza) STORED,
  volume NUMERIC(10,2) GENERATED ALWAYS AS (lunghezza * larghezza * altezza) STORED,
  costo_mq NUMERIC(10,2) NOT NULL DEFAULT 0,
  costo_mc NUMERIC(10,2) NOT NULL DEFAULT 0,
  costo_fisso NUMERIC(10,2) NOT NULL DEFAULT 0,
  totale NUMERIC(10,2) GENERATED ALWAYS AS ((lunghezza * larghezza * costo_mq) + (lunghezza * larghezza * altezza * costo_mc) + costo_fisso) STORED,
  status TEXT NOT NULL DEFAULT 'bozza' CHECK (status IN ('bozza', 'inviato', 'accettato', 'rifiutato')),
  data_scadenza DATE,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on preventivi
ALTER TABLE public.preventivi ENABLE ROW LEVEL SECURITY;

-- Create parametri table for system configuration
CREATE TABLE public.parametri (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('costo_mq', 'costo_mc', 'altezza_standard', 'profilo_alluminio')),
  nome TEXT NOT NULL,
  valore NUMERIC(10,2),
  valore_testo TEXT,
  descrizione TEXT,
  attivo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on parametri
ALTER TABLE public.parametri ENABLE ROW LEVEL SECURITY;

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
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

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email
  );
  
  -- Insert default parameters for new user
  INSERT INTO public.parametri (user_id, tipo, nome, valore, descrizione) VALUES
    (NEW.id, 'costo_mq', 'Costo al metro quadro standard', 50.00, 'Costo base per metro quadro'),
    (NEW.id, 'costo_mc', 'Costo al metro cubo standard', 25.00, 'Costo base per metro cubo'),
    (NEW.id, 'altezza_standard', 'Altezza standard', 2.70, 'Altezza standard per i calcoli'),
    (NEW.id, 'costo_mq', 'Costo premium', 75.00, 'Costo premium per lavori speciali'),
    (NEW.id, 'costo_mc', 'Costo premium volume', 35.00, 'Costo premium per volume');
    
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for prospects
CREATE POLICY "Users can view their own prospects"
  ON public.prospects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own prospects"
  ON public.prospects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prospects"
  ON public.prospects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prospects"
  ON public.prospects FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for preventivi
CREATE POLICY "Users can view their own preventivi"
  ON public.preventivi FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preventivi"
  ON public.preventivi FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preventivi"
  ON public.preventivi FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preventivi"
  ON public.preventivi FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for parametri
CREATE POLICY "Users can view their own parametri"
  ON public.parametri FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own parametri"
  ON public.parametri FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own parametri"
  ON public.parametri FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own parametri"
  ON public.parametri FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_prospects_user_id ON public.prospects(user_id);
CREATE INDEX idx_prospects_partita_iva ON public.prospects(partita_iva);
CREATE INDEX idx_preventivi_user_id ON public.preventivi(user_id);
CREATE INDEX idx_preventivi_prospect_id ON public.preventivi(prospect_id);
CREATE INDEX idx_preventivi_numero ON public.preventivi(numero_preventivo);
CREATE INDEX idx_parametri_user_id ON public.parametri(user_id);
CREATE INDEX idx_parametri_tipo ON public.parametri(tipo);

-- Create unique constraint for prospect partita_iva per user
CREATE UNIQUE INDEX idx_prospects_user_partita_iva ON public.prospects(user_id, partita_iva);