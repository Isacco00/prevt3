do
$$
    declare
        v_old_id     uuid := '0cc24fed-e4f9-42d7-8fda-3d3b987f419a';
        v_prospect   bigint;
        v_preventivi bigint;
        v_tokens     bigint;
    begin
        select count(*) into v_prospect from public.prospect where user_id = v_old_id;
        select count(*) into v_preventivi from public.preventivo where user_id = v_old_id;
        select count(*) into v_tokens from public.password_reset_tokens where user_id = v_old_id;

        if v_prospect > 0 or v_preventivi > 0 or v_tokens > 0 then
            raise exception
                'Impossibile eliminare utente % : record collegati - prospect=%, preventivi=%, tokens=%',
                v_old_id, v_prospect, v_preventivi, v_tokens;
        end if;

        delete from public.utente where id = v_old_id;
    end
$$;
