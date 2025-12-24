'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function TestResultPage() {
  const [sendState, setSendState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [sendError, setSendError] = useState<string | null>(null);
  const [aiReply, setAiReply] = useState<any>(null);
  const [payload, setPayload] = useState<any>(null);
  const autoSentRef = useRef(false);

  // ✅ AI 서버로 전송
  const sendToAI = async (data: any) => {
    setSendState('sending');
    setSendError(null);
    setAiReply(null);

    try {
      const AI_URL = process.env.NEXT_PUBLIC_AI_URL;
      
      console.log('📡 전송 시작:', `${AI_URL}/predict`);
      console.log('📦 Payload 크기:', JSON.stringify(data).length, 'bytes');
      
      const response = await axios.post(`${AI_URL}/predict`, data, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000,
      });

      setSendState('success');
      setAiReply(response.data);
      
      // ✅ 응답 확인
      console.log('='.repeat(80));
      console.log('✅ AI 서버 응답');
      console.log('='.repeat(80));
      console.log('Status:', response.status);
      console.log('Response Data:');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('='.repeat(80));

    } catch (error: any) {
      console.error('='.repeat(80));
      console.error('❌ AI 전송 실패');
      console.error('='.repeat(80));
      console.error('Error:', error);
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
      console.error('='.repeat(80));
      
      setSendState('error');
      setSendError(error.response?.data?.message || error.message || 'AI 서버 통신 실패');
    }
  };

  // ✅ 페이지 로드 시 자동 전송
  useEffect(() => {
    if (autoSentRef.current) return;
    
    try {
      const finalData = JSON.parse(sessionStorage.getItem('final_test_data') || '{}');
      
      if (!finalData.survey || !finalData.cat_raw) {
        setSendState('error');
        setSendError('테스트 데이터가 없습니다. 처음부터 다시 시작해주세요.');
        return;
      }
      
      // ✅ 전송 전 데이터 확인
      console.log('='.repeat(80));
      console.log('📤 AI 서버로 전송할 데이터');
      console.log('='.repeat(80));
      console.log(JSON.stringify(finalData, null, 2));
      console.log('='.repeat(80));
      
      setPayload(finalData);
      autoSentRef.current = true;
      void sendToAI(finalData);
      
    } catch (error) {
      console.error('❌ 데이터 로드 오류:', error);
      setSendState('error');
      setSendError('데이터를 불러오는 중 오류가 발생했습니다.');
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      alert('데이터를 클립보드에 복사했습니다.');
    } catch {
      alert('복사에 실패했습니다.');
    }
  };

  const handleReset = () => {
    sessionStorage.removeItem('survey_answers');
    sessionStorage.removeItem('cat_raw_data');
    sessionStorage.removeItem('final_test_data');
    window.location.href = '/test/survey';
  };

  const handleRetry = () => {
    if (payload) {
      void sendToAI(payload);
    }
  };

  // ✅ 디버그 로그 함수
  const handleDebugLog = () => {
    console.clear();
    
    const surveyData = sessionStorage.getItem('survey_answers');
    const rawData = sessionStorage.getItem('cat_raw_data');
    const finalData = sessionStorage.getItem('final_test_data');
    
    console.log('='.repeat(100));
    console.log('🔍 전체 SessionStorage 데이터');
    console.log('='.repeat(100));
    
    console.log('\n📋 1. Survey Answers:');
    console.log(surveyData ? JSON.parse(surveyData) : 'null');
    
    console.log('\n🎯 2. CAT Raw Data:');
    if (rawData) {
      const parsed = JSON.parse(rawData);
      Object.keys(parsed).forEach(key => {
        console.log(`  - ${key}:`, parsed[key]?.length || 0, '개');
        console.log(`    첫 데이터:`, parsed[key]?.[0]);
      });
    } else {
      console.log('null');
    }
    
    console.log('\n📦 3. Final Test Data:');
    console.log(finalData ? JSON.parse(finalData) : 'null');
    
    console.log('\n' + '='.repeat(100));
  };

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] flex flex-col items-center py-12">
      <div className="w-[950px] bg-white rounded-[10px] mt-[80px] shadow-[0_4px_10px_rgba(0,0,0,0.15)] flex flex-col items-center p-[50px]">
        
        {/* 헤더 */}
        <div className="w-full flex flex-col items-center mb-8">
          <p className="text-[32px] font-bold bg-gradient-to-r from-[#59C0EE] to-[#4E59F4] bg-clip-text text-transparent">
            ADHD 테스트 결과
          </p>
          <p className="text-[16px] font-medium text-[#737373] mt-2">
            AI가 당신의 집중력을 분석하고 있습니다
          </p>
        </div>

        {/* Payload 표시 */}
        {payload && (
          <div className="w-full mt-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[18px] font-bold text-[#474747]">📊 전송 데이터</p>
              <div className="flex gap-2">
                <button
                  onClick={handleDebugLog}
                  className="px-3 py-2 bg-gray-200 text-gray-700 text-[12px] font-medium rounded hover:bg-gray-300 transition-colors"
                >
                  🔍 Console 출력
                </button>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-[#4A8AEE] text-white text-[14px] font-medium rounded-lg hover:bg-[#3A7ADE] transition-colors"
                >
                  JSON 복사
                </button>
              </div>
            </div>
            <pre className="w-full bg-[#111827] text-[#E5E7EB] rounded-[10px] p-4 text-[12px] overflow-x-auto max-h-[300px]">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>
        )}

        {/* AI 응답 */}
        <div className="w-full mt-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[18px] font-bold text-[#474747]">🤖 AI 분석 결과</p>
            {sendState !== 'sending' && sendState !== 'idle' && (
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-[#4A8AEE] text-white text-[14px] font-medium rounded-lg hover:bg-[#3A7ADE] transition-colors"
              >
                다시 전송
              </button>
            )}
          </div>

          {sendState === 'idle' && (
            <div className="w-full bg-[#F3F4F6] border border-[#D1D5DB] rounded-[10px] p-6 text-center">
              <p className="text-[14px] text-[#6B7280]">🔄 데이터를 준비하고 있습니다...</p>
            </div>
          )}

          {sendState === 'sending' && (
            <div className="w-full bg-[#F3F4F6] border border-[#D1D5DB] rounded-[10px] p-6 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-[#4A8AEE] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[14px] text-[#6B7280]">⏳ AI가 분석 중입니다...</p>
              </div>
            </div>
          )}

          {sendState === 'error' && sendError && (
            <div className="w-full bg-[#FEF2F2] border border-[#FECACA] rounded-[10px] p-6">
              <p className="text-[16px] text-[#991B1B] font-semibold mb-2">❌ 전송 실패</p>
              <p className="text-[14px] text-[#991B1B] whitespace-pre-wrap">{sendError}</p>
            </div>
          )}

          {sendState === 'success' && aiReply && (
            <div className="w-full bg-[#ECFDF5] border border-[#A7F3D0] rounded-[10px] p-6">
              <p className="text-[16px] text-[#065F46] font-semibold mb-3">✅ 분석 완료</p>
              <div className="bg-white rounded-lg p-4">
                <pre className="text-[13px] text-[#065F46] whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(aiReply, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="w-full mt-10 flex items-center justify-between gap-4">
          <button
            onClick={handleReset}
            className="flex-1 py-3 bg-white border-2 border-[#CDD0D4] text-[#474747] text-[14px] font-semibold rounded-lg hover:bg-[#F9FAFB] transition-colors"
          >
            처음부터 다시하기
          </button>

          <Link
            href="/"
            className="flex-1 py-3 text-center bg-[#4A8AEE] text-white text-[14px] font-semibold rounded-lg hover:bg-[#3A7ADE] transition-colors"
          >
            홈으로 가기
          </Link>
        </div>
      </div>
    </div>
  );
}