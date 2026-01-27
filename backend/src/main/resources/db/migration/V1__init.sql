-- Flyway migration: initial unified schema (clean version)
-- PostgreSQL

CREATE EXTENSION IF NOT EXISTS pgcrypto;

------------------------------------------------------------
-- UTENTI (ex auth.users + public.users + alter vari)
------------------------------------------------------------
CREATE TABLE public.utente (
                               id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                               email text UNIQUE NOT NULL,
                               password_hash varchar(255),
                               first_name text,
                               last_name text,
                               avatar_url text,
                               role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
                               active boolean NOT NULL DEFAULT true,
                               created_at timestamptz NOT NULL DEFAULT now(),
                               updated_at timestamptz NOT NULL DEFAULT now()
);

------------------------------------------------------------
-- PASSWORD RESET TOKENS
------------------------------------------------------------
CREATE TABLE public.password_reset_tokens (
                                              id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                              user_id uuid NOT NULL,
                                              expires_at timestamp NOT NULL,
                                              used boolean NOT NULL DEFAULT false,
                                              CONSTRAINT fk_prt_user FOREIGN KEY (user_id)
                                                  REFERENCES public.utente(id)
);

------------------------------------------------------------
-- PROSPECT
------------------------------------------------------------
CREATE TABLE public.prospect (
                                 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                 user_id uuid NOT NULL,
                                 ragione_sociale text NOT NULL,
                                 partita_iva text NOT NULL,
                                 codice_fiscale text,
                                 indirizzo text,
                                 citta text,
                                 cap text,
                                 provincia text,
                                 telefono text,
                                 email text,
                                 tipo text NOT NULL DEFAULT 'prospect' CHECK (tipo IN ('prospect','cliente')),
                                 tipo_prospect text DEFAULT 'Professional' CHECK (tipo_prospect IN ('Professional','Finale')),
                                 created_at timestamptz NOT NULL DEFAULT now(),
                                 updated_at timestamptz NOT NULL DEFAULT now(),
                                 CONSTRAINT prospect_user_fk FOREIGN KEY (user_id)
                                     REFERENCES public.utente(id)
);

------------------------------------------------------------
-- PREVENTIVO
------------------------------------------------------------
-- auto-generated definition
create table preventivo
(
    id                                  uuid                     default gen_random_uuid() not null
        constraint preventivi_pkey
            primary key,
    user_id                             uuid                                               not null
        constraint preventivi_user_id_fkey
            references "utente",
    prospect_id                         uuid
        constraint preventivi_prospect_id_fkey
            references prospect,
    numero_preventivo                   text                                               not null,
    titolo                              text                                               not null,
    descrizione                         text,
    larghezza                           numeric                                            not null,
    altezza                             numeric                                            not null,
    costo_mq                            numeric                  default 0                 not null,
    costo_mc                            numeric                  default 0                 not null,
    costo_fisso                         numeric                  default 0                 not null,
    status                              text                     default 'bozza'::text     not null
        constraint preventivi_status_check
            check (status = ANY (ARRAY ['bozza'::text, 'inviato'::text, 'accettato'::text, 'rifiutato'::text])),
    data_scadenza                       date,
    note                                text,
    created_at                          timestamp with time zone default now()             not null,
    updated_at                          timestamp with time zone default now()             not null,
    profondita                          numeric,
    layout                              text,
    distribuzione                       integer,
    complessita                         text,
    superficie_stampa                   numeric,
    sviluppo_lineare                    numeric,
    numero_pezzi                        numeric,
    costo_struttura                     numeric                  default 0,
    costo_grafica                       numeric                  default 0,
    costo_premontaggio                  numeric                  default 0,
    costo_totale                        numeric                  default 0,
    totale                              numeric                  default 0,
    bifaccialita                        numeric                  default 0,
    retroilluminazione                  numeric                  default 0,
    larg_storage                        numeric                  default 0,
    prof_storage                        numeric                  default 0,
    alt_storage                         numeric                  default 2.5,
    layout_storage                      text                     default '0'::text,
    numero_porte                        text                     default '0'::text,
    desk_qta                            integer                  default 0,
    layout_desk                         text                     default ''::text,
    porta_scorrevole                    integer                  default 0,
    ripiano_superiore                   integer                  default 0,
    ripiano_inferiore                   integer                  default 0,
    teca_plexiglass                     integer                  default 0,
    fronte_luminoso                     integer                  default 0,
    borsa                               integer                  default 0,
    superficie_stampa_storage           numeric                  default 0,
    sviluppo_metri_lineari_storage      numeric                  default 0,
    numero_pezzi_storage                numeric                  default 0,
    superficie_stampa_desk              numeric                  default 0,
    numero_pezzi_desk                   numeric                  default 0,
    espositori_config                   text                     default '{}'::text,
    complementi_config                  text                     default '{}'::text,
    borsa_stand                         integer                  default 0,
    baule_trolley                       integer                  default 0,
    staffa_monitor                      integer                  default 0,
    mensola                             integer                  default 0,
    spot_light                          integer                  default 0,
    kit_faro_50w                        integer                  default 0,
    kit_faro_100w                       integer                  default 0,
    quadro_elettrico_16a                integer                  default 0,
    nicchia                             integer                  default 0,
    pedana                              integer                  default 0,
    qta_tipo30                          integer                  default 0,
    qta_tipo50                          integer                  default 0,
    qta_tipo100                         integer                  default 0,
    numero_pezzi_espositori             numeric                  default 0,
    superficie_stampa_espositori        numeric                  default 0,
    ripiano_30x30                       integer                  default 0,
    ripiano_50x50                       integer                  default 0,
    ripiano_100x50                      integer                  default 0,
    teca_plexiglass_30x30x30            integer                  default 0,
    teca_plexiglass_50x50x50            integer                  default 0,
    teca_plexiglass_100x50x30           integer                  default 0,
    retroilluminazione_30x30x100h       integer                  default 0,
    retroilluminazione_50x50x100h       integer                  default 0,
    retroilluminazione_100x50x100h      integer                  default 0,
    servizio_montaggio_smontaggio       boolean                  default false,
    servizio_certificazioni             boolean                  default false,
    servizio_istruzioni_assistenza      boolean                  default false,
    extra_perc_complex                  numeric                  default 0,
    extra_stand_complesso               numeric                  default 0,
    costo_retroilluminazione            numeric                  default 0,
    accessori_stand_config              text                     default '{}'::text,
    borsa_espositori                    integer                  default 0,
    premontaggio                        boolean                  default true,
    marginalita_struttura               numeric                  default 50,
    marginalita_grafica                 numeric                  default 50,
    marginalita_retroilluminazione      numeric                  default 50,
    marginalita_accessori               numeric                  default 50,
    marginalita_premontaggio            numeric                  default 50,
    marginalita_struttura_storage       numeric                  default 50,
    marginalita_grafica_storage         numeric                  default 50,
    marginalita_premontaggio_storage    numeric                  default 50,
    marginalita_struttura_desk          numeric                  default 50,
    marginalita_grafica_desk            numeric                  default 50,
    marginalita_premontaggio_desk       numeric                  default 50,
    marginalita_accessori_desk          numeric                  default 50,
    marginalita_struttura_espositori    numeric                  default 50,
    marginalita_grafica_espositori      numeric                  default 50,
    marginalita_premontaggio_espositori numeric                  default 50,
    marginalita_accessori_espositori    numeric                  default 50,
    totale_preventivo                   numeric                  default 0,
    totale_costi                        numeric                  default 0
);

CREATE INDEX idx_preventivo_user_id ON public.preventivo(user_id);
CREATE INDEX idx_preventivo_prospect_id ON public.preventivo(prospect_id);

create table preventivi_servizi
(
    id                                 uuid                     default gen_random_uuid() not null
        primary key,
    preventivo_id                      uuid                                               not null
        references preventivo
            on delete cascade,
    created_at                         timestamp with time zone default now()             not null,
    updated_at                         timestamp with time zone default now()             not null,
    montaggio_smontaggio               boolean                  default false,
    certificazioni                     boolean                  default false,
    istruzioni_assistenza              boolean                  default false,
    personale_mont                     integer                  default 0,
    costo_orario_mont                  numeric                  default 20,
    giorni_montaggio                   integer                  default 0,
    ore_lavoro_cantxper_mont           numeric                  default 0,
    km_ar_mont                         numeric                  default 0,
    conseg_cant                        boolean                  default false,
    volo_mont                          text                     default 'NO'::text,
    treno_mont                         boolean                  default false,
    ore_viaggio_trasferta_mont         numeric                  default 0,
    viaggio_auto_com_mont              boolean                  default false,
    extra_costi_trasferta_mont         text                     default 'NO'::text,
    extra_km_trasp_furg_mont           numeric                  default 0,
    extra_km_trasp_tir_mont            numeric                  default 0,
    ricarico_montaggio                 numeric                  default 30,
    tot_cost_ore_mont                  numeric                  default 0,
    tot_cost_km_mont                   numeric                  default 0,
    num_vitti                          integer                  default 0,
    num_alloggi                        integer                  default 0,
    tot_cost_vittall                   numeric                  default 0,
    tot_costo_volo_ar                  numeric                  default 0,
    tot_costo_treno                    numeric                  default 0,
    tot_costo_trasf_pers               numeric                  default 0,
    tot_costi_auto                     numeric                  default 0,
    tot_costi_extra_trasf_mont         numeric                  default 0,
    tot_costi_extra_km_trasp_furg_mont numeric                  default 0,
    tot_costi_extra_km_trasp_tir_mont  numeric                  default 0,
    tot_costi_consegna_cantiere        numeric                  default 0,
    totale_costo_montaggio             numeric                  default 0,
    preventivo_montaggio               numeric                  default 0,
    personale_smon                     integer                  default 0,
    costo_orario_smon                  numeric                  default 20,
    giorni_smontaggio_viaggio          integer                  default 0,
    ore_lavoro_cantxper_smon           numeric                  default 0,
    km_ar_smon                         numeric                  default 0,
    volo_smon                          text                     default 'NO'::text,
    treno_smon                         boolean                  default false,
    ore_viaggio_trasferta_smon         numeric                  default 0,
    viaggio_auto_com_smon              boolean                  default false,
    extra_costi_trasferta_smon         text                     default 'NO'::text,
    extra_km_trasp_furg_smon           numeric                  default 0,
    extra_km_trasp_tir_smon            numeric                  default 0,
    tot_cost_ore_smon                  numeric                  default 0,
    tot_cost_km_smon                   numeric                  default 0,
    num_vitti_smon                     integer                  default 0,
    num_alloggi_smon                   integer                  default 0,
    tot_cost_vittall_smon              numeric                  default 0,
    tot_costo_volo_ar_smon             numeric                  default 0,
    tot_costo_treno_smon               numeric                  default 0,
    tot_costo_trasf_pers_smon          numeric                  default 0,
    tot_costi_auto_smon                numeric                  default 0,
    tot_costi_extra_trasf_smon         numeric                  default 0,
    tot_costi_extra_km_trasp_furg_smon numeric                  default 0,
    tot_costi_extra_km_trasp_tir_smon  numeric                  default 0,
    totale_costo_smontaggio            numeric                  default 0,
    preventivo_smontaggio              numeric                  default 0
);
------------------------------------------------------------
-- ALTRI BENI / SERVIZI
------------------------------------------------------------
CREATE TABLE public.altri_beni_servizi (
                                           id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                           preventivo_id uuid NOT NULL,
                                           descrizione text NOT NULL DEFAULT '',
                                           costo_unitario numeric NOT NULL DEFAULT 0,
                                           marginalita numeric NOT NULL DEFAULT 0,
                                           prezzo_unitario numeric NOT NULL DEFAULT 0,
                                           quantita numeric NOT NULL DEFAULT 0,
                                           totale numeric NOT NULL DEFAULT 0,
                                           created_at timestamptz NOT NULL DEFAULT now(),
                                           updated_at timestamptz NOT NULL DEFAULT now(),
                                           CONSTRAINT abs_preventivo_fk FOREIGN KEY (preventivo_id)
                                               REFERENCES public.preventivo(id) ON DELETE CASCADE
);

------------------------------------------------------------
-- CONDIZIONI STANDARD FORNITURA
------------------------------------------------------------
CREATE TABLE public.condizioni_standard_fornitura (
                                                      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                                      voce text NOT NULL,
                                                      testo_standard text NOT NULL DEFAULT 'Inserisci testo',
                                                      ordine integer NOT NULL DEFAULT 0,
                                                      attivo boolean NOT NULL DEFAULT true,
                                                      created_at timestamptz NOT NULL DEFAULT now(),
                                                      updated_at timestamptz NOT NULL DEFAULT now()
);

------------------------------------------------------------
-- CONDIZIONI FORNITURA PREVENTIVO
------------------------------------------------------------
CREATE TABLE public.condizioni_fornitura_preventivi (
                                                        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                                        preventivo_id uuid NOT NULL,
                                                        voce text NOT NULL,
                                                        testo text NOT NULL DEFAULT 'Inserisci testo',
                                                        selezionato boolean NOT NULL DEFAULT true,
                                                        ordine integer NOT NULL DEFAULT 0,
                                                        created_at timestamptz NOT NULL DEFAULT now(),
                                                        updated_at timestamptz NOT NULL DEFAULT now(),
                                                        CONSTRAINT cfp_preventivo_fk FOREIGN KEY (preventivo_id)
                                                            REFERENCES public.preventivo(id) ON DELETE CASCADE
);

------------------------------------------------------------
-- LISTINI ACCESSORI
------------------------------------------------------------
CREATE TABLE public.listino_accessori_stand (
                                                id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                                nome text NOT NULL,
                                                costo_unitario numeric NOT NULL DEFAULT 0,
                                                attivo boolean NOT NULL DEFAULT true,
                                                created_at timestamptz NOT NULL DEFAULT now(),
                                                updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.listino_accessori_desk (
                                               id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                               nome text NOT NULL,
                                               costo_unitario numeric NOT NULL DEFAULT 0,
                                               attivo boolean NOT NULL DEFAULT true,
                                               created_at timestamptz NOT NULL DEFAULT now(),
                                               updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.listino_accessori_espositori (
                                                     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                                     nome text NOT NULL,
                                                     costo_unitario numeric NOT NULL DEFAULT 0,
                                                     attivo boolean NOT NULL DEFAULT true,
                                                     created_at timestamptz NOT NULL DEFAULT now(),
                                                     updated_at timestamptz NOT NULL DEFAULT now()
);

create table parametri_a_costi_unitari
(
    id           uuid                     default gen_random_uuid() not null
        primary key,
    parametro    text                                               not null,
    unita_misura text                                               not null,
    valore       numeric                  default 0                 not null,
    attivo       boolean                  default true              not null,
    created_at   timestamp with time zone default now()             not null,
    updated_at   timestamp with time zone default now()             not null
);

create table parametri
(
    id            uuid                     default gen_random_uuid() not null
        primary key,
    tipo          text                                               not null,
    nome          text                                               not null,
    valore        numeric,
    valore_testo  text,
    descrizione   text,
    attivo        boolean                  default true              not null,
    created_at    timestamp with time zone default now()             not null,
    updated_at    timestamp with time zone default now()             not null,
    valore_chiave text,
    ordine        integer                  default 0
);

create table marginalita_per_prospect
(
    id            uuid                     default gen_random_uuid() not null
        primary key,
    tipo_prospect text                                               not null
        unique,
    marginalita   numeric                  default 0                 not null,
    attivo        boolean                  default true              not null,
    created_at    timestamp with time zone default now()             not null,
    updated_at    timestamp with time zone default now()             not null
);

create table costi_volo_ar
(
    id            uuid                     default gen_random_uuid() not null
        primary key,
    tipologia     text                                               not null,
    costo_volo_ar numeric                  default 0                 not null,
    attivo        boolean                  default true              not null,
    created_at    timestamp with time zone default now()             not null,
    updated_at    timestamp with time zone default now()             not null
);

create table costi_struttura_espositori_layout
(
    id                uuid                     default gen_random_uuid() not null
        primary key,
    layout_espositore text                                               not null,
    costo_unitario    numeric                  default 0                 not null,
    attivo            boolean                  default true              not null,
    created_at        timestamp with time zone default now()             not null,
    updated_at        timestamp with time zone default now()             not null
);
create table costi_struttura_desk_layout
(
    id             uuid                     default gen_random_uuid() not null
        primary key,
    layout_desk    text                                               not null,
    costo_unitario numeric                  default 0                 not null,
    attivo         boolean                  default true              not null,
    created_at     timestamp with time zone default now()             not null,
    updated_at     timestamp with time zone default now()             not null
);

create table costi_retroilluminazione
(
    id             uuid                     default gen_random_uuid() not null
        primary key,
    altezza        numeric                                            not null,
    costo_al_metro numeric                                            not null,
    created_at     timestamp with time zone default now()             not null,
    updated_at     timestamp with time zone default now()             not null
);

create table costi_extra_trasf_mont
(
    id               uuid                     default gen_random_uuid() not null
        primary key,
    livello          text                                               not null,
    costo_extra_mont numeric                  default 0                 not null,
    attivo           boolean                  default true              not null,
    created_at       timestamp with time zone default now()             not null,
    updated_at       timestamp with time zone default now()             not null
);

INSERT INTO public."utente" (id, email, created_at, updated_at, active, password_hash, first_name, last_name, avatar_url, role)
VALUES ('51f22dce-b83e-483d-a571-7863a6481ab6', 'massimo@t3systems.it', '2025-12-23 22:13:48.065123 +00:00',
        '2025-12-23 22:13:48.065123 +00:00', true, '$2a$12$xDoDbuKlGqd4YGHQJJK9U.zusOta/6eAXjCa7Tf.ov5mOWZxRTNWa',
        'Flaviano', 'Bortoletto', null, 'admin');
INSERT INTO public."utente" (id, email, created_at, updated_at, active, password_hash, first_name, last_name, avatar_url, role)
VALUES ('0cc24fed-e4f9-42d7-8fda-3d3b987f419a', 'massimo_piva@outlook.it', '2025-12-23 22:13:48.065123 +00:00',
        '2025-12-23 22:13:48.065123 +00:00', true, '$2a$12$xDoDbuKlGqd4YGHQJJK9U.zusOta/6eAXjCa7Tf.ov5mOWZxRTNWa',
        'Massimo', 'Piva',
        'https://gbkfnibaphesqccufuvy.supabase.co/storage/v1/object/public/avatars/8dc1ffe8-e374-4c05-b05d-86d5cf9518a9/avatar_1763319452964.png','admin');
INSERT INTO public."utente" (id, email, created_at, updated_at, active, password_hash, first_name, last_name, avatar_url, role)
VALUES ('8dc1ffe8-e374-4c05-b05d-86d5cf9518a9', 'massimopiva@t3systems.it', '2025-12-23 22:13:48.065123 +00:00',
        '2025-12-23 22:13:48.065123 +00:00', true, '$2a$12$xDoDbuKlGqd4YGHQJJK9U.zusOta/6eAXjCa7Tf.ov5mOWZxRTNWa',
        'Massimo', 'Piva',
        'https://gbkfnibaphesqccufuvy.supabase.co/storage/v1/object/public/avatars/0cc24fed-e4f9-42d7-8fda-3d3b987f419a/avatar_1755789905999.png','admin');
INSERT INTO public."utente" (id, email, created_at, updated_at, active, password_hash, first_name, last_name, avatar_url, role)
VALUES ('bd088db4-826b-4f3e-87af-058448cf31c2', 'commerciale@t3systems.it', '2025-12-23 22:13:48.065123 +00:00',
        '2026-01-02 07:42:11.073921 +00:00', true, '$2a$12$xDoDbuKlGqd4YGHQJJK9U.zusOta/6eAXjCa7Tf.ov5mOWZxRTNWa',
        'Massimo', 'Durello', 'bd088db4-826b-4f3e-87af-058448cf31c2/avatar.png','admin');
INSERT INTO public."utente" (id, email, created_at, updated_at, active, password_hash, first_name, last_name, avatar_url,role)
VALUES ('90698481-909e-4a4e-9cb7-e098727a3f6d', 'isaccotrevisan@gmail.com', '2026-01-02 10:39:33.211808 +00:00',
        '2026-01-02 13:07:42.110753 +00:00', true, '$2a$10$ovfHNsFXk9mYwwYJnjFhFOaME7qg2KY7iofrvUAVWO0SoThx.2uk2',
        'Isacco', 'Trevisan', '90698481-909e-4a4e-9cb7-e098727a3f6d/avatar.png','admin');

INSERT INTO "public"."prospect" ("id", "user_id", "ragione_sociale", "partita_iva", "codice_fiscale", "indirizzo",
                                  "citta", "cap", "provincia", "telefono", "email", "tipo", "created_at", "updated_at",
                                  "tipo_prospect")
VALUES ('3913c9e1-0cbc-4683-a96b-da15f26cd64b', '0cc24fed-e4f9-42d7-8fda-3d3b987f419a', 'Trisport SaS', '04851040289',
        '', 'VIA CAVINELLO 18', 'Torino', '35010', 'TO', '3489003013', 'massimo.piva@azzurrodigitale.com', 'cliente',
        '2025-08-05 13:04:37.221297+00', '2025-08-28 17:40:27.163183+00', 'Professional'),
       ('682e4fdc-b58f-4269-86ac-8e1033fdb5e0', '0cc24fed-e4f9-42d7-8fda-3d3b987f419a', 'Merryl Srl', '08198930961', '',
        'Via del domani 33', 'Brugherio', '20861', 'MB', '+332549891234', 'info@merrylcosmetics.com', 'prospect',
        '2025-08-05 15:34:16.745414+00', '2025-09-20 07:31:13.177701+00', 'Professional'),
       ('78391b70-6186-47c0-b5fa-0046f3f39f5a', '0cc24fed-e4f9-42d7-8fda-3d3b987f419a', 'Ricciardi SpA', '00642650246',
        '', 'VIA CAVINELLO 14, P.IVA 04171930284', 'Massanzago', '35010', 'PD', '3489003013', 'massimo_piva@outlook.it',
        'cliente', '2025-08-22 09:25:40.706953+00', '2025-09-20 11:50:35.396124+00', 'Finale'),
       ('80815f83-ad4f-471e-9aad-6d0496029cd3', '51f22dce-b83e-483d-a571-7863a6481ab6', 'Naked Creativity ',
        '05163420283', '', 'The Clarence Centre, 6 St George''s Circus. SE1 6FE', 'London ', 'SE1 6FE', 'PD', '',
        'jordan@nakedcreativity.co.uk', 'cliente', '2025-11-21 09:38:56.124344+00', '2025-11-21 09:38:56.124344+00',
        'Professional'),
       ('96efa20d-825b-4a5c-ab71-1e7c2ceab3bd', '0cc24fed-e4f9-42d7-8fda-3d3b987f419a', 'Stample Srl', '03495150280',
        '', 'Via Generico 5', 'Padova', '35129', 'PD', '0499002020', 'info@stample.it', 'prospect',
        '2025-09-20 08:21:42.933388+00', '2025-09-20 08:30:06.445294+00', 'Finale'),
       ('9cd6b085-43a3-4b63-b828-abb1e3e516f5', '51f22dce-b83e-483d-a571-7863a6481ab6', 'PRT Visual s.r.l. ',
        '04982120265', '', 'Via Frejus 5', 'Beinasco ', '10092 ', 'TO', '', 'marco.marra@prtvisual.com', 'cliente',
        '2025-11-11 16:04:58.651518+00', '2025-11-11 16:04:58.651518+00', 'Professional'),
       ('cc700fe4-0528-46d0-a5c8-08104645cedc', '51f22dce-b83e-483d-a571-7863a6481ab6', 'MLTG Srl ', '01892310358', '',
        'Via L. Lama, 12', 'Cadelbosco di Sopra', '42023', 'RE', '0522 912046', 'g.casali@mltg-group.it', 'prospect',
        '2025-12-01 08:39:12.31941+00', '2026-01-02 14:58:44.918758+00', 'Professional'),
       ('f887723b-fa99-43ab-81d5-a9e5e8cc972d', '0cc24fed-e4f9-42d7-8fda-3d3b987f419a', 'Miriade Srl', '04171930284',
        '', 'VIA CAVINELLO 15', 'Massanzago', '35010', 'PD', '3489003013', 'massimo_piva@outlook.it', 'prospect',
        '2025-08-05 13:02:20.9213+00', '2025-09-20 07:29:32.709301+00', 'Professional');

INSERT INTO "public"."preventivo" ("id", "user_id", "prospect_id", "numero_preventivo", "titolo", "descrizione",
                                   "larghezza", "altezza", "costo_mq", "costo_mc", "costo_fisso", "status",
                                   "data_scadenza", "note", "created_at", "updated_at", "profondita", "layout",
                                   "distribuzione", "complessita", "superficie_stampa", "sviluppo_lineare",
                                   "numero_pezzi", "costo_struttura", "costo_grafica", "costo_premontaggio",
                                   "costo_totale", "totale", "bifaccialita", "retroilluminazione", "larg_storage",
                                   "prof_storage", "alt_storage", "layout_storage", "numero_porte", "desk_qta",
                                   "layout_desk", "porta_scorrevole", "ripiano_superiore", "ripiano_inferiore",
                                   "teca_plexiglass", "fronte_luminoso", "borsa", "superficie_stampa_storage",
                                   "sviluppo_metri_lineari_storage", "numero_pezzi_storage", "superficie_stampa_desk",
                                   "numero_pezzi_desk", "espositori_config", "complementi_config", "borsa_stand",
                                   "baule_trolley", "staffa_monitor", "mensola", "spot_light", "kit_faro_50w",
                                   "kit_faro_100w", "quadro_elettrico_16a", "nicchia", "pedana", "qta_tipo30",
                                   "qta_tipo50", "qta_tipo100", "numero_pezzi_espositori",
                                   "superficie_stampa_espositori", "ripiano_30x30", "ripiano_50x50", "ripiano_100x50",
                                   "teca_plexiglass_30x30x30", "teca_plexiglass_50x50x50", "teca_plexiglass_100x50x30",
                                   "retroilluminazione_30x30x100h", "retroilluminazione_50x50x100h",
                                   "retroilluminazione_100x50x100h", "servizio_montaggio_smontaggio",
                                   "servizio_certificazioni", "servizio_istruzioni_assistenza", "extra_perc_complex",
                                   "extra_stand_complesso", "costo_retroilluminazione", "accessori_stand_config",
                                   "borsa_espositori", "premontaggio", "marginalita_struttura", "marginalita_grafica",
                                   "marginalita_retroilluminazione", "marginalita_accessori",
                                   "marginalita_premontaggio", "marginalita_struttura_storage",
                                   "marginalita_grafica_storage", "marginalita_premontaggio_storage",
                                   "marginalita_struttura_desk", "marginalita_grafica_desk",
                                   "marginalita_premontaggio_desk", "marginalita_accessori_desk",
                                   "marginalita_struttura_espositori", "marginalita_grafica_espositori",
                                   "marginalita_premontaggio_espositori", "marginalita_accessori_espositori",
                                   "totale_preventivo", "totale_costi")
VALUES ('20bf2fbb-056d-4437-a41f-0452e39fcf1b', '0cc24fed-e4f9-42d7-8fda-3d3b987f419a',
        '682e4fdc-b58f-4269-86ac-8e1033fdb5e0', '001', 'Primo Preventivo', '', '1.00', '3.00', '3672000.00',
        '99999999.99', '0.00', 'accettato', null, '', '2025-09-27 16:48:16.769985+00', '2025-10-02 17:25:10.597038+00',
        '1', '1_lato', '1', 'normale', '6', '1', '6', '207', '117', '43.2', '367.2', '367.2', '0.00', '1.00', '1', '1',
        '3', '0', '0', '0',
        '[{"layout":"50","quantity":1},{"layout":"100","quantity":0},{"layout":"150","quantity":0},{"layout":"200","quantity":0}]',
        '0', '0', '0', '0', '0', '1', '12', '2', '2', '0', '0', '{}', '{}', '0', '0', '0', '0', '0', '0', '0', '0', '0',
        '0', '1', '0', '0', '12', '1.2', '0', '0', '1', '0', '0', '0', '0', '0', '0', 'true', 'true', 'true', '10',
        '20.7', '0.00', '{"f31ebdf2-9611-4623-a1db-d53c61a89fd2":1}', '0', 'true', '50', '50', '50', '50', '51', '50',
        '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '4452.21', '2506.05'),
       ('21c32834-9a1c-4ad4-8712-7c00d446defd', '51f22dce-b83e-483d-a571-7863a6481ab6',
        '9cd6b085-43a3-4b63-b828-abb1e3e516f5', 'TDQ_131125_01', 'Noleggio parete monitor + desk ',
        'Noleggio_Parete autoportante T3 200x200x50 con supporto monitor + desk 100x100x50  ', '2.00', '2.50',
        '1651250.00', '66050000.00', '0.00', 'bozza', '2025-11-20', 'Stampa, labour e ripiani desk esclusi ',
        '2025-11-13 09:47:00.342634+00', '2025-11-13 09:47:00.342634+00', '2', '1_lato', '3', 'normale', '15', '2',
        '40', '368', '292.5', '0', '660.5', '660.5', '3.00', '0.00', '0', '0', '2.5', '0', '0', '0',
        '[{"layout":"50","quantity":0},{"layout":"100","quantity":1},{"layout":"150","quantity":0},{"layout":"200","quantity":0}]',
        '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '{}', '{}', '0', '0', '0', '0', '0', '0', '0', '0', '0',
        '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'false', 'false', 'false', '0', '0',
        '0.00', '{}', '0', 'true', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50',
        '50', '50', '1745.86', '1102.57'),
       ('3e478351-b941-4741-8c0b-91a1d0f3d31c', '51f22dce-b83e-483d-a571-7863a6481ab6',
        '80815f83-ad4f-471e-9aad-6d0496029cd3', 'TDQ_211125_01', 'Stand Shaily_Pharmapack_Parigi',
        'Stand Shaily_Pharmapack_Parigi_6x5_tre lati liberi ', '2.00', '3.00', '848700.00', '28290000.00', '0.00',
        'bozza', null, '', '2025-11-21 09:45:14.412072+00', '2025-11-21 10:04:37.964143+00', '5', '1_lato', '4', 'alta',
        '9', '2', '36', '414', '175.5', '259.2', '848.7', '848.7', '0.00', '0.00', '3', '1.5', '3', '1', '1', '0',
        '[{"layout":"50","quantity":0},{"layout":"100","quantity":0},{"layout":"150","quantity":0},{"layout":"200","quantity":0}]',
        '0', '0', '0', '0', '0', '0', '29', '9', '36', '0', '0', '{}', '{}', '0', '0', '0', '0', '0', '0', '0', '0',
        '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'true', 'false', 'false', '0',
        '0', '0.00', '{}', '0', 'true', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50',
        '50', '50', '50', '9342.15', '6228.1'),
       ('510ea226-29ea-4e03-906f-7d728e4a7f5e', '51f22dce-b83e-483d-a571-7863a6481ab6',
        'cc700fe4-0528-46d0-a5c8-08104645cedc', 'TDQ_011225_00', 'Stand Maximova ',
        'Stand T3 Cliente Maximova. Cosmoprof 2026 (26-29 Marzo). Area 8x4 due lati aperti. Rivestimento in Dibond. ',
        '8.00', '3.00', '1501031.25', '50034375.00', '0.00', 'bozza', null, '', '2025-12-01 08:49:12.854614+00',
        '2025-12-01 08:53:56.666854+00', '4', '2_lati', '3', 'alta', '51', '12', '184', '2484', '994.5', '1324.8',
        '4803.3', '4803.3', '4.00', '4.00', '3', '2', '4', '1', '1', '0',
        '[{"layout":"50","quantity":0},{"layout":"100","quantity":0},{"layout":"150","quantity":0},{"layout":"200","quantity":0}]',
        '0', '0', '0', '0', '0', '0', '42', '10', '30', '0', '0', '{}', '{}', '0', '0', '0', '0', '0', '0', '0', '0',
        '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'false', 'false', 'true', '10',
        '248.4', '0.00',
        '{"f2e76942-a780-4841-acdb-7851f0004a3d":2,"dd2c05d1-0461-4437-8193-8ce7c1a69994":4,"b2c4f2e6-74ae-47ae-a550-723e3a105411":1,"52de1077-8664-400b-883f-d54d40b1b985":8,"397d0b79-307a-433a-ac5a-de71c8171e08":1,"9625fe9a-29cc-46c8-8254-683c55829e85":0}',
        '0', 'true', '50', '50', '50', '50', '50', '60', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50',
        '17811.1', '11383.47'),
       ('874203f9-a80e-484d-bfa8-0ccd70f06421', '0cc24fed-e4f9-42d7-8fda-3d3b987f419a',
        '78391b70-6186-47c0-b5fa-0046f3f39f5a', '002', 'Secondo Preventivo', '', '2.00', '3.00', '3521250.00',
        '99999999.99', '0.00', 'inviato', null, '', '2025-09-28 17:27:26.999832+00', '2025-09-28 18:25:19.82997+00',
        '2', '2_lati', '2', 'normale', '15', '4', '40', '828', '292.5', '288', '1408.5', '1408.5', '0.00', '0.00', '0',
        '0', '2.5', '0', '0', '0',
        '[{"layout":"50","quantity":0},{"layout":"100","quantity":0},{"layout":"150","quantity":0},{"layout":"200","quantity":0}]',
        '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '{}', '{}', '0', '0', '0', '0', '0', '0', '0', '0', '0',
        '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'false', 'false', 'false', '0', '0',
        '0.00', '{}', '0', 'true', '70', '70', '70', '70', '70', '70', '70', '70', '70', '70', '70', '70', '70', '70',
        '70', '70', '2394.45', '1408.5'),
       ('882b8a3e-8aea-4211-8758-4feb9fb37dcc', '51f22dce-b83e-483d-a571-7863a6481ab6',
        '96efa20d-825b-4a5c-ab71-1e7c2ceab3bd', 'TDQ_041225_001', 'Stand Italo ',
        'Stand 12x4 H 4.5 con sgabuzzino due lati aperti ', '4.00', '4.00', '1267083.33', '31677083.33', '0.00',
        'bozza', null, '', '2025-12-04 13:50:20.717611+00', '2025-12-12 09:17:27.751263+00', '12', '2_lati', '3',
        'normale', '76', '16', '232', '4600', '1482', '0', '6082', '6082', '2.00', '2.00', '2', '2', '4', '2', '1', '0',
        '[{"layout":"50","quantity":0},{"layout":"100","quantity":0},{"layout":"150","quantity":2},{"layout":"200","quantity":0}]',
        '0', '0', '0', '0', '0', '0', '18', '5', '15', '0', '0', '{}', '{}', '0', '0', '0', '0', '0', '0', '0', '0',
        '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'true', 'false', 'false', '0',
        '0', '0.00', '{"52de1077-8664-400b-883f-d54d40b1b985":10,"397d0b79-307a-433a-ac5a-de71c8171e08":2}', '0',
        'false', '70', '70', '70', '70', '70', '70', '70', '70', '70', '70', '70', '70', '70', '70', '70', '70',
        '19387.89', '11404.64'),
       ('b2ba1fb6-c483-4ded-b4d5-6441fec2a40b', '51f22dce-b83e-483d-a571-7863a6481ab6',
        '9cd6b085-43a3-4b63-b828-abb1e3e516f5', 'TDQ_251125_01', 'Isola promozionale DGA Serramenti ',
        'Isola promozionale per centri commerciali area 3x3 quattro lati liberi con torre centrale 100x100 con monitor e due desk 200x50x100 ',
        '2.00', '2.50', '1529375.00', '61175000.00', '0.00', 'bozza', null, '', '2025-11-25 13:31:49.689282+00',
        '2025-11-25 13:31:49.689282+00', '2', '1_lato', '3', 'normale', '12.5', '2', '36', '368', '243.75', '0',
        '611.75', '611.75', '2.00', '0.00', '0', '0', '2.5', '0', '0', '0',
        '[{"layout":"50","quantity":0},{"layout":"100","quantity":0},{"layout":"150","quantity":0},{"layout":"200","quantity":1}]',
        '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '{}', '{}', '0', '0', '0', '0', '0', '0', '0', '0', '0',
        '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'false', 'false', 'false', '0', '0',
        '0.00', '{}', '0', 'true', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50',
        '50', '50', '1843.88', '1229.25'),
       ('b7833c92-4790-4710-bf9e-e9ca1f0eb5e9', '51f22dce-b83e-483d-a571-7863a6481ab6',
        '9cd6b085-43a3-4b63-b828-abb1e3e516f5', 'TDQ_181225_02', 'Stand 3x3 Terme Preistoriche ',
        'Stand 3x3 due lati aperti con storage 1x1 con porta apertura verso l''esterno ', '3.00', '2.50', '1605833.33',
        '64233333.33', '0.00', 'bozza', null, '', '2025-12-18 14:26:16.359411+00', '2025-12-18 14:26:16.359411+00', '3',
        '2_lati', '3', 'normale', '17.5', '6', '84', '1104', '341.25', '0', '1445.25', '1445.25', '0.00', '0.00', '1',
        '1', '2.5', '2', '1', '0',
        '[{"layout":"50","quantity":0},{"layout":"100","quantity":1},{"layout":"150","quantity":0},{"layout":"200","quantity":0}]',
        '0', '0', '0', '0', '0', '0', '7', '3', '9', '0', '0', '{}', '{}', '0', '0', '0', '0', '0', '0', '0', '0', '0',
        '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'false', 'false', 'true', '0', '0',
        '0.00', '{}', '0', 'true', '60', '50', '50', '50', '50', '60', '50', '50', '60', '50', '50', '50', '50', '50',
        '50', '50', '6701.57', '4179.55'),
       ('b8d3e5b3-1312-42b0-bd1a-4f702214b6ae', '51f22dce-b83e-483d-a571-7863a6481ab6',
        '9cd6b085-43a3-4b63-b828-abb1e3e516f5', 'TDQ_241125_02', 'Stand Cinelli E-Labtech',
        'Parete di fondo 8x0.5x2.5 Storage 4x0.5x2.5 ', '8.00', '4.00', '566562.50', '14164062.50', '0.00', 'bozza',
        null, '', '2025-11-24 15:43:02.491118+00', '2025-11-24 15:43:02.491118+00', '8', '1_lato', '2', 'normale', '68',
        '8', '104', '2300', '1326', '0', '3626', '3626', '8.00', '0.00', '4', '2', '2.5', '1', '1', '0',
        '[{"layout":"50","quantity":0},{"layout":"100","quantity":0},{"layout":"150","quantity":0},{"layout":"200","quantity":0}]',
        '0', '0', '0', '0', '0', '0', '32', '12', '24', '0', '0', '{}', '{}', '0', '0', '0', '0', '0', '0', '0', '0',
        '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'false', 'false', 'false', '0',
        '0', '0.00', '{}', '0', 'true', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50',
        '50', '50', '50', '11607.75', '7738.5'),
       ('c9eb8869-f95a-4087-92f7-774f57efdc23', '0cc24fed-e4f9-42d7-8fda-3d3b987f419a',
        '3913c9e1-0cbc-4683-a96b-da15f26cd64b', '003', 'Terzo Preventivo', '', '1.50', '3.00', '3325714.29',
        '99999999.99', '0.00', 'bozza', null, '', '2025-09-28 17:37:49.909747+00', '2025-09-28 18:25:59.043194+00',
        '3.5', '2_lati', '2', 'normale', '18', '5', '50', '1035', '351', '360', '1746', '1746', '0.00', '0.00', '0',
        '0', '2.5', '0', '0', '0',
        '[{"layout":"50","quantity":0},{"layout":"100","quantity":0},{"layout":"150","quantity":0},{"layout":"200","quantity":0}]',
        '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '{}', '{}', '0', '0', '0', '0', '0', '0', '0', '0', '0',
        '0', '0', '1', '0', '12', '2', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'false', 'false', 'false', '0', '0',
        '0.00', '{}', '0', 'true', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50',
        '50', '50', '3141.6', '2094.4'),
       ('f12b33dd-eccb-45c2-8691-871c455caf60', '51f22dce-b83e-483d-a571-7863a6481ab6',
        '9cd6b085-43a3-4b63-b828-abb1e3e516f5', 'TDQ_111125_01', 'Struttura Stand Acquaviva ',
        'Area 6x5, stand tre lati liberi, altezza parete 3.5 mt, storage 2x2 con porta H 3 mt. , desk 100x50x100 ',
        '6.00', '3.50', '653750.00', '18678571.43', '0.00', 'bozza', '2025-11-28', '', '2025-11-11 16:11:31.156462+00',
        '2025-11-11 16:40:27.451461+00', '5', '1_lato', '3', 'normale', '24.5', '6', '84', '1483.5', '477.75', '0',
        '1961.25', '1961.25', '0.00', '0.00', '2', '2', '3', '1', '1', '0',
        '[{"layout":"50","quantity":0},{"layout":"100","quantity":1},{"layout":"150","quantity":0},{"layout":"200","quantity":0}]',
        '0', '0', '0', '0', '0', '0', '26', '8', '24', '0', '0', '{}', '{}', '0', '0', '0', '0', '0', '0', '0', '0',
        '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'true', 'false', 'false', '10',
        '148.35', '0.00',
        '{"52de1077-8664-400b-883f-d54d40b1b985":5,"9625fe9a-29cc-46c8-8254-683c55829e85":0,"b2c4f2e6-74ae-47ae-a550-723e3a105411":1,"397d0b79-307a-433a-ac5a-de71c8171e08":1}',
        '0', 'false', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50',
        '12351.53', '8554.12');


INSERT INTO "public"."parametri_a_costi_unitari" ("id", "parametro", "unita_misura", "valore", "attivo", "created_at",
                                                  "updated_at")
VALUES ('3030d428-4f07-4b39-ac43-054b9a0522ee', 'Costo alloggio', '€/notte', '50', 'true',
        '2025-09-13 18:09:30.802733+00', '2025-09-13 18:09:30.802733+00'),
       ('356d54cf-83f6-44e9-b82a-2feddf9f3741', 'Costo_istruzionieassistenza', '€', '200', 'true',
        '2025-09-15 17:53:37.899686+00', '2025-09-15 17:53:37.899686+00'),
       ('3d602cc6-e211-4e1c-bf52-e50a4662ed14', 'Costo Stampa Grafica', '€/mq', '19.5', 'true',
        '2025-09-12 16:12:40.090504+00', '2025-09-12 16:12:40.090504+00'),
       ('451ae3eb-f61d-457e-adff-82dd4cca219d', 'Costo_certificazione', '€', '500', 'true',
        '2025-09-15 17:53:37.899686+00', '2025-09-15 18:08:59.264005+00'),
       ('46b5ec36-10f2-49c9-ad37-ce93e0d0bb61', 'Costo furgone al km', '€/km', '1', 'true',
        '2025-09-14 09:13:19.250906+00', '2025-09-14 09:13:19.250906+00'),
       ('55f2950d-9454-45b9-a310-e875782ca1bf', 'Costo montatori xkm', '€/km', '1.30', 'true',
        '2025-09-13 18:09:30.802733+00', '2025-09-14 08:59:25.643826+00'),
       ('68fad896-507b-482b-a0d9-398996c9e002', 'Costo fisso consegna', '€', '1500', 'true',
        '2025-09-13 18:09:30.802733+00', '2025-09-15 17:58:56.271255+00'),
       ('90bfa7cd-8661-4fcf-802b-cf977cdf0605', 'Costo auto al km', '€/km', '0.3', 'true',
        '2025-09-13 18:09:30.802733+00', '2025-09-14 08:47:15.357709+00'),
       ('99f51f19-90d7-47ff-9df8-9f4430209601', 'Costo pasto', '€/pasto', '25', 'true', '2025-09-13 18:09:30.802733+00',
        '2025-09-13 18:09:30.802733+00'),
       ('b45e602c-47f6-4035-abb2-c3406c873915', 'Costo TIR al km', '€/km', '2', 'true', '2025-09-14 09:13:19.250906+00',
        '2025-09-14 09:13:19.250906+00'),
       ('e6eb4279-8341-4ece-8aee-68c146959809', 'Costo treno al km', '€/km', '0.15', 'true',
        '2025-09-13 18:09:30.802733+00', '2025-09-13 18:09:30.802733+00'),
       ('febf22ae-de2f-443a-87dc-66d6facf5cc8', 'Costo Premontaggio', '€/pz', '7.2', 'true',
        '2025-09-12 16:12:40.090504+00', '2025-09-12 16:24:07.361873+00');

INSERT INTO "public"."preventivi_servizi" ("id", "preventivo_id", "created_at", "updated_at", "montaggio_smontaggio",
                                           "certificazioni", "istruzioni_assistenza", "personale_mont",
                                           "costo_orario_mont", "giorni_montaggio", "ore_lavoro_cantxper_mont",
                                           "km_ar_mont", "conseg_cant", "volo_mont", "treno_mont",
                                           "ore_viaggio_trasferta_mont", "viaggio_auto_com_mont",
                                           "extra_costi_trasferta_mont", "extra_km_trasp_furg_mont",
                                           "extra_km_trasp_tir_mont", "ricarico_montaggio", "tot_cost_ore_mont",
                                           "tot_cost_km_mont", "num_vitti", "num_alloggi", "tot_cost_vittall",
                                           "tot_costo_volo_ar", "tot_costo_treno", "tot_costo_trasf_pers",
                                           "tot_costi_auto", "tot_costi_extra_trasf_mont",
                                           "tot_costi_extra_km_trasp_furg_mont", "tot_costi_extra_km_trasp_tir_mont",
                                           "tot_costi_consegna_cantiere", "totale_costo_montaggio",
                                           "preventivo_montaggio", "personale_smon", "costo_orario_smon",
                                           "giorni_smontaggio_viaggio", "ore_lavoro_cantxper_smon", "km_ar_smon",
                                           "volo_smon", "treno_smon", "ore_viaggio_trasferta_smon",
                                           "viaggio_auto_com_smon", "extra_costi_trasferta_smon",
                                           "extra_km_trasp_furg_smon", "extra_km_trasp_tir_smon", "tot_cost_ore_smon",
                                           "tot_cost_km_smon", "num_vitti_smon", "num_alloggi_smon",
                                           "tot_cost_vittall_smon", "tot_costo_volo_ar_smon", "tot_costo_treno_smon",
                                           "tot_costo_trasf_pers_smon", "tot_costi_auto_smon",
                                           "tot_costi_extra_trasf_smon", "tot_costi_extra_km_trasp_furg_smon",
                                           "tot_costi_extra_km_trasp_tir_smon", "totale_costo_smontaggio",
                                           "preventivo_smontaggio")
VALUES ('47b66e40-92fb-4cb8-b1b2-2c73239fc1bd', '882b8a3e-8aea-4211-8758-4feb9fb37dcc', '2025-12-04 13:57:36.406577+00',
        '2025-12-12 09:17:27.34085+00', 'true', 'false', 'false', '2', '25', '2', '10', '300', 'false', 'NO', 'false',
        '0', 'false', 'Basso', '0', '0', '30', '1000', '390', '8', '2', '300', '0', '0', '0', '0', '80', '0', '0', '0',
        '1770', '2301', '2', '25', '1', '6', '300', 'NO', 'false', '0', 'false', 'NO', '0', '0', '300', '390', '4', '0',
        '100', '0', '0', '0', '0', '0', '0', '0', '790', '1027'),
       ('7e01198b-69e9-413f-bbd6-daf7c185f4e5', 'f12b33dd-eccb-45c2-8691-871c455caf60', '2025-11-11 16:19:25.308852+00',
        '2025-11-11 16:19:25.308852+00', 'true', 'false', 'false', '2', '30', '2', '8', '500', 'false', 'NO', 'false',
        '0', 'false', 'Medio', '0', '0', '30', '960', '650', '8', '2', '300', '0', '0', '0', '0', '120', '0', '0', '0',
        '2030', '2639', '2', '30', '1', '6', '500', 'NO', 'false', '0', 'false', 'NO', '0', '0', '360', '650', '4', '0',
        '100', '0', '0', '0', '0', '0', '0', '0', '1110', '1443'),
       ('bfce2914-2481-4c76-aaac-e8eb6c9f29a2', '20bf2fbb-056d-4437-a41f-0452e39fcf1b', '2025-09-27 17:45:27.110535+00',
        '2025-09-27 17:45:27.110535+00', 'true', 'false', 'false', '1', '20', '1', '1', '0', 'false', 'NO', 'false',
        '0', 'false', 'NO', '0', '0', '30', '20', '0', '2', '0', '50', '0', '0', '0', '0', '0', '0', '0', '0', '70',
        '91', '1', '20', '1', '1', '0', 'NO', 'false', '0', 'false', 'NO', '0', '0', '20', '0', '2', '0', '50', '0',
        '0', '0', '0', '0', '0', '0', '70', '91'),
       ('d0ec4578-0bf5-40a7-8170-1511f90229b4', '3e478351-b941-4741-8c0b-91a1d0f3d31c', '2025-11-21 10:04:37.586406+00',
        '2025-11-21 10:04:37.586406+00', 'true', 'false', 'false', '1', '30', '4', '10', '2500', 'false', 'NO', 'false',
        '0', 'false', 'NO', '0', '0', '30', '1200', '3250', '8', '3', '350', '0', '0', '0', '0', '0', '0', '0', '0',
        '4800', '6240', '0', '20', '0', '0', '0', 'NO', 'false', '0', 'false', 'NO', '0', '0', '0', '0', '0', '0', '0',
        '0', '0', '0', '0', '0', '0', '0', '0', '0');

INSERT INTO "public"."parametri" ("id", "tipo", "nome", "valore", "valore_testo", "descrizione", "attivo", "created_at",
                                  "updated_at", "valore_chiave", "ordine")
VALUES ('0489f8d0-f5e8-47b9-999c-9466b3a35d7f', 'costo_mc', 'Costo premium volume', '35.00', null,
        'Costo premium per volume', 'true', '2025-08-21 15:07:07.969048+00', '2025-08-21 15:07:07.969048+00', null,
        '0'),
       ('0af8f954-9c00-489b-9ff8-fc801eaa5613', 'costo_mq', 'Costo al metro quadro standard', '50.00', null,
        'Costo base per metro quadro', 'true', '2025-08-21 15:07:07.969048+00', '2025-08-21 15:07:07.969048+00', null,
        '0'),
       ('12471bdd-42ff-4490-88bf-e9ce399cabe7', 'costo_altezza', '3', '207.00', null,
        'Costo per metro lineare per altezza 3m', 'true', '2025-08-05 14:20:17.328234+00',
        '2025-08-05 14:40:25.704175+00', '3', '0'),
       ('13cc57c8-807f-43bb-a6b5-eccabc6cf98b', 'costo_stampa', 'Costo stampa grafica al metro quadro', '0.00', null,
        'Costo per la stampa grafica per metro quadro', 'true', '2025-08-05 14:20:17.328234+00',
        '2025-09-12 16:20:00.426738+00', 'costo_stampa_mq', '0'),
       ('2883ac4d-04a5-462c-bf9d-4e19d5a9ba15', 'costo_mc', 'Costo al metro cubo standard', '25.00', null,
        'Costo base per metro cubo', 'true', '2025-08-21 15:07:07.969048+00', '2025-08-21 15:07:07.969048+00', null,
        '0'),
       ('58e0f4e0-03f3-4e86-8415-1041039076aa', 'costo_altezza', '3.5', '247.25', null,
        'Costo per metro lineare per altezza 3.5m', 'true', '2025-08-05 14:20:17.328234+00',
        '2025-08-05 15:38:10.111829+00', '3.5', '0'),
       ('5c1f22de-dd4b-46e4-8905-58ced56ca173', 'profili_distribuzione', '4', '18.00', null,
        'Numero di profili per distribuzione 4', 'true', '2025-08-05 14:20:17.328234+00',
        '2025-08-05 14:40:25.704175+00', '4', '0'),
       ('7f7f337e-8d7e-4546-9f32-bc1c1844773b', 'costo_mq', 'Costo premium', '75.00', null,
        'Costo premium per lavori speciali', 'true', '2025-08-21 15:07:07.969048+00', '2025-08-21 15:07:07.969048+00',
        null, '0'),
       ('84c73cad-a2e5-4d79-bbb1-1f9fd1b92c4b', 'costo_altezza', '2.5', '184.00', null,
        'Costo per metro lineare per altezza 2.5m', 'true', '2025-08-05 14:20:17.328234+00',
        '2025-08-05 14:40:25.704175+00', '2.5', '0'),
       ('8c9f5320-4b3a-47ce-9e23-5e1888a3134f', 'profili_distribuzione', '1', '6.00', null,
        'Numero di profili per distribuzione 1', 'true', '2025-08-05 14:20:17.328234+00',
        '2025-08-12 11:14:38.097379+00', '1', '0'),
       ('8e1c0e40-eb07-4e61-a776-74328f3a4de6', 'costo_premontaggio', 'Costo Premontaggio al pezzo', '0.00', null,
        'Costo per il premontaggio di ogni pezzo', 'true', '2025-08-05 14:20:17.328234+00',
        '2025-09-12 16:20:16.943239+00', 'costo_premontaggio_pezzo', '0'),
       ('af4bf64b-8248-427a-82cd-63ec6124979a', 'profili_distribuzione', '3', '14.00', null,
        'Numero di profili per distribuzione 3', 'true', '2025-08-05 14:20:17.328234+00',
        '2025-08-05 14:40:25.704175+00', '3', '0'),
       ('de81c4f1-c851-455b-bede-0ec6f192f4f7', 'profili_distribuzione', '2', '10.00', null,
        'Numero di profili per distribuzione 2', 'true', '2025-08-05 14:20:17.328234+00',
        '2025-08-05 14:40:25.704175+00', '2', '0'),
       ('e4dcbebd-f5c2-403c-af5a-a7b26f34ec5a', 'costo_altezza', '4', '287.50', null,
        'Costo per metro lineare per altezza 4m', 'true', '2025-08-05 14:20:17.328234+00',
        '2025-08-05 14:40:25.704175+00', '4', '0'),
       ('f23af6c7-78c6-4e46-9ee5-3a471d3a8027', 'altezza_standard', 'Altezza standard', '2.70', null,
        'Altezza standard per i calcoli', 'true', '2025-08-21 15:07:07.969048+00', '2025-08-21 15:07:07.969048+00',
        null, '0');

INSERT INTO "public"."marginalita_per_prospect" ("id", "tipo_prospect", "marginalita", "attivo", "created_at",
                                                 "updated_at")
VALUES ('3cd511e2-f6c8-4d64-9dc0-92288d6b6bd1', 'Professional', '50', 'true', '2025-09-16 16:40:39.177934+00',
        '2025-09-16 16:40:39.177934+00'),
       ('ab7f61d2-ada2-47ff-96a6-dbaa5253ed91', 'Finale', '70', 'true', '2025-09-16 16:40:39.177934+00',
        '2025-09-16 16:40:39.177934+00');

INSERT INTO "public"."listino_accessori_stand" ("id", "nome", "costo_unitario", "attivo", "created_at", "updated_at")
VALUES ('123dfff2-ce0f-4c52-a7a0-d0ec6e7a1a67', 'Kit Faro 50 W', '65.5', 'true', '2025-08-29 08:21:15.2301+00',
        '2025-08-29 08:39:05.904285+00'),
       ('235b98db-159e-42ba-a098-d99944b23f0b', 'Spot light', '48', 'true', '2025-08-29 08:21:15.2301+00',
        '2025-08-29 08:39:44.603679+00'),
       ('35c71398-9f09-4793-81dc-f685a34a7103', 'Borsa', '31', 'true', '2025-08-29 08:21:15.2301+00',
        '2025-08-29 08:36:34.804783+00'),
       ('397d0b79-307a-433a-ac5a-de71c8171e08', 'Staffa monitor', '66.67', 'true', '2025-08-29 08:21:15.2301+00',
        '2025-08-29 08:39:53.112521+00'),
       ('52de1077-8664-400b-883f-d54d40b1b985', 'Kit Faro 100 W', '76', 'true', '2025-08-29 08:21:15.2301+00',
        '2025-08-29 08:38:57.761429+00'),
       ('9625fe9a-29cc-46c8-8254-683c55829e85', 'Porta', '416.5', 'true', '2025-08-29 08:21:15.2301+00',
        '2025-08-29 08:39:29.908724+00'),
       ('b2c4f2e6-74ae-47ae-a550-723e3a105411', 'Quadro elettrico 16A', '245', 'true', '2025-08-29 08:21:15.2301+00',
        '2025-08-29 08:39:37.499755+00'),
       ('dd2c05d1-0461-4437-8193-8ce7c1a69994', 'Mensola', '75', 'true', '2025-08-29 08:21:15.2301+00',
        '2025-08-29 08:39:14.023199+00'),
       ('f2e76942-a780-4841-acdb-7851f0004a3d', 'Nicchia', '125.25', 'true', '2025-08-29 08:21:15.2301+00',
        '2025-08-29 08:39:22.705478+00'),
       ('f31ebdf2-9611-4623-a1db-d53c61a89fd2', 'Baule trolley', '100.00', 'true', '2025-08-29 08:21:15.2301+00',
        '2025-09-04 19:39:42.902693+00');

INSERT INTO "public"."listino_accessori_espositori" ("id", "nome", "costo_unitario", "attivo", "created_at", "updated_at")
VALUES ('096c32c1-4318-4067-9d98-b2d90f7844d4', 'Ripiano 100x50', '40.00', 'true', '2025-08-31 18:46:59.256871+00',
        '2025-08-31 18:46:59.256871+00'),
       ('09e6dfcf-919c-40a0-acef-557a000ab7db', 'Ripiano 30x30', '15.00', 'true', '2025-08-31 18:46:59.256871+00',
        '2025-08-31 18:46:59.256871+00'),
       ('2e294405-229b-4368-b2e5-fff1df124e91', 'Retroilluminazione 50x50x100 H', '132.00', 'true',
        '2025-08-31 18:46:59.256871+00', '2025-08-31 18:46:59.256871+00'),
       ('32090e1a-fb45-4032-914d-0b82e3912666', 'Borsa', '190', 'true', '2025-08-31 18:46:59.256871+00',
        '2025-09-01 10:25:51.71231+00'),
       ('5bb45429-c1db-4989-8dd1-899370d096f9', 'Retroilluminazione 30x30x100 H', '90.00', 'true',
        '2025-08-31 18:46:59.256871+00', '2025-08-31 18:46:59.256871+00'),
       ('5e4462c9-6717-4dbb-b7c4-d92c2df58473', 'Retroilluminazione 100x50x100 H', '130.00', 'true',
        '2025-08-31 18:46:59.256871+00', '2025-08-31 18:46:59.256871+00'),
       ('66ecbb25-4f49-4717-98f0-59986265971d', 'Ripiano 50x50', '25.00', 'true', '2025-08-31 18:46:59.256871+00',
        '2025-08-31 18:46:59.256871+00'),
       ('6ff7643f-c7f0-49c8-8151-04961f7cb672', 'Teca in plexiglass 50x50x50', '100.00', 'true',
        '2025-08-31 18:46:59.256871+00', '2025-08-31 18:46:59.256871+00'),
       ('775a9b62-86bc-41c1-af93-7a2c2b4374f1', 'Teca in plexiglass 30x30x30', '75.00', 'true',
        '2025-08-31 18:46:59.256871+00', '2025-08-31 18:46:59.256871+00'),
       ('97af94c6-005c-4648-8175-8ffe98760d08', 'Teca in plexiglass 100x50x30', '130.00', 'true',
        '2025-08-31 18:46:59.256871+00', '2025-08-31 18:46:59.256871+00');

INSERT INTO "public"."listino_accessori_desk" ("id", "nome", "costo_unitario", "attivo", "created_at", "updated_at")
VALUES ('2570b81d-27c7-4150-8b9d-f53581234279', 'Fronte luminoso dim. 100x100', '305', 'true',
        '2025-08-29 10:18:16.869169+00', '2025-08-30 06:02:35.890625+00'),
       ('4d57416c-5f40-4aad-9d77-dcc037f83c1f', 'Ripiano Superiore L 100', '40', 'true',
        '2025-08-29 10:18:16.869169+00', '2025-08-30 06:03:05.745865+00'),
       ('55ed4aea-cc02-41b4-8ef7-f00decd6cf0b', 'Borsa', '31', 'true', '2025-08-29 10:18:16.869169+00',
        '2025-08-30 06:02:11.178672+00'),
       ('57745bef-479a-43a0-bebc-cf96482dda37', 'Ripiano Inferiore L 100', '40', 'true',
        '2025-08-29 10:18:16.869169+00', '2025-08-30 06:02:59.160886+00'),
       ('ce79111a-f558-4391-bc5b-dc0fd68cdc7c', 'Porta scorrevole con chiave', '65', 'true',
        '2025-08-29 10:18:16.869169+00', '2025-08-30 06:02:48.354046+00'),
       ('e14473d7-0e79-4e3a-a9b9-f6f51a1e75c1', 'Teca in plexiglass', '130', 'true', '2025-08-29 10:18:16.869169+00',
        '2025-08-30 06:03:15.328989+00');

INSERT INTO "public"."costi_volo_ar" ("id", "tipologia", "costo_volo_ar", "attivo", "created_at", "updated_at")
VALUES ('06d2d84c-fb25-4fa7-8388-3b39356d605c', 'Last minute', '240', 'true', '2025-09-13 18:09:30.802733+00',
        '2025-09-13 18:09:30.802733+00'),
       ('d1eb04ef-958c-4558-90a5-68ba112c0344', 'Low cost', '120', 'true', '2025-09-13 18:09:30.802733+00',
        '2025-09-13 18:09:30.802733+00'),
       ('dc4fb333-98af-44c5-bcc1-1c46a9ae4399', 'Standard', '360', 'true', '2025-09-13 18:09:30.802733+00',
        '2025-09-13 18:09:30.802733+00');

INSERT INTO "public"."costi_struttura_espositori_layout" ("id", "layout_espositore", "costo_unitario", "attivo",
                                                          "created_at", "updated_at")
VALUES ('2c17fb52-1322-4ebb-9217-75c1c706989a', '100', '252', 'true', '2025-09-02 16:23:06.457011+00',
        '2025-09-04 19:36:55.829364+00'),
       ('7e060e38-647f-4801-ad88-a52fdea03412', '50', '223.00', 'true', '2025-09-02 16:23:06.457011+00',
        '2025-09-02 16:23:06.457011+00'),
       ('c1346203-cc0d-419c-ac82-a21c3f8c22fc', '30', '193.00', 'true', '2025-09-02 16:23:06.457011+00',
        '2025-09-02 16:23:06.457011+00');

INSERT INTO "public"."costi_struttura_desk_layout" ("id", "layout_desk", "costo_unitario", "attivo", "created_at",
                                                    "updated_at")
VALUES ('44b189b7-764e-41d8-af90-2b1660d6a323', '200', '415', 'true', '2025-08-30 05:59:59.150899+00',
        '2025-09-11 19:43:58.864015+00'),
       ('6ff8f157-9ac5-41a2-8db6-ddd167499909', '50', '225', 'true', '2025-08-30 05:59:01.470303+00',
        '2025-09-11 19:44:17.180953+00'),
       ('9c2ed9c7-1dd8-45c5-afcf-54e3a516e8d6', '150', '275', 'true', '2025-08-30 05:59:49.358738+00',
        '2025-09-11 19:44:04.6393+00'),
       ('d99cc8b6-d2ba-40f4-8960-8133d7f7ee2a', '100', '250', 'true', '2025-08-30 05:59:35.309961+00',
        '2025-09-11 19:44:10.789152+00');

INSERT INTO "public"."costi_retroilluminazione" ("id", "altezza", "costo_al_metro", "created_at", "updated_at")
VALUES ('7c04b6b2-f7f8-4bd6-b46c-b7cf6cde01ec', '2.5', '270.00', '2025-08-27 10:22:33.720166+00',
        '2025-08-29 07:25:20.191191+00'),
       ('aba84d72-2788-46d7-ac9c-bd0292f940c2', '4.0', '450.00', '2025-08-27 09:49:49.66248+00',
        '2025-08-29 07:26:37.18738+00'),
       ('b8a05d86-ca46-4ffd-b6bf-05f5337f07b8', '3.0', '300.00', '2025-08-27 09:49:49.66248+00',
        '2025-08-29 07:25:49.489372+00'),
       ('ef770086-5630-4b46-ab9a-5ddf5c4c1d93', '3.5', '380.00', '2025-08-27 10:23:12.389809+00',
        '2025-08-29 07:26:15.624792+00');

INSERT INTO "public"."costi_extra_trasf_mont" ("id", "livello", "costo_extra_mont", "attivo", "created_at",
                                               "updated_at")
VALUES ('4f1dbd7f-fcd9-4fc6-a861-8e697a75c241', 'Medio', '30', 'true', '2025-09-13 18:09:30.802733+00',
        '2025-09-13 18:09:30.802733+00'),
       ('8b0f3596-bbca-4676-82a4-437bd831e1ec', 'Alto', '40', 'true', '2025-09-13 18:09:30.802733+00',
        '2025-09-13 18:09:30.802733+00'),
       ('947335ba-9609-4526-92f9-bcb2c81788df', 'Basso', '20', 'true', '2025-09-13 18:09:30.802733+00',
        '2025-09-13 18:09:30.802733+00');

INSERT INTO "public"."condizioni_standard_fornitura" ("id", "voce", "testo_standard", "ordine", "attivo", "created_at",
                                                      "updated_at")
VALUES ('06b37dff-cca4-4fb2-8e95-7b8df506a8e0', 'Tempi di consegna', 'Inserisci testo', '3', 'true',
        '2025-09-21 17:43:43.933341+00', '2025-09-21 17:43:43.933341+00'),
       ('36dd0e4b-6cde-4182-b73b-2e513db46819', 'Resa', 'Inserisci testo', '5', 'true', '2025-09-21 17:43:43.933341+00',
        '2025-09-21 17:43:43.933341+00'),
       ('404e4bb8-d910-4a27-817a-e9441aae95fa', 'Condizioni generali', 'Inserisci testo', '1', 'true',
        '2025-09-21 17:43:43.933341+00', '2025-09-21 17:43:43.933341+00'),
       ('7ba7bbcf-0494-45df-a5a6-ae2d84af58f8', 'Pagamenti', 'Pagamento 30 giorni dffm', '2', 'true',
        '2025-09-21 17:43:43.933341+00', '2025-09-21 18:08:10.058045+00'),
       ('b7187fef-8811-43f3-90f9-5dfd3f4a6d0b', 'Consegna', 'Inserisci testo', '4', 'true',
        '2025-09-21 17:43:43.933341+00', '2025-09-21 17:43:43.933341+00'),
       ('c9b894a8-9f30-4520-a348-05a9e8176873', 'Validità offerta', 'Inserisci testo', '6', 'true',
        '2025-09-21 17:43:43.933341+00', '2025-09-21 17:43:43.933341+00');

INSERT INTO "public"."condizioni_fornitura_preventivi" ("id", "preventivo_id", "voce", "testo", "selezionato", "ordine",
                                                        "created_at", "updated_at")
VALUES ('04c61100-701c-45c8-a39d-f183092bfb20', 'f12b33dd-eccb-45c2-8691-871c455caf60', 'Validità offerta', '30 gg ',
        'true', '6', '2025-11-11 16:20:48.721707+00', '2025-11-11 16:20:48.721707+00'),
       ('08043833-b5a0-48bf-86a7-f9317b0c59d4', '510ea226-29ea-4e03-906f-7d728e4a7f5e', 'Validità offerta',
        'Inserisci testo', 'true', '6', '2025-12-01 08:53:52.538696+00', '2025-12-01 08:53:52.538696+00'),
       ('1549d4a8-af5c-4298-a318-356d2d14fee2', 'f12b33dd-eccb-45c2-8691-871c455caf60', 'Pagamenti',
        'Pagamento 30 giorni dffm', 'true', '2', '2025-11-11 16:20:48.721707+00', '2025-11-11 16:20:48.721707+00'),
       ('1887a951-8fd3-4f5e-a661-2b03e9d9611a', '510ea226-29ea-4e03-906f-7d728e4a7f5e', 'Condizioni generali',
        'Inserisci testo', 'true', '1', '2025-12-01 08:53:52.538696+00', '2025-12-01 08:53:52.538696+00'),
       ('300c30a6-7e98-498d-a090-d718d5ac3249', 'f12b33dd-eccb-45c2-8691-871c455caf60', 'Condizioni generali',
        'Resa: franco fabbrica ', 'true', '1', '2025-11-11 16:20:48.721707+00', '2025-11-11 16:20:48.721707+00'),
       ('3cd38d2d-bbc7-42d7-8708-41aafab5a050', 'f12b33dd-eccb-45c2-8691-871c455caf60', 'Resa', 'Franco Fabbrica',
        'true', '5', '2025-11-11 16:20:48.721707+00', '2025-11-11 16:20:48.721707+00'),
       ('68109d38-ab71-4c5c-9494-9251b94fec3f', '510ea226-29ea-4e03-906f-7d728e4a7f5e', 'Tempi di consegna',
        'Inserisci testo', 'true', '3', '2025-12-01 08:53:52.538696+00', '2025-12-01 08:53:52.538696+00'),
       ('8a825ca3-ba89-4e12-9635-8f43b88487c1', 'f12b33dd-eccb-45c2-8691-871c455caf60', 'Consegna', 'Inserisci testo',
        'true', '4', '2025-11-11 16:20:48.721707+00', '2025-11-11 16:20:48.721707+00'),
       ('a4a8eaab-85c2-40f2-8511-2e1255d76791', '510ea226-29ea-4e03-906f-7d728e4a7f5e', 'Consegna', 'Inserisci testo',
        'true', '4', '2025-12-01 08:53:52.538696+00', '2025-12-01 08:53:52.538696+00'),
       ('b5322032-b117-4c45-a44d-8c5ecbaf4426', 'f12b33dd-eccb-45c2-8691-871c455caf60', 'Tempi di consegna',
        'Inserisci testo', 'true', '3', '2025-11-11 16:20:48.721707+00', '2025-11-11 16:20:48.721707+00'),
       ('d60c9b36-de63-41e6-82d4-5c6060351926', '510ea226-29ea-4e03-906f-7d728e4a7f5e', 'Resa', 'Inserisci testo',
        'true', '5', '2025-12-01 08:53:52.538696+00', '2025-12-01 08:53:52.538696+00'),
       ('d6539990-d86f-4a14-bc09-0dfa9fc2a9c0', '510ea226-29ea-4e03-906f-7d728e4a7f5e', 'Pagamenti',
        'Pagamento 30 giorni dffm', 'true', '2', '2025-12-01 08:53:52.538696+00', '2025-12-01 08:53:52.538696+00');

INSERT INTO "public"."altri_beni_servizi" ("id", "preventivo_id", "descrizione", "costo_unitario", "marginalita",
                                           "prezzo_unitario", "quantita", "totale", "created_at", "updated_at")
VALUES ('450124b9-8569-4253-811b-f87f01f4dc0f', '874203f9-a80e-484d-bfa8-0ccd70f06421', '', '10', '10', '11', '14',
        '154', '2025-11-16 19:33:00.26914+00', '2025-11-16 19:36:42.559873+00'),
       ('5e0a581a-24cc-411b-ba79-2df6f093ac46', '20bf2fbb-056d-4437-a41f-0452e39fcf1b', 'Altro servizio aggiunto', '50',
        '50', '75', '1', '75', '2025-09-27 17:39:30.660889+00', '2025-09-27 17:39:48.213656+00'),
       ('6f713b28-d002-49bc-b308-4a29ea18aa5d', 'f12b33dd-eccb-45c2-8691-871c455caf60', 'Tavolino rotondo ', '50', '50',
        '75', '1', '75', '2025-11-11 16:21:21.387542+00', '2025-11-11 16:21:52.344756+00'),
       ('9b275ced-4c67-4c7c-aa39-d0473f6c7f3a', 'f12b33dd-eccb-45c2-8691-871c455caf60', 'Ta', '0', '0', '0', '0', '0',
        '2025-11-11 16:21:21.420029+00', '2025-11-11 16:21:21.420029+00'),
       ('bcaa1d9d-d575-4b6b-b894-4164eb6d72d9', '20bf2fbb-056d-4437-a41f-0452e39fcf1b', 'Servizio aggiunto', '100',
        '50', '150', '1', '150', '2025-09-27 17:38:04.559606+00', '2025-09-27 17:40:54.979735+00');