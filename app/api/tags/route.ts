import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all tags and flatten them
    const { data, error } = await supabase
      .from('prompts')
      .select('tags')
      .eq('user_id', user.id);

    if (error) throw error;

    const allTags = new Set<string>();
    data.forEach((item: { tags: string[] }) => {
      item.tags?.forEach(tag => allTags.add(tag));
    });

    return NextResponse.json(Array.from(allTags).sort());
  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}
