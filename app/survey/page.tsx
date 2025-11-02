'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SurveyCard from '@/components/SurveyCard';

const surveyQuestions = ['1. 나는 중요한 일을 할 때도 쉽게 집중이 흐트러진다.','2. 나는 과제를 끝까지 마무리하는 데 어려움을 느낀다.','3. 나는 일을 하다가 자주 다른 생각이나 활동으로 옮겨간다.','4. 나는 주어진 지시사항을 끝까지 따르지 못할 때가 많다.','5. 나는 반복적이거나 지루한 작업에서 쉽게 실수를 한다.','6. 나는 다른 사람이 말할 때 집중하지 못하고 놓칠 때가 많다.','7. 나는 책이나 글을 읽을 때 집중력이 오래 유지되지 않는다.','8. 나는 일이나 과제를 정리·계획하는 데 어려움이 있다.','9. 나는 약속이나 일정을 자주 잊어버린다.','10. 나는 물건(책, 휴대폰, 필기구 등)을 자주 잃어버리거나 잘 챙기지 못한다.','11. 나는 대화 중 상대방의 말을 끝까지 기다리지 못하고 끼어드는 경우가 많다.','12. 나는 즉흥적으로 행동하여 후회할 때가 많다.','13. 나는 줄을 서거나 기다리는 상황에서 차분히 기다리기 어려움.','14. 나는 흥분되거나 기분이 고조되면 행동을 통제하기 힘들다.','15. 나는 위험한 행동(예: 무모한 운전, 즉흥적 지출 등)을 쉽게 한다.','16. 나는 불필요하게 말을 많이 하거나 멈추기 어렵다.','17. 나는 사소한 일에도 참지 못하고 쉽게 화를 낸다.','18. 나는 어떤 일을 시작하면 중간에 충동적으로 다른 일을 벌이기도 한다.','19. 나는 규칙이나 규율을 지켜야 하는 상황에서도 충동적으로 위반할 때가 있다.','20. 나는 감정을 조절하지 못하고 즉각적으로 표현하는 경우가 많다.'];

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

<<<<<<< HEAD
        {/* 제출 버튼 */}
        <div
          className={`w-[150px] h-[55px] mt-[50px] flex items-center justify-center rounded-[60px] text-white text-[18px] font-semibold transition-all duration-200 ${allAnswered ? 'bg-[#4A8AEE] cursor-pointer hover:bg-[#4077CE]' : 'bg-gray-300 cursor-not-allowed'}`}
          onClick={() => {
            if (allAnswered) {
              console.log('설문 답안 찍은거: ', answers);
              router.push('/test');
            }
          }}
        >
          제출
=======
        {/* 페이지 네비게이션 */}
        <div className="w-full h-[50px] mt-[40px] flex items-center px-4 relative">
          <p className="absolute left-1/2 -translate-x-1/2 text-[18px] font-semibold text-[#737373]">
            {currentPage} / {totalPages}
          </p>
          {currentPage < totalPages ? (
            <div onClick={() => allAnswered && setCurrentPage(prev => prev + 1)} className={`ml-auto w-[110px] h-[50px] flex items-center justify-center rounded-[60px] duration-200 ${allAnswered ? 'bg-[#4A8AEE] cursor-pointer hover:bg-[#4077CE]' : 'bg-gray-300 cursor-not-allowed'}`}>
              <p className="text-[18px] font-semibold text-white">다음 →</p>
            </div>
          ) : (
            <div
              className="ml-auto w-[110px] h-[50px] flex items-center justify-center rounded-[60px] bg-green-500 cursor-pointer hover:bg-green-600 duration-200"
              onClick={() => {
                console.log('설문 완료!', answers);
                router.push('/cat/before');
              }}
            >
              <p className="text-[18px] font-semibold text-white">제출</p>
            </div>
          )}
>>>>>>> 93bb9070cc69af9b165dc9068a7ddd5ec73d81c5
        </div>
      </div>
    </div>
  );
}
