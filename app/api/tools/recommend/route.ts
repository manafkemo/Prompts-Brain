import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { consumeCredit } from '@/lib/credits';
import { Tool } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { goal } = await req.json();
    if (!goal || typeof goal !== 'string') {
      return NextResponse.json({ error: 'Goal is required' }, { status: 400 });
    }

    // Deduct 1 credit for AI Recommendation
    const creditCheck = await consumeCredit(supabase);
    if (!creditCheck.success) {
      return NextResponse.json({ error: creditCheck.error }, { status: 403 });
    }

    // Fetch all tools from the database to filter
    const { data: allTools, error: toolsError } = await supabase.from('tools').select('*');
    if (toolsError) throw toolsError;

    // RULE: DO NOT send all tools to AI model. 
    // First filter tools (by category or keywords). Then send only top relevant (max 15).
    const goalLower = goal.toLowerCase();
    const rankedTools = (allTools as Tool[]).map(tool => {
      let score = 0;
      const tText = `${tool.name} ${tool.description} ${tool.category} ${tool.tags.join(' ')}`.toLowerCase();
      
      // Simple word match scoring
      const words = goalLower.split(/\w+/);
      for (const word of words) {
        if (word.length > 2 && tText.includes(word)) {
          score += 1;
        }
      }
      return { tool, score };
    });

    // Sort by score descending and take top 10
    rankedTools.sort((a, b) => b.score - a.score);
    const topTools = rankedTools.slice(0, 10).map(r => r.tool);

    // AI Generation
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const instruction = `You are an AI expert helping a user pick the best tools from a library for their specific goal.
    
User's Goal: "${goal}"

Available Tools Context (JSON):
${JSON.stringify(topTools.map(t => ({ id: t.id, name: t.name, desc: t.description })), null, 2)}

Task:
Select the top 1 to 3 best tools from the provided 'Available Tools Context' that fit the user's goal.
Explain why each tool fits, and suggest 1 or 2 powerful prompts they could use in that tool.

Return ONLY a valid JSON array matching this exact structure:
[
  {
    "tool_id": "UUID here",
    "name": "Tool Name text",
    "reasoning": "Why it's the best fit (1-2 sentences)",
    "suggested_prompts": ["Prompt example 1", "Prompt example 2"]
  }
]`;

    // Timeout protection
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI Request Timeout')), 25000)
    );

    const resultData = await Promise.race([
      model.generateContent(instruction),
      timeoutPromise
    ]) as { response: { text: () => string } };

    const text = resultData.response.text();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Gemini did not return valid JSON array');
    }

    const recommendations = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ recommendations });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('API Error /api/tools/recommend:', err);
    return NextResponse.json({ error: err.message || 'Recommendation failed' }, { status: 500 });
  }
}
