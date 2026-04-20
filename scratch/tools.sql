create table public.tools (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  category text,
  pricing text, -- Free / Freemium / Paid
  url text,
  tags text[] default ARRAY[]::text[],
  created_at timestamp with time zone default now()
);

create table public.user_saved_tools (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  tool_id uuid references public.tools(id) on delete cascade,
  created_at timestamp default now(),
  unique(user_id, tool_id)
);

-- RLS policies
alter table public.tools enable row level security;
alter table public.user_saved_tools enable row level security;

-- Tools are viewable by everyone
create policy "Tools are viewable by everyone"
  on public.tools for select
  using ( true );

-- User Saved Tools RLS
create policy "Users can view their own saved tools"
  on public.user_saved_tools for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own saved tools"
  on public.user_saved_tools for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own saved tools"
  on public.user_saved_tools for delete
  using ( auth.uid() = user_id );

-- Insert Seed Data
insert into public.tools (name, description, category, pricing, url, tags) values
-- AI Image
('Midjourney', 'High-quality AI image generation via Discord with hyper-realistic capabilities.', 'AI Image', 'Paid', 'https://midjourney.com', ARRAY['image', 'art', 'realistic']),
('Leonardo AI', 'Powerful AI image suite for creators with incredible models and canvas editor.', 'AI Image', 'Freemium', 'https://leonardo.ai', ARRAY['image', 'art', 'gaming']),
('DALL·E 3', 'OpenAI''s standard model for generating images directly from ChatGPT.', 'AI Image', 'Freemium', 'https://openai.com/dall-e-3', ARRAY['image', 'chatgpt', 'openai']),
('Stable Diffusion', 'Open-source image generation model that can be run locally or via API.', 'AI Image', 'Free', 'https://stability.ai', ARRAY['image', 'open-source', 'local']),
-- AI Video
('Runway Gen-2', 'State-of-the-art text-to-video and image-to-video generation tool.', 'AI Video', 'Freemium', 'https://runwayml.com', ARRAY['video', 'animation']),
('Pika Labs', 'AI video generation platform specializing in 3D and cinematic video clips.', 'AI Video', 'Freemium', 'https://pika.art', ARRAY['video', 'cinematic', '3d']),
('HeyGen', 'AI video generation for marketing, tutorials, and avatars.', 'AI Video', 'Freemium', 'https://heygen.com', ARRAY['video', 'avatars', 'marketing']),
('Sora', 'OpenAI''s groundbreaking text-to-video model (limited access).', 'AI Video', 'Paid', 'https://openai.com/sora', ARRAY['video', 'openai']),
-- AI Writing
('ChatGPT', 'The most popular conversational AI by OpenAI, great for brainstorming and coding.', 'AI Writing', 'Freemium', 'https://chatgpt.com', ARRAY['writing', 'chat', 'assistant']),
('Jasper', 'Enterprise-grade AI writing assistant for marketing copy and blogs.', 'AI Writing', 'Paid', 'https://jasper.ai', ARRAY['writing', 'marketing', 'copy']),
('Claude 3', 'Anthropic''s powerful AI model known for large context windows and nuanced writing.', 'AI Writing', 'Freemium', 'https://anthropic.com/claude', ARRAY['writing', 'analysis', 'coding']),
('Copy.ai', 'AI marketing copywriter for fast generation of ads, emails, and social media.', 'AI Writing', 'Freemium', 'https://copy.ai', ARRAY['writing', 'marketing', 'social']),
-- Dev Tools
('GitHub Copilot', 'Your AI pair programmer built right into your IDE.', 'Dev Tools', 'Paid', 'https://github.com/features/copilot', ARRAY['coding', 'ide', 'assistant']),
('Cursor', 'The AI-first code editor that dramatically speeds up development.', 'Dev Tools', 'Freemium', 'https://cursor.sh', ARRAY['coding', 'ide', 'editor']),
('v0 by Vercel', 'Generative UI system that builds React components from text.', 'Dev Tools', 'Freemium', 'https://v0.dev', ARRAY['coding', 'ui', 'react']),
('Codeium', 'Free AI code completion and generation tool with vast language support.', 'Dev Tools', 'Free', 'https://codeium.com', ARRAY['coding', 'free', 'assistant']);
