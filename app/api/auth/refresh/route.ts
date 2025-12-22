// import { NextResponse } from 'next/server';

// function backendBaseUrl(): string | undefined {
//   const url = process.env.NEXT_PUBLIC_API_URL;
//   return url && url.trim() ? url.trim().replace(/\/+$/, '') : undefined;
// }

// export async function POST(req: Request) {
//   const backend = backendBaseUrl();
//   if (!backend) {
//     return NextResponse.json({ error: 'NEXT_PUBLIC_API_URL 이 설정되지 않았습니다.' }, { status: 500 });
//   }

//   const cookie = req.headers.get('cookie') ?? '';

//   const res = await fetch(`${backend}/auth/refresh`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Cookie: cookie,
//     },
//     credentials: 'include',
//     body: JSON.stringify({}),
//   });

//   const contentType = res.headers.get('content-type') || 'application/json';
//   const text = await res.text();

//   return new NextResponse(text, {
//     status: res.status,
//     headers: {
//       'Content-Type': contentType,
//     },
//   });
// }
