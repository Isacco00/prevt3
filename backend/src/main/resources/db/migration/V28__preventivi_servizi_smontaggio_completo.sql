-- Aggiunge i nuovi campi al servizio di Smontaggio per allineare alla
-- specifica: la sezione Smontaggio replica completamente i dati di
-- ingresso del Montaggio usando variabili dedicate (_smon).

alter table preventivi_servizi
    add column if not exists punto_partenza_smon         text,
    add column if not exists punto_arrivo_smon           text,
    add column if not exists rientro_doposmont           boolean        not null default true,
    add column if not exists giorni_viaggio_smon         integer        not null default 0,
    add column if not exists pernottamenti_viaggio_smon  integer        not null default 0,
    add column if not exists tempo_viaggio_ar_smon       numeric(12,2)  not null default 0,
    add column if not exists costo_orario_viaggio_smon   numeric(12,2)  not null default 0,
    add column if not exists noleggio_mezzo_smon         text           not null default 'No',
    add column if not exists giorni_noleggio_smon        integer        not null default 0,
    add column if not exists costo_pedaggi_smon          numeric(12,2)  not null default 0,
    add column if not exists costo_volo_pp_smon          numeric(12,2)  not null default 0,
    add column if not exists costo_treno_pp_smon         numeric(12,2)  not null default 0,
    add column if not exists ritiro_cant                 boolean        not null default false,
    add column if not exists tot_cost_noleggio_smon      numeric(14,2)  not null default 0,
    add column if not exists tot_costi_ritiro_cantiere   numeric(14,2)  not null default 0;
