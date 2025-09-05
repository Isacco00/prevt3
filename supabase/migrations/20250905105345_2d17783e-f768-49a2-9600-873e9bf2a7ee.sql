-- Fix function search path security warning
alter function public.update_updated_at_column() set search_path = '';
alter function public.is_admin() set search_path = '';