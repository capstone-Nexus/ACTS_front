"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Test4() {
    const [testFinished, setTestFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTestFinished(true);
    });
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#F9FAFB]">
      <div className="mt-[130px] mb-10 w-[900px] h-[751px] bg-white border border-[#CCCCCC] flex flex-col items-center">
        <div className="mt-8 text-[32px] font-bold">분할 주의력 검사</div>
        <div className="mt-1 text-[18px] text-[#737373]">진행 중...</div>
        <div className="mt-8 w-[800px] h-[1px] bg-[#CDD0D4]" />

        <div className="relative w-[800px] h-[330px] bg-[#F9FAFB] text-center flex flex-col justify-center items-center border border-[#CDD0D4] mt-12">
          <div className="absolute top-4 right-4 w-[100px] h-[30px] bg-white text-[12px] font-medium flex justify-center items-center border border-[#CDD0D4] text-[#474747]">
            진행률 : 20/20
          </div>

          <div className="w-[120px] h-[120px] border border-[#CDD0D4] flex items-center justify-center">
            <div className="w-[70px] h-[70px] rounded-full bg-white border-3 border-black"></div>
          </div>
        </div>

        <div className="w-[800px] h-[50px] mt-7 text-center bg-[#F9FAFB] border border-[#CDD0D4]">
          <p className="mt-3 text-[14px] font-medium text-[#474747]">
            이전 자극과 같으면 클릭하세요.
          </p>
        </div>

        {testFinished && (
          <Link href="/test/cat/test5" className="mt-10 w-[90px] h-[50px] flex justify-center items-center bg-[#4A8AEE] cursor-pointer border-2 border-transparent hover:border-[#4A8AEE] hover:bg-white duration-200 group">
            <p className="text-[14px] font-medium text-white group-hover:text-[#4A8AEE] transition-colors duration-200">
              다음 →
            </p>
          </Link>)}
      </div>
    </div>
  );
}
