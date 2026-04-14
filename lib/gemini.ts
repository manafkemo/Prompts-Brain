import { GeminiAnalysis } from './types';
import { z } from 'zod';

const GeminiSchema = z.object({
  type: z.enum(['image', 'video', 'voice', 'code', 'other']),
  style: z.array(z.string()),
  subject: z.string(),
  description: z.string(),
  quality_score: z.number().int().min(1).max(10),
  creativity_score: z.number().int().min(1).max(10),
  tags: z.array(z.string()),
});

const analysisCache = new Map<string, GeminiAnalysis>();

export async function analyzePrompt(promptText: string): Promise<GeminiAnalysis> {
  // Check cache first
  if (analysisCache.has(promptText)) {
    return analysisCache.get(promptText)!;
  }

  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const instruction = `Analyze the following AI prompt and return a structured JSON.

You must:
- Identify the main purpose (image, video, voice, code, etc)
- Extract style and tone
- Identify the subject
- Give a short description
- Score quality and creativity from 1 to 10
- Generate relevant tags

Return ONLY valid JSON with this exact structure:
{
  "type": "image | video | voice | code | other",
  "style": ["style1", "style2"],
  "subject": "main subject",
  "description": "short explanation",
  "quality_score": 1-10,
  "creativity_score": 1-10,
  "tags": ["tag1", "tag2", "tag3"]
}

Prompt:
"""
${promptText}
"""`;

  // Add timeout protection
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('AI Request Timeout')), 30000)
  );

  const result: any = await Promise.race([
    model.generateContent(instruction),
    timeoutPromise
  ]);

  const text = result.response.text();

  // Extract JSON from response (strip any markdown code fences)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Gemini did not return valid JSON');
  }

  const parsed = JSON.parse(jsonMatch[0]);
  const validated = GeminiSchema.parse(parsed);
  
  // Save to cache
  analysisCache.set(promptText, validated);
  
  return validated;
}

export async function improvePrompt(promptText: string): Promise<string> {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  // Using the new gemini-2.5-flash which is the one you prefer
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const instruction = `You are an expert AI prompt engineer.

Your job is NOT just to rewrite the prompt, but to make it more effective and usable for AI generation.

Rules:

If the prompt lacks a clear subject, you MUST intelligently infer or add a suitable subject.
Transform generic technical prompts into a complete scene.
Add a clear subject, environment, and context.
Improve structure, clarity, and quality.
Keep it concise but powerful.
Do NOT just rephrase — upgrade the prompt.

Return ONLY the improved prompt.

Prompt:
"""
${promptText}
"""`;

  const result = await model.generateContent(instruction);
  const text = result.response.text();

  return text.trim();
}

export async function suggestStyles(promptText: string): Promise<string[]> {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const instruction = `Analyze the following prompt and suggest the most suitable style variations.

Rules:
* Suggest 3 to 5 styles maximum
* Styles must match the context of the prompt
* Avoid irrelevant styles
* Keep them short (one word or short phrase)

Return ONLY a JSON array.

Prompt:
"""
${promptText}
"""`;

  const result = await model.generateContent(instruction);
  const text = result.response.text();

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('Gemini did not return valid JSON array');
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return parsed as string[];
}

export async function generateStylePrompt(promptText: string, style: string): Promise<string> {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const instruction = `You are an expert AI prompt engineer.

Transform the following prompt into a ${style} version.

Rules:
* Keep the original intent
* Apply the selected style strongly
* Add subject, environment, and scene if missing
* Make it visually rich and production-ready
* Keep it concise

Return ONLY the improved prompt.

Prompt:
"""
${promptText}
"""`;

  const result = await model.generateContent(instruction);
  const text = result.response.text();

  return text.trim();
}
