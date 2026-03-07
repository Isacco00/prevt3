alter table costi_retroilluminazione
    rename to listino_retroilluminazione;
alter table listino_retroilluminazione
    add column ricarico_percentuale numeric(19, 2);
alter table listino_retroilluminazione
    add column prezzo numeric(19, 2);
alter table listino_retroilluminazione
    add column descrizione text;
