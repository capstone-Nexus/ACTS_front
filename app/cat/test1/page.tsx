"use client";

import { useState } from "react";
import Link from "next/link";

export default function Test1() {
    const [currentScreen, setCurrentScreen] = useState<"intro" | "test">("intro");
    const handleStartTest = () => {
        setCurrentScreen("test");
    };

    if (currentScreen === "intro") {
        return (
            <div className="w-full h-screen flex flex-col items-center bg-gray-50">
                <div className="mt-[150px] w-[900px] h-[873px] flex flex-col items-center bg-white border border-[#CDD0D4]">
                    <p className="text-[32px] font-bold mt-12">단순 선택 주의력 검사</p>
                    <p className="mt-2 tex`t-[18px] text-[#737373]">Simple Selective Attention</p>
                    <div className="mt-10 w-[800px] h-[1px] bg-[#CDD0D4]" />
                    <div className="mt-13 w-[800px] h-[410px] bg-[#F9FAFB] border border-[#E4E7EB]">
                        <div className="ml-10 mt-9">
                            <p className="text-[18px] font-bold">🎯 검사 목적</p>
                            <p className="mt-2 text-[14px] font-medium text-[#474747]">시각 및 청각 자극에 대한 기본적인 반응 속도와 정확도를 평가합니다.</p>
                        </div>
                        <div className="ml-10 mt-9 mb-5">
                            <p className="text-[18px] font-bold">📋 검사 방법</p>
                            <div className="mt-2 ml-7 text-[14px] font-medium text-[#474747] leading-7">
                                <li>화면에 <span className="text-[#4A8AEE] font-bold">파란색 원</span>이 나타나면 즉시 스페이스바를 클릭하세요</li>
                                <li>또는 <span className="text-[#4A8AEE] font-bold">소리</span>가 들릴 때마다 스페이스바를 클릭하세요</li>
                                <li>자극이 제시될 때 빠르고 정확하게 반응해야 합니다</li>
                            </div>
                        </div>
                        <div className="w-[720px] h-[100px] bg-[#EBEDEF] ml-10 border-l-3 border-[#4A8AEE] p-4">
                            <p className="text-[14px] font-semibold ml-1 mt-2">💡 예시</p>
                            <p className="mt-2 ml-3">파란색 원 나타나거나 종소리가 들린다면 → 즉시 스페이스바 클릭</p>
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
            단순 선택 주의력 검사 페이지
            <Link href="/cat/test2" className="mt-11 w-[90px] h-[50px] flex justify-center items-center bg-[#4A8AEE] cursor-pointer border-2 border-transparent hover:border-[#4A8AEE] hover:bg-white duration-200 group">
                    <p className="text-[14px] font-medium text-white group-hover:text-[#4A8AEE] transition-colors duration-200">
                        다음 →
                    </p>
                </Link>
        </div>
    );
}
