import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content } = await request.json();

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ error: 'Feedback content is required' }, { status: 400 });
    }

    // 1. Insert into Supabase to get the sequence number (feedback count)
    const { data, error } = await supabase
      .from('feedbacks')
      .insert([
        {
          user_id: user.id,
          user_email: user.email,
          content: content.trim(),
        },
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Database Error inserting feedback:', error);
      throw error;
    }

    const feedbackNumber = data.id;

    // 2. Send to Telegram Bot
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      // Escape HTML characters to prevent breaking the HTML parser
      const safeContent = content.trim()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
        
      const message = `🚀 <b>New Feedback Received (#${feedbackNumber})</b>\n\n` +
                      `📧 <b>User:</b> ${user.email}\n` +
                      `💬 <b>Message:</b> ${safeContent}\n\n` +
                      `📅 <b>Date:</b> ${new Date().toLocaleString()}`;

      try {
        const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
          }),
        });

        if (!telegramRes.ok) {
          const errorData = await telegramRes.json();
          console.error('Telegram API Error:', errorData);
        }
      } catch (telegramError) {
        console.error('Failed to send Telegram notification:', telegramError);
        // We don't fail the whole request if Telegram fails, 
        // as long as it's saved in DB.
      }
    } else {
      console.warn('Telegram environment variables missing. Notification skipped.');
    }

    return NextResponse.json({ success: true, id: feedbackNumber });
  } catch (error: any) {
    console.error('Feedback API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
