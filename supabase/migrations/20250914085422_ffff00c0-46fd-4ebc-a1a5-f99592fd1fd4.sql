-- Update the parameter name from "costo per km" to "costo montatori xkm"
UPDATE parametri_a_costi_unitari 
SET parametro = 'costo montatori xkm' 
WHERE parametro = 'costo per km';