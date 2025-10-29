"use client";

import { useState } from "react";
import Link from "next/link";
import TestRight from "@/public/images/test_right.svg";
import TestLeft from "@/public/images/test_left.svg";
import Image from 'next/image';

export default function Test3() {
    const [currentScreen, setCurrentScreen] = useState<"intro" | "test">("intro");
    const handleStartTest = () => {
        setCurrentScreen("test");
    };

    if (currentScreen === "intro") {
        return (
            <div className="w-full h-full flex flex-col items-center bg-gray-50">
                <div className="mt-[150px] mb-15 w-[900px] h-[753px] flex flex-col items-center bg-white border border-[#CDD0D4]">
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
         <div className="w-full min-h-screen flex justify-center items-center bg-[#F9FAFB]">
            <div className="mt-[130px] mb-10 w-[900px] h-[751px] bg-[#ffffff] border border-[#CCCCCC] items-center flex flex-col">
                <div className="mt-8 text-[32px] font-bold">간섭 선택 주의력 검사</div>
                <div className="mt-1 text-[18px] text-[#737373]">진행 중...</div>
                <div className="mt-8 w-[800px] h-[1px] bg-[#CDD0D4]" />
                <div className="relative w-[800px] h-[330px] bg-[#F9FAFB] text-center flex flex-col justify-center items-center border border-[#CDD0D4] mt-12">
                    <div className="absolute top-4 right-4 w-[100px] h-[30px] bg-white text-[12px] font-medium flex justify-center items-center border border-[#CDD0D4] text-[#474747]">
                        진행률 : 12/20
                    </div>
                    <div className="flex flex-row justify-center items-center w-[50px] h-[50px]">
                        <Image src={TestRight} alt="오른쪽 화살표" className="w-[100px] h-[100px] mr-10"/>
                        <Image src={TestRight} alt="오른쪽 화살표" className="w-[100px] h-[100px] mr-10"/>
                        <Image src={TestLeft} alt="왼쪽 화살표" className="w-[100px] h-[100px] mr-10"/>
                        <Image src={TestRight} alt="오른쪽 화살표" className="w-[100px] h-[100px] mr-10"/>
                        <Image src={TestRight} alt="오른쪽 화살표" className="w-[100px] h-[100px] mr-10"/>
                    </div>
                </div>

                <div className="flex flex-row gap-8 mt-7 ">
                    <div className="w-[70px] h-[70px] rounded-full border-1 border-black flex items-center justify-center"><Image src={TestLeft} alt="왼쪽 화살표" className="w-[50px] h-[50px]"/></div>
                    <div className="w-[70px] h-[70px] rounded-full border-1 border-black flex items-center justify-center"><Image src={TestRight} alt="오른쪽 화살표" className="w-[50px] h-[50px]"/></div>
                </div>

                <Link href="/cat/test4" className="mt-10 w-[90px] h-[50px] flex justify-center items-center bg-[#4A8AEE] cursor-pointer border-2 border-transparent hover:border-[#4A8AEE] hover:bg-white duration-200 group">
                    <p className="text-[14px] font-medium text-white group-hover:text-[#4A8AEE] transition-colors duration-200">
                        다음 →
                    </p>
                </Link>
            </div>
        </div>
    );
}
