-- Seed parametri di trasporto / noleggio richiesti da spec Montaggio/Smontaggio
-- Tutti i nomi variabile attesi dal calcolo costi servizio montaggio.

insert into listino_servizi_prezzo_unitario (parametro, unita_misura, costo, ricarico_percentuale, descrizione, attivo)
select v.parametro, v.unita_misura, v.costo, 0, v.descrizione, true
from (values
    ('costo_noleggio_auto',       '€/giorno', 60,  'Prezzo noleggio vettura'),
    ('costo_noleggio_furgone',    '€/giorno', 90,  'Prezzo noleggio furgone'),
    ('costo_noleggio_altromezzo', '€/giorno', 120, 'Prezzo noleggio altro mezzo'),
    ('costo_auto_xkm',            '€/km',     0.20,'Prezzo carburante auto al km'),
    ('costo_furgone_xkm',         '€/km',     0.30,'Prezzo carburante furgone al km'),
    ('costo_altromezzo_xkm',      '€/km',     0.40,'Prezzo carburante altro mezzo al km'),
    ('costo_autowow_xkm',         '€/km',     0.30,'Prezzo Auto WOW al km'),
    ('costo_fisso_consegna',      '€',        150, 'Prezzo fisso consegna in cantiere'),
    ('costo_furgextra_xkm',       '€/km',     1.00,'Prezzo Furgone con autista al km'),
    ('costo_tirextra_xkm',        '€/km',     2.00,'Prezzo TIR con autista al km')
) as v(parametro, unita_misura, costo, descrizione)
where not exists (
    select 1 from listino_servizi_prezzo_unitario s where s.parametro = v.parametro
);
