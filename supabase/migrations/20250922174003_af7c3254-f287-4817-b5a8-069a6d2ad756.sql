-- Fix security vulnerability: Restrict pricing tables to authenticated users only
-- Currently these tables expose sensitive business data (costs, margins, pricing) publicly

-- Drop existing public read policies and create authenticated-only policies

-- 1. condizioni_standard_fornitura
DROP POLICY IF EXISTS "Everyone can view condizioni_standard_fornitura" ON public.condizioni_standard_fornitura;
CREATE POLICY "Authenticated users can view condizioni_standard_fornitura" 
ON public.condizioni_standard_fornitura 
FOR SELECT 
TO authenticated
USING (true);

-- 2. costi_extra_trasf_mont  
DROP POLICY IF EXISTS "Everyone can view costi_extra_trasf_mont" ON public.costi_extra_trasf_mont;
CREATE POLICY "Authenticated users can view costi_extra_trasf_mont" 
ON public.costi_extra_trasf_mont 
FOR SELECT 
TO authenticated
USING (true);

-- 3. costi_retroilluminazione
DROP POLICY IF EXISTS "Everyone can view costi_retroilluminazione" ON public.costi_retroilluminazione;
CREATE POLICY "Authenticated users can view costi_retroilluminazione" 
ON public.costi_retroilluminazione 
FOR SELECT 
TO authenticated
USING (true);

-- 4. costi_struttura_desk_layout
DROP POLICY IF EXISTS "Everyone can view costi_struttura_desk_layout" ON public.costi_struttura_desk_layout;
CREATE POLICY "Authenticated users can view costi_struttura_desk_layout" 
ON public.costi_struttura_desk_layout 
FOR SELECT 
TO authenticated
USING (true);

-- 5. costi_struttura_espositori_layout
DROP POLICY IF EXISTS "Everyone can view costi_struttura_espositori_layout" ON public.costi_struttura_espositori_layout;
CREATE POLICY "Authenticated users can view costi_struttura_espositori_layout" 
ON public.costi_struttura_espositori_layout 
FOR SELECT 
TO authenticated
USING (true);

-- 6. costi_volo_ar
DROP POLICY IF EXISTS "Everyone can view costi_volo_ar" ON public.costi_volo_ar;
CREATE POLICY "Authenticated users can view costi_volo_ar" 
ON public.costi_volo_ar 
FOR SELECT 
TO authenticated
USING (true);

-- 7. listino_accessori_desk
DROP POLICY IF EXISTS "Everyone can view listino_accessori_desk" ON public.listino_accessori_desk;
CREATE POLICY "Authenticated users can view listino_accessori_desk" 
ON public.listino_accessori_desk 
FOR SELECT 
TO authenticated
USING (true);

-- 8. listino_accessori_espositori
DROP POLICY IF EXISTS "Everyone can view listino_accessori_espositori" ON public.listino_accessori_espositori;
CREATE POLICY "Authenticated users can view listino_accessori_espositori" 
ON public.listino_accessori_espositori 
FOR SELECT 
TO authenticated
USING (true);

-- 9. listino_accessori_stand
DROP POLICY IF EXISTS "Everyone can view listino_accessori_stand" ON public.listino_accessori_stand;
CREATE POLICY "Authenticated users can view listino_accessori_stand" 
ON public.listino_accessori_stand 
FOR SELECT 
TO authenticated
USING (true);

-- 10. marginalita_per_prospect (CRITICAL - exposes profit margins)
DROP POLICY IF EXISTS "Everyone can view marginalita_per_prospect" ON public.marginalita_per_prospect;
CREATE POLICY "Authenticated users can view marginalita_per_prospect" 
ON public.marginalita_per_prospect 
FOR SELECT 
TO authenticated
USING (true);

-- 11. parametri
DROP POLICY IF EXISTS "Everyone can view parametri" ON public.parametri;
CREATE POLICY "Authenticated users can view parametri" 
ON public.parametri 
FOR SELECT 
TO authenticated
USING (true);

-- 12. parametri_a_costi_unitari (CRITICAL - exposes unit costs)
DROP POLICY IF EXISTS "Everyone can view parametri_a_costi_unitari" ON public.parametri_a_costi_unitari;
CREATE POLICY "Authenticated users can view parametri_a_costi_unitari" 
ON public.parametri_a_costi_unitari 
FOR SELECT 
TO authenticated
USING (true);