'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Test1() {
    const TOTAL_TRIALS = 20;
    const STIMULUS_TIME = 1000; // 1초 동안 자극 표시
    const [currentScreen, setCurrentScreen] = useState<"intro" | "test">("intro");
    const [progress, setProgress] = useState(0);
    const [stimuli, setStimuli] = useState<("blue-circle" | "sound")[]>([]);
    const [currentStimulus, setCurrentStimulus] = useState<"blue-circle" | "sound" | "">("");
    const [showNext, setShowNext] = useState(false);
    const [responses, setResponses] = useState<{ stimulus: string; time: number }[]>([]);
    const stimulusTimeout = useRef<NodeJS.Timeout | null>(null);
    const autoNextTimeout = useRef<NodeJS.Timeout | null>(null);
    const stimulusStartTime = useRef<number>(0);

    // 오디오 객체 생성
    const audioRef = useRef<HTMLAudioElement | null>(null);
    useEffect(() => {
        audioRef.current = new Audio("/sounds/bell.mp3"); // public/sounds/bell.mp3 파일 필요
    }, []);

    const handleStartTest = () => {
        setCurrentScreen("test");

        const stim: ("blue-circle" | "sound")[] = Array.from({ length: TOTAL_TRIALS }, () =>
            Math.random() < 0.5 ? "blue-circle" : "sound"
        );
        setStimuli(stim);
        setProgress(0);
        setShowNext(false);

        setTimeout(() => {
            nextStimulus(0);
        }, 500); // 잠시 지연 후 첫 자극
    };

    const nextStimulus = (index: number) => {
        const stim = stimuli[index];
        setCurrentStimulus(stim);
        stimulusStartTime.current = Date.now();

        // 소리 자극이면 오디오 재생
        if (stim === "sound" && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }

        // 1초 후 자극 사라짐
        stimulusTimeout.current = setTimeout(() => {
            setCurrentStimulus("");
        }, STIMULUS_TIME);

        // 2초 동안 반응 없으면 자동 기록 후 다음
        autoNextTimeout.current = setTimeout(() => {
            recordResponse("");
            if (index < TOTAL_TRIALS - 1) {
                setProgress(index + 1);
                nextStimulus(index + 1);
            } else {
                setShowNext(true);
            }
        }, 2000);
    };

    const recordResponse = (clicked: "clicked" | "") => {
        if (stimulusTimeout.current) clearTimeout(stimulusTimeout.current);
        if (autoNextTimeout.current) clearTimeout(autoNextTimeout.current);

        const time = Date.now() - stimulusStartTime.current;
        setResponses(prev => [...prev, { stimulus: currentStimulus || "none", time }]);
        setCurrentStimulus("");
    };

    const handleClick = () => {
        recordResponse("clicked");
        if (progress < TOTAL_TRIALS - 1) {
            const nextIndex = progress + 1;
            setProgress(nextIndex);
            nextStimulus(nextIndex);
        } else {
            setShowNext(true);
        }
    };

    if (currentScreen === "intro") {
        return (
            <div className="w-full h-full flex flex-col items-center bg-gray-50">
                <div className="mt-[150px] w-[900px] h-[753px] mb-15 flex flex-col items-center bg-white border border-[#CDD0D4]">
                    <p className="text-[32px] font-bold mt-12">단순 선택 주의력 검사</p>
                    <p className="mt-2 text-[18px] text-[#737373]">Simple Selective Attention</p>
                    <div className="mt-10 w-[800px] h-[1px] bg-[#CDD0D4]" />
                    <div className="mt-13 w-[800px] h-[410px] bg-[#F9FAFB] border border-[#E4E7EB] p-10">
                        <p className="text-[18px] font-bold">🎯 검사 목적</p>
                        <p className="mt-2 text-[14px] font-medium text-[#474747]">
                            시각 및 청각 자극에 대한 기본적인 반응 속도와 정확도를 평가합니다.
                        </p>
                        <p className="mt-6 text-[18px] font-bold">📋 검사 방법</p>
                        <ul className="mt-2 ml-7 text-[14px] font-medium text-[#474747] leading-7 list-disc">
                            <li>
                                화면에 <span className="text-[#4A8AEE] font-bold">파란색 원</span>이 나타나면 즉시 스페이스바를 클릭
                            </li>
                            <li>
                                또는 <span className="text-[#4A8AEE] font-bold">소리</span>가 들릴 때마다 스페이스바 클릭
                            </li>
                            <li>자극이 제시될 때 빠르고 정확하게 반응</li>
                        </ul>
                        <div className="w-[720px] h-[100px] bg-[#EBEDEF] mt-6 border-l-3 border-[#4A8AEE] p-4">
                            <p className="text-[14px] font-semibold ml-1 mt-2">💡 예시</p>
                            <p className="mt-2 ml-3">
                                파란색 원 나타나거나 종소리가 들린다면 → 즉시 스페이스바 클릭
                            </p>
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
            <div className="mt-[130px] mb-10 w-[900px] h-[751px] bg-[#ffffff] border border-[#CCCCCC] flex flex-col items-center">
                <div className="mt-8 text-[32px] font-bold">단순 선택 주의력 검사</div>
                <div className="mt-1 text-[18px] text-[#737373]">진행 중...</div>
                <div className="mt-8 w-[800px] h-[1px] bg-[#CDD0D4]" />

                <div
                    className="relative w-[800px] h-[330px] bg-[#F9FAFB] flex justify-center items-center border border-[#CDD0D4] mt-12 cursor-pointer"
                    onClick={handleClick}
                >
                    <div className="absolute top-4 right-4 w-[100px] h-[30px] bg-white text-[12px] font-medium flex justify-center items-center border border-[#CDD0D4] text-[#474747]">
                        진행률 : {Math.min(progress + 1, TOTAL_TRIALS)}/{TOTAL_TRIALS}
                    </div>

                    {currentStimulus === "blue-circle" && (
                        <div className="w-[100px] h-[100px] rounded-full bg-[#4A8AEE]"></div>
                    )}
                    {currentStimulus === "sound" && (
                        <div className="text-[48px] font-bold animate-pulse">🔔</div>
                    )}
                </div>

                {showNext && (
                    <Link
                        href="/cat/test2"
                        className="mt-10 w-[90px] h-[50px] flex justify-center items-center bg-[#4A8AEE] cursor-pointer border-2 border-transparent hover:border-[#4A8AEE] hover:bg-white duration-200 group"
                    >
                        <p className="text-[14px] font-medium text-white group-hover:text-[#4A8AEE] transition-colors duration-200">
                            다음 →
                        </p>
                    </Link>
                )}
            </div>
        </div>
    );
}
