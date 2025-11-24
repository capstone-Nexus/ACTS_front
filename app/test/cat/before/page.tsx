import Link from "next/link";

export default function CatBefore() {
    const TestData = [
        {
            title: 'TEST 1',
            description: '단순 선택 주의력',
            description1: '기본 반응 속도와 정확도 측정',
        },
        {
            title: 'TEST 2',
            description: '억제 지속 주의력',
            description1: '충동 억제 및 주의 지속력 평가',
        },
        {
            title: 'TEST 3',
            description: '간섭 선택 주의력',
            description1: '방해 자극 통제 능력 확인',
        },
        {
            title: 'TEST 4',
            description: '분할 주의력',
            description1: '복합 자극 동시 처리 능력',
        },
        {
            title: 'TEST 5',
            description: '작업 기억력',
            description1: '단기 기억 유지 및 조작 능력',
        },
    ];
    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-[#F9FAFB]">
            <div className="mt-[150px] mb-[80px] w-[900px] h-[850px] bg-[#ffffff] border border-[#CCCCCC] items-center flex flex-col">
                <div className="mt-12 text-[32px] font-bold">CAT 종합 주의력 검사</div>
                <div className="text-[18px] text-[#737373]">comprehensive attention test</div>
                <div className="mt-10 w-[800px] h-[1px] bg-[#CDD0D4]" />
                <div className=" w-[800px] h-[150px] bg-[#F9FAFB] text-center flex flex-col mt-12">
                    <div className="mt-7 text-[22px] font-bold">검사 소개</div>
                    <p className="text-[14px] mt-4">CAT는 개인의 주의 집중 능력, 반응 억제력, 작업 기억력 등을 다각도로 측정하는  종합 인지 검사입니다.</p>
                    <p className="text-[14px]">총 5가지 세부 검사로 구성되어 있으며,  시각적 자극과 청각적 자극 모두를 활용합니다.</p>
                </div>
                <div className="mt-10 grid grid-cols-3 gap-6">
                    {TestData.map((test, index) => (
                        <div key={index} className="w-[250px] h-[150px] border border-[#CCCCCC] flex flex-col justify-center">
                            <p className="ml-5 text-[22px] font-bold">{test.title}</p>
                            <p className="ml-5 text-[16px] font-bold mt-1">{test.description}</p>
                            <p className="ml-5 text-[12px] font-medium text-[#737373] mt-1">{test.description1}</p>
                        </div>
                    ))}
                </div>

                <Link href="/test/cat/test1" className="mt-8 w-[200px] h-[60px] flex justify-center items-center bg-[#4A8AEE] cursor-pointer border-2 border-transparent hover:border-[#4A8AEE] hover:bg-white duration-200 group">
                    <p className="text-[18px] font-bold text-white group-hover:text-[#4A8AEE] transition-colors duration-200">
                        검사 시작하기 →/
                    </p>
                </Link>
            </div>
        </div>
    )
}