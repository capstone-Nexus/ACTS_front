'use client';

import Link from 'next/link';
import MainHeader from '@/components/MainHeader';
import Background1 from '../public/images/background1.jpg';
import Image from 'next/image';
import Footer from '@/components/footer';
import Dotbogi from '@/public/images/dotbogi.png';
import Mockup from '@/public/images/mockup.png';
import Right from '@/public/images/right.svg';
import Robot from '@/public/images/robot.png';

export default function Home() {
  const processList = [
    { title: '설문 조사', description: '총 20문항으로 이루어진\nDSM-5를 기반으로 한 설문 진행', icon: '📋' },
    { title: 'CAT 검사', description: '총 5가지 테스트로 이루어진\n종합 인지능력 검사를 진행', icon: '🧠', mt: 'mt-[120px]' },
    { title: '진단 및 솔루션', description: '테스트 결과를 종합하여\nADHD진단 및 솔루션 제공', icon: '🔍' },
    { title: 'AI 상담 챗봇', description: 'ADHD 증상 및 솔루션에 관한\nAI 기반 맞춤형 상담 제공', icon: '🗣️', mt: 'mt-[120px]' }
  ];

  const stats = [
    { title: '누적 검사 참여자', value: '45,000', subtitle: '전 세계 4만 5천 명 이상이 검사함', highlight: '+' },
    { title: '참여 기관 및 학교', value: '60', subtitle: '많은 공공기관도 사용함', highlight: '+' },
    { title: '검사 정확도', value: '95', subtitle: '정확도가 굉장히 높음', highlight: '+' }
  ];

  const ProcessCard = ({ title, description, icon, mt }: { title: string; description: string; icon: string; mt?: string }) => (
    <div className={`w-[320px] h-[370px] rounded-[20px] py-[50px] px-[40px] cursor-pointer transition-transform duration-300 hover:-translate-y-[10px] ${mt || ''}`} style={{ boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.15)' }}>
      <p className="text-[24px] font-bold text-black">{title}</p>
      <p className="text-[16px] font-medium text-[#474747] leading-[23px] mt-[10px]">{description}</p>
      <p className="text-[100px] mt-[50px]">{icon}</p>
    </div>
  );

  const StatCard = ({ title, value, subtitle, highlight }: { title: string; value: string; subtitle: string; highlight?: string }) => (
    <div className="w-auto h-full flex flex-col">
      <p className="text-[28px] text-white font-bold">{title}</p>
      <p className="text-[70px] text-white font-bold">
        {value}
        {highlight && <span className="text-[50px] text-[#87B6FF]">{highlight}</span>}
      </p>
      <p className="text-[18px] text-white font-bold">{subtitle}</p>
    </div>
  );

  const SectionButton = ({ text, onClick }: { text: string; onClick?: () => void }) => (
    <div onClick={onClick} className="w-[200px] h-[60px] center border-2 border-[#4A8AEE] bg-[#F9FAFB] cursor-pointer mt-[40px] duration-200 hover:bg-[#4A8AEE] hover:text-white text-[18px] text-[#4A8AEE] font-regular flex items-center justify-center">
      {text}
    </div>
  );

  return (
    <>
      <MainHeader />
      <Image src={Dotbogi} alt="backgroundimg" className="fixed z-[-1]" />

      {/* 섹션1 */}
      <div className="w-full h-[800px] bg-black relative overflow-hidden">
        <Image src={Background1} alt="background1" fill className="object-cover object-[center_35%]" />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center">
          <p className="text-[70px] text-white font-medium mt-[214px]">
            <span className="font-black">ADHD</span> 자가진단의 
          </p>
          <p className="text-[70px] text-white font-medium">새로운 기준</p>
          <p className="text-[22px] font-medium text-white mt-8">과학적이고 정확한 진단을 위한 종합적인 테스트와</p>
          <p className="text-[22px] font-medium text-white mt-1">개인화된 AI상담 서비스를 제공합니다</p>
        </div>
      </div>

      {/* 섹션2 */}
      <div className="w-full h-[450px] bg-[#F9FAFB] flex flex-col items-center">
        <p className="text-[40px] font-medium text-[#4A8AEE] mt-[111px]">Discover yourself with ACTS.</p>
        <p className="text-[18px] text-[#474747] mt-[31px]">ACTS를 통해 ADHD 검사 결과를 쉽고 정확하게 확인하고,</p>
        <p className="text-[18px] text-[#474747] mt-1">결과를 바탕으로 스스로를 더 깊이 이해할 수 있는 인사이트를 얻어보세요.</p>
        <Link href="/test">
          <SectionButton text="검사 바로가기" />
        </Link>
      </div>

      {/* 섹션3 */}
      <div className="w-full h-[1000px] bg-white flex flex-col justify-center px-[160px]">
        <div className="w-full h-[60px] flex flex-col justify-between">
          <p className="text-[14px] font-medium text-[#4A8AEE]">한눈에 보는 검사 프로세스</p>
          <p className="text-[28px] font-bold text-[#474747]">검사 진행 과정</p>
        </div>
        <div className="w-full h-[490px] mt-[55px] flex flex-row justify-center gap-[25px]">
          {processList.map((process, idx) => (
            <ProcessCard key={idx} {...process} />
          ))}
        </div>
      </div>

      {/* 섹션4 */}
      <div className="w-full h-[750px] bg-black/45 px-[100px] py-[80px]">
        <div className="w-[900px] h-full flex flex-col">
          <p className="text-white text-[28px] font-medium">Main Service</p>
          <p className="text-white text-[55px] font-medium leading-[80px] mt-[40px]">
            <span className="font-black">ACTS</span>에서 검사하고
            <br />
            자신이 <span className="font-black">ADHD</span>인지 알아보세요
          </p>
          <p className="text-[18px] text-white font-medium leading-[40px] mt-[25px]">
            CAT 검사(Cognitive Ability Test) 는 개인의 주의력, 인지 처리 능력, 사고력, 집중력 등을 종합적으로 평가하는 인지능력
            <br />
            검사입니다. 특히 ADHD(주의력결핍 과잉행동장애) 와 같은 주의력 문제를 객관적으로 파악하는 데에 활용됩니다.
          </p>
          <div className="w-full h-[160px] mt-auto flex flex-row gap-[110px]">
            {stats.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>
        </div>
      </div>

      {/* 섹션5 */}
      <div className="w-full h-screen bg-white center">
        <div className="w-[1200px] h-[500px] flex flex-row justify-between items-center">
          <div className="w-auto h-full flex flex-col justify-center gap-[30px]">
            <p className="font-bold text-[28px] text-[#4A8AEE]">나만의 ADHD 관리 시작하기</p>
            <p className="font-bold text-[50px] text-black leading-[75px]">
              내 ADHD 관리,
              <br />
              검사부터 솔루션까지
              <br />
              간편하게
            </p>
          </div>
          <Image src={Mockup} alt="mockup" className="w-[700px]" />
        </div>
      </div>

      {/* 섹션6 */}
      <div className="w-full h-[400px] bg-[#2F2880] relative overflow-hidden flex flex-row">
        <div className="w-[555px] h-full ml-[120px] flex flex-col justify-center">
          <p className="text-[50px] text-white leading-[70px]">
            <span className="font-bold">AI 챗봇</span>에게
            <br />
            <span className="font-bold">궁금한 점</span>을 물어보세요!
          </p>
          <p className="text-[24px] text-white mt-[35px]">최신 정보를 바탕으로 정확하고 빠른 답변을 제공합니다.</p>
        </div>
        <Image src={Robot} alt="robot" className="w-[470px] h-[470px] mt-[100px] ml-[70px]" />
        <div className="w-[80px] h-[80px] rounded-[80px] bg-white center ml-auto mr-[50px] mt-auto mb-[60px] cursor-pointer">
          <Image src={Right} alt="right" className="w-[35px]" />
        </div>
      </div>
      <Footer />
    </>
  );
}