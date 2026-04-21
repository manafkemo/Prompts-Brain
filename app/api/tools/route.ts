import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    let query = supabase.from('tools').select('*').order('created_at', { ascending: false });
    
    // User can see global tools (user_id is null) OR their own tools
    if (user) {
      query = query.or(`user_id.is.null,user_id.eq.${user.id}`);
    } else {
      query = query.is('user_id', null);
    }
    
    if (category) {
      query = query.eq('category', category);
    }

    const { data: tools, error } = await query;
    
    if (error) throw error;
    
    return NextResponse.json(tools);
  } catch (error: any) {
    console.error('API Error /api/tools:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
