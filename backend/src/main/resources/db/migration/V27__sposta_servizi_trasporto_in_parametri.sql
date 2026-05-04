-- Sposta i parametri di trasporto/noleggio da listino_servizi_prezzo_unitario
-- a parametri_a_costi_unitari. Il listino_servizi_prezzo_unitario ospitera
-- solo Certificazione, Istruzioni e Assistenza, Premontaggio, Stampa Grafica.

insert into parametri_a_costi_unitari (parametro, nome_variabile, unita_misura, valore, ricarico_percentuale, attivo)
select v.parametro, v.nome_variabile, v.unita_misura, v.valore, 0, true
from (values
    ('Costo noleggio auto',                'costo_noleggio_auto',       '€/giorno', 60),
    ('Costo noleggio furgone',             'costo_noleggio_furgone',    '€/giorno', 90),
    ('Costo noleggio altro mezzo',         'costo_noleggio_altromezzo', '€/giorno', 120),
    ('Costo carburante auto al km',        'costo_auto_xkm',            '€/km',     0.20),
    ('Costo carburante furgone al km',     'costo_furgone_xkm',         '€/km',     0.30),
    ('Costo carburante altro mezzo al km', 'costo_altromezzo_xkm',      '€/km',     0.40),
    ('Costo Auto WOW al km',               'costo_autowow_xkm',         '€/km',     0.30),
    ('Costo furgone con autista al km',    'costo_furgextra_xkm',       '€/km',     1.00),
    ('Costo TIR con autista al km',        'costo_tirextra_xkm',        '€/km',     2.00)
) as v(parametro, nome_variabile, unita_misura, valore)
where not exists (
    select 1 from parametri_a_costi_unitari p where p.nome_variabile = v.nome_variabile
);

delete from listino_servizi_prezzo_unitario
where parametro in (
    'costo_noleggio_auto', 'costo_noleggio_furgone', 'costo_noleggio_altromezzo',
    'costo_auto_xkm', 'costo_furgone_xkm', 'costo_altromezzo_xkm',
    'costo_autowow_xkm', 'costo_fisso_consegna',
    'costo_furgextra_xkm', 'costo_tirextra_xkm'
);
