import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Checks if a user has enough credits and decrements by 1 if they do.
 * This is an atomic operation performed via a Supabase RPC.
 * 
 * @param supabase The server-side Supabase client
 * @returns { success: boolean, credits: number | null, error: string | null }
 */
export async function consumeCredit(supabase: SupabaseClient) {
  const { data: success, error } = await supabase.rpc('decrement_credits');

  if (error) {
    console.error('Credit System RPC Error:', error.message, error.details, error.hint);
    return { success: false, error: `Credit system error: ${error.message}` };
  }

  // If success is false, it means credits were <= 0
  if (!success) {
    return { success: false, error: 'You have no more credits to use. Premium plans coming soon!' };
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
