import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { data, error } = await supabase
      .from('prompts')
      .select('id, created_at, original_prompt, type, tags, quality_score, creativity_score, subject, description, style, extracted_text')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Normalize scores to 1-10 scale if they are > 10 (old data)
    const normalizedData = {
      ...data,
      quality_score: data.quality_score > 10 ? Math.round(data.quality_score / 10) : data.quality_score,
      creativity_score: data.creativity_score > 10 ? Math.round(data.creativity_score / 10) : data.creativity_score,
    };

    return NextResponse.json(normalizedData);
  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch prompt' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete prompt' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from('prompts')
      .update({ collection_id: body.collection_id })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update prompt' },
      { status: 500 }
    );
  }
}

