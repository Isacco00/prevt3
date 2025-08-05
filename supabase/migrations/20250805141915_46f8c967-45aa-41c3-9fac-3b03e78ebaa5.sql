-- Insert default parameters for administration
INSERT INTO public.parametri (user_id, tipo, nome, valore, descrizione) VALUES
-- Default for all users (we'll use a system user_id or handle this in the application)
-- For now, these will be inserted when a user accesses admin page

-- Costo stampa grafica al metro quadro
(gen_random_uuid(), 'costo_stampa', 'Costo stampa grafica al metro quadro', 19.50, 'Costo per la stampa grafica per metro quadro'),

-- Costo Premontaggio al pezzo  
(gen_random_uuid(), 'costo_premontaggio', 'Costo Premontaggio al pezzo', 7.20, 'Costo per il premontaggio di ogni pezzo'),

-- Numero di profili m/l in funzione della distribuzione
(gen_random_uuid(), 'profili_distribuzione', 'Profili distribuzione 1', 6, 'Numero di profili per distribuzione 1'),
(gen_random_uuid(), 'profili_distribuzione', 'Profili distribuzione 2', 10, 'Numero di profili per distribuzione 2'),
(gen_random_uuid(), 'profili_distribuzione', 'Profili distribuzione 3', 14, 'Numero di profili per distribuzione 3'),
(gen_random_uuid(), 'profili_distribuzione', 'Profili distribuzione 4', 18, 'Numero di profili per distribuzione 4'),

-- Costo per m/l in funzione dell'altezza
(gen_random_uuid(), 'costo_altezza', 'Costo altezza 2.5', 184.00, 'Costo per metro lineare per altezza 2.5m'),
(gen_random_uuid(), 'costo_altezza', 'Costo altezza 3', 207.00, 'Costo per metro lineare per altezza 3m'),
(gen_random_uuid(), 'costo_altezza', 'Costo altezza 3.4', 247.25, 'Costo per metro lineare per altezza 3.4m'),
(gen_random_uuid(), 'costo_altezza', 'Costo altezza 4', 287.50, 'Costo per metro lineare per altezza 4m');

-- Add additional columns to parametri table for better parameter management
ALTER TABLE public.parametri ADD COLUMN IF NOT EXISTS valore_chiave text;
ALTER TABLE public.parametri ADD COLUMN IF NOT EXISTS ordine integer DEFAULT 0;

-- Update the records to include keys for easier reference
UPDATE public.parametri SET valore_chiave = 'distribuzione_1' WHERE tipo = 'profili_distribuzione' AND nome = 'Profili distribuzione 1';
UPDATE public.parametri SET valore_chiave = 'distribuzione_2' WHERE tipo = 'profili_distribuzione' AND nome = 'Profili distribuzione 2';
UPDATE public.parametri SET valore_chiave = 'distribuzione_3' WHERE tipo = 'profili_distribuzione' AND nome = 'Profili distribuzione 3';
UPDATE public.parametri SET valore_chiave = 'distribuzione_4' WHERE tipo = 'profili_distribuzione' AND nome = 'Profili distribuzione 4';

UPDATE public.parametri SET valore_chiave = 'altezza_2_5' WHERE tipo = 'costo_altezza' AND nome = 'Costo altezza 2.5';
UPDATE public.parametri SET valore_chiave = 'altezza_3' WHERE tipo = 'costo_altezza' AND nome = 'Costo altezza 3';
UPDATE public.parametri SET valore_chiave = 'altezza_3_4' WHERE tipo = 'costo_altezza' AND nome = 'Costo altezza 3.4';
UPDATE public.parametri SET valore_chiave = 'altezza_4' WHERE tipo = 'costo_altezza' AND nome = 'Costo altezza 4';