import { NextResponse } from 'next/server';
import axios from 'axios';

const AI_URL = process.env.NEXT_PUBLIC_AI_URL || '';

export async function POST(req: Request) {
  if (!AI_URL) {
    return NextResponse.json({ error: 'AI 서버 URL이 설정되지 않았습니다.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const response = await axios.post(`${AI_URL.replace(/\/+$/, '')}/predict`, body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const status =
      typeof error === 'object' && error && 'response' in error
        ? ((error as { response?: { status?: number } }).response?.status ?? 502)
        : 502;
    const message =
      typeof error === 'object' && error && 'message' in error ? String((error as { message: string }).message) : 'AI 서버 통신 실패';
    return NextResponse.json({ error: message }, { status });
  }
}
