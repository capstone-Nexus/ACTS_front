import Image from 'next/image';
import Link from 'next/link';

export default function Test() {
  const cardData = [
    {
      icon: '/images/clock.svg',
      title: '검사 소요 시간',
      description: '약 10~15분 정도 소요됩니다',
    },
    {
      icon: '/images/graph.svg',
      title: '검사 구성',
      description: '설문 20문항 + 3가지 테스트',
    },
    {
      icon: '/images/calendar.svg',
      title: '검사 일정',
      description: '한 번에 완료하거나 중간 저장 가능',
    },
    {
      icon: '/images/warning.svg',
      title: '주의사항',
      description: '집중할 수 있는 환경에서 진행하세요',
    },
  ];

  return (
    <div className='flex flex-col items-center'>
      <div className="w-full h-[300px] mt-[80px] flex flex-col items-center justify-center gap-[30px]">
        <div className="w-[60px] h-[60px] rounded-[10px] flex items-center justify-center bg-[#4A8AEE]">
          <Image src="/images/check.svg" alt="checkimg" width={35} height={35} />
        </div>
        <div className="flex flex-col items-center">
          <p className="text-[40px] font-bold">ADHD 종합 진단 테스트</p>
          <p className="text-[18px] font-medium text-[#737373] mt-[5px]">
            정확한 자가진단을 위한 과학적 검사 도구
          </p>
        </div>
      </div>
      <div className="w-full h-[230px] flex flex-row justify-center items-center gap-[30px]">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="w-[225px] h-[230px] border border-[#cccccc] rounded-[20px] bg-white flex flex-col items-center justify-center cursor-pointer duration-300 hover:scale-105"
          >
            <div className="w-[60px] h-[60px] rounded-[10px] bg-[#EDF9FF] flex items-center justify-center">
              <Image src={card.icon} alt={`${card.title} 아이콘`} width={35} height={35} />
            </div>
            <p className="text-[18px] font-semibold mt-6">{card.title}</p>
            <p className="text-[14px] mb-4 text-center">{card.description}</p>
          </div>
        ))}
      </div>
      <div className="w-[990px] h-[100px] bg-[#FFFBEB] border-1 border-[#FEF3C7] rounded-[10px] mt-[70px] flex flex-col justify-center p-8 gap-[5px]">
        <p className="text-[14px] text-[#78350F] font-semibold">💡 안내사항</p>
        <p className="text-[14px] text-[#78350F] font-medium">이 검사는 의학적 진단을 대체할 수 없으며, 참고용 자가진단 도구입니다. 정확한 진단은 전문의와 상담하시기 바랍니다.</p>
      </div>
      <Link href="survey" className="group w-[200px] h-[60px] center bg-[#4A8AEE] rounded-[10px] my-[50px] cursor-pointer hover:border-2 border-[#4A8AEE] hover:bg-white duration-250">
        <p className="text-[18px] font-bold text-white group-hover:text-[#4A8AEE]">검사 시작하기</p>
      </Link>
    </div>
  );
}
