"use client";

import { useState } from "react";

export default function Test5() {
    const [currentScreen, setCurrentScreen] = useState<"intro" | "test" | "result">("intro");
    const [currentTrial, setCurrentTrial] = useState(0);
    const [sequence, setSequence] = useState<number[]>([]);
    const [userResponse, setUserResponse] = useState<number[]>([]);
    const [isShowing, setIsShowing] = useState(false);
    const [activeBox, setActiveBox] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [isTestComplete, setIsTestComplete] = useState(false);
    
    const totalTrials = 10;
    const boxes = [0, 1, 2, 3, 4, 5, 6, 7];

    const handleStartTest = () => {
        setCurrentScreen("test");
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
        const reversedSequence = [...sequence].reverse();
        const isCorrect = JSON.stringify(response) === JSON.stringify(reversedSequence);
        
        if (isCorrect) {
            setScore(score + 1);
        }
        
        setTimeout(() => {
            if (currentTrial + 1 < totalTrials) {
                setCurrentTrial(currentTrial + 1);
                startNewTrial();
            } else {
                setIsTestComplete(true);
            }
        }, 500);
    };

    if (currentScreen === "intro") {
        return (
            <div className="w-full h-screen flex flex-col items-center bg-gray-50">
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
                                <li>제시가 끝난 후, 방금 본 순서를 '반대로' 클릭하세요</li>
                            </div>
                        </div>
                        <div className="w-[720px] h-[100px] bg-[#EBEDEF] ml-10 border-l-4 border-[#4A8AEE] p-4">
                            <p className="text-[14px] font-semibold ml-1 mt-2">💡 예시</p>
                            <p className="mt-2 ml-3 text-[14px]">제시: [1] [2] [3] [4] [5] [6] [7] [8] → 응답: [8] [7] [6] [5] [4] [3] [2] [1]</p>
                        </div>
                    </div>
                    <button
                        onClick={handleStartTest}
                        className="mt-12 px-[21px] py-[14px] bg-[#4A8AEE] text-white text-[14px] font-medium hover:bg-[#3A7ADE] transition-colors"
                    >
                        테스트 시작 →
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-[#F9FAFB]">
            <div className="mt-[130px] mb-10 w-[900px] h-[751px] bg-[#ffffff] border border-[#CCCCCC] items-center flex flex-col">
                <div className="mt-8 text-[32px] font-bold">작업 기억력 검사</div>
                <div className="mt-1 text-[18px] text-[#737373]">
                    {isShowing ? "순서를 기억하세요..." : "역순으로 클릭하세요"}
                </div>
                <div className="mt-8 w-[800px] h-[1px] bg-[#CDD0D4]" />
                <div className="relative w-[800px] h-[330px] bg-[#F9FAFB] text-center flex flex-col justify-center items-center border border-[#CDD0D4] mt-12">
                    <div className="absolute top-4 right-4 w-[100px] h-[30px] bg-white text-[12px] font-medium flex justify-center items-center border border-[#CDD0D4] text-[#474747]">
                        진행률 : {currentTrial + 1}/{totalTrials}
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4">
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
                        <div className="absolute bottom-4 text-[14px] text-[#737373]">
                            선택: {userResponse.map(i => i + 1).join(' → ')}
                        </div>
                    )}
                </div>

                {isTestComplete && (
                    <a 
                        href="/result" 
                        className="mt-10 w-[90px] h-[50px] flex justify-center items-center bg-[#4A8AEE] cursor-pointer border-2 border-transparent hover:border-[#4A8AEE] hover:bg-white duration-200 group"
                    >
                        <p className="text-[14px] font-medium text-white group-hover:text-[#4A8AEE] transition-colors duration-200">
                            다음 →
                        </p>
                    </a>
                )}
            </div>
        </div>
    );
}
