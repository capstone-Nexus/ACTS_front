  'use client';

  import { useEffect, useMemo, useRef, useState } from 'react';
  import Image from 'next/image';
  import { useRouter } from 'next/navigation';
  import Up from '@/public/images/up.svg';
  import Loading from '@/components/loading';
  import MessageBubble from '@/app/consultation/components/MessageBubble';
  import axios from 'axios';
  import Write from '@/public/images/write.svg';
   import {
     getChatMessages,
      deleteChat,
     listChats,
     normalizeChatTitle,
     streamChat,
     updateChatTitle,
     type ChatListItem,
   } from '@/app/consultation/lib/backendChat';
    import { MoreHorizontal } from 'lucide-react';

   export default function Consultation() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    type UiMessage = { id: string; sender: 'user' | 'bot'; content: string };

    const [chatList, setChatList] = useState<ChatListItem[]>([]);
    const [selectedChatIdx, setSelectedChatIdx] = useState<number | null>(null);

    const [messages, setMessages] = useState<UiMessage[]>([]);
    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
     const [authBlocked, setAuthBlocked] = useState(false);
     const [editingChatIdx, setEditingChatIdx] = useState<number | null>(null);
     const [editingTitle, setEditingTitle] = useState<string>('');
     const [menuChatIdx, setMenuChatIdx] = useState<number | null>(null);
     const [deleteConfirmChatIdx, setDeleteConfirmChatIdx] = useState<number | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);
    const streamAbortRef = useRef<AbortController | null>(null);
    const streamingAssistantIdRef = useRef<string | null>(null);
     const authHandledRef = useRef(false);
     const menuRef = useRef<HTMLDivElement>(null);

    const backendConfigured = !!process.env.NEXT_PUBLIC_API_URL;

    const makeId = () => {
      if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
      return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    };

    const selectedChatTitle = useMemo(() => {
      if (selectedChatIdx == null) return '새 채팅';
      const raw = chatList.find((c) => c.idx === selectedChatIdx)?.title || `Chat #${selectedChatIdx}`;
      return normalizeChatTitle(raw);
    }, [chatList, selectedChatIdx]);

    const formatDate = (iso: string) => {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return iso;
      return d.toLocaleString();
    };

     const handleAuthExpiredOnce = () => {
       if (authHandledRef.current) return;
       authHandledRef.current = true;
       setAuthBlocked(true);
       alert('로그인이 만료되었습니다. 다시 로그인 해주세요.');
       router.replace('/signin');
     };

     const closeMenu = () => {
       setMenuChatIdx(null);
       setDeleteConfirmChatIdx(null);
     };

     useEffect(() => {
       if (menuChatIdx == null) return;
       const onDown = (e: MouseEvent) => {
         const target = e.target as Node | null;
         if (!target) return;
         if (menuRef.current && menuRef.current.contains(target)) return;
         closeMenu();
       };
       window.addEventListener('mousedown', onDown);
       return () => window.removeEventListener('mousedown', onDown);
     }, [menuChatIdx]);

     const refreshChatList = async () => {
      if (!backendConfigured) return;
       if (authBlocked) return;
      setError(null);
      try {
        const list = await listChats();
        setChatList(list);
      } catch (e: any) {
        if (String(e?.message) === '401') {
           handleAuthExpiredOnce();
          return;
        }
        setError(e?.message || '채팅 목록을 불러오지 못했습니다.');
      }
    };

    useEffect(() => {
      if (!backendConfigured) return;
      if (selectedChatIdx != null) return;
      if (messages.length > 0) return;
      if (chatList.length === 0) return;

      const first = chatList[0];
      setSelectedChatIdx(first.idx);
      void loadChat(first.idx);
    }, [backendConfigured, chatList]);

     const loadChat = async (chatIdx: number) => {
      if (!backendConfigured) return;
       if (authBlocked) return;
      setError(null);
      try {
        const items = await getChatMessages(chatIdx);
        const ui: UiMessage[] = items.map((m) => ({
          id: String(m.idx),
          sender: m.role === 'assistant' ? 'bot' : 'user',
          content: m.content,
        }));
        setMessages(ui);
      } catch (e: any) {
        if (String(e?.message) === '401') {
           handleAuthExpiredOnce();
          return;
        }
        setError(e?.message || '채팅 히스토리를 불러오지 못했습니다.');
      }
    };

    const sendViaLocalApi = async (text: string) => {
      // Fallback: existing local proxy (non-SSE)
      try {
        const res = await axios.post('/api/chat', { message: text });
        return res.data?.reply ?? '응답 생성 오류';
      } catch {
        return '서버와 통신 오류';
      }
    };

     const sendMessage = async () => {
      if (!input.trim()) return;
      if (isStreaming) return;
       if (authBlocked) return;

      setError(null);
      const text = input;
      setInput('');

      streamAbortRef.current?.abort();
      streamAbortRef.current = null;
      streamingAssistantIdRef.current = null;

      const userMsg: UiMessage = { id: makeId(), sender: 'user', content: text };
      const assistantId = makeId();
      const botMsg: UiMessage = { id: assistantId, sender: 'bot', content: '' };
      streamingAssistantIdRef.current = assistantId;

      setMessages((prev) => [...prev, userMsg, botMsg]);


       if (backendConfigured) {
        const controller = new AbortController();
        streamAbortRef.current = controller;
        setIsStreaming(true);

        try {
          await streamChat(
            {
              message: text,
              ...(selectedChatIdx != null ? { chatIdx: selectedChatIdx } : {}),
            },
            {
              signal: controller.signal,
              onEvent: (event) => {
                if (event.type === 'chatIdx') {
                  setSelectedChatIdx(event.chatIdx);
                  return;
                }
                if (event.type === 'content') {
                  const id = streamingAssistantIdRef.current;
                  if (!id) return;
                  setMessages((prev) =>
                    prev.map((m) => (m.id === id ? { ...m, content: m.content + event.content } : m))
                  );
                  return;
                }
                if (event.type === 'done') {
                  return;
                }
              },
            }
          );

          await refreshChatList();
        } catch (e: any) {
          if (e?.name === 'AbortError') return;
          if (String(e?.message) === '401') {
             handleAuthExpiredOnce();
            return;
          }
          setError(e?.message || '채팅 전송에 실패했습니다.');
        } finally {
          setIsStreaming(false);
          streamAbortRef.current = null;
          streamingAssistantIdRef.current = null;
        }

        return;
      }

      // 2) Fallback to local /api/chat (no DB, no SSE).
      setIsStreaming(true);
      const reply = await sendViaLocalApi(text);
      setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: reply } : m)));
      setIsStreaming(false);
    };

    useEffect(() => {
      if (!scrollRef.current) return;
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, isStreaming]);

     useEffect(() => {
      setTimeout(() => setIsLoading(false), 200);
    }, []);

    // Initial load: chat list + (optionally) latest chat messages.
     useEffect(() => {
      if (!backendConfigured) {
        setMessages([{ id: makeId(), sender: 'bot', content: '백엔드 API 설정이 없어 임시 채팅만 가능합니다.' }]);
        return;
      }

      void (async () => {
        await refreshChatList();
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) return <Loading />;

    return (
      <div className="w-full h-screen bg-white pt-[80px]">
        <div className="h-full flex">
          {/* Sidebar */}
          <div className="w-[275px] border-r border-[#E5E7EB] flex flex-col">
            <div className="p-4 border-b border-[#E5E7EB]">
              <button
                className="mt-3 w-[240px] h-[40px] bg-[#4A8AEE] text-white text-[13px] font-medium rounded-[7px] hover:bg-[#3A7ADE] transition-colors"
                onClick={() => {
                  setSelectedChatIdx(null);
                  setMessages([]);
                  setError(null);
                }}
              >
                <div className="flex items-center gap-2 justify-center"><Image src={Write} alt="write" width={20} height={20} /><p className="text-[13px] font-medium">새 채팅</p></div>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {backendConfigured && chatList.length === 0 ? (
                <p className="p-4 text-[13px] text-[#6B7280]">채팅 목록이 없습니다.</p>
              ) : null}

              {chatList.map((c) => (
                <div
                  key={c.idx}
                  className={`w-full px-4 py-3 border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors flex items-start gap-2 ${
                    selectedChatIdx === c.idx ? 'bg-[#EEF6FF]' : 'bg-white'
                  }`}
                >
                  <button
                    onClick={() => {
                      streamAbortRef.current?.abort();
                      setSelectedChatIdx(c.idx);
                      void loadChat(c.idx);
                    }}
                    className="flex-1 text-left"
                  >
                     {editingChatIdx === c.idx ? (
                       <div className="flex items-center gap-2">
                         <input
                           value={editingTitle}
                           onChange={(e) => setEditingTitle(e.target.value)}
                           autoFocus
                           className="w-full h-[28px] rounded-[6px] px-2 border border-[#D1D5DB] bg-white text-[13px] outline-none focus:border-[#4A8AEE]"
                           onKeyDown={async (e) => {
                             if (e.key === 'Escape') {
                               e.preventDefault();
                               setEditingChatIdx(null);
                               setEditingTitle('');
                               return;
                             }
                             if (e.key === 'Enter') {
                               e.preventDefault();
                               if (authBlocked) return;
                               const trimmed = editingTitle.trim();
                               if (!trimmed) {
                                 setEditingChatIdx(null);
                                 setEditingTitle('');
                                 return;
                               }
                               try {
                                 await updateChatTitle(c.idx, trimmed);
                                 setEditingChatIdx(null);
                                 setEditingTitle('');
                                 await refreshChatList();
                               } catch (err: any) {
                                 if (String(err?.message) === '401') {
                                   handleAuthExpiredOnce();
                                   return;
                                 }
                                 setError(err?.message || '제목 수정에 실패했습니다.');
                               }
                             }
                           }}
                           onBlur={async () => {
                             if (authBlocked) {
                               setEditingChatIdx(null);
                               setEditingTitle('');
                               return;
                             }
                             const trimmed = editingTitle.trim();
                             setEditingChatIdx(null);
                             setEditingTitle('');
                             if (!trimmed) return;
                             try {
                               await updateChatTitle(c.idx, trimmed);
                               await refreshChatList();
                             } catch (err: any) {
                               if (String(err?.message) === '401') {
                                 handleAuthExpiredOnce();
                                 return;
                               }
                               setError(err?.message || '제목 수정에 실패했습니다.');
                             }
                           }}
                         />
                       </div>
                     ) : (
                       <p className="text-[13px] font-semibold text-[#111827] truncate">
                         {normalizeChatTitle(c.title)}
                       </p>
                     )}
                    <p className="mt-1 text-[11px] text-[#6B7280] truncate">{formatDate(c.updatedAt)}</p>
                  </button>

                   <div className="relative" ref={menuChatIdx === c.idx ? menuRef : undefined}>
                     <button
                       aria-label="채팅 메뉴"
                       className="mt-[2px] w-[28px] h-[28px] rounded-[8px] border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] flex items-center justify-center"
                       onClick={(e) => {
                         e.preventDefault();
                         e.stopPropagation();
                         setError(null);
                         setEditingChatIdx(null);
                         setEditingTitle('');
                         setDeleteConfirmChatIdx(null);
                         setMenuChatIdx((prev) => (prev === c.idx ? null : c.idx));
                       }}
                     >
                       <MoreHorizontal size={16} className="text-[#6B7280]" />
                     </button>

                     {menuChatIdx === c.idx && (
                       <div className="absolute right-0 top-[34px] z-50 w-[150px] rounded-[10px] border border-[#E5E7EB] bg-white shadow-[0_6px_18px_rgba(0,0,0,0.12)] p-1">
                         {deleteConfirmChatIdx === c.idx ? (
                           <div className="p-2">
                             <p className="text-[12px] text-[#111827]">삭제할까요?</p>
                             <div className="mt-2 flex items-center gap-2">
                               <button
                                 className="flex-1 h-[30px] rounded-[8px] bg-red-600 text-white text-[12px] hover:bg-red-700"
                                 onClick={async (e) => {
                                   e.preventDefault();
                                   e.stopPropagation();
                                   if (authBlocked) return;

                                   try {
                                     await deleteChat(c.idx);
                                     if (selectedChatIdx === c.idx) {
                                       setSelectedChatIdx(null);
                                       setMessages([]);
                                     }
                                     closeMenu();
                                     await refreshChatList();
                                   } catch (err: any) {
                                     if (String(err?.message) === '401') {
                                       handleAuthExpiredOnce();
                                       return;
                                     }
                                     setError(err?.message || '삭제에 실패했습니다.');
                                   }
                                 }}
                               >
                                 삭제
                               </button>
                               <button
                                 className="flex-1 h-[30px] rounded-[8px] border border-[#E5E7EB] bg-white text-[12px] hover:bg-[#F9FAFB]"
                                 onClick={(e) => {
                                   e.preventDefault();
                                   e.stopPropagation();
                                   setDeleteConfirmChatIdx(null);
                                 }}
                               >
                                 취소
                               </button>
                             </div>
                           </div>
                         ) : (
                           <>
                             <button
                               className="w-full text-left px-3 py-2 rounded-[8px] text-[13px] hover:bg-[#F9FAFB]"
                               onClick={(e) => {
                                 e.preventDefault();
                                 e.stopPropagation();
                                 setEditingChatIdx(c.idx);
                                 const current = normalizeChatTitle(c.title);
                                 setEditingTitle(current === '새 채팅' ? '' : current);
                                 closeMenu();
                               }}
                             >
                               이름 바꾸기
                             </button>
                             <button
                               className="w-full text-left px-3 py-2 rounded-[8px] text-[13px] text-red-600 hover:bg-[#FEF2F2]"
                               onClick={(e) => {
                                 e.preventDefault();
                                 e.stopPropagation();
                                 setDeleteConfirmChatIdx(c.idx);
                               }}
                             >
                               삭제
                             </button>
                           </>
                         )}
                       </div>
                     )}
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="h-[50px] flex items-center justify-between px-6">
              {error && <p className="text-[12px] text-red-600">{error}</p>}
            </div>

            <div className="flex-1 w-full overflow-y-auto px-6" ref={scrollRef}>
              <div className="max-w-[900px] mx-auto flex flex-col gap-[22px] py-6">
                {messages.length === 0 ? (
                  <MessageBubble sender="bot" content="메시지를 입력하면 대화가 시작됩니다." />
                ) : (
                  messages.map((msg) => <MessageBubble key={msg.id} sender={msg.sender} content={msg.content} />)
                )}
                {isStreaming && <MessageBubble sender="bot" content="..." />}
              </div>
            </div>

            <div className="w-full flex justify-center px-6 pb-6 bg-white border-t border-[#E5E7EB]">
              <div className="w-full max-w-[900px] h-[60px] bg-[#F5F5F5] border border-[#D2D2D2] rounded-[60px] p-[10px] flex items-center justify-between">
                <input
                  className="flex-1 bg-transparent focus:outline-none ml-2 text-base"
                  placeholder="무엇을 알고 싶으세요?"
                  value={input}
                  disabled={isStreaming}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') void sendMessage();
                  }}
                />
                <button
                  className={`w-[45px] h-[45px] rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                    isStreaming ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#4A8AEE] hover:bg-[#3A7ADE]'
                  }`}
                  onClick={() => void sendMessage()}
                  disabled={isStreaming}
                >
                  <Image src={Up} alt="up" width={22} height={22} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
