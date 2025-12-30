import Image from 'next/image';
import { Icons } from '@/icons';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ReportResponse } from '@/lib/reportApi';

interface ModalProps {
  isOpen: boolean;
  setModalOpen: (open: boolean) => void;
  testResult: ReportResponse;
}

type AnalysisType = 'simple' | 'sustained' | 'interference' | 'divided' | 'working_memory';

function SolutionCards({ content }: { content: string }) {
  const parseSolutions = (text: string) => {
    const solutions = [];
    
    const solutionBlocks = text.split(/솔루션\d+:/);
    
    for (let i = 1; i < solutionBlocks.length && i <= 3; i++) {
      const block = solutionBlocks[i];
      
      const titleMatch = block.match(/제목:\s*([^\n]+)/);
      const descMatch = block.match(/설명:\s*([^\n]+)/);
      const examplesMatch = block.match(/예시:\s*([^\n]+)/);
      
      if (titleMatch && descMatch && examplesMatch) {
        solutions.push({
          title: titleMatch[1].trim(),
          description: descMatch[1].trim(),
          examples: examplesMatch[1].trim(),
        });
      }
    }
    
    if (solutions.length === 0) {
      return [
        {
          title: '규칙적인 운동',
          description: '주 3회 이상 유산소 운동으로 집중력 향상',
          examples: '조깅, 수영, 자전거 등',
        },
        {
          title: '명상 및 호흡 훈련',
          description: '하루 10분 명상으로 마음의 안정 찾기',
          examples: '아침 명상, 복식 호흡, 요가',
        },
        {
          title: '숙면 관리',
          description: '규칙적인 수면 패턴으로 뇌 기능 회복',
          examples: '일정한 취침 시간, 수면 환경 개선, 블루라이트 차단',
        },
      ];
    }
    
    return solutions.slice(0, 3);
  };

  const solutions = parseSolutions(content);
  const emojis = ['🏃', '🧘', '😴', '📚', '🎯', '⏰'];

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 justify-center">
      {solutions.map((solution, idx) => (
        <div
          key={idx}
          className="flex-1 bg-[#F6FCFF] border border-[#A5E1FF] rounded-lg p-6 flex flex-col gap-2"
        >
          <p className="text-[44px]">{emojis[idx] || '💡'}</p>
          <p className="text-[16px] font-bold text-black">{solution.title}</p>
          <p className="text-xs text-[#737373] font-medium">{solution.description}</p>
          <p className="text-[10px] text-[#4a8aee] font-medium">{solution.examples}</p>
        </div>
      ))}
    </div>
  );
}

export default function Modal({ isOpen, setModalOpen, testResult }: ModalProps) {
  const [activeTab, setActiveTab] = useState<'overall' | 'analysis' | 'solution'>('overall');
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisType>('simple');
  const [aiSolution, setAiSolution] = useState<string>('');
  const [solutionLoading, setSolutionLoading] = useState(false);
  const [domainInterpretations, setDomainInterpretations] = useState<Record<AnalysisType, string>>({
    simple: '',
    sustained: '',
    interference: '',
    divided: '',
    working_memory: '',
  });
  const [interpretationLoading, setInterpretationLoading] = useState<Record<AnalysisType, boolean>>({
    simple: false,
    sustained: false,
    interference: false,
    divided: false,
    working_memory: false,
  });

  useEffect(() => {
    if (activeTab === 'solution' && !aiSolution && !solutionLoading) {
      generateSolution();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'analysis' && !domainInterpretations[activeAnalysis] && !interpretationLoading[activeAnalysis]) {
      generateDomainInterpretation(activeAnalysis);
    }
  }, [activeAnalysis, activeTab]);

  if (!isOpen) return null;

  const score = Math.round(testResult.p_final * 100);
  let message = '';
  let imageUrl = '';
  let riskLevel = '';
  let riskDescription = '';
  
  if (score >= 80) {
    message = '높은 경향';
    riskLevel = 'ADHD 위험도: 높음';
    riskDescription = 'ADHD와 관련된 특성이 높게 나타났습니다. 전문가와 상담을 고려해보세요.';
    imageUrl = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Anxious%20Face%20with%20Sweat.png';
  } else if (score >= 60) {
    message = '약간 높음';
    riskLevel = 'ADHD 위험도: 약간 높음';
    riskDescription = 'ADHD와 관련된 특성이 약간 높게 나타났습니다. 생활 습관 개선과 함께 전문가 상담을 고려해보세요.';
    imageUrl = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Raised%20Eyebrow.png';
  } else if (score >= 40) {
    message = '보통';
    riskLevel = 'ADHD 위험도: 보통';
    riskDescription = 'ADHD 증상이 보통 수준입니다. 현재 상태를 유지하며 건강한 생활 습관을 이어가세요.';
    imageUrl = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Slightly%20Smiling%20Face.png';
  } else if (score >= 20) {
    message = '낮음';
    riskLevel = 'ADHD 위험도: 낮음';
    riskDescription = 'ADHD 증상이 경미하거나 거의 나타나지 않습니다. 집중력이 양호한 상태입니다.';
    imageUrl = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face.png';
  } else {
    message = '매우 낮음';
    riskLevel = 'ADHD 위험도: 매우 낮음';
    riskDescription = 'ADHD 증상이 거의 나타나지 않습니다. 집중력이 매우 좋은 상태입니다.';
    imageUrl = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Beaming%20Face%20with%20Smiling%20Eyes.png';
  }

  const domainData = {
    simple: {
      title: '단순 주의력',
      subtitle: '기본적인 자극에 대한 주의력',
      icon: '🎯',
      score: testResult.cat_score?.simple || 0,
      evaluation: '단순한 시각 자극에 대한 반응 능력을 측정합니다.',
    },
    sustained: {
      title: '지속 주의력',
      subtitle: '장시간 집중을 유지하는 능력',
      icon: '⏱️',
      score: testResult.cat_score?.sustained || 0,
      evaluation: '오랜 시간 동안 주의를 유지하는 능력을 측정합니다.',
    },
    interference: {
      title: '간섭 통제',
      subtitle: '방해 요소를 무시하는 능력',
      icon: '🧠',
      score: testResult.cat_score?.interference || 0,
      evaluation: '불필요한 자극을 무시하고 집중하는 능력을 측정합니다.',
    },
    divided: {
      title: '분할 주의력',
      subtitle: '여러 작업을 동시에 처리하는 능력',
      icon: '🔀',
      score: testResult.cat_score?.divided || 0,
      evaluation: '여러 자극에 동시에 주의를 기울이는 능력을 측정합니다.',
    },
    working_memory: {
      title: '작업 기억력',
      subtitle: '정보를 단기적으로 유지하고 처리하는 능력',
      icon: '💭',
      score: testResult.cat_score?.working_memory || 0,
      evaluation: '정보를 일시적으로 저장하고 조작하는 능력을 측정합니다.',
    },
  };

  const generateSolution = async () => {
    setSolutionLoading(true);
    try {
      const prompt = `다음은 주의력 테스트 결과입니다:
- 전체 점수: ${score}점 (100점 만점)
- 단순 주의력: ${domainData.simple.score}점
- 지속 주의력: ${domainData.sustained.score}점
- 간섭 통제: ${domainData.interference.score}점
- 분할 주의력: ${domainData.divided.score}점
- 작업 기억력: ${domainData.working_memory.score}점

이 결과를 바탕으로 3가지 맞춤형 솔루션을 제안해주세요.
각 솔루션은 다음 형식으로 작성해주세요:

솔루션1:
제목: (짧은 제목, 예: 규칙적인 운동)
설명: (한 문장, 30자 이내)
예시: (쉼표로 구분된 3가지 예시)

솔루션2:
제목: (짧은 제목)
설명: (한 문장, 30자 이내)
예시: (쉼표로 구분된 3가지 예시)

솔루션3:
제목: (짧은 제목)
설명: (한 문장, 30자 이내)
예시: (쉼표로 구분된 3가지 예시)

가장 점수가 낮은 영역을 중심으로 실용적인 솔루션을 제안해주세요.`;

      const response = await axios.post('/api/chat', {
        message: prompt,
      });

      setAiSolution(response.data.reply);
    } catch (error) {
      console.error('솔루션 생성 실패:', error);
      setAiSolution('솔루션 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSolutionLoading(false);
    }
  };

  const generateDomainInterpretation = async (domain: AnalysisType) => {
    setInterpretationLoading(prev => ({ ...prev, [domain]: true }));
    try {
      const domainInfo = domainData[domain];
      const prompt = `다음은 주의력 테스트의 "${domainInfo.title}" 영역 결과입니다:
- 점수: ${domainInfo.score}점 (100점 만점, 점수가 높을수록 해당 영역의 능력이 우수함)
- 설명: ${domainInfo.evaluation}

이 점수에 대해 다음 내용을 간단하게 해석해주세요:
1. 현재 이 영역의 상태 평가
2. 일상생활에서 나타날 수 있는 주요 특징
3. 한 줄 조언

100-150자 정도로 간결하고 이해하기 쉽게 작성해주세요.`;

      const response = await axios.post('/api/chat', {
        message: prompt,
      });

      setDomainInterpretations(prev => ({
        ...prev,
        [domain]: response.data.reply
      }));
    } catch (error) {
      console.error('해석 생성 실패:', error);
      setDomainInterpretations(prev => ({
        ...prev,
        [domain]: '해석 생성에 실패했습니다. 잠시 후 다시 시도해주세요.'
      }));
    } finally {
      setInterpretationLoading(prev => ({ ...prev, [domain]: false }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[100] p-4">
      <div className="w-full max-w-[1000px] h-[625px] max-h-[800px] bg-white rounded-[20px] flex flex-col overflow-hidden">
        <div className="w-full flex flex-row justify-between px-[3%] pt-[3%] min-h-[80px]">
          <div className="h-full flex flex-col justify-between">
            <p className="text-xl md:text-2xl font-bold text-black">검사 결과 상세보기</p>
            <p className="text-xs font-medium text-[#737373]">
              검사 일자: {new Date(testResult.reported_at).toLocaleDateString('ko-KR')}
            </p>
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
            <p className={`text-sm md:text-base select-none ${activeTab === 'overall' ? 'font-bold text-[#4a8aee]' : 'font-medium text-[#737373]'}`}>종합 결과</p>
            {activeTab === 'overall' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4a8aee]" />}
          </div>
          <div className="h-full flex items-center cursor-pointer relative px-[5px]" onClick={() => setActiveTab('analysis')}>
            <p className={`text-sm md:text-base select-none ${activeTab === 'analysis' ? 'font-bold text-[#4a8aee]' : 'font-medium text-[#737373]'}`}>영역별 분석</p>
            {activeTab === 'analysis' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4a8aee]" />}
          </div>
          <div className="h-full flex items-center cursor-pointer relative px-[5px]" onClick={() => setActiveTab('solution')}>
            <p className={`text-sm md:text-base select-none ${activeTab === 'solution' ? 'font-bold text-[#4a8aee]' : 'font-medium text-[#737373]'}`}>AI 솔루션</p>
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
                  <p className="text-lg md:text-xl text-[#4a8aee] font-bold">{riskLevel}</p>
                  <p className="text-xs md:text-sm text-[#737373] font-medium leading-5">
                    {riskDescription}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="w-full h-full p-[3%] flex flex-col lg:flex-row gap-[3%]">
              <div className="w-full lg:w-60 bg-white border border-[#d2d2d2] rounded-lg flex flex-col p-[15px] gap-[10px] mb-4 lg:mb-0">
                <p className="text-xs text-black font-medium">영역 선택</p>
                {(Object.keys(domainData) as AnalysisType[]).map((key) => (
                  <div
                    key={key}
                    onClick={() => setActiveAnalysis(key)}
                    className={`w-full min-h-[45px] rounded-[5px] text-xs font-medium flex flex-row items-center px-[15px] gap-1.5 cursor-pointer select-none duration-200 ${
                      activeAnalysis === key ? 'bg-[#F6FCFF] border-[#4a8aee]' : 'bg-[#F9FAFB] text-[#737373] border-[#d2d2d2]'
                    } border`}
                  >
                    <span className="text-[16px]">{domainData[key].icon}</span>
                    {domainData[key].title}
                  </div>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto flex flex-col bg-white border border-[#d2d2d2] rounded-lg p-4 md:p-5">
                <p className="text-base md:text-lg text-black font-bold">{domainData[activeAnalysis].title}</p>
                <p className="text-xs text-[#737373] font-medium">{domainData[activeAnalysis].subtitle}</p>

                <div className="w-full flex flex-col gap-2 mt-2">
                  <p className="text-sm md:text-base font-bold text-[#4a8aee] ml-auto">{domainData[activeAnalysis].score}점</p>
                  <div className="w-full h-2 rounded-full bg-[#e5e7eb]">
                    <div className="h-full rounded-full bg-[#4a8aee]" style={{ width: `${domainData[activeAnalysis].score}%` }}></div>
                  </div>
                </div>

                <div className="w-full min-h-[60px] bg-[#F6FCFF] border border-[#A5E1FF] rounded-lg p-3 flex flex-col justify-between mt-5">
                  <p className="text-xs text-[#4a8aee] font-bold">평가 결과</p>
                  <p className="text-xs text-[#3c3c3c] font-medium">{domainData[activeAnalysis].evaluation}</p>
                </div>

                <div className="w-full bg-[#F9FAFB] border border-[#D2D2D2] rounded-lg mt-5 p-4 flex flex-col gap-2 min-h-[150px]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-black">AI 점수 해석</p>
                    {!interpretationLoading[activeAnalysis] && domainInterpretations[activeAnalysis] && (
                      <button
                        onClick={() => generateDomainInterpretation(activeAnalysis)}
                        className="text-[10px] text-[#4A8AEE] hover:text-[#4077CE] font-medium"
                      >
                        새로 생성
                      </button>
                    )}
                  </div>
                  
                  {interpretationLoading[activeAnalysis] ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-4">
                      <div className="w-8 h-8 border-3 border-[#4A8AEE] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-[10px] text-[#737373] mt-2">AI가 해석을 생성하고 있습니다...</p>
                    </div>
                  ) : domainInterpretations[activeAnalysis] ? (
                    <p className="text-xs text-[#474747] font-medium leading-relaxed whitespace-pre-wrap">
                      {domainInterpretations[activeAnalysis]}
                    </p>
                  ) : (
                    <p className="text-xs text-[#474747] font-medium">
                      {domainData[activeAnalysis].score >= 80 ? '🎉 이 영역은 매우 우수합니다! 집중력이 뛰어난 상태입니다.' :
                       domainData[activeAnalysis].score >= 60 ? '😊 이 영역은 양호한 수준입니다. 좋은 집중력을 보이고 있습니다.' :
                       domainData[activeAnalysis].score >= 40 ? '✅ 이 영역은 보통 수준입니다. 적절한 집중력을 유지하고 있습니다.' :
                       domainData[activeAnalysis].score >= 20 ? '📊 이 영역에서 약간의 개선이 필요합니다.' :
                       '⚠️ 이 영역에서 어려움이 관찰됩니다. 전문가 상담을 권장합니다.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'solution' && (
            <div className="w-full h-full p-5 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[16px] font-bold text-black">맞춤형 솔루션 제안</p>
                {!solutionLoading && aiSolution && (
                  <button
                    onClick={generateSolution}
                    className="px-3 py-1.5 text-[11px] text-[#4A8AEE] border border-[#4A8AEE] rounded hover:bg-[#F0F5FF] transition-colors"
                  >
                    새로 생성
                  </button>
                )}
              </div>

              {solutionLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-[#4A8AEE] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[14px] text-[#737373] mt-4">AI가 맞춤형 솔루션을 생성하고 있습니다...</p>
                </div>
              ) : aiSolution ? (
                <div className="flex-1 overflow-y-auto">
                  <SolutionCards content={aiSolution} />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-[14px] text-[#737373]">솔루션을 불러오는 중 오류가 발생했습니다.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-full min-h-[80px] bg-white border-t border-[#d2d2d2] flex flex-row items-center justify-center gap-3 md:gap-5 p-4">
          <Link href="/consultation" className="w-[100px] md:w-[110px] h-10 bg-[#4a8aee] flex justify-center items-center rounded-sm duration-200 hover:bg-[#4077CE]">
            <p className="text-xs text-white font-medium">챗봇 상담하기</p>
          </Link>

        </div>
      </div>
    </div>
  );
}
