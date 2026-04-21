import { NextResponse } from 'next/server';
import { suggestStyles } from '@/lib/gemini';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { consumeCredit } from '@/lib/credits';

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
    const { success, error: creditError } = await consumeCredit(supabase);
    if (!success) {
      return NextResponse.json({ error: creditError || 'Insufficient credits' }, { status: 403 });
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
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Gemini Suggest Styles Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to suggest styles' },
      { status: 500 }
    );
  }
}
