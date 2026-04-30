alter table preventivi_servizi
    add column punto_partenza         text,
    add column punto_arrivo           text,
    add column rientro_dopomont       boolean        default true            not null,
    add column giorni_viaggio         integer        default 0               not null,
    add column pernottamenti_viaggio  integer        default 0               not null,
    add column tempo_viaggio_ar_mont  numeric        default 0               not null,
    add column costo_orario_viaggio   numeric        default 0               not null,
    add column noleggio_mezzo         text           default 'No'            not null,
    add column costo_pedaggi          numeric        default 0               not null,
    add column costo_volo_pp          numeric        default 0               not null,
    add column costo_treno_pp         numeric        default 0               not null,
    add column tot_cost_noleggio      numeric        default 0               not null;
