-- Add Stand accessories columns to preventivi table
ALTER TABLE public.preventivi 
ADD COLUMN borsa_stand integer DEFAULT 0,
ADD COLUMN baule_trolley integer DEFAULT 0,
ADD COLUMN staffa_monitor integer DEFAULT 0,
ADD COLUMN mensola integer DEFAULT 0,
ADD COLUMN spot_light integer DEFAULT 0,
ADD COLUMN kit_faro_50w integer DEFAULT 0,
ADD COLUMN kit_faro_100w integer DEFAULT 0,
ADD COLUMN quadro_elettrico_16a integer DEFAULT 0,
ADD COLUMN nicchia integer DEFAULT 0,
ADD COLUMN pedana integer DEFAULT 0;