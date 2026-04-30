-- Seed opzioni altezza
insert into parametri (id, tipo, nome, valore, attivo, ordine, created_at, updated_at)
values
    (gen_random_uuid(), 'opzione_altezza', '2.5', 2.5, true, 1, now(), now()),
    (gen_random_uuid(), 'opzione_altezza', '3',   3,   true, 2, now(), now()),
    (gen_random_uuid(), 'opzione_altezza', '3.5', 3.5, true, 3, now(), now()),
    (gen_random_uuid(), 'opzione_altezza', '4',   4,   true, 4, now(), now())
on conflict do nothing;

-- Seed opzioni larghezza/profondita: 0, 0.5, 0.75, 1, poi step 0.5 fino a 15
do $$
declare
    v numeric;
    ord int := 1;
begin
    insert into parametri (id, tipo, nome, valore, attivo, ordine, created_at, updated_at)
    values (gen_random_uuid(), 'opzione_larghezza_prof', '0', 0, true, ord, now(), now());
    ord := ord + 1;
    insert into parametri (id, tipo, nome, valore, attivo, ordine, created_at, updated_at)
    values (gen_random_uuid(), 'opzione_larghezza_prof', '0.5', 0.5, true, ord, now(), now());
    ord := ord + 1;
    insert into parametri (id, tipo, nome, valore, attivo, ordine, created_at, updated_at)
    values (gen_random_uuid(), 'opzione_larghezza_prof', '0.75', 0.75, true, ord, now(), now());
    ord := ord + 1;

    v := 1;
    while v <= 15 loop
        insert into parametri (id, tipo, nome, valore, attivo, ordine, created_at, updated_at)
        values (gen_random_uuid(), 'opzione_larghezza_prof',
                trim(trailing '.' from trim(trailing '0' from to_char(v, 'FM999999990.00'))),
                v, true, ord, now(), now());
        ord := ord + 1;
        v := v + 0.5;
    end loop;
end $$;
