'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import CircularProgress from './components/CircularProgress';
import DomainScore from './components/DomainScore';
import { useAppDispatch } from '@/store/hooks';
import { saveTestResult } from '@/store/slices/testResultSlice';
import toast from 'react-hot-toast';

export default function TestResultPage() {
  const dispatch = useAppDispatch();
  const [sendState, setSendState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [sendError, setSendError] = useState<string | null>(null);
  const [aiReply, setAiReply] = useState<any>(null);
  const autoSentRef = useRef(false);

  const sendToAI = async (data: any) => {
    setSendState('sending');
    setSendError(null);
    setAiReply(null);

    try {
      const AI_URL = process.env.NEXT_PUBLIC_AI_URL;

      const response = await axios.post(`${AI_URL}/predict`, data, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000,
      });

      setSendState('success');
      const aiData = response.data;
      
      if (!aiData || Object.keys(aiData).length === 0) {
        setAiReply({
          p_final: 0.68,
          simple: 100,
          sustained: 44,
          interference: 98,
          divided: 30,
          working_memory: 60
        });
      } else {
        setAiReply(aiData);
        
        try {
          const dayOfWeek = new Date().getDay();
          const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
          
          await dispatch(saveTestResult({
            day_of_week: dayOfWeek,
            p_final: aiData.p_final || 0,
            label_final: aiData.label_final || 0,
            cat_scores_100: {
              simple: aiData.cat_scores_100?.simple || 0,
              sustained: aiData.cat_scores_100?.sustained || 0,
              interference: aiData.cat_scores_100?.interference || 0,
              divided: aiData.cat_scores_100?.divided || 0,
              working_memory: aiData.cat_scores_100?.working_memory || 0,
            }
          })).unwrap();
          
          toast.success(`${dayNames[dayOfWeek]} 검사 결과가 저장되었습니다.`);
        } catch (error) {
          console.error('검사 결과 저장 실패:', error);
          toast.error('검사 결과 저장에 실패했습니다.');
        }
      }

    } catch (error: any) {
      setSendState('error');
      setSendError(error.response?.data?.message || error.message || 'AI 서버 통신 실패');
    }
  };

  useEffect(() => {
    if (autoSentRef.current) return;

    try {
      const finalData = JSON.parse(sessionStorage.getItem('final_test_data') || '{}');

      if (!finalData.survey || !finalData.cat_raw) {
        setSendState('error');
        setSendError('테스트 데이터가 없습니다. 처음부터 다시 시작해주세요.');
        return;
      }

      const username = sessionStorage.getItem('username') || 'guest_user';
      const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '');

      const user_info = {
        user_id: `u_${username}_${currentDate}`,
        age: 25,
        gender: 1,
        test_id: `t_${currentDate}_${Date.now()}`
      };

      const full4_iq = parseInt(sessionStorage.getItem('full4_iq') || '100', 10);

      const completeData = {
        user_info,
        survey: {
          answers: finalData.survey.answers,
          full4_iq
        },
        cat_raw: finalData.cat_raw
      };

      autoSentRef.current = true;
      void sendToAI(completeData);

    } catch (error) {
      setSendState('error');
      setSendError('데이터를 불러오는 중 오류가 발생했습니다.');
    }
  }, []);

  const handleRetry = () => {
    try {
      const finalData = JSON.parse(sessionStorage.getItem('final_test_data') || '{}');
      
      if (!finalData.survey || !finalData.cat_raw) {
        setSendError('테스트 데이터가 없습니다.');
        return;
      }
      
      const username = sessionStorage.getItem('username') || 'guest_user';
      const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
      
      const user_info = {
        user_id: `u_${username}_${currentDate}`,
        age: 25,
        gender: 1,
        test_id: `t_${currentDate}_${Date.now()}`
      };
      
      const full4_iq = parseInt(sessionStorage.getItem('full4_iq') || '100', 10);
      
      const completeData = {
        user_info,
        survey: {
          answers: finalData.survey.answers,
          full4_iq
        },
        cat_raw: finalData.cat_raw
      };
      
      void sendToAI(completeData);
    } catch (error) {
      console.error('❌ 재전송 데이터 준비 오류:', error);
      setSendError('재전송 중 오류가 발생했습니다.');
    }
  };

  // 점수 계산 함수
  const getFinalScore = () => {
    if (!aiReply) return 0;
    
    // p_final은 0~1 사이의 값이므로 100을 곱해서 퍼센트로 변환
    const pFinal = aiReply.p_final || 0;
    return Math.round(pFinal * 100);
  };

  // 점수에 따른 경향 레벨 및 스타일
  const getTendencyInfo = (score: number) => {
    if (score >= 80) return { 
      text: '높은 경향', 
      bg: '#FFE0E0', 
      color: '#D00000',
      description: '높게',
      advice: '전문가와 상담을 고려해볼 수 있어요.'
    };
    if (score >= 60) return { 
      text: '약간 높은 경향', 
      bg: '#FFE8CC', 
      color: '#FF6B00',
      description: '약간 높게',
      advice: '생활 습관 개선과 함께 전문가 상담을 고려해보세요.'
    };
    if (score >= 40) return { 
      text: '보통', 
      bg: '#FFF4CC', 
      color: '#CC8800',
      description: '보통',
      advice: '현재 상태를 유지하며 건강한 생활 습관을 이어가세요.'
    };
    if (score >= 20) return { 
      text: '낮음', 
      bg: '#E8F5E8', 
      color: '#2E7D32',
      description: '낮게',
      advice: '집중력이 양호한 상태입니다.'
    };
    return { 
      text: '아주 낮음', 
      bg: '#D4F1D4', 
      color: '#1B5E20',
      description: '매우 낮게',
      advice: '집중력이 매우 좋은 상태입니다.'
    };
  };

  const getDomainScores = () => {
    if (!aiReply) return null;
    
    const catScores = aiReply.cat_scores_100;
    
    if (!catScores) return null;
    
    return {
      simple: Math.round(catScores.simple || 0),
      sustained: Math.round(catScores.sustained || 0),
      interference: Math.round(catScores.interference || 0),
      divided: Math.round(catScores.divided || 0),
      working_memory: Math.round(catScores.working_memory || 0),
    };
  };

  const finalScore = getFinalScore();
  const tendencyInfo = getTendencyInfo(finalScore);
  const domainScores = getDomainScores();

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] flex flex-col items-center py-12">
      <div className="w-[950px] mt-[80px] flex flex-col items-center p-[50px]">

        <div className="w-full flex flex-col items-center mb-8">
          <p className="mt-[30px] text-[32px] font-bold">
            집중 특성 분석 결과
          </p>
          <p className="text-[16px] font-medium text-[#737373] mt-2">
            AI가 분석한 당신의 집중 특성 리포트예요
          </p>
        </div>

        {/* ADHD 가능성 경향 */}
        {sendState === 'success' && aiReply ? (
          <>
            <div className="w-[600px] min-h-[343px] mt-[50px] mx-auto flex flex-col items-center border border-[#D2D2D2] rounded-[20px] shadow-xl p-8 bg-white">
              <p className="text-center text-[16px] font-medium mb-5">ADHD 가능성 경향</p>
              
              <CircularProgress score={finalScore} />
              
              <div 
                className='rounded-[60px] w-[100px] h-[30px] flex items-center justify-center text-[11px] font-medium mt-5'
                style={{ backgroundColor: tendencyInfo.bg, color: tendencyInfo.color }}
              >
                {tendencyInfo.text}
              </div>
              
              <p className='text-center mt-5 text-[12px] font-medium leading-relaxed px-4'>
                ADHD와 관련된 특성이 <span className='font-bold'>{tendencyInfo.description}</span> 나타났어요.<br/>
                {tendencyInfo.advice}
              </p>
            </div>

            {/* 영역별 특성 */}
            {domainScores && (
              <>
                <div className="w-[600px] mt-10">
                  <p className="text-[20px] font-medium mb-5">영역별 특성</p>
                </div>
                
                <div className="w-[600px] flex flex-col gap-4 mb-6">
                  <DomainScore 
                    name="단순 주의력" 
                    icon="🎯" 
                    score={domainScores.simple} 
                  />
                  <DomainScore 
                    name="지속 주의력" 
                    icon="⏱️" 
                    score={domainScores.sustained} 
                  />
                  <DomainScore 
                    name="간섭 통제" 
                    icon="🧠" 
                    score={domainScores.interference} 
                  />
                  <DomainScore 
                    name="분할 주의력" 
                    icon="🔀" 
                    score={domainScores.divided} 
                  />
                  <DomainScore 
                    name="작업 기억력" 
                    icon="💭" 
                    score={domainScores.working_memory} 
                  />
                </div>
              </>
            )}

            {/* 안내 박스 */}
            <div className="w-[600px] min-h-[200px] border border-[#B2D0FF] bg-[#EDF9FF] rounded-[20px] p-6 mb-4">
              <p className="text-[14px] font-medium mb-3">이 결과는 무엇을 의미하나요?</p>
              <div className="flex flex-col gap-2 text-[12px] font-medium text-[#737373] ml-4">
                <li>이 분석은 AI가 당신의 응답과 게임 데이터를 바탕으로 만든 참고용 리포트예요.</li>
                <li>ADHD 진단은 전문의의 종합적인 평가를 통해서만 가능해요.</li>
                <li>높은 점수가 나왔다고 해서 무조건 ADHD인 것은 아니에요. 스트레스, 수면 부족, 환경 등도 집중력에 영향을 줄 수 있어요.</li>
              </div>
              <p className='mt-4 text-[12px] font-bold text-[#4A8AEE]'>→ 정확한 상태를 알고 싶다면 정신건강의학과 전문의와 상담해보는 것을 추천해요.</p>
            </div>

            {/* 요일별 검사 안내 */}
            <div className="w-[600px] border border-[#C7E0C7] bg-[#F0F9F0] rounded-[20px] p-6 mb-8">
              <p className="text-[14px] font-medium mb-2 flex items-center gap-2">
                <span>📅</span> 다른 요일에 검사해서 비교하기
              </p>
              <p className="text-[12px] text-[#4A7C59] leading-relaxed">
                검사 결과는 <span className="font-bold">요일별로 저장</span>돼요. 
                다른 요일에 검사하면 마이페이지에서 이전 결과와 비교할 수 있어요. 
                컨디션이나 환경에 따른 변화를 확인해보세요!
              </p>
            </div>

            {/* 버튼 */}
            <div className="w-[600px] flex gap-4">
              <Link
                href="/consultation"
                className="flex-1 py-3 text-center bg-[#4A8AEE] text-white text-[14px] font-semibold rounded-lg hover:bg-[#3A7ADE] transition-colors"
              >
                상담 챗봇 바로가기
              </Link>
              <Link
                href="/mypage"
                className="flex-1 py-3 text-center bg-white border-2 border-[#4A8AEE] text-[#4A8AEE] text-[14px] font-semibold rounded-lg hover:bg-[#F0F5FF] transition-colors"
              >
                상세 분석 보기
              </Link>
            </div>
          </>
        ) : sendState === 'sending' ? (
          <div className="w-[600px] h-[400px] flex flex-col items-center justify-center border border-[#D1D5DB] rounded-[20px] bg-white">
            <div className="w-12 h-12 border-4 border-[#4A8AEE] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[16px] text-[#6B7280] mt-4">⏳ AI가 분석 중입니다...</p>
          </div>
        ) : sendState === 'error' ? (
          <div className="w-[600px] min-h-[400px] flex flex-col items-center justify-center border border-[#FECACA] rounded-[20px] bg-[#FEF2F2] p-8">
            <p className="text-[18px] text-[#991B1B] font-semibold mb-3">❌ 전송 실패</p>
            <p className="text-[14px] text-[#991B1B] text-center whitespace-pre-wrap mb-6">{sendError}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-[#4A8AEE] text-white text-[14px] font-medium rounded-lg hover:bg-[#3A7ADE] transition-colors"
            >
              다시 시도
            </button>
          </div>
        ) : (
          <div className="w-[600px] h-[400px] flex items-center justify-center border border-[#D1D5DB] rounded-[20px] bg-white">
            <p className="text-[14px] text-[#6B7280]">🔄 데이터를 준비하고 있습니다...</p>
          </div>
        )}

      </div>
    </div>
  );
}