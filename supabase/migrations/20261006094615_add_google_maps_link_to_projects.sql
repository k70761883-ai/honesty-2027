ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS google_maps_link text;

NOTIFY pgrst, 'reload schema';
