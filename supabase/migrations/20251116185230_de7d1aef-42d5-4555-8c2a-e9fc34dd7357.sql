-- Drop existing restrictive RLS policies on preventivi
DROP POLICY IF EXISTS "Users can view their own preventivi" ON public.preventivi;
DROP POLICY IF EXISTS "Users can create their own preventivi" ON public.preventivi;
DROP POLICY IF EXISTS "Users can update their own preventivi" ON public.preventivi;
DROP POLICY IF EXISTS "Users can delete their own preventivi" ON public.preventivi;

-- Create new policies that allow all authenticated users to access all preventivi
CREATE POLICY "Authenticated users can view all preventivi" 
ON public.preventivi 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create preventivi" 
ON public.preventivi 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update all preventivi" 
ON public.preventivi 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete all preventivi" 
ON public.preventivi 
FOR DELETE 
TO authenticated
USING (true);

-- Update RLS policies for related tables (altri_beni_servizi, condizioni_fornitura_preventivi, preventivi_servizi)
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own altri_beni_servizi" ON public.altri_beni_servizi;
DROP POLICY IF EXISTS "Users can create their own altri_beni_servizi" ON public.altri_beni_servizi;
DROP POLICY IF EXISTS "Users can update their own altri_beni_servizi" ON public.altri_beni_servizi;
DROP POLICY IF EXISTS "Users can delete their own altri_beni_servizi" ON public.altri_beni_servizi;

-- Create new policies for altri_beni_servizi
CREATE POLICY "Authenticated users can view all altri_beni_servizi" 
ON public.altri_beni_servizi 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create altri_beni_servizi" 
ON public.altri_beni_servizi 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update all altri_beni_servizi" 
ON public.altri_beni_servizi 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete all altri_beni_servizi" 
ON public.altri_beni_servizi 
FOR DELETE 
TO authenticated
USING (true);

-- Drop existing restrictive policies for condizioni_fornitura_preventivi
DROP POLICY IF EXISTS "Users can view their own condizioni_fornitura_preventivi" ON public.condizioni_fornitura_preventivi;
DROP POLICY IF EXISTS "Users can create their own condizioni_fornitura_preventivi" ON public.condizioni_fornitura_preventivi;
DROP POLICY IF EXISTS "Users can update their own condizioni_fornitura_preventivi" ON public.condizioni_fornitura_preventivi;
DROP POLICY IF EXISTS "Users can delete their own condizioni_fornitura_preventivi" ON public.condizioni_fornitura_preventivi;

-- Create new policies for condizioni_fornitura_preventivi
CREATE POLICY "Authenticated users can view all condizioni_fornitura_preventivi" 
ON public.condizioni_fornitura_preventivi 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create condizioni_fornitura_preventivi" 
ON public.condizioni_fornitura_preventivi 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update all condizioni_fornitura_preventivi" 
ON public.condizioni_fornitura_preventivi 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete all condizioni_fornitura_preventivi" 
ON public.condizioni_fornitura_preventivi 
FOR DELETE 
TO authenticated
USING (true);

-- Drop existing restrictive policies for preventivi_servizi
DROP POLICY IF EXISTS "Users can view their own preventivi_servizi" ON public.preventivi_servizi;
DROP POLICY IF EXISTS "Users can create their own preventivi_servizi" ON public.preventivi_servizi;
DROP POLICY IF EXISTS "Users can update their own preventivi_servizi" ON public.preventivi_servizi;
DROP POLICY IF EXISTS "Users can delete their own preventivi_servizi" ON public.preventivi_servizi;

-- Create new policies for preventivi_servizi
CREATE POLICY "Authenticated users can view all preventivi_servizi" 
ON public.preventivi_servizi 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create preventivi_servizi" 
ON public.preventivi_servizi 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update all preventivi_servizi" 
ON public.preventivi_servizi 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete all preventivi_servizi" 
ON public.preventivi_servizi 
FOR DELETE 
TO authenticated
USING (true);