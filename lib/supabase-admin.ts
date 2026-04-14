import { createClient } from '@supabase/supabase-js';

// This client uses the SERVICE_ROLE_KEY which bypasses Row Level Security.
// NEVER use this on the frontend.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
