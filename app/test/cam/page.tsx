'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Loading from '@/components/loading';
import Webcam from './components/Webcam';

export default function Cam() {
  const [isLoading, setIsLoading] = useState(true);
  const [turnCount, setTurnCount] = useState(0);
  const [tiltCount, setTiltCount] = useState(0);
  const [awayCount, setAwayCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-[80px]">
      <div className="w-[130px] h-[30px] bg-[#EDF9FF] flex center flex-row rounded-[30px] mt-[40px] gap-2 select-none">
        <div className="w-[8px] h-[8px] bg-[#4A8AEE] rounded-full"></div>
        <p className="text-[14px] text-[#4A8AEE] font-medium">카메라 테스트</p>
      </div>

      <p className="text-[32px] font-bold text-black mt-[30px]">테스트 중에는 검사를 위한 카메라가 활성화됩니다.</p>
      <p className="text-[18px] font-medium text-black mt-[10px]">자리이탈이나 고개를 기울여보세요</p>

      <div className="w-[650px] h-[430px] bg-[#D9D9D9] rounded-[20px] mt-[60px] overflow-hidden relative" style={{ boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.15)' }}>
        <div className="w-full h-[350px] bg-[#EBEDEF] flex items-center justify-center relative">
          <div className="w-full h-full absolute flex items-center justify-center">
            <Webcam onTurnChange={setTurnCount} onTiltChange={setTiltCount} onAwayChange={setAwayCount} />
          </div>
          <div className="w-[330px] h-[230px] border-3 border-[#4A8AEE] rounded-[20px] z-10" />
        </div>

        <div className="w-full h-[80px] bg-white flex flex-row items-center justify-center">
          <div className="w-full h-full flex justify-center items-center gap-8 text-[16px] font-medium text-black">
            <p>고개 돌림: {turnCount}회</p>
            <p>고개 기울임: {tiltCount}회</p>
            <p>자리 이탈: {awayCount}회</p>
          </div>
        </div>
      </div>

      <Link href="/test/survey">
        <div className="w-[200px] h-[60px] rounded-[10px] bg-[#4A8AEE] text-white text-[18px] font-medium center mt-[20px] hover:bg-[#3A7ADE] cursor-pointer select-none duration-200">다음 →</div>
      </Link>
    </div>
  );
}
