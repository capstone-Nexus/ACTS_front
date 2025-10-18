"use client";

import { useState } from "react";

export default function StroopPage() {
    const [currentScreen, setCurrentScreen] = useState<"intro" | "test">("intro");
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [correctAnswers, setCorrectAnswers] = useState<number>(0);
    const totalQuestions = 15;
    const [timeLeft, setTimeLeft] = useState<number>(5);
    const [currentWordText, setCurrentWordText] = useState<string>("");
    const [currentWordColor, setCurrentWordColor] = useState<string>("");

    const colors = [
        { name: '빨강', value: '#F20E0E' },
        { name: '파랑', value: '#0000FF' },
        { name: '초록', value: '#00AC00' },
        { name: '보라', value: '#800080' },
        { name: '노랑', value: '#FFD700' },
        { name: '검정', value: '#000000'}
    ];

    const accuracy = currentQuestion > 1 ? Math.round((correctAnswers / (currentQuestion - 1)) * 100) : 0;

    const generateRandomProblem = () => {
        const randomTextIndex = Math.floor(Math.random() * colors.length);
        const randomColorIndex = Math.floor(Math.random() * colors.length);

        setCurrentWordText(colors[randomTextIndex].name);
        setCurrentWordColor(colors[randomColorIndex].value);
        setTimeLeft(5);
    };

    const handleColorChoice = (chosenColor: string) => {
        if (chosenColor === currentWordColor) {
            setCorrectAnswers(prev => prev + 1);
        }

        if (currentQuestion < totalQuestions) {
            setCurrentQuestion(prev => prev + 1);
            generateRandomProblem();
        } else {
            const finalCorrect = correctAnswers + (chosenColor === currentWordColor ? 1 : 0);
            alert(`테스트 완료! 정답: ${finalCorrect}/${totalQuestions}`);
            setCurrentScreen('intro');
            resetGame();
        }
    };

    const resetGame = () => {
        setCurrentQuestion(1);
        setCorrectAnswers(0);
        setTimeLeft(5);
    };

    const handleStartTest = () => {
        setCurrentScreen('test');
        resetGame();
        generateRandomProblem();
    };

    if (currentScreen === 'intro') {
        return (
            <div className="w-full h-screen flex items-center justify-center flex-grow bg-[#f5f5f5]">
                <div className="drop-shadow-lg mt-22 w-[820px] min-h-[530px] bg-white rounded-[30px] p-10 shadow flex flex-col items-center">
                    <h1 className="text-[36px] font-bold bg-gradient-to-r from-[#59C0EE] to-[#4E59F4] bg-clip-text text-transparent text-center mb-12">
                        Stroop 테스트
                    </h1>

                    <div className="w-[700px] bg-[#f5f5f5] rounded-[10px] p-6 text-gray-700 text-sm leading-relaxed text-center">
                        <h2 className="text-2xl font-bold mb-2 text-[#4A8AEE]">🎯 테스트 방법</h2>
                        <p className="font-medium text-lg leading-[35px]">
                            화면에 나타나는 <span className="text-[#4A8AEE] font-bold text-xl">글짜의 색깔</span>을 선택하세요. <br />
                            글자가 의미하는 색깔이 아닌, <span className="text-[#4A8AEE] font-bold text-xl">실제 글자의 색깔</span>을 골라야 합니다.
                            <br />
                            <span className="text-[#4A8AEE] font-bold text-xl">예시:</span> "빨강" 이라는 글자가 파란색으로 쓰여있다면
                            <span className="text-[#4A8AEE] font-bold text-xl">파랑 </span>버튼을 누르세요. <br />
                            ⏱️ 각 문제마다 <span className="text-[#4A8AEE] font-bold text-xl">5초의</span> 시간이 주어집니다.
                        </p>
                    </div>

                    <button
                        onClick={handleStartTest}
                        className="mt-12 px-[21px] py-[14px] rounded-[10px] bg-[#4A8AEE] text-white text-lg font-bold hover:bg-[#3A7ADE] transition-colors"
                    >
                        테스트 시작
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-screen flex items-center justify-center flex-grow bg-[#f5f5f5]">
            <div className="drop-shadow-lg mt-22 w-[550px] min-h-[530px] bg-white rounded-[30px] p-10 shadow flex flex-col items-center">
                <div className="text-2xl font-bold mb-6">글자의 색깔을 선택하세요</div>

                <div className="w-[450px] bg-gray-200 rounded-[30px] h-4 mb-6">
                    <div
                        className="bg-gradient-to-r from-[#59C0EE] to-[#A95FDC] h-4 rounded-full transition-all duration-300"
                        style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
                    ></div>
                </div>

                <div className="flex justify-center items-center gap-28 w-[450px] h-[105px] rounded-[20px] mb-8 text-sm text-center bg-[#F5F5F5]">
                    <div className="flex flex-col items-center">
                        <span className="text-[#4A8AEE] font-bold text-3xl leading-none">{totalQuestions}</span>
                        <span className="font-medium text-[14px] text-[#3C3C3C] leading-tight">문제</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[#4A8AEE] font-bold text-3xl leading-none">{correctAnswers}</span>
                        <span className="font-medium text-[14px] text-[#3C3C3C] leading-tight">정답</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[#4A8AEE] font-bold text-3xl leading-none">{accuracy}%</span>
                        <span className="font-medium text-[14px] text-[#3C3C3C] leading-tight">정확도</span>
                    </div>
                </div>

                <div className="flex flex-col items-center mb-8">
                    <div
                        className="text-6xl font-bold mb-8 border-4 px-4 py-2 rounded-lg"
                        style={{ color: currentWordColor, borderColor: currentWordColor }}
                    >
                        {currentWordText}
                    </div>

                    <div className="grid grid-cols-3 gap-9 w-full max-w-md">
                        {colors.map((color) => (
                            <button
                                key={color.name}
                                onClick={() => handleColorChoice(color.value)}
                                className="shadow-md text-[#000000] px-10 py-3 rounded-lg font-medium hover:scale-105 transition-transform bg-[#EDF9FF] hover:bg-blue-50">
                                {color.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}