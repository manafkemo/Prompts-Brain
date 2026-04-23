-- Add category_id to user_saved_tools
ALTER TABLE public.user_saved_tools ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.tool_categories(id) ON DELETE SET NULL;

-- Update RLS if needed (already enabled for user_id)
-- Ensure users can update their own category links
DROP POLICY IF EXISTS "Users can update their own saved tools" ON public.user_saved_tools;
CREATE POLICY "Users can update their own saved tools"
  ON public.user_saved_tools FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
