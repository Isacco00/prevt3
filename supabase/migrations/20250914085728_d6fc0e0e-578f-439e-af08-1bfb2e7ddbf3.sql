-- Update the parameter name from "Costo per km" to "costo montatori xkm" (exact case match)
UPDATE parametri_a_costi_unitari 
SET parametro = 'costo montatori xkm' 
WHERE parametro = 'Costo per km';