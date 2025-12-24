"use client";

import Link from "next/link";
import { useState } from "react";

export default function Test5() {
    const [currentScreen, setCurrentScreen] = useState<"intro" | "test" | "result">("intro");
    const [progress, setProgress] = useState(0);
    const [sequence, setSequence] = useState<number[]>([]);
    const [userResponse, setUserResponse] = useState<number[]>([]);
    const [isShowing, setIsShowing] = useState(false);
    const [activeBox, setActiveBox] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [testFinished, setTestFinished] = useState(false);

    const TOTAL_TRIALS = 5;
    const boxes = [0, 1, 2, 3, 4, 5, 6, 7];

    const handleStartTest = () => {
        setCurrentScreen("test");
        setProgress(0);
        setScore(0);
        setCorrectCount(0);
        startNewTrial();
    };

    const shuffleArray = (array: number[]) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const startNewTrial = () => {
        setUserResponse([]);
        setIsShowing(true);

        const newSequence = shuffleArray(boxes);
        setSequence(newSequence);

        showSequence(newSequence);
    };

    const showSequence = async (seq: number[]) => {
        await new Promise(resolve => setTimeout(resolve, 300));

        for (let i = 0; i < seq.length; i++) {
            setActiveBox(seq[i]);
            await new Promise(resolve => setTimeout(resolve, 500));
            setActiveBox(null);
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        setIsShowing(false);
    };

    const handleBoxClick = (index: number) => {
        if (isShowing) return;

        const newResponse = [...userResponse, index];
        setUserResponse(newResponse);

        setActiveBox(index);
        setTimeout(() => setActiveBox(null), 300);

        if (newResponse.length === sequence.length) {
            checkAnswer(newResponse);
        }
    };

    const checkAnswer = (response: number[]) => {
        const isCorrect = JSON.stringify(response) === JSON.stringify(sequence);

        if (isCorrect) {
            setScore(score + 1);
            setCorrectCount(prev => prev + 1);
        }

        // ✅ Raw 데이터 저장
        const rawData = JSON.parse(sessionStorage.getItem('cat_raw_data') || '{}');
        if (!rawData.wm_trials) rawData.wm_trials = [];
        
        rawData.wm_trials.push({
            trial_index: progress,
            type: "forward",
            presented: sequence,
            user_answer: response,
            correct: isCorrect
        });
        
        sessionStorage.setItem('cat_raw_data', JSON.stringify(rawData));

        setTimeout(() => {
            if (progress + 1 < TOTAL_TRIALS) {
                setProgress(progress + 1);
                startNewTrial();
            } else {
                setTestFinished(true);
                // ✅ 모든 테스트 완료 - 최종 데이터 준비
                prepareFinalData();
            }
        }, 500);
    };

    // ✅ 최종 데이터 준비 함수
    const prepareFinalData = () => {
        try {
            const surveyAnswers = JSON.parse(sessionStorage.getItem('survey_answers') || '{}');
            const catRawData = JSON.parse(sessionStorage.getItem('cat_raw_data') || '{}');
            
            const finalPayload = {
                survey: {
                    answers: surveyAnswers
                },
                cat_raw: catRawData
            };
            
            sessionStorage.setItem('final_test_data', JSON.stringify(finalPayload));
            
            // ✅ 상세 Console 출력
            console.log('='.repeat(80));
            console.log('🎉 모든 테스트 완료!');
            console.log('='.repeat(80));
            
            console.log('\n📋 Survey 답변:');
            console.log(JSON.stringify(surveyAnswers, null, 2));
            
            console.log('\n🎯 CAT Raw 데이터:');
            console.log('- Simple Trials:', catRawData.simple_trials?.length || 0, '개');
            console.log('- Sustained Trials:', catRawData.sustained_trials?.length || 0, '개');
            console.log('- Interference Trials:', catRawData.interference_trials?.length || 0, '개');
            console.log('- Divided Trials:', catRawData.divided_trials?.length || 0, '개');
            console.log('- WM Trials:', catRawData.wm_trials?.length || 0, '개');
            
            console.log('\n📦 최종 Payload:');
            console.log(JSON.stringify(finalPayload, null, 2));
            
            console.log('\n' + '='.repeat(80));
            
        } catch (error) {
            console.error('❌ 데이터 준비 중 오류:', error);
        }
    };

    const handleUndo = () => {
        if (isShowing) return;
        if (testFinished) return;
        if (userResponse.length === 0) return;
        setUserResponse(prev => prev.slice(0, -1));
        setActiveBox(null);
    };

    if (currentScreen === "intro") {
        return (
            <div className="w-full h-screen flex flex-col items-center bg-gray-50 select-none">
                <div className="mt-[150px] w-[900px] h-[753px] flex flex-col items-center bg-white border border-[#CDD0D4]">
                    <p className="text-[32px] font-bold mt-12">작업 기억력 검사</p>
                    <p className="mt-2 text-[18px] text-[#737373]">Working Memory</p>
                    <div className="mt-10 w-[800px] h-[1px] bg-[#CDD0D4]" />
                    <div className="mt-13 w-[800px] h-[410px] bg-[#F9FAFB] border border-[#E4E7EB]">
                        <div className="ml-10 mt-9">
                            <p className="text-[18px] font-bold">🎯 검사 목적</p>
                            <p className="mt-2 text-[14px] font-medium text-[#474747]">단기 기억을 유지하고 조작하는 능력을 측정합니다.</p>
                        </div>
                        <div className="ml-10 mt-9 mb-5">
                            <p className="text-[18px] font-bold">📋 검사 방법</p>
                            <div className="mt-2 ml-7 text-[14px] font-medium text-[#474747] leading-7">
                                <li>8개의 박스가 중복 없이 한 번씩 제시됩니다</li>
                                <li>제시가 끝난 후, <span className="text-[#4A8AEE] font-bold">보여준 순서대로</span> 클릭하세요</li>
                            </div>
                        </div>
                        <div className="w-[720px] h-[100px] bg-[#EBEDEF] ml-10 border-l-4 border-[#4A8AEE] p-4">
                            <p className="text-[14px] font-semibold ml-1 mt-2">💡 예시</p>
                            <p className="mt-2 ml-3 text-[14px]">제시: [1] [2] [3] [4] → 응답: [1] [2] [3] [4]</p>
                        </div>
                    </div>
                    <button
                        onClick={handleStartTest}
                        className="mt-12 px-[21px] py-[14px] bg-[#4A8AEE] text-white text-[14px] font-medium hover:bg-[#3A7ADE] transition-colors select-none">
                        테스트 시작 →
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-[#F9FAFB] select-none">
            <div className="mt-[130px] mb-10 w-[900px] h-[751px] bg-[#ffffff] border border-[#CCCCCC] items-center flex flex-col">
                <div className="mt-8 text-[32px] font-bold">작업 기억력 검사</div>
                <div className="mt-1 text-[18px] text-[#737373]">
                    {isShowing ? "순서를 기억하세요..." : "보여준 순서대로 클릭하세요"}
                </div>
                <div className="mt-8 w-[800px] h-[1px] bg-[#CDD0D4]" />
                <div className="relative w-[800px] h-[330px] bg-[#F9FAFB] text-center flex flex-col justify-center items-center border border-[#CDD0D4] mt-12">
                    <div className="absolute top-4 right-[130px] w-[100px] h-[30px] bg-white text-[12px] font-medium flex justify-center items-center border border-[#CDD0D4] text-[#474747]">
                        맞춘개수 : {correctCount}/{progress + 1}
                    </div>

                    <div className="absolute top-4 right-4 w-[100px] h-[30px] bg-white text-[12px] font-medium flex justify-center items-center border border-[#CDD0D4] text-[#474747]">
                        진행률 : {progress + 1}/{TOTAL_TRIALS}
                    </div>

                    <div className="grid grid-cols-4 gap-4 select-none">
                        {boxes.map((box) => (
                            <div
                                key={box}
                                onClick={() => handleBoxClick(box)}
                                className={`w-[80px] h-[80px] border-2 flex items-center justify-center text-[24px] font-bold transition-all duration-300 cursor-pointer
                                    ${activeBox === box
                                        ? 'bg-[#4A8AEE] border-[#4A8AEE] text-white scale-110'
                                        : 'bg-white border-[#CDD0D4] hover:border-[#4A8AEE] hover:bg-[#F0F5FF]'
                                    }
                                    ${isShowing ? 'cursor-not-allowed' : ''}
                                `}
                            >
                                {box + 1}
                            </div>
                        ))}
                    </div>

                    {!isShowing && userResponse.length > 0 && (
                        <div className="absolute bottom-4 text-[14px] text-[#737373] select-none">
                            선택: {userResponse.map(i => i + 1).join(' → ')}
                        </div>
                    )}
                </div>

                {!isShowing && !testFinished && (
                    <div className="mt-6 w-[800px] flex justify-end">
                        <button
                            onClick={handleUndo}
                            disabled={userResponse.length === 0}
                            className={`h-[42px] px-4 border text-[14px] font-medium transition-colors ${
                                userResponse.length === 0
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-200'
                                    : 'bg-white text-[#474747] border-[#CDD0D4] hover:bg-[#F9FAFB]'
                            }`}
                        >
                            지우기
                        </button>
                    </div>
                )}

                {testFinished && (
                    <Link href="/test/result" className="mt-10 w-[90px] h-[50px] flex justify-center items-center bg-[#4A8AEE] cursor-pointer border-2 border-transparent hover:border-[#4A8AEE] hover:bg-white duration-200 group">
                        <p className="text-[14px] font-medium text-white group-hover:text-[#4A8AEE] transition-colors duration-200">
                            다음 →
                        </p>
                    </Link>
                )}
            </div>
        </div>
    );
}