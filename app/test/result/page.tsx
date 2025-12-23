'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { clearCatFeatures, getCatFeatures } from '@/app/test/cat/lib/catFeatures';
import API from '@/lib/axios';
import axios from 'axios';

const REQUIRED_KEYS = [
  'simple_sel_rt_mean',
  'simple_sel_rt_sd',
  'sustained_omission',
  'sustained_commission',
  'interference_omission',
  'interference_commission',
] as const;

export default function TestResultPage() {
  const [refresh, setRefresh] = useState(0);
  const [sendState, setSendState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [sendError, setSendError] = useState<string | null>(null);
  const [aiReply, setAiReply] = useState<string | null>(null);
  const autoSentRef = useRef(false);

  const features = useMemo(() => {
    void refresh;
    return getCatFeatures();
  }, [refresh]);

  const payload = useMemo(() => {
    return {
      ...features,
    };
  }, [features]);

  const missing = REQUIRED_KEYS.filter((k) => features[k] === undefined);

  const sendToAI = async () => {
    if (missing.length > 0) {
      setSendState('error');
      setSendError(`필수 피처 누락: ${missing.join(', ')}`);
      return;
    }

    setSendState('sending');
    setSendError(null);
    setAiReply(null);

    // 1) Prefer backend (baseURL = NEXT_PUBLIC_API_URL) if configured.
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    const backendPath = process.env.NEXT_PUBLIC_AI_REPORT_PATH || '/ai/report';

    try {
      if (backendUrl) {
        const res = await API.post(backendPath, payload);
        setSendState('success');
        setAiReply(typeof res.data === 'string' ? res.data : JSON.stringify(res.data, null, 2));
        return;
      }
    } catch (e: unknown) {
      // Fall through to local /api/chat as a best-effort.
      console.error(e);
    }

    // 2) Fallback: send as prompt to local OpenAI chat proxy.
    try {
      const prompt =
        `아래는 CAT 최소 피처(6개 + 선택 p_survey) payload입니다.\n` +
        `각 지표를 사람이 이해하기 쉽게 해석하고, ADHD 가능성/주의력 특성을 요약해 주세요.\n` +
        `가능하면 짧은 bullet과 권장 다음 단계(진단/상담/생활습관)를 제안해 주세요.\n\n` +
        `${JSON.stringify(payload)}`;

      const res = await axios.post('/api/chat', { message: prompt });
      setSendState('success');
      setAiReply(res.data?.reply ?? null);
    } catch (e: unknown) {
      setSendState('error');
      const error = e as { response?: { data?: { error?: string } }; message?: string };
      setSendError(error?.response?.data?.error || error?.message || 'AI 전송 실패');
    }
  };

  useEffect(() => {
    // Auto-send once when payload is complete.
    if (autoSentRef.current) return;
    if (missing.length > 0) return;
    autoSentRef.current = true;
    void sendToAI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missing.length]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      alert('payload를 클립보드에 복사했습니다.');
    } catch {
      alert('복사에 실패했습니다.');
    }
  };

  const handleReset = () => {
    clearCatFeatures();
    setRefresh((x) => x + 1);
  };

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] flex flex-col items-center py-12">
      <div className="w-[950px] bg-white rounded-[10px] mt-[80px] shadow-[0_4px_10px_rgba(0,0,0,0.15)] flex flex-col items-center p-[50px]">
        <div className="w-full flex flex-col items-center mb-8">
          <p className="text-[32px] font-bold">CAT 최소 피처 확인</p>
          <p className="text-[16px] font-medium text-[#737373] mt-2">
            백엔드로 보낼 최소 세트(6개 + 선택 1) payload를 확인합니다.
          </p>
        </div>

        {missing.length > 0 ? (
          <div className="w-full bg-[#FFFBEB] border border-[#FEF3C7] rounded-[10px] p-6">
            <p className="text-[14px] text-[#78350F] font-semibold">누락된 필수 피처</p>
            <ul className="mt-2 ml-5 text-[14px] text-[#78350F]">
              {missing.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="w-full bg-[#ECFDF5] border border-[#A7F3D0] rounded-[10px] p-6">
            <p className="text-[14px] text-[#065F46] font-semibold">필수 피처 6개가 모두 입력되었습니다.</p>
          </div>
        )}

        <div className="w-full mt-8">
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-bold text-[#474747]">payload</p>
            <button
              onClick={handleCopy}
              className="w-[140px] h-[40px] bg-[#4A8AEE] text-white text-[14px] font-medium hover:bg-[#3A7ADE] transition-colors"
            >
              JSON 복사
            </button>
          </div>
          <pre className="mt-3 w-full bg-[#111827] text-[#E5E7EB] rounded-[10px] p-4 text-[12px] overflow-x-auto">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </div>

        <div className="w-full mt-8">
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-bold text-[#474747]">AI 전송</p>
            <button
              onClick={sendToAI}
              disabled={sendState === 'sending'}
              className={`w-[140px] h-[40px] text-[14px] font-medium transition-colors ${
                sendState === 'sending'
                  ? 'bg-gray-300 text-white cursor-not-allowed'
                  : 'bg-[#4A8AEE] text-white hover:bg-[#3A7ADE]'
              }`}
            >
              {sendState === 'sending' ? '전송 중...' : 'AI로 전송'}
            </button>
          </div>

          {sendState === 'error' && sendError && (
            <div className="mt-3 w-full bg-[#FEF2F2] border border-[#FECACA] rounded-[10px] p-4">
              <p className="text-[13px] text-[#991B1B] font-semibold">전송 실패</p>
              <p className="mt-1 text-[12px] text-[#991B1B] whitespace-pre-wrap">{sendError}</p>
            </div>
          )}

          {sendState === 'success' && (
            <div className="mt-3 w-full bg-[#ECFDF5] border border-[#A7F3D0] rounded-[10px] p-4">
              <p className="text-[13px] text-[#065F46] font-semibold">전송 성공</p>
              {aiReply && (
                <pre className="mt-2 text-[12px] text-[#065F46] whitespace-pre-wrap">{aiReply}</pre>
              )}
            </div>
          )}
        </div>

        <div className="w-full mt-10 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="w-[140px] h-[44px] bg-white border border-[#CDD0D4] text-[#474747] text-[14px] font-medium hover:bg-[#F9FAFB] transition-colors"
          >
            입력 초기화
          </button>

          <Link
            href="/test/cat/before"
            className="w-[180px] h-[44px] flex justify-center items-center bg-[#4A8AEE] text-white text-[14px] font-medium hover:bg-[#3A7ADE] transition-colors"
          >
            CAT 다시하기
          </Link>
        </div>
      </div>
    </div>
  );
}


