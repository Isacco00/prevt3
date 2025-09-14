-- Add the missing parameter for fixed delivery cost
INSERT INTO parametri_a_costi_unitari (parametro, valore, unita_misura, attivo)
VALUES ('costo_fisso_consegna', 150, '€', true)
ON CONFLICT (parametro) DO UPDATE SET
  valore = EXCLUDED.valore,
  unita_misura = EXCLUDED.unita_misura,
  attivo = EXCLUDED.attivo;