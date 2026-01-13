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
CREATE TABLE public.preventivo (
                                   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                   user_id uuid NOT NULL,
                                   prospect_id uuid,
                                   numero_preventivo text NOT NULL,
                                   titolo text NOT NULL,
                                   descrizione text,

                                   larghezza numeric NOT NULL,
                                   altezza numeric NOT NULL,
                                   profondita numeric,

                                   layout text,
                                   distribuzione integer,
                                   complessita text,

                                   superficie_stampa numeric DEFAULT 0,
                                   sviluppo_lineare numeric DEFAULT 0,
                                   numero_pezzi numeric DEFAULT 0,

                                   costo_mq numeric DEFAULT 0,
                                   costo_mc numeric DEFAULT 0,
                                   costo_fisso numeric DEFAULT 0,
                                   costo_struttura numeric DEFAULT 0,
                                   costo_grafica numeric DEFAULT 0,
                                   costo_premontaggio numeric DEFAULT 0,
                                   costo_retroilluminazione numeric DEFAULT 0,

                                   totale numeric DEFAULT 0,
                                   totale_preventivo numeric DEFAULT 0,
                                   totale_costi numeric DEFAULT 0,

                                   status text NOT NULL DEFAULT 'bozza'
                                       CHECK (status IN ('bozza','inviato','accettato','rifiutato')),
                                   data_scadenza date,
                                   note text,

                                   premontaggio boolean DEFAULT true,

                                   espositori_config text DEFAULT '{}',
                                   complementi_config text DEFAULT '{}',
                                   accessori_stand_config text DEFAULT '{}',

                                   created_at timestamptz NOT NULL DEFAULT now(),
                                   updated_at timestamptz NOT NULL DEFAULT now(),

                                   CONSTRAINT preventivo_user_fk FOREIGN KEY (user_id)
                                       REFERENCES public.utente(id),
                                   CONSTRAINT preventivo_prospect_fk FOREIGN KEY (prospect_id)
                                       REFERENCES public.prospect(id)
);

CREATE INDEX idx_preventivo_user_id ON public.preventivo(user_id);
CREATE INDEX idx_preventivo_prospect_id ON public.preventivo(prospect_id);

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
