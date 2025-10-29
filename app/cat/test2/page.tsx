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
            <div className="w-full h-full flex flex-col items-center bg-gray-50">
                <div className="mt-[150px] mb-15 w-[900px] h-[753px] flex flex-col items-center bg-white border border-[#CDD0D4]">
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
         <div className="w-full min-h-screen flex justify-center items-center bg-[#F9FAFB]">
                    <div className="mt-[130px] mb-10 w-[900px] h-[751px] bg-[#ffffff] border border-[#CCCCCC] items-center flex flex-col">
                        <div className="mt-8 text-[32px] font-bold">억제 지속 주의력 검사</div>
                        <div className="mt-1 text-[18px] text-[#737373]">진행 중...</div>
                        <div className="mt-8 w-[800px] h-[1px] bg-[#CDD0D4]" />
                        <div className="relative w-[800px] h-[330px] bg-[#F9FAFB] text-center flex flex-col justify-center items-center border border-[#CDD0D4] mt-12">
                            <div className="absolute top-4 right-4 w-[100px] h-[30px] bg-white text-[12px] font-medium flex justify-center items-center border border-[#CDD0D4] text-[#474747]">
                                진행률 : 12/20
                            </div>
                            <div className="w-[120px] h-[120px] border-1 border-[#CDD0D4] flex items-center justify-center">
                              <div className="w-[70px] h-[70px] rounded-full bg-white border-3 border-black"></div>
                            </div>
                        </div>
        
                        <div className="w-[800px] h-[50px] mt-7 text-center bg-[#F9FAFB] border-1 border-[#CDD0D4]">
                            <p className="mt-3 text-[14px] font-medium text-[#474747]">X를 제외한 모든 도형을 클릭하세요.</p>
                        </div>
        
                        <Link href="/cat/test3" className="mt-10 w-[90px] h-[50px] flex justify-center items-center bg-[#4A8AEE] cursor-pointer border-2 border-transparent hover:border-[#4A8AEE] hover:bg-white duration-200 group">
                            <p className="text-[14px] font-medium text-white group-hover:text-[#4A8AEE] transition-colors duration-200">
                                다음 →
                            </p>
                        </Link>
                    </div>
                </div>
    );
}
