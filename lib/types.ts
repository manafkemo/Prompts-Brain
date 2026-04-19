export type PromptType = 'image' | 'video' | 'voice' | 'code' | 'other';

export interface Prompt {
  id: string;
  original_prompt: string;
  extracted_text: string | null;
  image_url: string | null;
  type: PromptType;
  style: string[];
  subject: string;
  description: string;
  quality_score: number;
  creativity_score: number;
  tags: string[];
  created_at: string;
  collection_id?: string | null;
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface GeminiAnalysis {
  type: PromptType;
  style: string[];
  subject: string;
  description: string;
  quality_score: number;
  creativity_score: number;
  tags: string[];
}

export interface AddPromptPayload {
  original_prompt: string;
  extracted_text?: string | null;
  image_file?: File | null;
}
