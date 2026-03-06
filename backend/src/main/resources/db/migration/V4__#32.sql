alter table preventivo
    drop constraint preventivi_status_check;
update preventivo set status = upper(status);
