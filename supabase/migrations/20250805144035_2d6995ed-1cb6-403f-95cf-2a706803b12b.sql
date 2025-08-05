-- Aggiorna i parametri per altezza con valori numerici corretti
UPDATE public.parametri 
SET nome = '2.5', valore_chiave = '2.5'
WHERE tipo = 'costo_altezza' AND nome = 'Altezza 2.5m';

UPDATE public.parametri 
SET nome = '3', valore_chiave = '3'
WHERE tipo = 'costo_altezza' AND nome = 'Altezza 3m';

UPDATE public.parametri 
SET nome = '3.5', valore_chiave = '3.5'
WHERE tipo = 'costo_altezza' AND nome = 'Altezza 3.5m';

UPDATE public.parametri 
SET nome = '4', valore_chiave = '4'
WHERE tipo = 'costo_altezza' AND nome = 'Altezza 4m';

-- Aggiorna i parametri per distribuzione con valori numerici corretti
UPDATE public.parametri 
SET nome = '1', valore_chiave = '1'
WHERE tipo = 'profili_distribuzione' AND nome = 'Distribuzione 1';

UPDATE public.parametri 
SET nome = '2', valore_chiave = '2'
WHERE tipo = 'profili_distribuzione' AND nome = 'Distribuzione 2';

UPDATE public.parametri 
SET nome = '3', valore_chiave = '3'
WHERE tipo = 'profili_distribuzione' AND nome = 'Distribuzione 3';

UPDATE public.parametri 
SET nome = '4', valore_chiave = '4'
WHERE tipo = 'profili_distribuzione' AND nome = 'Distribuzione 4';