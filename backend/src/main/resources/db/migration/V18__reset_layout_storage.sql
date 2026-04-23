-- Reset di tutti i record esistenti al nuovo layout unificato con stand.
-- Valori legacy ('0','1','2') non più riconosciuti dal frontend → spostati a '0_lati'.
UPDATE preventivo SET layout_storage = '0_lati';
