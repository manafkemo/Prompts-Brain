-- Add icon and color columns to tool_categories
ALTER TABLE public.tool_categories ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE public.tool_categories ADD COLUMN IF NOT EXISTS color TEXT;
