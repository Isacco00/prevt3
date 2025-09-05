-- Fix function search path mutable warning
-- Fix all functions to have immutable search_path

-- Fix the existing functions
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  );
$$;

-- Add auto profile creation trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer 
set search_path = public 
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

-- Create trigger to auto-create profile when user signs up
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();