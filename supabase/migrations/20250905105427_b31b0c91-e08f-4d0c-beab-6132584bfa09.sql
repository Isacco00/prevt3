-- Fix linter: set immutable search_path and security definer on is_admin
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