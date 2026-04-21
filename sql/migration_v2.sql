-- Phase 1: Database Migration for Library Expansion

-- 1. Add user_id to tools table to support private/user-added tools
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Add is_favorite to user_saved_tools tracking
ALTER TABLE public.user_saved_tools ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;

-- 3. Create tool_categories table for custom user organization
CREATE TABLE IF NOT EXISTS public.tool_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- 4. Update RLS Policies for tools
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own tools
DROP POLICY IF EXISTS "Users can insert their own tools" ON public.tools;
CREATE POLICY "Users can insert their own tools"
  ON public.tools FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can view global tools or their own tools
DROP POLICY IF EXISTS "Tools are viewable by everyone" ON public.tools;
CREATE POLICY "Tools are viewable by everyone"
  ON public.tools FOR SELECT
  USING (user_id IS NULL OR user_id = auth.uid());

-- 5. Update RLS for tool_categories
ALTER TABLE public.tool_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own categories" ON public.tool_categories;
CREATE POLICY "Users can view their own categories"
  ON public.tool_categories FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own categories" ON public.tool_categories;
CREATE POLICY "Users can manage their own categories"
  ON public.tool_categories FOR ALL
  USING (auth.uid() = user_id);

-- 6. Add UPDATE policy for user_saved_tools (Required for favoriting)
DROP POLICY IF EXISTS "Users can update their own saved tools" ON public.user_saved_tools;
CREATE POLICY "Users can update their own saved tools"
  ON public.user_saved_tools FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
