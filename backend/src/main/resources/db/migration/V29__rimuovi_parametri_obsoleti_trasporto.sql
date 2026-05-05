-- Rimuove i parametri di trasporto obsoleti, sostituiti dai parametri con
-- nome_variabile introdotti in V25/V27. Le formule Montaggio e Smontaggio
-- ora usano: costo_auto_xkm, costo_furgone_xkm, costo_altromezzo_xkm,
-- costo_autowow_xkm, costo_furgextra_xkm, costo_tirextra_xkm.

delete from parametri_a_costi_unitari
where parametro in (
    'Costo montatori xkm',
    'Costo treno al km',
    'Costo auto al km',
    'Costo furgone al km',
    'Costo TIR al km'
);
