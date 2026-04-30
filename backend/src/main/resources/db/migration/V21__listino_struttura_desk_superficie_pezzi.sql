alter table listino_struttura_desk
    add column superficie numeric default 0 not null;

alter table listino_struttura_desk
    add column numero_pezzi integer default 0 not null;
