-- Enable required extension for UUID generation
create extension if not exists pgcrypto;

-- Helper: update updated_at column
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = public;

-- PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  email text,
  first_name text,
  last_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user','admin')),
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger update_profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();

alter table public.profiles enable row level security;

-- Helper: check if current user is admin
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  );
$$;

-- Policies for profiles (Using traditional syntax without "if not exists")
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

drop policy if exists "Admins can update any profile" on public.profiles;
create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin());

drop policy if exists "Service role can insert profiles" on public.profiles;
create policy "Service role can insert profiles"
  on public.profiles for insert
  with check ((current_setting('request.jwt.claims', true)::jsonb ->> 'role') = 'service_role');

-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public 
as $$
begin
  insert into public.profiles (user_id, email, first_name, last_name)
  values (
    new.id, 
    new.email,
    new.raw_user_meta_data ->> 'first_name', 
    new.raw_user_meta_data ->> 'last_name'
  );
  return new;
end;
$$;

-- Trigger to create profile on user creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- PARAMETRI TABLE
create table if not exists public.parametri (
  id uuid primary key default gen_random_uuid(),
  tipo text not null,
  nome text not null,
  valore numeric(12,2),
  valore_testo text,
  descrizione text,
  valore_chiave text,
  ordine integer not null default 0,
  attivo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists parametri_nome_idx on public.parametri (nome);

create trigger update_parametri_updated_at
before update on public.parametri
for each row execute function public.update_updated_at_column();

alter table public.parametri enable row level security;

drop policy if exists "Authenticated can read parametri" on public.parametri;
create policy "Authenticated can read parametri"
  on public.parametri for select
  using (auth.uid() is not null);

drop policy if exists "Admins can modify parametri" on public.parametri;
create policy "Admins can modify parametri"
  on public.parametri for all
  using (public.is_admin())
  with check (public.is_admin());

-- COSTI RETROILLUMINAZIONE TABLE
create table if not exists public.costi_retroilluminazione (
  id uuid primary key default gen_random_uuid(),
  altezza numeric(6,2) not null,
  costo_al_metro numeric(12,2) not null,
  attivo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger update_costi_retroilluminazione_updated_at
before update on public.costi_retroilluminazione
for each row execute function public.update_updated_at_column();

alter table public.costi_retroilluminazione enable row level security;

drop policy if exists "Authenticated can read costi_retroilluminazione" on public.costi_retroilluminazione;
create policy "Authenticated can read costi_retroilluminazione"
  on public.costi_retroilluminazione for select
  using (auth.uid() is not null);

drop policy if exists "Admins can modify costi_retroilluminazione" on public.costi_retroilluminazione;
create policy "Admins can modify costi_retroilluminazione"
  on public.costi_retroilluminazione for all
  using (public.is_admin())
  with check (public.is_admin());

-- LISTINI ACCESSORI TABLES (stand, desk, espositori)
create table if not exists public.listino_accessori_stand (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  costo_unitario numeric(12,2) not null,
  attivo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listino_accessori_desk (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  costo_unitario numeric(12,2) not null,
  attivo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listino_accessori_espositori (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  costo_unitario numeric(12,2) not null,
  attivo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger update_listino_accessori_stand_updated_at
before update on public.listino_accessori_stand
for each row execute function public.update_updated_at_column();

create trigger update_listino_accessori_desk_updated_at
before update on public.listino_accessori_desk
for each row execute function public.update_updated_at_column();

create trigger update_listino_accessori_espositori_updated_at
before update on public.listino_accessori_espositori
for each row execute function public.update_updated_at_column();

alter table public.listino_accessori_stand enable row level security;
alter table public.listino_accessori_desk enable row level security;
alter table public.listino_accessori_espositori enable row level security;

drop policy if exists "Authenticated can read listini accessori stand" on public.listino_accessori_stand;
create policy "Authenticated can read listini accessori stand"
  on public.listino_accessori_stand for select
  using (auth.uid() is not null);

drop policy if exists "Authenticated can read listini accessori desk" on public.listino_accessori_desk;
create policy "Authenticated can read listini accessori desk"
  on public.listino_accessori_desk for select
  using (auth.uid() is not null);

drop policy if exists "Authenticated can read listini accessori espositori" on public.listino_accessori_espositori;
create policy "Authenticated can read listini accessori espositori"
  on public.listino_accessori_espositori for select
  using (auth.uid() is not null);

drop policy if exists "Admins can modify listino accessori stand" on public.listino_accessori_stand;
create policy "Admins can modify listino accessori stand"
  on public.listino_accessori_stand for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can modify listino accessori desk" on public.listino_accessori_desk;
create policy "Admins can modify listino accessori desk"
  on public.listino_accessori_desk for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can modify listino accessori espositori" on public.listino_accessori_espositori;
create policy "Admins can modify listino accessori espositori"
  on public.listino_accessori_espositori for all
  using (public.is_admin()) with check (public.is_admin());

-- COSTI STRUTTURA LAYOUT TABLES
create table if not exists public.costi_struttura_desk_layout (
  id uuid primary key default gen_random_uuid(),
  layout_desk text not null,
  costo_unitario numeric(12,2) not null,
  attivo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.costi_struttura_espositori_layout (
  id uuid primary key default gen_random_uuid(),
  layout_espositore text not null,
  costo_unitario numeric(12,2) not null,
  attivo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger update_costi_struttura_desk_layout_updated_at
before update on public.costi_struttura_desk_layout
for each row execute function public.update_updated_at_column();

create trigger update_costi_struttura_espositori_layout_updated_at
before update on public.costi_struttura_espositori_layout
for each row execute function public.update_updated_at_column();

alter table public.costi_struttura_desk_layout enable row level security;
alter table public.costi_struttura_espositori_layout enable row level security;

drop policy if exists "Authenticated can read costi struttura desk" on public.costi_struttura_desk_layout;
create policy "Authenticated can read costi struttura desk"
  on public.costi_struttura_desk_layout for select
  using (auth.uid() is not null);

drop policy if exists "Authenticated can read costi struttura espositori" on public.costi_struttura_espositori_layout;
create policy "Authenticated can read costi struttura espositori"
  on public.costi_struttura_espositori_layout for select
  using (auth.uid() is not null);

drop policy if exists "Admins can modify costi struttura desk" on public.costi_struttura_desk_layout;
create policy "Admins can modify costi struttura desk"
  on public.costi_struttura_desk_layout for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can modify costi struttura espositori" on public.costi_struttura_espositori_layout;
create policy "Admins can modify costi struttura espositori"
  on public.costi_struttura_espositori_layout for all
  using (public.is_admin()) with check (public.is_admin());