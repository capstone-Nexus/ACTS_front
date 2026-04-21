export type ChatListItem = {
  idx: number;
  title: string;
  userIdx: number;
  createdAt: string;
  updatedAt: string;
};

export type ChatMessageItem = {
  idx: number;
  chatIdx: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

export type StreamEvent =
  | { type: 'chatIdx'; chatIdx: number }
  | { type: 'content'; content: string }
  | { type: 'done' };

const DEFAULT_STREAM_PATH = '/chat/stream';
const DEFAULT_LIST_PATH = '/chat/list';
const DEFAULT_MESSAGES_PATH_TEMPLATE = '/chat/{chatIdx}';
const DEFAULT_TITLE_UPDATE_PATH_TEMPLATE = '/api/chat/{chatIdx}';
const DEFAULT_DELETE_PATH_TEMPLATE = '/api/chat/{chatIdx}';

function baseUrl(): string | undefined {
  const url = process.env.NEXT_PUBLIC_API_URL;
  return url && url.trim() ? url.trim().replace(/\/+$/, '') : undefined;
}

function joinUrl(b: string, path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('accessToken');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function refreshAccessToken(b: string): Promise<string | null> {
  try {

    const tryProxy = async () =>
      fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
      });

    const tryDirect = async () =>
      fetch(joinUrl(b, '/auth/refresh'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
      });

    let res: Response;
    try {
      res = await tryProxy();
      if (res.status === 404) res = await tryDirect();
    } catch {
      res = await tryDirect();
    }

    if (!res.ok) return null;
    const json = await res.json().catch(() => null);

    const token: unknown = json?.data ?? json?.data?.data;
    if (typeof token !== 'string' || !token) return null;

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('accessToken', token);
    }

    return token;
  } catch {
    return null;
  }
}

async function fetchWithAuthRetry(
  b: string,
  path: string,
  init: RequestInit,
  opts?: { retry401?: boolean }
): Promise<Response> {
  const doFetch = () =>
    fetch(joinUrl(b, path), {
      ...init,
      headers: {
        ...(init.headers || {}),
        ...authHeaders(),
      },
    });

  const res = await doFetch();
  if (res.status !== 401) return res;

  if (opts?.retry401 === false) return res;

  const refreshed = await refreshAccessToken(b);
  if (!refreshed) return res;

  return await doFetch();
}

export function getBackendChatPaths() {
  return {
    streamPath: process.env.NEXT_PUBLIC_CHAT_STREAM_PATH || DEFAULT_STREAM_PATH,
    listPath: process.env.NEXT_PUBLIC_CHAT_LIST_PATH || DEFAULT_LIST_PATH,
    messagesPathTemplate: process.env.NEXT_PUBLIC_CHAT_MESSAGES_PATH || DEFAULT_MESSAGES_PATH_TEMPLATE,
    titleUpdatePathTemplate:
      process.env.NEXT_PUBLIC_CHAT_TITLE_UPDATE_PATH || DEFAULT_TITLE_UPDATE_PATH_TEMPLATE,
    deletePathTemplate: process.env.NEXT_PUBLIC_CHAT_DELETE_PATH || DEFAULT_DELETE_PATH_TEMPLATE,
  };
}

export function normalizeChatTitle(title: string | null | undefined): string {
  const t = (title || '').trim();
  if (!t) return '새 채팅';
  if (t.toLowerCase() === 'new chat') return '새 채팅';
  return t;
}

const USER_PROMPT_END_MARKERS = [
  '이 아래부터는 사용자의 메시지와 채팅 기록입니다. 기존 흐름을 참고해 사용자의 메시지에 대해서 응답해주세요.',
  '이 아래부터는 사용자의 메시지와 채팅 기록입니다.'
];

export function stripUserPromptWrapper(content: string): string {
  if (!content) return content;
  for (const marker of USER_PROMPT_END_MARKERS) {
    const idx = content.lastIndexOf(marker);
    if (idx !== -1) {
      return content.slice(idx + marker.length).trimStart();
    }
  }
  return content;
}

async function fetchJsonWithFallback<T>(
  b: string,
  paths: string[],
  init: RequestInit
): Promise<T> {
  let lastStatus: number | undefined;
  for (const path of paths) {
    const res = await fetchWithAuthRetry(b, path, init);
    lastStatus = res.status;

    if (res.status === 401) throw new Error('401');
    if (res.status === 404 || res.status === 400) continue;
    if (!res.ok) throw new Error(`요청 실패 (${res.status})`);

    return (await res.json()) as T;
  }

  throw new Error(`채팅 히스토리 조회 실패 (${lastStatus ?? 0})`);
}

export async function listChats(): Promise<ChatListItem[]> {
  const b = baseUrl();
  if (!b) throw new Error('NEXT_PUBLIC_API_URL 이 설정되지 않았습니다.');
  const { listPath } = getBackendChatPaths();

  const res = await fetchWithAuthRetry(b, listPath, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
    },
    credentials: 'include',
  });

  if (res.status === 401) throw new Error('401');
  if (!res.ok) throw new Error(`채팅 목록 조회 실패 (${res.status})`);
  return (await res.json()) as ChatListItem[];
}

export async function getChatMessages(chatIdx: number): Promise<ChatMessageItem[]> {
  const b = baseUrl();
  if (!b) throw new Error('NEXT_PUBLIC_API_URL 이 설정되지 않았습니다.');
  const { messagesPathTemplate } = getBackendChatPaths();

  const baseTemplate = messagesPathTemplate.replace('{chatIdx}', String(chatIdx));

  const candidates = [
    baseTemplate,
    `/chat/${chatIdx}`,
  ].filter(Boolean);

  const raw = await fetchJsonWithFallback<ChatMessageItem[]>(b, candidates, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
    },
    credentials: 'include',
  });

  return raw.map((m) =>
    m.role === 'user' ? { ...m, content: stripUserPromptWrapper(m.content) } : m
  );
}

export async function streamChat(
  body: { message: string; chatIdx?: number; title?: string },
  opts: { signal?: AbortSignal; onEvent: (event: StreamEvent) => void }
): Promise<void> {
  const b = baseUrl();
  if (!b) throw new Error('NEXT_PUBLIC_API_URL 이 설정되지 않았습니다.');
  const { streamPath } = getBackendChatPaths();

  const res = await fetchWithAuthRetry(
    b,
    streamPath,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
      },
      credentials: 'include',
      body: JSON.stringify(body),
      signal: opts.signal,
    },
    { retry401: true }
  );

  if (res.status === 401) throw new Error('401');
  if (!res.ok) throw new Error(`채팅 전송 실패 (${res.status})`);
  if (!res.body) throw new Error('SSE 응답 바디가 비어있습니다.');

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let sepIndex: number;
    while ((sepIndex = buffer.indexOf('\n\n')) !== -1) {
      const chunk = buffer.slice(0, sepIndex);
      buffer = buffer.slice(sepIndex + 2);

      const lines = chunk.split('\n').map((l) => l.trim());
      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        const dataStr = line.replace(/^data:\s*/, '');
        try {
          const parsed = JSON.parse(dataStr) as StreamEvent;
          if (parsed && typeof parsed === 'object' && 'type' in parsed) {
            opts.onEvent(parsed);
          }
        } catch {
        }
      }
    }
  }
}

export async function updateChatTitle(chatIdx: number, title: string): Promise<void> {
  const b = baseUrl();
  if (!b) throw new Error('NEXT_PUBLIC_API_URL 이 설정되지 않았습니다.');

  const { titleUpdatePathTemplate } = getBackendChatPaths();
  const main = titleUpdatePathTemplate.replace('{chatIdx}', String(chatIdx));

  const candidates = [
    main,
    `/api/chat/${chatIdx}`,
    `/chat/${chatIdx}`,
    `/chat/${chatIdx}/title`,
    `/chat/title/${chatIdx}`,
    `/chat/title?chatIdx=${chatIdx}`,
    `/api/chat/${chatIdx}/title`,
    `/api/chat/title/${chatIdx}`,
    `/api/chat/title?chatIdx=${chatIdx}`,
  ].filter(Boolean);

  let lastStatus: number | undefined;
  for (const path of candidates) {
    const res = await fetchWithAuthRetry(
      b,
      path,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ title }),
      },
      { retry401: true }
    );

    lastStatus = res.status;
    if (res.status === 401) throw new Error('401');
    if (res.status === 404) continue;
    if (!res.ok) throw new Error(`제목 수정 실패 (${res.status})`);
    return;
  }

  throw new Error(`제목 수정 실패 (${lastStatus ?? 0})`);
}

export async function deleteChat(chatIdx: number): Promise<void> {
  const b = baseUrl();
  if (!b) throw new Error('NEXT_PUBLIC_API_URL 이 설정되지 않았습니다.');

  const { deletePathTemplate } = getBackendChatPaths();
  const main = deletePathTemplate.replace('{chatIdx}', String(chatIdx));

  const candidates = [
    main,
    `/api/chat/${chatIdx}`,
    `/chat/${chatIdx}`,
    `/chat/${chatIdx}/delete`,
    `/chat/delete/${chatIdx}`,
    `/chat/delete?chatIdx=${chatIdx}`,
  ].filter(Boolean);

  let lastStatus: number | undefined;
  for (const path of candidates) {
    const res = await fetchWithAuthRetry(
      b,
      path,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
      { retry401: true }
    );

    lastStatus = res.status;
    if (res.status === 401) throw new Error('401');
    if (res.status === 404) continue;
    if (!res.ok) throw new Error(`삭제 실패 (${res.status})`);
    return;
  }

  throw new Error(`삭제 실패 (${lastStatus ?? 0})`);
}


