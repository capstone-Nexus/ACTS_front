"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Test4() {
    const [testFinished, setTestFinished] = useState(false);
    const [currentScreen, setCurrentScreen] = useState<"intro" | "test">("intro");
    const [currentCount, setCurrentCount] = useState(0);
    const [progress, setProgress] = useState(0);
    const [showStimulus, setShowStimulus] = useState(false);
    
    // 자극 데이터 (이미지 모양과 소리)
    const shapes = ["circle", "square", "triangle"];
    const sounds = ["bell", "beep", "dong"];
    const [currentVisual, setCurrentVisual] = useState("");
    const [currentSound, setCurrentSound] = useState("");
    const [prevVisual, setPrevVisual] = useState("");
    const [prevSound, setPrevSound] = useState("");
    
    const totalTrials = 20;
    const [results, setResults] = useState<{correct: number, missed: number, falseAlarm: number}>({
        correct: 0,
        missed: 0,
        falseAlarm: 0
    });
    const [responded, setResponded] = useState(false);

    const handleStartTest = () => {
        setCurrentScreen("test");
        startTrial();
    };
    
    const generateStimulus = () => {
        const visual = shapes[Math.floor(Math.random() * shapes.length)];
        const sound = sounds[Math.floor(Math.random() * sounds.length)];
        return { visual, sound };
    };
    
    const startTrial = () => {
        if (currentCount >= totalTrials) {
            setTestFinished(true);
            return;
        }
        
        setResponded(false);
        const { visual, sound } = generateStimulus();
        
        setPrevVisual(currentVisual);
        setPrevSound(currentSound);
        setCurrentVisual(visual);
        setCurrentSound(sound);
        setShowStimulus(true);
        
        // 소리 재생 (간단한 beep 구현)
        playSound(sound);
        
        setTimeout(() => {
            // 자극 표시 후 반응 체크
            const isMatch = (visual === prevVisual || sound === prevSound) && currentCount > 0;
            
            if (isMatch && !responded) {
                setResults(prev => ({ ...prev, missed: prev.missed + 1 }));
            }
            
            setShowStimulus(false);
            setCurrentCount(prev => prev + 1);
            setProgress(Math.round(((currentCount + 1) / totalTrials) * 100));
            
            setTimeout(() => startTrial(), 500);
        }, 2000);
    };
    
    const playSound = (soundType: string) => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        const frequencies: {[key: string]: number} = {
            bell: 800,
            beep: 400,
            dong: 300
        };
        
        oscillator.frequency.value = frequencies[soundType];
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    };
    
    const handleResponse = () => {
        if (responded || currentCount === 0) return;
        
        setResponded(true);
        const isMatch = (currentVisual === prevVisual || currentSound === prevSound);
        
        if (isMatch) {
            setResults(prev => ({ ...prev, correct: prev.correct + 1 }));
        } else {
            setResults(prev => ({ ...prev, falseAlarm: prev.falseAlarm + 1 }));
        }
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === "Space" && currentScreen === "test" && showStimulus) {
                e.preventDefault();
                handleResponse();
            }
        };
        
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [currentScreen, showStimulus, responded, currentCount, currentVisual, currentSound, prevVisual, prevSound]);

    if (currentScreen === "intro") {
        return (
            <div className="w-full h-full flex flex-col items-center bg-gray-50 select-none">
                <div className="mt-[150px] mb-15 w-[900px] h-[753px] flex flex-col items-center bg-white border border-[#CDD0D4]">
                    <p className="text-[32px] font-bold mt-12">분할 주의력 검사</p>
                    <p className="mt-2 text-[18px] text-[#737373]">Divided Attention</p>
                    <div className="mt-10 w-[800px] h-[1px] bg-[#CDD0D4]" />
                    <div className="mt-13 w-[800px] h-[410px] bg-[#F9FAFB] border border-[#E4E7EB] p-10">
                        <p className="text-[18px] font-bold">🎯 검사 목적</p>
                        <p className="mt-2 text-[14px] font-medium text-[#474747]">
                            시각과 청각 등 여러 자극을 동시에 처리하는 능력을 측정합니다.
                        </p>
                        <p className="mt-6 text-[18px] font-bold">📋 검사 방법</p>
                        <ul className="mt-2 ml-7 text-[14px] font-medium text-[#474747] leading-7 list-disc">
                            <li>그림과 소리가 동시에 표시됩니다</li>
                            <li>앞서 제시된 소리나 그림이 <span className="text-[#4A8AEE] font-bold">반복되는 경우</span> 스페이스바를 클릭하세요</li>
                            <li>현재 자극과 바로 전 자극을 비교해야 합니다</li>
                        </ul>
                        <div className="w-[720px] h-[100px] bg-[#EBEDEF] mt-6 border-l-3 border-[#4A8AEE] p-4">
                            <p className="text-[14px] font-semibold ml-1 mt-2">💡 예시</p>
                            <p className="mt-2 ml-3">1번째: 종소리 - 2번째: 딩동 (클릭 안 함) - 3번째: 딩동 (클릭)</p>
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
            <div className="mt-[130px] mb-10 w-[900px] h-[751px] bg-white border border-[#CCCCCC] flex flex-col items-center">
                <div className="mt-8 text-[32px] font-bold">분할 주의력 검사</div>
                <div className="mt-1 text-[18px] text-[#737373]">진행 중...</div>
                <div className="mt-8 w-[800px] h-[1px] bg-[#CDD0D4]" />

                <div className="relative w-[800px] h-[330px] bg-[#F9FAFB] text-center flex flex-col justify-center items-center border border-[#CDD0D4] mt-12">
                    <div className="absolute top-4 right-4 w-[100px] h-[30px] bg-white text-[12px] font-medium flex justify-center items-center border border-[#CDD0D4] text-[#474747]">
                        진행률 : {currentCount}/{totalTrials}
                    </div>

                    <div className="w-[120px] h-[120px] border border-[#CDD0D4] flex items-center justify-center">
                        {showStimulus && currentVisual === "circle" && (
                            <div className="w-[70px] h-[70px] rounded-full bg-white border-3 border-black"></div>
                        )}
                        {showStimulus && currentVisual === "square" && (
                            <div className="w-[70px] h-[70px] bg-white border-3 border-black"></div>
                        )}
                        {showStimulus && currentVisual === "triangle" && (
                            <div className="w-0 h-0 border-l-[35px] border-l-transparent border-r-[35px] border-r-transparent border-b-[70px] border-b-black"></div>
                        )}
                        {!showStimulus && (
                            <div className="text-[#CCCCCC] text-[14px]">+</div>
                        )}
                    </div>
                    
                    {showStimulus && (
                        <div className="mt-4 text-[12px] text-[#737373]">
                            소리: {currentSound === "bell" ? "🔔 종소리" : currentSound === "beep" ? "📢 삑소리" : "🔊 딩동"}
                        </div>
                    )}
                </div>

                <div className="w-[800px] h-[50px] mt-7 text-center bg-[#F9FAFB] border border-[#CDD0D4]">
                    <p className="mt-3 text-[14px] font-medium text-[#474747]">
                        {showStimulus ? "이전 자극과 같으면 스페이스바를 누르세요" : "다음 자극 준비 중..."}
                    </p>
                </div>

                {testFinished && (
                    <>
                        <div className="mt-6 text-center">
                            <p className="text-[16px] font-bold text-[#474747]">검사 완료!</p>
                            <p className="mt-2 text-[14px] text-[#737373]">
                                정답: {results.correct} / 오답: {results.falseAlarm} / 놓침: {results.missed}
                            </p>
                        </div>
                        <Link href="/test/cat/test5" className="mt-6 w-[90px] h-[50px] flex justify-center items-center bg-[#4A8AEE] cursor-pointer border-2 border-transparent hover:border-[#4A8AEE] hover:bg-white duration-200 group">
                            <p className="text-[14px] font-medium text-white group-hover:text-[#4A8AEE] transition-colors duration-200">
                                다음 →
                            </p>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}