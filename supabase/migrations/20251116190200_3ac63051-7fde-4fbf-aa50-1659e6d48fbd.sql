-- Drop existing restrictive RLS policies for prospects
DROP POLICY IF EXISTS "Users can view their own prospects" ON public.prospects;
DROP POLICY IF EXISTS "Users can create their own prospects" ON public.prospects;
DROP POLICY IF EXISTS "Users can update their own prospects" ON public.prospects;
DROP POLICY IF EXISTS "Users can delete their own prospects" ON public.prospects;

-- Create new permissive RLS policies for prospects that allow all authenticated users
CREATE POLICY "Authenticated users can view all prospects"
  ON public.prospects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create prospects"
  ON public.prospects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update all prospects"
  ON public.prospects
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete all prospects"
  ON public.prospects
  FOR DELETE
  TO authenticated
  USING (true);