alter table costi_extra_trasf_mont
    add column costo_extra_smont numeric default 0 not null;

update costi_extra_trasf_mont
set costo_extra_smont = costo_extra_mont
where costo_extra_smont = 0;
