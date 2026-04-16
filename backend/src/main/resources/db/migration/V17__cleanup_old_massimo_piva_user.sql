do
$$
    declare
        v_old_id uuid := '0cc24fed-e4f9-42d7-8fda-3d3b987f419a';
        v_new_id uuid := '8dc1ffe8-e374-4c05-b05d-86d5cf9518a9';
    begin
        if not exists(select 1 from public.utente where id = v_old_id) then
            return;
        end if;

        if not exists(select 1 from public.utente where id = v_new_id) then
            raise exception 'Utente target % non trovato, impossibile riassegnare da %', v_new_id, v_old_id;
        end if;

        update public.prospect set user_id = v_new_id where user_id = v_old_id;
        update public.preventivo set user_id = v_new_id where user_id = v_old_id;
        delete from public.password_reset_tokens where user_id = v_old_id;

        delete from public.utente where id = v_old_id;
    end
$$;
