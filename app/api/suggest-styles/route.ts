import { NextResponse } from 'next/server';
import { suggestStyles } from '@/lib/gemini';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return NextResponse.json(
        { error: 'prompt is required and must be a valid string' },
        { status: 400 }
      );
    }

    const styles = await suggestStyles(prompt);

    return NextResponse.json({ styles });
  } catch (error: any) {
    console.error('Gemini Suggest Styles Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to suggest styles' },
      { status: 500 }
    );
  }
}
