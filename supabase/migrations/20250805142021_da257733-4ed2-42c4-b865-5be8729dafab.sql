-- First, let's check what constraint exists on tipo column and remove it if needed
ALTER TABLE public.parametri DROP CONSTRAINT IF EXISTS parametri_tipo_check;

-- Add additional columns to parametri table for better parameter management  
ALTER TABLE public.parametri ADD COLUMN IF NOT EXISTS valore_chiave text;
ALTER TABLE public.parametri ADD COLUMN IF NOT EXISTS ordine integer DEFAULT 0;

-- Insert default parameters for administration using existing user_id from auth.users
-- We'll use the first user's ID as default, or you can specify a specific user
DO $$
DECLARE
    default_user_id uuid;
BEGIN
    -- Get the first user ID or use a default one
    SELECT id INTO default_user_id FROM auth.users LIMIT 1;
    
    -- If no users exist, create parameters that will be assigned when user logs in
    IF default_user_id IS NULL THEN
        default_user_id := '00000000-0000-0000-0000-000000000000'::uuid;
    END IF;
    
    -- Insert default parameters
    INSERT INTO public.parametri (user_id, tipo, nome, valore, descrizione, valore_chiave) VALUES
    -- Costo stampa grafica al metro quadro
    (default_user_id, 'costo_stampa', 'Costo stampa grafica al metro quadro', 19.50, 'Costo per la stampa grafica per metro quadro', 'costo_stampa_mq'),
    
    -- Costo Premontaggio al pezzo  
    (default_user_id, 'costo_premontaggio', 'Costo Premontaggio al pezzo', 7.20, 'Costo per il premontaggio di ogni pezzo', 'costo_premontaggio_pezzo'),
    
    -- Numero di profili m/l in funzione della distribuzione
    (default_user_id, 'profili_distribuzione', 'Distribuzione 1', 6, 'Numero di profili per distribuzione 1', 'distribuzione_1'),
    (default_user_id, 'profili_distribuzione', 'Distribuzione 2', 10, 'Numero di profili per distribuzione 2', 'distribuzione_2'),
    (default_user_id, 'profili_distribuzione', 'Distribuzione 3', 14, 'Numero di profili per distribuzione 3', 'distribuzione_3'),
    (default_user_id, 'profili_distribuzione', 'Distribuzione 4', 18, 'Numero di profili per distribuzione 4', 'distribuzione_4'),
    
    -- Costo per m/l in funzione dell'altezza
    (default_user_id, 'costo_altezza', 'Altezza 2.5m', 184.00, 'Costo per metro lineare per altezza 2.5m', 'altezza_2_5'),
    (default_user_id, 'costo_altezza', 'Altezza 3m', 207.00, 'Costo per metro lineare per altezza 3m', 'altezza_3'),
    (default_user_id, 'costo_altezza', 'Altezza 3.4m', 247.25, 'Costo per metro lineare per altezza 3.4m', 'altezza_3_4'),
    (default_user_id, 'costo_altezza', 'Altezza 4m', 287.50, 'Costo per metro lineare per altezza 4m', 'altezza_4')
    ON CONFLICT DO NOTHING;
END $$;