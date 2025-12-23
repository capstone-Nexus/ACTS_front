import Image from 'next/image';
import { Icons } from '@/icons';
import Link from 'next/link';
import { useState } from 'react';
import { analysisData, solutionData } from '../data/analysisData';

interface ModalProps {
  isOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

export default function Modal({ isOpen, setModalOpen }: ModalProps) {
  const [activeTab, setActiveTab] = useState<'overall' | 'analysis' | 'solution'>('overall');
  const [activeAnalysis, setActiveAnalysis] = useState<'focus' | 'impulse' | 'speed' | 'memory'>('focus');

  if (!isOpen) return null;

  const score = 100;
  let message = '';
  let imageUrl = '';

  if (score >= 80) {
    message = '최고에요!';
    imageUrl = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Beaming%20Face%20with%20Smiling%20Eyes.png';
  } else if (score >= 50) {
    message = '그럭저럭..';
    imageUrl = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Raised%20Eyebrow.png';
  } else {
    message = '별로에요..';
    imageUrl = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Crossed-Out%20Eyes.png';
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[100] p-4">
      <div className="w-full max-w-[1000px] h-[625px] max-h-[800px] bg-white rounded-[20px] flex flex-col overflow-hidden">
        <div className="w-full flex flex-row justify-between px-[3%] pt-[3%] min-h-[80px]">
          <div className="h-full flex flex-col justify-between">
            <p className="text-xl md:text-2xl font-bold text-black">검사 결과 상세보기</p>
            <p className="text-xs font-medium text-[#737373]">검사 일자: </p>
          </div>

          <Image
            src={Icons.X}
            alt="x"
            className="cursor-pointer select-none mb-auto"
            onClick={() => {
              setModalOpen(false);
            }}
          />
        </div>

        <div className="w-full min-h-[50px] bg-white border-b border-[#d2d2d2] px-[5%] flex flex-row items-end gap-[3%] relative">
          <div className="h-full flex items-center cursor-pointer relative px-[5px]" onClick={() => setActiveTab('overall')}>
            <p className={`text-sm md:text-base select-none font-${activeTab === 'overall' ? 'bold' : 'medium'} text-${activeTab === 'overall' ? '[#4a8aee]' : '[#737373]'}`}>종합 결과</p>
            {activeTab === 'overall' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4a8aee]" />}
          </div>
          <div className="h-full flex items-center cursor-pointer relative px-[5px]" onClick={() => setActiveTab('analysis')}>
            <p className={`text-sm md:text-base select-none font-${activeTab === 'analysis' ? 'bold' : 'medium'} text-${activeTab === 'analysis' ? '[#4a8aee]' : '[#737373]'}`}>영역별 분석</p>
            {activeTab === 'analysis' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4a8aee]" />}
          </div>
          <div className="h-full flex items-center cursor-pointer relative px-[5px]" onClick={() => setActiveTab('solution')}>
            <p className={`text-sm md:text-base select-none font-${activeTab === 'solution' ? 'bold' : 'medium'} text-${activeTab === 'solution' ? '[#4a8aee]' : '[#737373]'}`}>솔루션</p>
            {activeTab === 'solution' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4a8aee]" />}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'overall' && (
            <div className="w-full h-full p-[3%]">
              <div className="w-full flex flex-col lg:flex-row justify-between gap-[3%]">
                <div className="w-full lg:w-[45%] min-h-[130px] bg-[#F9FAFB] border border-[#CDD0D4] rounded-[10px] flex flex-row items-center p-4">
                  <img src={imageUrl} alt="score emoji" width="100" height="100" className="w-[80px] h-[80px] md:w-[100px] md:h-[100px]" />

                  <div className="flex-1 h-full flex flex-col justify-center ml-4">
                    <p className="text-xs md:text-sm font-medium text-[#474747]">현재 나의 점수는...</p>
                    <p className="text-2xl md:text-3xl font-bold text-[#474747]">
                      <span className="text-[#4A8AEE]">{score}</span>점! {message}
                    </p>
                  </div>
                </div>

                <div className="flex-1 bg-[#F6FCFF] border border-[#A5E1FF] rounded-[10px] p-4 md:p-5 flex flex-col justify-between min-h-[130px]">
                  <p className="text-lg md:text-xl text-[#4a8aee] font-bold">ADHD 위험도: 낮음</p>
                  <p className="text-xs md:text-sm text-[#737373] font-medium leading-5">
                    현재 ADHD 증상이 경미하거나 거의 나타나지 않습니다.
                    <br />
                    검사를 하면서 나온 데이터들을 종합하여 분석한 AI의 총평 같은거
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="w-full h-full p-[3%] flex flex-col lg:flex-row gap-[3%]">
              <div className="w-full lg:w-60 bg-white border border-[#d2d2d2] rounded-lg flex flex-col p-[15px] gap-[10px] mb-4 lg:mb-0">
                <p className="text-xs text-black font-medium">영역 선택</p>
                <div onClick={() => setActiveAnalysis('focus')} className={`w-full min-h-[45px] rounded-[5px] text-xs font-medium flex flex-row items-center px-[15px] gap-1.5 cursor-pointer select-none duration-200 ${activeAnalysis === 'focus' ? 'bg-[#F6FCFF] border-[#4a8aee]' : 'bg-[#F9FAFB] text-[#737373] border-[#d2d2d2]'} border`}>
                  <Image src={Icons.Focus} alt="focus" width={15} />
                  주의력 집중
                </div>
                <div onClick={() => setActiveAnalysis('impulse')} className={`w-full min-h-[45px] rounded-[5px] text-xs font-medium flex flex-row items-center px-[15px] gap-1.5 cursor-pointer select-none duration-200 ${activeAnalysis === 'impulse' ? 'bg-[#F6FCFF] border-[#4a8aee]' : 'bg-[#F9FAFB] text-[#737373] border-[#d2d2d2]'} border`}>
                  <Image src={Icons.Zap} alt="Zap" width={15} />
                  충동 반응
                </div>
                <div onClick={() => setActiveAnalysis('speed')} className={`w-full min-h-[45px] rounded-[5px] text-xs font-medium flex flex-row items-center px-[15px] gap-1.5 cursor-pointer select-none duration-200 ${activeAnalysis === 'speed' ? 'bg-[#F6FCFF] border-[#4a8aee]' : 'bg-[#F9FAFB] text-[#737373] border-[#d2d2d2]'} border`}>
                  <Image src={Icons.Clock} alt="clock" width={15} />
                  반응 속도
                </div>
                <div onClick={() => setActiveAnalysis('memory')} className={`w-full min-h-[45px] rounded-[5px] text-xs font-medium flex flex-row items-center px-[15px] gap-1.5 cursor-pointer select-none duration-200 ${activeAnalysis === 'memory' ? 'bg-[#F6FCFF] border-[#4a8aee]' : 'bg-[#F9FAFB] text-[#737373] border-[#d2d2d2]'} border`}>
                  <Image src={Icons.Brain} alt="brain" width={15} />
                  작업 기억
                </div>
              </div>

              <div className="flex-1 overflow-y-auto flex flex-col bg-white border border-[#d2d2d2] rounded-lg p-4 md:p-5">
                {activeAnalysis === 'focus' && (
                  <>
                    <p className="text-base md:text-lg text-black font-bold">{analysisData.focus.title}</p>
                    <p className="text-xs text-[#737373] font-medium">{analysisData.focus.subtitle}</p>

                    <div className="w-full flex flex-col gap-2 mt-2">
                      <p className="text-sm md:text-base font-bold text-[#4a8aee] ml-auto">{analysisData.focus.score}점</p>
                      <div className="w-full h-2 rounded-full bg-[#e5e7eb]">
                        <div className="h-full rounded-full bg-[#4a8aee]" style={{ width: `${analysisData.focus.score}%` }}></div>
                      </div>
                    </div>

                    <div className="w-full min-h-[60px] bg-[#F6FCFF] border border-[#A5E1FF] rounded-lg p-3 flex flex-col justify-between mt-5">
                      <p className="text-xs text-[#4a8aee] font-bold">평가 결과</p>
                      <p className="text-xs text-[#3c3c3c] font-medium">{analysisData.focus.evaluation}</p>
                    </div>

                    <div className="w-full bg-[#F9FAFB] border border-[#D2D2D2] rounded-lg mt-5 p-3 flex flex-col gap-1 min-h-[100px]">
                      <p className="text-sm font-bold text-black mb-1">세부 항목</p>
                      {analysisData.focus.details.map((item, idx) => (
                        <div key={idx} className="w-full flex flex-row justify-between">
                          <p className="text-sm text-[#474747] font-medium">- {item.label}</p>
                          <p className="text-sm text-[#4a8aee] font-medium">{item.status}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {activeAnalysis === 'impulse' && (
                  <>
                    <p className="text-base md:text-lg text-black font-bold">{analysisData.impulse.title}</p>
                    <p className="text-xs text-[#737373] font-medium">{analysisData.impulse.subtitle}</p>

                    <div className="w-full flex flex-col gap-2 mt-2">
                      <p className="text-sm md:text-base font-bold text-[#4a8aee] ml-auto">{analysisData.impulse.score}점</p>
                      <div className="w-full h-2 rounded-full bg-[#e5e7eb]">
                        <div className="h-full rounded-full bg-[#4a8aee]" style={{ width: `${analysisData.impulse.score}%` }}></div>
                      </div>
                    </div>

                    <div className="w-full min-h-[60px] bg-[#F6FCFF] border border-[#A5E1FF] rounded-lg p-3 flex flex-col justify-between mt-5">
                      <p className="text-xs text-[#4a8aee] font-bold">평가 결과</p>
                      <p className="text-xs text-[#3c3c3c] font-medium">{analysisData.impulse.evaluation}</p>
                    </div>

                    <div className="w-full bg-[#F9FAFB] border border-[#D2D2D2] rounded-lg mt-5 p-3 flex flex-col gap-1 min-h-[100px]">
                      <p className="text-sm font-bold text-black mb-1">세부 항목</p>
                      {analysisData.impulse.details.map((item, idx) => (
                        <div key={idx} className="w-full flex flex-row justify-between">
                          <p className="text-sm text-[#474747] font-medium">- {item.label}</p>
                          <p className="text-sm text-[#4a8aee] font-medium">{item.status}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {activeAnalysis === 'speed' && (
                  <>
                    <p className="text-base md:text-lg text-black font-bold">{analysisData.speed.title}</p>
                    <p className="text-xs text-[#737373] font-medium">{analysisData.speed.subtitle}</p>

                    <div className="w-full flex flex-col gap-2 mt-2">
                      <p className="text-sm md:text-base font-bold text-[#4a8aee] ml-auto">{analysisData.speed.score}점</p>
                      <div className="w-full h-2 rounded-full bg-[#e5e7eb]">
                        <div className="h-full rounded-full bg-[#4a8aee]" style={{ width: `${analysisData.speed.score}%` }}></div>
                      </div>
                    </div>

                    <div className="w-full min-h-[60px] bg-[#F6FCFF] border border-[#A5E1FF] rounded-lg p-3 flex flex-col justify-between mt-5">
                      <p className="text-xs text-[#4a8aee] font-bold">평가 결과</p>
                      <p className="text-xs text-[#3c3c3c] font-medium">{analysisData.speed.evaluation}</p>
                    </div>

                    <div className="w-full bg-[#F9FAFB] border border-[#D2D2D2] rounded-lg mt-5 p-3 flex flex-col gap-1 min-h-[100px]">
                      <p className="text-sm font-bold text-black mb-1">세부 항목</p>
                      {analysisData.speed.details.map((item, idx) => (
                        <div key={idx} className="w-full flex flex-row justify-between">
                          <p className="text-sm text-[#474747] font-medium">- {item.label}</p>
                          <p className="text-sm text-[#4a8aee] font-medium">{item.status}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {activeAnalysis === 'memory' && (
                  <>
                    <p className="text-base md:text-lg text-black font-bold">{analysisData.memory.title}</p>
                    <p className="text-xs text-[#737373] font-medium">{analysisData.memory.subtitle}</p>

                    <div className="w-full flex flex-col gap-2 mt-2">
                      <p className="text-sm md:text-base font-bold text-[#4a8aee] ml-auto">{analysisData.memory.score}점</p>
                      <div className="w-full h-2 rounded-full bg-[#e5e7eb]">
                        <div className="h-full rounded-full bg-[#4a8aee]" style={{ width: `${analysisData.memory.score}%` }}></div>
                      </div>
                    </div>

                    <div className="w-full min-h-[60px] bg-[#F6FCFF] border border-[#A5E1FF] rounded-lg p-3 flex flex-col justify-between mt-5">
                      <p className="text-xs text-[#4a8aee] font-bold">평가 결과</p>
                      <p className="text-xs text-[#3c3c3c] font-medium">{analysisData.memory.evaluation}</p>
                    </div>

                    <div className="w-full bg-[#F9FAFB] border border-[#D2D2D2] rounded-lg mt-5 p-3 flex flex-col gap-1 min-h-[100px]">
                      <p className="text-sm font-bold text-black mb-1">세부 항목</p>
                      {analysisData.memory.details.map((item, idx) => (
                        <div key={idx} className="w-full flex flex-row justify-between">
                          <p className="text-sm text-[#474747] font-medium">- {item.label}</p>
                          <p className="text-sm text-[#4a8aee] font-medium">{item.status}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'solution' && (
            <div className="w-full h-full p-5 flex flex-col">
              <p className="text-[16px] font-bold text-black">맞춤형 솔루션 제안</p>

              <div className="w-full h-50 flex flex-row justify-center gap-[50px] mt-[30px]">
                {solutionData.map((solution, idx) => (
                  <div key={idx} className="flex-1 h-full bg-[#F6FCFF] border border-[#A5E1FF] rounded-lg p-[25px] flex flex-col gap-1">
                    <p className="text-[44px]">{solution.emoji}</p>
                    <p className="text-[16px] font-bold text-black">{solution.title}</p>
                    <p className="text-xs text-[#737373] font-medium">{solution.description}</p>
                    <p className="text-[10px] text-[#4a8aee] font-medium">{solution.examples}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-full min-h-[80px] bg-white border-t border-[#d2d2d2] flex flex-row items-center justify-center gap-3 md:gap-5 p-4">
          <Link href="/consultation" className="w-[100px] md:w-[110px] h-10 bg-[#4a8aee] flex justify-center items-center rounded-sm duration-200 hover:bg-[#4077CE]">
            <p className="text-xs text-white font-medium">챗봇 상담하기</p>
          </Link>

          <div className="w-[100px] md:w-[110px] h-10 bg-white border-[1.5px] border-[#4a8aee] rounded-sm flex justify-center items-center cursor-pointer text-xs text-[#4a8aee] font-medium duration-200 hover:bg-[#4a8aee] hover:text-white">결과 다운로드</div>
        </div>
      </div>
    </div>
  );
}
