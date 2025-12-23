'use client';

interface Process {
  title: string;
  description: string;
  icon: string;
  mt?: string;
}

const processList: Process[] = [
  { title: '설문 조사', description: '총 20문항으로 이루어진\nDSM-5를 기반으로 한 설문 진행', icon: '📋' },
  { title: 'CAT 검사', description: '총 5가지 테스트로 이루어진\n종합 인지능력 검사를 진행', icon: '🧠', mt: 'mt-[120px]' },
  { title: '진단 및 솔루션', description: '테스트 결과를 종합하여\nADHD진단 및 솔루션 제공', icon: '🔍' },
  { title: 'AI 상담 챗봇', description: 'ADHD 증상 및 솔루션에 관한\nAI 기반 맞춤형 상담 제공', icon: '🗣️', mt: 'mt-[120px]' }
];

const ProcessCard = ({ title, description, icon, mt }: Process) => (
  <div
    className={`w-[320px] h-[370px] rounded-[20px] py-[50px] px-[40px] cursor-pointer transition-transform duration-300 hover:-translate-y-[10px] ${mt || ''}`}
    style={{ boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.15)' }}
  >
    <p className="text-[24px] font-bold text-black">{title}</p>
    <p className="text-[16px] font-medium text-[#474747] leading-[23px] mt-[10px]">{description}</p>
    <p className="text-[100px] mt-[50px]">{icon}</p>
  </div>
);

export default function ProcessCardSection() {
  return (
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
  );
}
