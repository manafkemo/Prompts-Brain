-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  credits INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Simple RLS Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow insert for the trigger function (SECURITY DEFINER handles this)
-- and for the decrement_credits auto-init
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, credits)
  VALUES (new.id, new.email, 10);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Atomic decrement function (RPC)
-- Auto-initializes profile for old users who don't have one yet (one-time, 10 credits).
-- Does NOT renew credits for existing users.
CREATE OR REPLACE FUNCTION public.decrement_credits()
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
  user_email TEXT;
BEGIN
  -- Try to get current credits
  SELECT credits INTO current_credits
  FROM public.profiles
  WHERE id = auth.uid();

  -- If profile doesn't exist, create it with 10 credits (one-time init for old users)
  IF NOT FOUND THEN
    SELECT email INTO user_email FROM auth.users WHERE id = auth.uid();
    INSERT INTO public.profiles (id, email, credits)
    VALUES (auth.uid(), user_email, 10)
    ON CONFLICT (id) DO NOTHING;
    -- Set credits to 10 since we just created the profile
    current_credits := 10;
  END IF;

  -- Check if they have credits remaining
  IF COALESCE(current_credits, 0) > 0 THEN
    UPDATE public.profiles
    SET credits = credits - 1
    WHERE id = auth.uid();
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
