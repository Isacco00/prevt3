alter table parametri_a_costi_unitari
    add column nome_variabile text;

update parametri_a_costi_unitari
set nome_variabile = case
    when lower(parametro) like '%alloggio%' then 'costo_alloggio'
    when lower(parametro) like '%pasto%' then 'costo_pasto'
    else regexp_replace(lower(trim(parametro)), '[^a-z0-9]+', '_', 'g')
end
where nome_variabile is null;
