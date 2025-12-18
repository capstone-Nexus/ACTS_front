import { NextResponse } from 'next/server';

function backendBaseUrl(): string | undefined {
  const url = process.env.NEXT_PUBLIC_API_URL;
  return url && url.trim() ? url.trim().replace(/\/+$/, '') : undefined;
}

/**
 * Proxy refresh request to backend.
 *
 * Why:
 * - In this project, `refreshToken` is currently stored as a cookie on the frontend origin (localhost),
 *   so it is NOT sent to the backend domain on cross-origin requests.
 * - This route receives that cookie (same-origin), then forwards it to the backend refresh endpoint.
 */
export async function POST(req: Request) {
  const backend = backendBaseUrl();
  if (!backend) {
    return NextResponse.json({ error: 'NEXT_PUBLIC_API_URL 이 설정되지 않았습니다.' }, { status: 500 });
  }

  const cookie = req.headers.get('cookie') ?? '';

  const res = await fetch(`${backend}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie,
    },
    // backend may also rely on cookie attributes; keep credentials behavior.
    credentials: 'include',
    body: JSON.stringify({}),
  });

  const contentType = res.headers.get('content-type') || 'application/json';
  const text = await res.text();

  return new NextResponse(text, {
    status: res.status,
    headers: {
      'Content-Type': contentType,
    },
  });
}




