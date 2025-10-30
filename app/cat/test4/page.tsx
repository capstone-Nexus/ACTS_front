"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const TOTAL_TRIALS = 20;
const STIMULUS_TIME = 2000;

type Stimulus = { visual: string; audio: string };

export default function Test4() {
    const [currentScreen, setCurrentScreen] = useState<"intro" | "test">("intro");
    const [progress, setProgress] = useState(0);
    const [stimuli, setStimuli] = useState<Stimulus[]>([]);
    const [currentStimulus, setCurrentStimulus] = useState<Stimulus | null>(null);
    const [responses, setResponses] = useState<{clicked: boolean, time: number}[]>([]);
    const [showNext, setShowNext] = useState(false);
    const stimulusStartTime = useRef<number>(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleStartTest = () => {
        setCurrentScreen("test");
        generateStimuli();
    };

    const generateStimuli = () => {
        const newStimuli: Stimulus[] = [];
        const visuals = ["red", "blue", "green"];
        const audios = ["ding", "buzz", "beep"];
        for (let i = 0; i < TOTAL_TRIALS; i++) {
            const visual = visuals[Math.floor(Math.random() * visuals.length)];
            const audio = audios[Math.floor(Math.random() * audios.length)];
            newStimuli.push({ visual, audio });
        }
        setStimuli(newStimuli);
        setProgress(0);
        setCurrentStimulus(newStimuli[0]);
        stimulusStartTime.current = Date.now();
        startTimeout();
    };

    const startTimeout = () => {
        timeoutRef.current = setTimeout(() => handleClick(false), STIMULUS_TIME);
    };

    const handleClick = (clicked: boolean) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        const time = Date.now() - stimulusStartTime.current;
        setResponses(prev => [...prev, { clicked, time }]);

        const nextIndex = progress + 1;
        if (nextIndex < TOTAL_TRIALS) {
            setProgress(nextIndex);
            setCurrentStimulus(stimuli[nextIndex]);
            stimulusStartTime.current = Date.now();
            startTimeout();
        } else {
            setProgress(nextIndex);
            setCurrentStimulus(null);
            setShowNext(true);
        }
    };

    if (currentScreen === "intro") {
        return (
            <div className="w-full h-full flex flex-col items-center bg-gray-50">
                <div className="mt-[150px] mb-15 w-[900px] h-[753px] flex flex-col items-center bg-white border border-[#CDD0D4]">
                    <p className="text-[32px] font-bold mt-12">분할 주의력 검사</p>
                    <p className="mt-2 text-[18px] text-[#737373]">Divided Attention</p>
                    <div className="mt-10 w-[800px] h-[1px] bg-[#CDD0D4]" />
                    <div className="mt-13 w-[800px] h-[410px] bg-[#F9FAFB] border border-[#E4E7EB] p-10">
                        <p className="text-[18px] font-bold">🎯 검사 목적</p>
                        <p className="mt-2 text-[14px] font-medium text-[#474747]">
                            시각과 청각 등 여러 자극을 동시에 처리하는 능력을 측정합니다.
                        </p>
                        <p className="mt-6 text-[18px] font-bold">📋 검사 방법</p>
                        <ul className="mt-2 ml-7 text-[14px] font-medium text-[#474747] leading-7 list-disc">
                            <li>그림과 소리가 동시에 표시됩니다</li>
                            <li>앞서 제시된 소리나 그림이 <span className="text-[#4A8AEE] font-bold">반복되는 경우</span> 스페이스바를 클릭하세요</li>
                            <li>현재 자극과 바로 전 자극을 비교해야 합니다</li>
                        </ul>
                        <div className="w-[720px] h-[100px] bg-[#EBEDEF] mt-6 border-l-3 border-[#4A8AEE] p-4">
                            <p className="text-[14px] font-semibold ml-1 mt-2">💡 예시</p>
                            <p className="mt-2 ml-3">1번째: 종소리 - 2번째: 딩동 (클릭 안 함) - 3번째: 딩동 (클릭)</p>
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

    const isRepeat = progress > 0 &&
        currentStimulus?.visual === stimuli[progress - 1].visual &&
        currentStimulus?.audio === stimuli[progress - 1].audio;

    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-[#F9FAFB]">
            <div className="mt-[130px] mb-10 w-[900px] h-[751px] bg-white border border-[#CCCCCC] flex flex-col items-center">
                <div className="mt-8 text-[32px] font-bold">분할 주의력 검사</div>
                <div className="mt-1 text-[18px] text-[#737373]">진행 중...</div>
                <div className="mt-8 w-[800px] h-[1px] bg-[#CDD0D4]" />

                <div className="relative w-[800px] h-[330px] bg-[#F9FAFB] text-center flex flex-col justify-center items-center border border-[#CDD0D4] mt-12">
                    <div className="absolute top-4 right-4 w-[100px] h-[30px] bg-white text-[12px] font-medium flex justify-center items-center border border-[#CDD0D4] text-[#474747]">
                        진행률 : {progress}/{TOTAL_TRIALS}
                    </div>

                    <div className="w-[120px] h-[120px] border border-[#CDD0D4] flex items-center justify-center cursor-pointer"
                         onClick={() => handleClick(isRepeat)}>
                        <div className="w-[70px] h-[70px] rounded-full bg-white border-3 border-black"></div>
                    </div>
                </div>

                <div className="w-[800px] h-[50px] mt-7 text-center bg-[#F9FAFB] border border-[#CDD0D4]">
                    <p className="mt-3 text-[14px] font-medium text-[#474747]">이전 자극과 같으면 클릭하세요.</p>
                </div>

                {showNext && (
                    <Link href="/cat/test5" className="mt-10 w-[90px] h-[50px] flex justify-center items-center bg-[#4A8AEE] cursor-pointer border-2 border-transparent hover:border-[#4A8AEE] hover:bg-white duration-200 group">
                        <p className="text-[14px] font-medium text-white group-hover:text-[#4A8AEE] transition-colors duration-200">
                            다음 →
                        </p>
                    </Link>
                )}
            </div>
        </div>
    );
}
