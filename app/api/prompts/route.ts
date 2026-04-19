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
    const tags = searchParams.get('tags');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const title = searchParams.get('title');
    const content = searchParams.get('content');
    const minCreativity = searchParams.get('minCreativity');
    const maxCreativity = searchParams.get('maxCreativity');
    const minQuality = searchParams.get('minQuality');
    const maxQuality = searchParams.get('maxQuality');
    
    let query = supabase
      .from('prompts')
      .select('id, created_at, original_prompt, type, tags, quality_score, creativity_score, subject, description, collection_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Universal search (already exists, but we'll refine it)
    if (search) {
      query = query.or(`original_prompt.ilike.%${search}%,subject.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Specific filters
    if (title) {
      query = query.or(`subject.ilike.%${title}%,description.ilike.%${title}%`);
    }

    if (content) {
      query = query.ilike('original_prompt', `%${content}%`);
    }

    if (tags) {
      const tagList = tags.split(',').map(tag => tag.trim());
      query = query.contains('tags', tagList);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    if (minCreativity) {
      query = query.gte('creativity_score', parseInt(minCreativity));
    }
    if (maxCreativity) {
      query = query.lte('creativity_score', parseInt(maxCreativity));
    }

    if (minQuality) {
      query = query.gte('quality_score', parseInt(minQuality));
    }
    if (maxQuality) {
      query = query.lte('quality_score', parseInt(maxQuality));
    }

    const { data, error } = await query;

    if (error) throw error;

    // Normalize scores to 1-10 scale if they are > 10 (old data)
    const normalizedData = data?.map((prompt: any) => ({
      ...prompt,
      quality_score: prompt.quality_score > 10 ? Math.round(prompt.quality_score / 10) : prompt.quality_score,
      creativity_score: prompt.creativity_score > 10 ? Math.round(prompt.creativity_score / 10) : prompt.creativity_score,
    }));

    return NextResponse.json(normalizedData);
  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}
