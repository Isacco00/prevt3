-- Add certification and instructions cost parameters
INSERT INTO public.parametri_a_costi_unitari (parametro, valore, unita_misura, attivo)
VALUES 
  ('Costo_certificazione', 300, '€', true),
  ('Costo_istruzionieassistenza', 200, '€', true);