-- Remove user_id constraint and make parameter tables global
-- First, clean up duplicates and keep only one record per item

-- Remove duplicates from costi_retroilluminazione
DELETE FROM costi_retroilluminazione a USING costi_retroilluminazione b 
WHERE a.id > b.id AND a.altezza = b.altezza;

-- Remove duplicates from costi_struttura_desk_layout  
DELETE FROM costi_struttura_desk_layout a USING costi_struttura_desk_layout b 
WHERE a.id > b.id AND a.layout_desk = b.layout_desk;

-- Remove duplicates from listino_accessori_desk
DELETE FROM listino_accessori_desk a USING listino_accessori_desk b 
WHERE a.id > b.id AND a.nome = b.nome;

-- Remove duplicates from listino_accessori_espositori
DELETE FROM listino_accessori_espositori a USING listino_accessori_espositori b 
WHERE a.id > b.id AND a.nome = b.nome;

-- Remove duplicates from listino_accessori_stand
DELETE FROM listino_accessori_stand a USING listino_accessori_stand b 
WHERE a.id > b.id AND a.nome = b.nome;

-- Remove duplicates from parametri
DELETE FROM parametri a USING parametri b 
WHERE a.id > b.id AND a.tipo = b.tipo AND a.nome = b.nome;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can view their own costi_retroilluminazione" ON costi_retroilluminazione;
DROP POLICY IF EXISTS "Users can create their own costi_retroilluminazione" ON costi_retroilluminazione;
DROP POLICY IF EXISTS "Users can update their own costi_retroilluminazione" ON costi_retroilluminazione;
DROP POLICY IF EXISTS "Users can delete their own costi_retroilluminazione" ON costi_retroilluminazione;

DROP POLICY IF EXISTS "Users can view their own costi_struttura_desk_layout" ON costi_struttura_desk_layout;
DROP POLICY IF EXISTS "Users can create their own costi_struttura_desk_layout" ON costi_struttura_desk_layout;
DROP POLICY IF EXISTS "Users can update their own costi_struttura_desk_layout" ON costi_struttura_desk_layout;
DROP POLICY IF EXISTS "Users can delete their own costi_struttura_desk_layout" ON costi_struttura_desk_layout;

DROP POLICY IF EXISTS "Users can view their own listino_accessori_desk" ON listino_accessori_desk;
DROP POLICY IF EXISTS "Users can create their own listino_accessori_desk" ON listino_accessori_desk;
DROP POLICY IF EXISTS "Users can update their own listino_accessori_desk" ON listino_accessori_desk;
DROP POLICY IF EXISTS "Users can delete their own listino_accessori_desk" ON listino_accessori_desk;

DROP POLICY IF EXISTS "Users can view their own listino_accessori_espositori" ON listino_accessori_espositori;
DROP POLICY IF EXISTS "Users can create their own listino_accessori_espositori" ON listino_accessori_espositori;
DROP POLICY IF EXISTS "Users can update their own listino_accessori_espositori" ON listino_accessori_espositori;
DROP POLICY IF EXISTS "Users can delete their own listino_accessori_espositori" ON listino_accessori_espositori;

DROP POLICY IF EXISTS "Users can view their own listino_accessori_stand" ON listino_accessori_stand;
DROP POLICY IF EXISTS "Users can create their own listino_accessori_stand" ON listino_accessori_stand;
DROP POLICY IF EXISTS "Users can update their own listino_accessori_stand" ON listino_accessori_stand;
DROP POLICY IF EXISTS "Users can delete their own listino_accessori_stand" ON listino_accessori_stand;

DROP POLICY IF EXISTS "Users can view their own parametri" ON parametri;
DROP POLICY IF EXISTS "Users can create their own parametri" ON parametri;
DROP POLICY IF EXISTS "Users can update their own parametri" ON parametri;
DROP POLICY IF EXISTS "Users can delete their own parametri" ON parametri;

-- Remove user_id columns
ALTER TABLE costi_retroilluminazione DROP COLUMN IF EXISTS user_id;
ALTER TABLE costi_struttura_desk_layout DROP COLUMN IF EXISTS user_id;
ALTER TABLE listino_accessori_desk DROP COLUMN IF EXISTS user_id;
ALTER TABLE listino_accessori_espositori DROP COLUMN IF EXISTS user_id;
ALTER TABLE listino_accessori_stand DROP COLUMN IF EXISTS user_id;
ALTER TABLE parametri DROP COLUMN IF EXISTS user_id;

-- Create new RLS policies - everyone can read, only admins can modify

-- costi_retroilluminazione
CREATE POLICY "Everyone can view costi_retroilluminazione" ON costi_retroilluminazione FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can create costi_retroilluminazione" ON costi_retroilluminazione FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Only admins can update costi_retroilluminazione" ON costi_retroilluminazione FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Only admins can delete costi_retroilluminazione" ON costi_retroilluminazione FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- costi_struttura_desk_layout
CREATE POLICY "Everyone can view costi_struttura_desk_layout" ON costi_struttura_desk_layout FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can create costi_struttura_desk_layout" ON costi_struttura_desk_layout FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Only admins can update costi_struttura_desk_layout" ON costi_struttura_desk_layout FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Only admins can delete costi_struttura_desk_layout" ON costi_struttura_desk_layout FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- listino_accessori_desk
CREATE POLICY "Everyone can view listino_accessori_desk" ON listino_accessori_desk FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can create listino_accessori_desk" ON listino_accessori_desk FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Only admins can update listino_accessori_desk" ON listino_accessori_desk FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Only admins can delete listino_accessori_desk" ON listino_accessori_desk FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- listino_accessori_espositori
CREATE POLICY "Everyone can view listino_accessori_espositori" ON listino_accessori_espositori FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can create listino_accessori_espositori" ON listino_accessori_espositori FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Only admins can update listino_accessori_espositori" ON listino_accessori_espositori FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Only admins can delete listino_accessori_espositori" ON listino_accessori_espositori FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- listino_accessori_stand
CREATE POLICY "Everyone can view listino_accessori_stand" ON listino_accessori_stand FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can create listino_accessori_stand" ON listino_accessori_stand FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Only admins can update listino_accessori_stand" ON listino_accessori_stand FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Only admins can delete listino_accessori_stand" ON listino_accessori_stand FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- parametri
CREATE POLICY "Everyone can view parametri" ON parametri FOR SELECT TO authenticated USING (true);  
CREATE POLICY "Only admins can create parametri" ON parametri FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Only admins can update parametri" ON parametri FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Only admins can delete parametri" ON parametri FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Update handle_new_user function to not insert duplicate parametri
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email
  );
  
  -- Don't insert parametri anymore since they are now global
  -- Admin will manage them centrally
  
  RETURN NEW;
END;
$function$;