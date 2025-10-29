"use client";

import Link from "next/link";
import { useState } from "react";

export default function Test2() {
    const [currentScreen, setCurrentScreen] = useState<"intro" | "test">("intro");
    const handleStartTest = () => {
        setCurrentScreen("test");
    };

    if (currentScreen === "intro") {
        return (
            <div className="w-full h-screen flex flex-col items-center bg-gray-50">
                <div className="mt-[150px] w-[900px] h-[873px] flex flex-col items-center bg-white border border-[#CDD0D4]">
                    <p className="text-[32px] font-bold mt-12">억제 지속 주의력 검사</p>
                    <p className="mt-2 tex`t-[18px] text-[#737373]">Inhibitory Sustained Attention</p>
                    <div className="mt-10 w-[800px] h-[1px] bg-[#CDD0D4]" />
                    <div className="mt-13 w-[800px] h-[410px] bg-[#F9FAFB] border border-[#E4E7EB]">
                        <div className="ml-10 mt-9">
                            <p className="text-[18px] font-bold">🎯 검사 목적</p>
                            <p className="mt-2 text-[14px] font-medium text-[#474747]">불필요한 자극을 억제하면서 지속적으로 주의 집중을 유지하는 능력을 측정합니다.</p>
                        </div>
                        <div className="ml-10 mt-9 mb-5">
                            <p className="text-[18px] font-bold">📋 검사 방법</p>
                            <div className="mt-2 ml-7 text-[14px] font-medium text-[#474747] leading-7">
                                <li>다양한 모양이 순서대로 나타납니다</li>
                                <li><span className="text-[#4A8AEE] font-bold">‘X’ 모양을 제외한</span> 모든 그림에만 클릭하세요</li>
                                <li>실수로 X를 누르거나, 클릭해야 할 그림을 놓치면 감점됩니다</li>
                            </div>
                        </div>
                        <div className="w-[720px] h-[100px] bg-[#EBEDEF] ml-10 border-l-3 border-[#4A8AEE] p-4">
                            <p className="text-[14px] font-semibold ml-1 mt-2">💡 예시</p>
                            <p className="mt-2 ml-3">○ △ □ X  그림들이 랜덤하게 나타남 → X만 클릭하지 않기</p>
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
        <div className="w-full h-screen flex justify-center items-center">
            억제 지속 주의력 검사 페이지

            <Link href="/cat/test3" className="mt-11 w-[90px] h-[50px] flex justify-center items-center bg-[#4A8AEE] cursor-pointer border-2 border-transparent hover:border-[#4A8AEE] hover:bg-white duration-200 group">
                    <p className="text-[14px] font-medium text-white group-hover:text-[#4A8AEE] transition-colors duration-200">
                        다음 →
                    </p>
                </Link>
        </div>
    );
}
