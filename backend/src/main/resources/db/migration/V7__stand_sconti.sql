alter table preventivo add column grafica_cordino_attiva boolean default false not null;
alter table preventivo add column sconto_grafica_cordino numeric(19, 2) default 0;
alter table preventivo add column sconto_retroilluminazione numeric(19, 2) default 0;
alter table preventivo add column sconto_accessori_vendita numeric(19, 2) default 0;
alter table preventivo add column sconto_accessori_noleggio numeric(19, 2) default 0;
alter table preventivo add column sconto_premontaggio numeric(19, 2) default 0;
alter table preventivo add column sconto_extra_stand_complesso numeric(19, 2) default 0;

alter table preventivo drop column marginalita_grafica;
alter table preventivo drop column marginalita_retroilluminazione;
alter table preventivo drop column marginalita_accessori;
alter table preventivo drop column marginalita_premontaggio;
