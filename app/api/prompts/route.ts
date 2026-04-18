import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { useCredit } from '@/lib/credits';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check and deduct credits
    const { success, error: creditError } = await useCredit(supabase);
    if (!success) {
      console.error('Credit deduction failed for user:', user.id, creditError);
      return NextResponse.json(
        { error: creditError || 'You have no more credits to use.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Attach the user ID to the prompt data before saving
    const insertData = { 
      ...body, 
      user_id: user.id 
    };
    
    const { data, error } = await supabase
      .from('prompts')
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save prompt' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    let query = supabase
      .from('prompts')
      .select('id, created_at, original_prompt, type, tags, quality_score, creativity_score, subject, description')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('original_prompt', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}
