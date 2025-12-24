'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '@/components/Loading';
import toast from 'react-hot-toast';

export default function Test() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');

    if (!token) {
      toast.error('로그인이 필요합니다.', { duration: 2000 });
      router.replace('/signin');
    } else {
      setIsAuthChecked(true);
    }
  }, [router]);

  if (!isAuthChecked) return null;
  if (isLoading) return <Loading />;

  const cardData = [
    {
      icon: '/images/list.svg',
      title: '설문',
      description: '20문항으로',
      description1: '이루어져있습니다.',
    },
    {
      icon: '/images/graph.svg',
      title: 'CAT 검사',
      description: '5가지 검사로',
      description1: '이루어져있습니다.',
    },
    {
      icon: '/images/chatbot.svg',
      title: 'AI 종합 리포트',
      description: 'AI가 검사 결과를 종합해',
      description1: '솔루션을 제공합니다.',
    },
  ];

  return (
    <div className='flex flex-col items-center'>
      <div className="w-full h-[300px] mt-[80px] flex flex-col items-center justify-center gap-[30px]">
        <div className="w-[60px] h-[60px] rounded-[10px] flex items-center justify-center bg-[#4A8AEE]">
          <Image src="/images/check.svg" alt="checkimg" width={35} height={35} />
        </div>
        <div className="flex flex-col items-center">
          <p className="text-[40px] font-bold">ADHD 종합 진단 검사</p>
          <p className="text-[18px] font-medium text-[#737373] mt-[5px]">
            정확한 자가진단을 위한 과학적 검사 도구
          </p>
        </div>
      </div>
      <div className="w-full h-[230px] flex flex-row justify-center items-center gap-[70px]">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="w-[225px] h-[230px] border border-[#cccccc] rounded-[20px] bg-white flex flex-col items-center justify-center cursor-pointer duration-300 hover:scale-105"
          >
            <div className="w-[60px] h-[60px] rounded-[10px] bg-[#EDF9FF] flex items-center justify-center">
              <Image src={card.icon} alt={`${card.title} 아이콘`} width={35} height={35} />
            </div>
            <p className="text-[18px] font-semibold mt-6">{card.title}</p>
            <p className="text-[14px] mb-4 mt-3 text-center">{card.description}<br/>{card.description1}</p>
          </div>
        ))}
      </div>
      <div className="w-auto h-[100px] bg-[#FFFBEB] border-1 border-[#FEF3C7] rounded-[10px] mt-[70px] flex flex-col justify-center p-8 gap-[5px]">
        <p className="text-[14px] text-[#78350F] font-semibold">💡 안내사항</p>
        <li className="ml-6 text-[14px] text-[#78350F] font-medium">
          이 검사는 테스트 진행 중 웹캠을 통해 자세나 움직임(예: 목 기울임, 자리이탈 등)을 인식합니다.<br/>
          영상은 화면에 표시되지 않으며, 검사 분석용으로만 사용됩니다. 영상 촬영이 부담스러우신 경우 검사를 진행하지 않으셔도 됩니다.
        </li>
      </div>
      <Link
        href="/test/cam"
        className="group w-[200px] h-[60px] center bg-[#4A8AEE] rounded-[10px] my-[50px] cursor-pointer hover:border-2 border-[#4A8AEE] hover:bg-white duration-250"
      >
        <p className="text-[18px] font-bold text-white group-hover:text-[#4A8AEE]">검사 시작하기</p>
      </Link>
    </div>
  );
}
