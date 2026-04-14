import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const ADMIN_EMAIL = 'manafkemo@gmail.com';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Security check
    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, credits } = await request.json();

    if (!userId || typeof credits !== 'number') {
      return NextResponse.json({ error: 'Missing userId or valid credits count' }, { status: 400 });
    }

    // Update credits using admin client
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ credits })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Admin Update Credits Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update credits' },
      { status: 500 }
    );
  }
}
