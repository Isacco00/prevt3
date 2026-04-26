ALTER TABLE preventivi_servizi
    ADD COLUMN IF NOT EXISTS sconto_montaggio            numeric default 0,
    ADD COLUMN IF NOT EXISTS totale_prezzo_listino_mont  numeric default 0,
    ADD COLUMN IF NOT EXISTS totale_prezzo_netto_mont    numeric default 0,
    ADD COLUMN IF NOT EXISTS margine_mont                numeric default 0,
    ADD COLUMN IF NOT EXISTS marginalita_mont            numeric default 0,
    ADD COLUMN IF NOT EXISTS totale_prezzo_listino_smon  numeric default 0,
    ADD COLUMN IF NOT EXISTS totale_prezzo_netto_smon    numeric default 0,
    ADD COLUMN IF NOT EXISTS margine_smon                numeric default 0,
    ADD COLUMN IF NOT EXISTS marginalita_smon            numeric default 0;
