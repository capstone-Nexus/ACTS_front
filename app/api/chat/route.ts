import { NextResponse } from 'next/server';
import axios from 'axios';

let chatHistory: { role: string; content: string }[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message;

    chatHistory.push({ role: 'user', content: message });

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: '너는 대화를 이어가는 어시스턴트다.' }, ...chatHistory],
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

    // history에 AI 답변도 추가
    chatHistory.push({ role: 'assistant', content: botReply });

    return NextResponse.json({ reply: botReply });
  } catch (error: any) {
    return NextResponse.json({ error: '에러 발생' }, { status: 500 });
  }
}
