import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message: string | undefined = body?.message;
    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] | undefined = body?.messages;

    const userMessages =
      Array.isArray(messages) && messages.length > 0
        ? messages
            .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
            .map((m) => ({ role: m.role, content: m.content }))
        : typeof message === 'string' && message.trim()
          ? [{ role: 'user' as const, content: message }]
          : [];

    if (userMessages.length === 0) {
      return NextResponse.json({ error: 'message 또는 messages가 필요합니다.' }, { status: 400 });
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: '너는 대화를 이어가는 어시스턴트다.' }, ...userMessages],
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    const botReply = response.data.choices[0].message.content;

    return NextResponse.json({ reply: botReply });
  } catch (error: any) {
    return NextResponse.json({ error: '에러 발생' }, { status: 500 });
  }
}