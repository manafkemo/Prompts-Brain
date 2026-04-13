import { NextResponse } from 'next/server';
import { generateStylePrompt } from '@/lib/gemini';
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
      return NextResponse.json({ error: creditError || 'Insufficient credits' }, { status: 403 });
    }

    const body = await request.json();
    const { prompt, style } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return NextResponse.json(
        { error: 'prompt is required and must be a valid string' },
        { status: 400 }
      );
    }

    if (!style || typeof style !== 'string' || style.trim() === '') {
      return NextResponse.json(
        { error: 'style is required and must be a valid string' },
        { status: 400 }
      );
    }

    const generated_prompt = await generateStylePrompt(prompt, style);

    return NextResponse.json({ generated_prompt });
  } catch (error: any) {
    console.error('Gemini Generate Style Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate prompt for style' },
      { status: 500 }
    );
  }
}
