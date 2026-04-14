import { NextResponse } from 'next/server';
import { analyzePrompt } from '@/lib/gemini';
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
    const { promptText } = body;

    if (!promptText) {
      return NextResponse.json(
        { error: 'promptText is required' },
        { status: 400 }
      );
    }

    const analysis = await analyzePrompt(promptText);

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('Gemini Analysis Error:', error?.message || error);
    console.error('Full error:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: error.message || 'Failed to analyze prompt' },
      { status: 500 }
    );
  }
}
