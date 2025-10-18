"use client";


export default function NBackPage() {
    return (
        <div className="w-full h-screen flex items-center justify-center flex-grow bg-[#f5f5f5]">
            <div className="drop-shadow-lg mt-22 w-[820px] min-h-[530px] bg-white rounded-[30px] p-10 shadow flex flex-col items-center">
                <h1 className="text-[36px] font-bold bg-gradient-to-r from-[#59C0EE] to-[#4E59F4] bg-clip-text text-transparent text-center mb-12">
                    N-back 테스트
                </h1>

                <div className="w-[700px] bg-[#f5f5f5] rounded-[10px] p-6 text-gray-700 text-sm leading-relaxed text-center">
                    <h2 className="text-2xl font-bold mb-2 text-[#4A8AEE]">🎯 테스트 방법</h2>
                    <p className="font-medium text-lg leading-[35px]">
                        화면에 연속적으로 이미지가 나타납니다.<br />
                        앞서 나온 이미지와 동일한 이미지가 나온다면,<span className="text-[#4A8AEE] font-bold text-xl">최대한 빠르게 버튼</span>을 누릅니다.
                        <br />
                        동일하지 않다면 <span className="text-[#4A8AEE] font-bold text-xl">다음 이미지로 넘어갈 때 까지 기다립니다.</span><br />
                        📈 총 <span className="text-[#4A8AEE] font-bold text-xl">50단계</span>로 이루어져 있습니다.
                    </p>
                </div>

                <button className="mt-12 px-[21px] py-[14px] rounded-[10px] bg-[#4A8AEE] text-white text-lg font-bold">
                    테스트 시작
                </button>
            </div>
        </div>
    );
}
