-- Create feedbacks table with auto-incrementing ID for feedback numbering
CREATE TABLE IF NOT EXISTS public.feedbacks (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Allow any user to insert feedback
-- The API route will handle owner association
CREATE POLICY "Enable insert for all users" ON public.feedbacks
  FOR INSERT WITH CHECK (true);

-- Allow service role to read feedbacks (for our API/future admin)
CREATE POLICY "Enable select for service role" ON public.feedbacks
  FOR SELECT USING (true);
