'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SurveyCard from '@/components/SurveyCard';

const surveyQuestions = ['나는 세심한 것에 주의를 기울이지 못해서 사소한 실수를 자주 한다.', '나는 과제나 일을 끝까지 완수하지 못하고 중간에 포기하는 경우가 많다.', '나는 지루하거나 긴 시간이 필요한 활동에서 집중하기 어렵다.', '나는 대화 중에 다른 생각을 하거나, 상대방의 말을 놓치는 경우가 많다.', '나는 공부나 일을 체계적으로 정리하고 계획하는 것이 어렵다.', '나는 일을 미루는 습관이 있다.', '나는 주변 환경에 쉽게 산만해진다.', '나는 계획했던 일을 자주 잊어버린다.', '나는 여러 가지 일을 동시에 하다가 마무리를 못 짓는 경우가 많다.', '나는 지시에 따라 일을 진행하는 데 어려움을 겪는다.', '나는 필요한 물건(책, 연필 등)을 자주 잃어버린다.', '나는 기다리는 상황에서 쉽게 조급해진다.', '나는 남의 말을 끝까지 듣지 않고 끼어드는 경우가 많다.', '나는 오래 앉아 있는 것이 힘들다.', '나는 가만히 있지 못하고 손발을 꼼지락거리곤 한다.', '나는 차례를 기다리기 어렵다.', '나는 불필요하게 말을 많이 하는 편이다.', '나는 충동적으로 결정을 내려 후회하는 경우가 많다.', '나는 화가 쉽게 나고 감정을 조절하기 어렵다.', '나는 작은 자극에도 쉽게 집중이 흐트러진다.'];

export default function Survey() {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(surveyQuestions.length).fill(null));
  const router = useRouter();
  
  //문항 선택 로직
  const handleAnswer = (index: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);

    //스크롤
    window.scrollBy({ top: 200, behavior: 'smooth' });
  };

  const allAnswered = answers.every(a => a !== null);
  const progress = (answers.filter(a => a !== null).length / surveyQuestions.length) * 100;

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] flex flex-col items-center py-12">
      {/* 헤더 */}
      <div className="w-[950px] h-[180px] bg-white mt-[100px] rounded-[30px] flex flex-col items-center justify-center gap-3 shadow-[0_4px_10px_rgba(0,0,0,0.15)]">
        <p className="text-[32px] font-bold bg-gradient-to-r from-[#59C0EE] to-[#4E59F4] bg-clip-text text-transparent">ADHD 자가진단 설문</p>
        <p className="text-[18px] font-medium text-[#737373]">총 20개 문항 - 약 5분 소요</p>
        <div className="w-[90%] h-[10px] bg-[#D9D9D9] rounded-[60px] mt-3 overflow-hidden">
          <div className="h-full rounded-[60px] bg-gradient-to-r from-[#59C0EE] to-[#4E59F4] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* 본문 */}
      <div className="w-[950px] bg-white rounded-[30px] mt-[35px] shadow-[0_4px_10px_rgba(0,0,0,0.15)] flex flex-col items-center p-[50px]">
        <p className="text-[28px] font-bold self-start mb-6">🎯 집중력 체크</p>

        {surveyQuestions.map((question, index) => (
          <div key={index} className="w-full">
            <SurveyCard title={question} selected={answers[index] ?? undefined} onSelect={value => handleAnswer(index, value)} />
          </div>
        ))}

        {/* 제출 버튼 */}
        <div
          className={`w-[150px] h-[55px] mt-[50px] flex items-center justify-center rounded-[60px] text-white text-[18px] font-semibold transition-all duration-200 ${allAnswered ? 'bg-[#4A8AEE] cursor-pointer hover:bg-[#4077CE]' : 'bg-gray-300 cursor-not-allowed'}`}
          onClick={() => {
            if (allAnswered) {
              console.log('설문 완료!', answers);
              router.push('/test');
            }
          }}
        >
          제출
        </div>
      </div>
    </div>
  );
}
