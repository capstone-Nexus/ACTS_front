'use client';

import { useState, useRef } from "react";
import Link from "next/link";
import Image from 'next/image';
import TestRight from "@/public/images/test_right.svg";
import TestLeft from "@/public/images/test_left.svg";

const TOTAL_TRIALS = 20;
const STIMULUS_TIME = 2000;
const DIRECTIONS = ["left", "right"];

export default function Test3() {
    const [currentScreen, setCurrentScreen] = useState<"intro" | "test">("intro");
    const [progress, setProgress] = useState(0);
    const [arrows, setArrows] = useState<("left" | "right")[]>([]);
    const [responses, setResponses] = useState<{center: "left" | "right", clicked: "left" | "right" | "", time: number}[]>([]);
    const [showNext, setShowNext] = useState(false);
    const stimulusStartTime = useRef<number>(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleStartTest = () => {
        setCurrentScreen("test");
        nextStimulus();
    };

    const nextStimulus = () => {
        const center: "left" | "right" = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)] as "left" | "right";
        const newArrows: ("left" | "right")[] = [
            DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)] as "left" | "right",
            DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)] as "left" | "right",
            center,
            DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)] as "left" | "right",
            DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)] as "left" | "right",
        ];
        setArrows(newArrows);
        stimulusStartTime.current = Date.now();
        setShowNext(false);

        timeoutRef.current = setTimeout(() => handleClick(""), STIMULUS_TIME);
    };

    const handleClick = (clicked: "left" | "right" | "") => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        const time = Date.now() - stimulusStartTime.current;
        const center = arrows[2]; // 중앙 화살표 가져오기
        setResponses([...responses, { center, clicked, time }]);

        const nextIndex = progress + 1;
        if (nextIndex < TOTAL_TRIALS) {
            setProgress(nextIndex);
            nextStimulus();
        } else {
            setProgress(nextIndex);
            setShowNext(true);
        }
    };

    if (currentScreen === "intro") {
        return (
            <div className="w-full h-full flex flex-col items-center bg-gray-50">
                <div className="mt-[150px] mb-15 w-[900px] h-[753px] flex flex-col items-center bg-white border border-[#CDD0D4]">
                    <p className="text-[32px] font-bold mt-12">간섭 선택 주의력 검사</p>
                    <p className="mt-2 text-[18px] text-[#737373]">Flanker Task</p>
                    <div className="mt-10 w-[800px] h-[1px] bg-[#CDD0D4]" />
                    <div className="mt-13 w-[800px] h-[410px] bg-[#F9FAFB] border border-[#E4E7EB] p-10">
                        <p className="text-[18px] font-bold">🎯 검사 목적</p>
                        <p className="mt-2 text-[14px] font-medium text-[#474747]">
                            방해 자극(간섭 요인)이 있는 상황에서 정확히 선택할 수 있는 능력을 평가합니다.
                        </p>
                        <p className="mt-6 text-[18px] font-bold">📋 검사 방법</p>
                        <ul className="mt-2 ml-7 text-[14px] font-medium text-[#474747] leading-7 list-disc">
                            <li>화면 중앙에 하나의 화살표가 나타납니다</li>
                            <li>가운데 화살표가 가리키는 방향을 클릭하세요</li>
                            <li>좌우에 배치된 다른 화살표들은 무시해야 합니다</li>
                        </ul>
                        <div className="w-[720px] h-[100px] bg-[#EBEDEF] mt-6 border-l-3 border-[#4A8AEE] p-4">
                            <p className="text-[14px] font-semibold ml-1 mt-2">💡 예시</p>
                            <p className="mt-2 ml-3">← ← → ← ← 가운데가 오른쪽을 가리키므로 “→” 클릭</p>
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
                <div className="mt-8 text-[32px] font-bold">간섭 선택 주의력 검사</div>
                <div className="mt-1 text-[18px] text-[#737373]">진행 중...</div>
                <div className="mt-8 w-[800px] h-[1px] bg-[#CDD0D4]" />

                <div className="relative w-[800px] h-[330px] bg-[#F9FAFB] flex flex-col justify-center items-center border border-[#CDD0D4] mt-12">
                    <div className="absolute top-4 right-4 w-[100px] h-[30px] bg-white text-[12px] font-medium flex justify-center items-center border border-[#CDD0D4] text-[#474747]">
                        진행률 : {progress}/{TOTAL_TRIALS}
                    </div>

                    <div className="flex flex-row gap-4">
                        {arrows.map((dir, idx) => (
                            <div key={idx} className="cursor-pointer" onClick={() => idx === 2 ? handleClick(dir) : null}>
                                <Image
                                    src={dir === "left" ? TestLeft : TestRight}
                                    alt={dir + " arrow"}
                                    width={50}
                                    height={50}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {showNext && (
                    <Link href="/cat/test4" className="mt-10 w-[90px] h-[50px] flex justify-center items-center bg-[#4A8AEE] cursor-pointer border-2 border-transparent hover:border-[#4A8AEE] hover:bg-white duration-200 group">
                        <p className="text-[14px] font-medium text-white group-hover:text-[#4A8AEE] transition-colors duration-200">
                            다음 →
                        </p>
                    </Link>
                )}
            </div>
        </div>
    );
}
