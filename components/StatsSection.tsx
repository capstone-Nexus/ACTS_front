'use client';

interface Stat {
  title: string;
  value: string;
  subtitle: string;
  highlight?: string;
}

const stats: Stat[] = [
  { title: '누적 검사 참여자', value: '45,000', subtitle: '전 세계 4만 5천 명 이상이 검사함', highlight: '+' },
  { title: '참여 기관 및 학교', value: '60', subtitle: '많은 공공기관도 사용함', highlight: '+' },
  { title: '검사 정확도', value: '95', subtitle: '정확도가 굉장히 높음', highlight: '+' }
];

const StatCard = ({ title, value, subtitle, highlight }: Stat) => (
  <div className="w-auto h-full flex flex-col">
    <p className="text-[28px] text-white font-bold">{title}</p>
    <p className="text-[70px] text-white font-bold">
      {value}
      {highlight && <span className="text-[50px] text-[#87B6FF]">{highlight}</span>}
    </p>
    <p className="text-[18px] text-white font-bold">{subtitle}</p>
  </div>
);

export default function StatsSection() {
  return (
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
  );
}
