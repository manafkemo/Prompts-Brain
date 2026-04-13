import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Checks if a user has enough credits and decrements by 1 if they do.
 * This is an atomic operation performed via a Supabase RPC.
 * 
 * @param supabase The server-side Supabase client
 * @returns { success: boolean, credits: number | null, error: string | null }
 */
export async function useCredit(supabase: SupabaseClient) {
  const { data: success, error } = await supabase.rpc('decrement_credits');

  if (error) {
    console.error('Credit System Error:', error);
    return { success: false, error: error.message };
  }

  // If success is false, it means credits were <= 0
  if (!success) {
    return { success: false, error: 'Insufficient credits' };
  }

  return { success: true, error: null };
}

/**
 * Fetches the current user's profile which includes credits
 */
export async function getProfile(supabase: SupabaseClient) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: 'Unauthorized' };

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { data, error };
}
