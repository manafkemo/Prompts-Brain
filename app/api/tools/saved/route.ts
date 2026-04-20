import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Check Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Include the tool relation
    const { data: saved_tools, error } = await supabase
      .from('user_saved_tools')
      .select('*, tool:tools(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return NextResponse.json(saved_tools);
  } catch (error: any) {
    console.error('API Error /api/tools/saved:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
