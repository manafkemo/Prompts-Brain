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

    const body = await req.json();
    const { tool_id } = body;

    if (!tool_id) {
      return NextResponse.json({ error: 'tool_id is required' }, { status: 400 });
    }

    // Check if it's already saved
    const { data: existing, error: fetchError } = await supabase
      .from('user_saved_tools')
      .select('id')
      .eq('user_id', user.id)
      .eq('tool_id', tool_id)
      .single();

    if (existing) {
      // Unsave
      const { error: deleteError } = await supabase
        .from('user_saved_tools')
        .delete()
        .eq('id', existing.id);
        
      if (deleteError) throw deleteError;
      return NextResponse.json({ status: 'unsaved' });
    } else {
      // Save
      const { error: insertError } = await supabase
        .from('user_saved_tools')
        .insert({ user_id: user.id, tool_id });
        
      if (insertError) throw insertError;
      return NextResponse.json({ status: 'saved' });
    }

  } catch (error: any) {
    console.error('API Error /api/tools/save:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
