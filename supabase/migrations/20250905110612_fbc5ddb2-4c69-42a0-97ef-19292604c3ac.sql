-- Create prospects table
create table if not exists public.prospects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  ragione_sociale text not null,
  partita_iva text not null,
  codice_fiscale text,
  indirizzo text not null,
  citta text not null,
  cap text not null,
  provincia text not null,
  telefono text,
  email text,
  tipo text not null default 'prospect' check (tipo in ('prospect', 'cliente')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add unique constraint on partita_iva per user
create unique index if not exists prospects_user_partita_iva_idx 
  on public.prospects (user_id, partita_iva);

create or replace trigger update_prospects_updated_at
before update on public.prospects
for each row execute function public.update_updated_at_column();

alter table public.prospects enable row level security;

-- RLS policies for prospects
drop policy if exists "Users can view their own prospects" on public.prospects;
create policy "Users can view their own prospects"
  on public.prospects for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own prospects" on public.prospects;
create policy "Users can insert their own prospects"
  on public.prospects for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own prospects" on public.prospects;
create policy "Users can update their own prospects"
  on public.prospects for update
  using (auth.uid() = user_id);

drop policy if exists "Admins can view all prospects" on public.prospects;
create policy "Admins can view all prospects"
  on public.prospects for select
  using (public.is_admin());

-- Create preventivi table
create table if not exists public.preventivi (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  numero_preventivo text not null,
  titolo text not null,
  descrizione text,
  prospect_id uuid references public.prospects(id),
  
  -- Dimensioni base
  profondita numeric(8,2) not null,
  larghezza numeric(8,2) not null,
  altezza numeric(8,2) not null,
  layout text not null,
  distribuzione integer not null,
  complessita text not null default 'normale',
  bifaccialita numeric(8,2) default 0,
  retroilluminazione text,
  
  -- Elementi fisici calcolati
  superficie numeric(12,2),
  volume numeric(12,2),
  superficie_stampa numeric(12,2),
  sviluppo_lineare numeric(12,2),
  numero_pezzi numeric(12,2),
  
  -- Costi
  costo_mq numeric(12,2) not null default 0,
  costo_mc numeric(12,2) not null default 0,
  costo_fisso numeric(12,2) not null default 0,
  costo_struttura numeric(12,2),
  costo_grafica numeric(12,2),
  costo_premontaggio numeric(12,2),
  costo_retroilluminazione numeric(12,2) default 0,
  costo_totale numeric(12,2),
  totale numeric(12,2),
  
  -- Accessori Stand (JSONB per flessibilità)
  accessori_stand jsonb default '{}',
  
  -- Desk layouts (JSONB array)
  desk_layouts jsonb default '[]',
  
  -- Accessori Desk individuali
  porta_scorrevole integer default 0,
  ripiano_superiore integer default 0,
  ripiano_inferiore integer default 0,
  teca_plexiglass integer default 0,
  fronte_luminoso integer default 0,
  borsa integer default 0,
  
  -- Storage fields
  larg_storage numeric(8,2),
  prof_storage numeric(8,2),
  alt_storage numeric(8,2),
  layout_storage text,
  numero_porte integer,
  
  -- Espositori
  qta_tipo30 integer default 0,
  qta_tipo50 integer default 0,
  qta_tipo100 integer default 0,
  ripiano_30x30 integer default 0,
  ripiano_50x50 integer default 0,
  ripiano_100x50 integer default 0,
  teca_plexiglass_30x30x30 integer default 0,
  teca_plexiglass_50x50x50 integer default 0,
  teca_plexiglass_100x50x30 integer default 0,
  retroilluminazione_30x30x100h integer default 0,
  retroilluminazione_50x50x100h integer default 0,
  retroilluminazione_100x50x100h integer default 0,
  borsa_espositori integer default 0,
  
  -- Services
  servizio_montaggio_smontaggio boolean default false,
  servizio_certificazioni boolean default false,
  servizio_istruzioni_assistenza boolean default false,
  
  -- Complexity
  extra_perc_complex numeric(5,2) default 0,
  
  -- Status e gestione
  status text not null default 'bozza',
  data_scadenza date,
  note text,
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add unique constraint on numero_preventivo per user
create unique index if not exists preventivi_user_numero_idx 
  on public.preventivi (user_id, numero_preventivo);

create or replace trigger update_preventivi_updated_at
before update on public.preventivi
for each row execute function public.update_updated_at_column();

alter table public.preventivi enable row level security;

-- RLS policies for preventivi
drop policy if exists "Users can view their own preventivi" on public.preventivi;
create policy "Users can view their own preventivi"
  on public.preventivi for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own preventivi" on public.preventivi;
create policy "Users can insert their own preventivi"
  on public.preventivi for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own preventivi" on public.preventivi;
create policy "Users can update their own preventivi"
  on public.preventivi for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete their own preventivi" on public.preventivi;
create policy "Users can delete their own preventivi"
  on public.preventivi for delete
  using (auth.uid() = user_id);

drop policy if exists "Admins can view all preventivi" on public.preventivi;
create policy "Admins can view all preventivi"
  on public.preventivi for select
  using (public.is_admin());