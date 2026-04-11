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

export async function analyzePrompt(promptText: string): Promise<GeminiAnalysis> {
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

  const result = await model.generateContent(instruction);
  const text = result.response.text();

  // Extract JSON from response (strip any markdown code fences)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Gemini did not return valid JSON');
  }

  const parsed = JSON.parse(jsonMatch[0]);
  const validated = GeminiSchema.parse(parsed);
  return validated;
}
