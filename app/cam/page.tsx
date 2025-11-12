'use client';

import { useRef } from 'react';
import Webcam from 'react-webcam';
import Link from 'next/link';

export default function Cam() {
  const webcamRef = useRef<Webcam>(null);

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-[80px]">
      <div className="w-[130px] h-[30px] bg-[#EDF9FF] flex center flex-row rounded-[30px] mt-[40px] gap-2 select-none">
        <div className="w-[8px] h-[8px] bg-[#4A8AEE] rounded-full"></div>
        <p className="text-[14px] text-[#4A8AEE] font-medium">카메라 테스트</p>
      </div>

      <p className="text-[32px] font-bold text-black mt-[30px]">테스트 중에는 검사를 위한 카메라가 활성화됩니다.</p>
      <p className="text-[18px] font-medium text-black mt-[10px]">자리이탈이나 고개를 기울여보세요</p>

      <div className="w-[900px] h-[550px] bg-[#D9D9D9] rounded-[20px] mt-[60px] overflow-hidden relative" style={{ boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.15)' }}>
        <div className="w-full h-[470px] bg-pink-50 flex items-center justify-center relative">
          <Webcam ref={webcamRef} audio={false} className="absolute top-0 left-0 w-full h-full object-cover" />
          <div className="w-[530px] h-[330px] border-3 border-[#4A8AEE] rounded-[20px] z-10" />
        </div>

        <div className="w-full h-[80px] bg-white flex flex-row items-center justify-center">
          <p className="text-[18px] font-medium text-black">💡 카메라가 얼굴을 정확히 인식할 수 있도록 화면 중앙에 위치해 주세요.</p>
        </div>
      </div>

      <Link href='/survey'>
          <div className='w-[200px] h-[60px] rounded-[10px] bg-[#4A8AEE] text-white text-[18px] font-medium center mt-[60px] hover:bg-[#3A7ADE] cursor-pointer select-none'>
            다음 →
          </div>
        </Link>
    </div>
  );
}
