import { NextResponse } from 'next/server';
import { improvePrompt } from '@/lib/gemini';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // While improving doesn't require saving, we authenticate to prevent abuse
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

    const improved_prompt = await improvePrompt(prompt);

    return NextResponse.json({ improved_prompt });
  } catch (error: any) {
    console.error('Gemini Improve Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to improve prompt' },
      { status: 500 }
    );
  }
}
