import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { analyzeWebsite } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Check Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // 1. Check if tool already exists in global database
    let { data: existingTool, error: fetchError } = await supabase
      .from('tools')
      .select('*')
      .eq('url', url)
      .maybeSingle();

    if (fetchError) throw fetchError;

    let tool = existingTool;

    if (!tool) {
      // 2. Fetch Metadata (Basic Scrape)
      const metadata = await fetchMetadata(url);
      
      // 3. AI Analysis
      const analysis = await analyzeWebsite(url, metadata);
      
      // 4. Insert into tools table
      const { data: newTool, error: insertError } = await supabase
        .from('tools')
        .insert({
          name: analysis.name,
          description: analysis.description,
          category: analysis.category,
          pricing: analysis.pricing,
          url: url,
          tags: analysis.tags,
          user_id: user.id // Mark as user-submitted
        })
        .select()
        .single();
        
      if (insertError) throw insertError;
      tool = newTool;
    }

    // 5. Save to user's library
    const { error: saveError } = await supabase
      .from('user_saved_tools')
      .upsert({ 
        user_id: user.id, 
        tool_id: tool!.id 
      }, { onConflict: 'user_id,tool_id' });

    if (saveError) throw saveError;

    return NextResponse.json({ success: true, tool });

  } catch (error: any) {
    console.error('API Error /api/tools/add:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function fetchMetadata(url: string) {
  try {
    // Basic timeout protection
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ZanZoraBot/1.0; +https://zanzora.ai)'
      }
    });
    
    const html = await res.text();
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    // Try multiple description formats
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i) || 
                      html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i);
    
    return {
      title: titleMatch?.[1]?.trim() || '',
      description: descMatch?.[1]?.trim() || ''
    };
  } catch (e) {
    console.warn(`[Scraper] Could not fetch metadata for ${url}:`, e);
    return { title: '', description: '' };
  }
}
