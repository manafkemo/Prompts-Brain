import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    let query = supabase
      .from('tools')
      .select(`
        *,
        user_saved_tools (
          category_id,
          is_favorite,
          user_id
        )
      `)
      .order('created_at', { ascending: false });
    
    // User can see global tools (user_id is null) OR their own tools
    // User can see global tools (user_id is null) OR their own tools
    if (user) {
      query = query.or(`user_id.is.null,user_id.eq.${user.id}`);
      // Remove the top-level filter on user_saved_tools to avoid inner-join behavior
    } else {
      query = query.is('user_id', null);
    }
    
    if (category) {
      query = query.eq('category', category);
    }

    const { data: rawTools, error } = await query;
    
    if (error) throw error;

    // Flatten the tool data for easier frontend consumption
    const tools = rawTools.map((tool: any) => {
      // Find the saved data for the current user specifically
      const savedData = tool.user_saved_tools?.find((s: any) => s.user_id === user?.id) || {};
      const { user_saved_tools, ...toolData } = tool;
      return {
        ...toolData,
        user_category_id: savedData.category_id,
        is_favorite: !!savedData.is_favorite
      };
    });
    
    return NextResponse.json(tools);
  } catch (error: any) {
    console.error('API Error /api/tools:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // First, check if the tool is owned by the user
    const { data: tool, error: fetchError } = await supabase
      .from('tools')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    if (tool.user_id === user.id) {
      // It's a private tool, delete it entirely (cascades to user_saved_tools)
      const { error: deleteError } = await supabase
        .from('tools')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (deleteError) throw deleteError;
    } else {
      // It's a global tool, just remove the user's saved record
      const { error: removeError } = await supabase
        .from('user_saved_tools')
        .delete()
        .eq('tool_id', id)
        .eq('user_id', user.id);
      if (removeError) throw removeError;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
