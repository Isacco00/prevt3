alter table costi_retroilluminazione
    rename to listino_retroilluminazione;
alter table listino_retroilluminazione
    add column ricarico_percentuale numeric(19, 2);
alter table listino_retroilluminazione
    add column prezzo numeric(19, 2);
alter table listino_retroilluminazione
    add column descrizione text;
alter table costi_struttura_desk_layout
    rename to listino_struttura_desk;
alter table listino_struttura_desk
    add column ricarico_percentuale numeric(19, 2);
alter table listino_struttura_desk
    add column prezzo numeric(19, 2);
alter table listino_struttura_desk
    add column descrizione text;
alter table listino_accessori_stand
    add column ricarico_percentuale numeric(19, 2);
alter table listino_accessori_stand
    add column prezzo numeric(19, 2);
alter table listino_struttura_desk
    alter column layout_desk type numeric(19, 2) using layout_desk::numeric(19, 2);