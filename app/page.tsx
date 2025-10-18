'use client';

import Link from 'next/link';
import Footer from '@/components/footer';
import Image, { StaticImageData } from 'next/image';
import Plant from '@/public/images/plant.png';
import Dotbogi from '@/public/images/dotbogi.png';
import Computer from '@/public/images/computer.png';
import Bogo from '@/public/images/bogo.png';
import Background from '@/public/images/background.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faImages } from '@fortawesome/free-regular-svg-icons';
import { faRobot, faPalette } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';

const buttonPrimary = 'w-[170px] h-[60px] flex justify-center items-center bg-white rounded-[60px] hover:scale-105 transition duration-300';
const buttonSecondary = 'w-[170px] h-[60px] flex justify-center items-center rounded-[60px] border-2 border-white hover:bg-white/20 hover:scale-105 transition duration-300';

type Test = { title: string; subtitle: string; icon: any; path: string };
type Feature = { icon: string; title: string; description: string };
type Section4Card = { img: StaticImageData; alt: string; label: string };

const tests: Test[] = [
  { title: 'Stroop', subtitle: '테스트', icon: faPalette, path: '/stroop' },
  { title: 'N-back', subtitle: '테스트', icon: faImages, path: '/NBack' },
  { title: '시간 감각', subtitle: '테스트', icon: faClock, path: '/test' },
  { title: '상담 챗봇', subtitle: '테스트', icon: faRobot, path: '/consultation' }
];

const features: Feature[] = [
  {
    icon: '💡',
    title: '과학적 검증',
    description: 'DSM-5 기준과 국제 표준 진단 도구를 바탕\n으로 한 신뢰할 수 있는 진단 시스템을 제공\n합니다.'
  },
  {
    icon: '🤖',
    title: 'AI 상담 서비스',
    description: '24시간 언제든지 이용 가능한 개인화된 AI\n상담으로 즉시 도움과 가이드라인을 받을 수\n있습니다.'
  },
  {
    icon: '📊',
    title: '종합적 분석',
    description: '다양한 측면에서 ADHD 증상을 분석하고\n개인별 맞춤 결과와 개선 방안을\n제시합니다.'
  }
];

const section4Cards: Section4Card[] = [
  { img: Dotbogi, alt: '돋보기이미지', label: '상태 파악' },
  { img: Computer, alt: '컴퓨터이미지', label: '분석 인사이트' },
  { img: Plant, alt: '새싹이미지', label: '자기 이해' },
  { img: Bogo, alt: '보고서이미지', label: '데이터 활용' }
];

const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
};

const TestCard: React.FC<Test> = ({ title, subtitle, icon }) => (
  <div className="w-[215px] h-full bg-white rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.15)] cursor-pointer hover:scale-105 transition duration-300 p-[20px] relative">
    <p className="text-[20px]">
      <span className="text-[#4A8AEE] font-bold">{title}</span>
      <span className="text-[#000000] font-medium"> {subtitle}</span>
    </p>
    <p className="text-[20px] font-medium">바로가기</p>
    <FontAwesomeIcon icon={icon} className="absolute bottom-3 right-3 text-[#4A8AEE] text-[50px]" />
  </div>
);

const FeatureCard: React.FC<Feature> = ({ icon, title, description }) => (
  <div className="w-[380px] h-full rounded-[20px] bg-white flex flex-col justify-center items-center shadow-[0_4px_10px_rgba(0,0,0,0.15)] cursor-pointer gap-4 p-4 hover:scale-105 transition duration-300">
    <div className="w-[80px] h-[80px] bg-[#C8EDFF] rounded-full flex justify-center items-center">
      <p className="text-[50px]">{icon}</p>
    </div>
    <p className="text-[24px] font-bold text-center">{title}</p>
    <p className="text-[16px] text-[#64748B] text-center whitespace-pre-line">{description}</p>
  </div>
);

const ImageCard: React.FC<Section4Card> = ({ img, alt, label }) => (
  <div className="w-[25%] h-full flex flex-col items-center">
    <div className="w-full h-[180px] bg-white overflow-hidden">
      <Image src={img} alt={alt} className="h-[180px] cursor-pointer" />
    </div>
    <p className="text-[18px] text-[#3C3C3C] font-medium mt-[7px] text-center">{label}</p>
  </div>
);

export default function Home() {
  const section3Ref = useRef<HTMLDivElement>(null);

  const handleScrollToSection3 = () => {
    section3Ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full h-auto flex flex-col">
      {/* 섹션 1 */}
      <div className="w-full h-screen flex items-center bg-cover bg-center" style={{ backgroundImage: `url(${Background.src})` }}>
        <div className="w-full h-[400px]">
          <div className="w-[500px] h-full ml-[150px] flex flex-col justify-center gap-[35px]">
            <p className="text-[50px] text-white font-extrabold leading-[70px]">
              ADHD 자가진단의
              <br />
              새로운 기준
            </p>
            <p className="text-[25px] text-white font-medium leading-[40px]">
              과학적이고 정확한 진단을 위한 종합적인 테스트와
              <br />
              개인화된 AI상담 서비스를 제공합니다
            </p>
            <div className="w-[380px] h-[60px] flex flex-row justify-between">
              <Link href="/test" className={buttonPrimary}>
                <p className="text-[20px] text-[#3C3C3C] font-medium">진단 시작하기</p>
              </Link>
              <button onClick={handleScrollToSection3} className={buttonSecondary}>
                <p className="text-[20px] text-white font-medium">더 알아보기</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 섹션 2 */}
      <div className="w-full h-[700px] flex items-center bg-white">
        <div className="w-full h-[450px] flex flex-row justify-center gap-[50px]">
          <div className="w-[735px] h-full bg-[#f5f5f5] rounded-[20px] flex justify-center items-center">최근 분석 결과 차트</div>
          <div className="w-[470px] h-full flex flex-col justify-between">
            {chunkArray<Test>(tests, 2).map((group, i) => (
              <div key={i} className="w-full h-[210px] flex flex-row justify-between">
                {group.map((item, j) => (
                  <Link key={j} href={item.path} className="w-[215px]">
                    <TestCard title={item.title} subtitle={item.subtitle} icon={item.icon} path={item.path} />
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 섹션 3 */}
      <div ref={section3Ref} className="w-full h-[750px] bg-[#F5F5F5] flex justify-center">
        <div className="w-[1210px] h-full flex flex-col justify-center gap-[85px]">
          <div className="w-full h-[125px] flex flex-col justify-center gap-4">
            <p className="text-[36px] font-bold bg-gradient-to-r from-[#59C0EE] to-[#4E59F4] bg-clip-text text-transparent text-center">왜 우리 서비스를 선택해야 할까요?</p>
            <p className="text-[18px] font-medium text-[#737373] text-center">
              전문적이고 신뢰할 수 있는 ADHD 진단 도구와 맞춤형 상담 서비스를 통해
              <br />
              정확한 자가진단과 전문적인 가이드라인을 제공합니다.
            </p>
          </div>
          <div className="w-full h-[310px] flex flex-row justify-center items-center gap-[40px]">
            {features.map((item, i) => (
              <FeatureCard key={i} icon={item.icon} title={item.title} description={item.description} />
            ))}
          </div>
        </div>
      </div>

      {/* 섹션 4 */}
      <div className="w-full h-[660px] bg-white flex justify-center">
        <div className="w-[1000px] h-full flex flex-col justify-center gap-[85px]">
          <div className="w-full h-[125px] flex flex-col justify-center gap-4">
            <p className="text-[36px] font-bold bg-gradient-to-r from-[#59C0EE] to-[#4E59F4] bg-clip-text text-transparent text-center">우리 서비스와 함께라면</p>
            <p className="text-[18px] font-medium text-[#737373] text-center">
              ACTS를 통해 ADHD 검사 결과를 쉽고 정확하게 확인하고, <br />그 결과를 바탕으로 스스로를 더 깊이 이해할 수 있는 구체적인 분석과 인사이트를 얻어보세요.
            </p>
          </div>
          <div className="w-full h-[225px] flex flex-row justify-center gap-[0]">
            {section4Cards.map((card, i) => (
              <ImageCard key={i} img={card.img} alt={card.alt} label={card.label} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
