'use client';

import { useState, useEffect, useRef } from "react";

export default function Test1() {
    const TOTAL_TRIALS = 20;
    const STIMULUS_TIME = 500;
    const INTER_TRIAL_MIN = 2000;
    const INTER_TRIAL_MAX = 5000;
    
    const [currentScreen, setCurrentScreen] = useState<"intro" | "test">("intro");
    const [progress, setProgress] = useState(0);
    const [currentStimulus, setCurrentStimulus] = useState<"blue-circle" | "sound" | null>(null);
    const [isWaiting, setIsWaiting] = useState(false);
    const [isTestComplete, setIsTestComplete] = useState(false);
    const [results, setResults] = useState<{ type: string; reactionTime: number | null; correct: boolean }[]>([]);
    
    const stimulusStartTime = useRef<number>(0);
    const trialTimeout = useRef<NodeJS.Timeout | null>(null);
    const stimulusTimeout = useRef<NodeJS.Timeout | null>(null);
    const hasResponded = useRef(false);
    const currentTrialType = useRef<"blue-circle" | "sound" | null>(null);
    
    const audioRef = useRef<HTMLAudioElement | null>(null);
    
    useEffect(() => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.3;
        
        return () => {
            audioContext.close();
        };
    }, []);

    const playBeep = () => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    };

    const handleStartTest = () => {
        setCurrentScreen("test");
        setProgress(0);
        setResults([]);
        setIsTestComplete(false);
        setIsWaiting(true);
        
        setTimeout(() => {
            runTrial(0);
        }, 1000);
    };

    const runTrial = (trialIndex: number) => {
        if (trialIndex >= TOTAL_TRIALS) {
            setIsTestComplete(true);
            return;
        }

        hasResponded.current = false;
        setIsWaiting(true);
        
        const waitTime = Math.random() * (INTER_TRIAL_MAX - INTER_TRIAL_MIN) + INTER_TRIAL_MIN;
        
        trialTimeout.current = setTimeout(() => {
            const stimType = Math.random() < 0.5 ? "blue-circle" : "sound";
            currentTrialType.current = stimType;
            
            setCurrentStimulus(stimType);
            setIsWaiting(false);
            stimulusStartTime.current = performance.now();
            
            if (stimType === "sound") {
                playBeep();
            }
            
            stimulusTimeout.current = setTimeout(() => {
                setCurrentStimulus(null);
                
                // 반응이 없었다면 기록
                if (!hasResponded.current) {
                    setResults(prev => [...prev, {
                        type: stimType,
                        reactionTime: null,
                        correct: false
                    }]);
                    
                    setProgress(trialIndex + 1);
                    runTrial(trialIndex + 1);
                }
            }, STIMULUS_TIME);
        }, waitTime);
    };

    const handleResponse = () => {
        if (hasResponded.current || isWaiting) return;
        
        hasResponded.current = true;
        
        if (trialTimeout.current) clearTimeout(trialTimeout.current);
        if (stimulusTimeout.current) clearTimeout(stimulusTimeout.current);
        
        const reactionTime = performance.now() - stimulusStartTime.current;
        const stimType = currentTrialType.current;
        
        setResults(prev => [...prev, {
            type: stimType || 'none',
            reactionTime: reactionTime,
            correct: true
        }]);
        
        setCurrentStimulus(null);
        setProgress(progress + 1);
        
        setTimeout(() => {
            runTrial(progress + 1);
        }, 500);
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === 'Space' && currentScreen === 'test') {
                e.preventDefault();
                handleResponse();
            }
        };
        
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentScreen, isWaiting, progress]);

    if (currentScreen === "intro") {
        return (
            <div className="w-full h-full flex flex-col items-center bg-gray-50">
                <div className="mt-[150px] w-[900px] h-[753px] mb-15 flex flex-col items-center bg-white border border-[#CDD0D4]">
                    <p className="text-[32px] font-bold mt-12">단순 선택 주의력 검사</p>
                    <p className="mt-2 text-[18px] text-[#737373]">Simple Selective Attention</p>
                    <div className="mt-10 w-[800px] h-[1px] bg-[#CDD0D4]" />
                    <div className="mt-13 w-[800px] h-[410px] bg-[#F9FAFB] border border-[#E4E7EB] p-10">
                        <p className="text-[18px] font-bold">🎯 검사 목적</p>
                        <p className="mt-2 text-[14px] font-medium text-[#474747]">
                            시각 및 청각 자극에 대한 기본적인 반응 속도와 정확도를 평가합니다.
                        </p>
                        <p className="mt-6 text-[18px] font-bold">📋 검사 방법</p>
                        <ul className="mt-2 ml-7 text-[14px] font-medium text-[#474747] leading-7 list-disc">
                            <li>
                                화면에 <span className="text-[#4A8AEE] font-bold">파란색 원</span>이 나타나면 즉시 스페이스바를 누르세요
                            </li>
                            <li>
                                또는 <span className="text-[#4A8AEE] font-bold">소리</span>가 들리면 즉시 스페이스바를 누르세요
                            </li>
                            <li>가능한 한 빠르고 정확하게 반응하세요</li>
                            <li>자극이 나타나기 전에 미리 누르지 마세요</li>
                        </ul>
                        <div className="w-[720px] h-[100px] bg-[#EBEDEF] mt-6 border-l-4 border-[#4A8AEE] p-4">
                            <p className="text-[14px] font-semibold ml-1 mt-2">💡 주의사항</p>
                            <p className="mt-2 ml-3 text-[14px]">
                                자극이 나타날 때만 반응하세요. 각 자극은 짧게 나타나므로 집중해야 합니다.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleStartTest}
                        className="mt-12 px-[21px] py-[14px] bg-[#4A8AEE] text-white text-[14px] font-medium hover:bg-[#3A7ADE] transition-colors"
                    >
                        테스트 시작 →
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-[#F9FAFB]">
            <div className="mt-[130px] mb-10 w-[900px] h-[751px] bg-[#ffffff] border border-[#CCCCCC] flex flex-col items-center">
                <div className="mt-8 text-[32px] font-bold">단순 선택 주의력 검사</div>
                <div className="mt-1 text-[18px] text-[#737373]">
                    {isWaiting ? "준비..." : "반응하세요!"}
                </div>
                <div className="mt-8 w-[800px] h-[1px] bg-[#CDD0D4]" />

                <div
                    className="relative w-[800px] h-[330px] bg-[#F9FAFB] flex justify-center items-center border border-[#CDD0D4] mt-12 cursor-pointer"
                    onClick={handleResponse}
                >
                    <div className="absolute top-4 right-4 w-[100px] h-[30px] bg-white text-[12px] font-medium flex justify-center items-center border border-[#CDD0D4] text-[#474747]">
                        진행률 : {progress}/{TOTAL_TRIALS}
                    </div>

                    {currentStimulus === "blue-circle" && (
                        <div className="w-[120px] h-[120px] rounded-full bg-[#4A8AEE] animate-pulse"></div>
                    )}
                    {isWaiting && (
                        <div className="text-[24px] text-[#CCCCCC]">+</div>
                    )}
                </div>

                <div className="mt-8 text-[14px] text-[#737373]">
                    스페이스바를 누르거나 화면을 클릭하세요
                </div>

                {isTestComplete && (
                    <a
                        href="/cat/test2"
                        className="mt-10 w-[90px] h-[50px] flex justify-center items-center bg-[#4A8AEE] cursor-pointer border-2 border-transparent hover:border-[#4A8AEE] hover:bg-white duration-200 group"
                    >
                        <p className="text-[14px] font-medium text-white group-hover:text-[#4A8AEE] transition-colors duration-200">
                            다음 →
                        </p>
                    </a>
                )}
            </div>
        </div>
    );
}