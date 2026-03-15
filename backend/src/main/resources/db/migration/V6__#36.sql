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
alter table listino_accessori_stand
    add column descrizione text;
alter table listino_accessori_desk
    add column ricarico_percentuale numeric(19, 2);
alter table listino_accessori_desk
    add column prezzo numeric(19, 2);
alter table listino_accessori_desk
    add column descrizione text;
alter table listino_accessori_espositori
    add column ricarico_percentuale numeric(19, 2);
alter table listino_accessori_espositori
    add column prezzo numeric(19, 2);
alter table listino_accessori_espositori
    add column descrizione text;
alter table costi_struttura_espositori_layout
    rename to listino_struttura_espositori;
alter table listino_struttura_espositori
    add column ricarico_percentuale numeric(19, 2);
alter table listino_struttura_espositori
    add column prezzo numeric(19, 2);
alter table listino_struttura_espositori
    add column descrizione text;
alter table parametri_a_costi_unitari
    add column ricarico_percentuale numeric(19, 2);
alter table parametri_a_costi_unitari
    add column prezzo numeric(19, 2);
alter table parametri_a_costi_unitari
    add column descrizione text;
alter table listino_struttura_desk
    alter column layout_desk type numeric(19, 2) using layout_desk::numeric(19, 2);
alter table listino_struttura_espositori
    alter column layout_espositore type numeric(19, 2) using layout_espositore::numeric(19, 2);
alter table parametri
    add column ricarico_percentuale numeric(19, 2);
alter table parametri
    add column prezzo numeric(19, 2);

create table listino_servizi_prezzo_unitario
(
    id                   uuid                     default gen_random_uuid() not null
        primary key,
    parametro            text                                               not null,
    unita_misura         text                                               not null,
    costo                numeric                  default 0                 not null,
    ricarico_percentuale numeric                  default 0                 not null,
    descrizione          text,
    attivo               boolean                  default true              not null,
    created_at           timestamp with time zone default now()             not null,
    updated_at           timestamp with time zone default now()             not null
);

INSERT INTO public.listino_servizi_prezzo_unitario (id, parametro, unita_misura, costo, attivo,
                                                    created_at, updated_at)
VALUES (DEFAULT, 'Istruzioni e Assistenza', '€', 200, true, now(),
        now()),
       (DEFAULT, 'Stampa Grafica', '€/mq', 19.50, true, now(),
        now()),
       (DEFAULT, 'Certificazione', '€', 500, true, now(),
        now()),
       (DEFAULT, 'Premontaggio', '€/pz', 7.20, true, now(),
        now());

DELETE
FROM public.parametri_a_costi_unitari
WHERE id = '3d602cc6-e211-4e1c-bf52-e50a4662ed14';

DELETE
FROM public.parametri_a_costi_unitari
WHERE id = '356d54cf-83f6-44e9-b82a-2feddf9f3741';

DELETE
FROM public.parametri_a_costi_unitari
WHERE id = '451ae3eb-f61d-457e-adff-82dd4cca219d';

DELETE
FROM public.parametri_a_costi_unitari
WHERE id = 'febf22ae-de2f-443a-87dc-66d6facf5cc8';
