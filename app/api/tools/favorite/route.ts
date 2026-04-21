import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Check Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tool_id, is_favorite } = await req.json();

    if (!tool_id) {
      return NextResponse.json({ error: 'tool_id is required' }, { status: 400 });
    }

    // Upsert favorite status in user_saved_tools
    // This allows favoriting a tool even if it wasn't bookmarked yet
    const { data, error } = await supabase
      .from('user_saved_tools')
      .upsert({ 
        user_id: user.id, 
        tool_id: tool_id, 
        is_favorite: is_favorite 
      }, { onConflict: 'user_id,tool_id' })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error('API Error /api/tools/favorite:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
