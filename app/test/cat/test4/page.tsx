"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function Test4() {
    const [testFinished, setTestFinished] = useState(false);
    const [currentScreen, setCurrentScreen] = useState<"intro" | "test">("intro");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showStimulus, setShowStimulus] = useState(false);

    const shapes = ["circle", "square", "triangle"];
    const sounds = ["bell", "beep", "dong"];

    const TOTAL_TRIALS = 20;

    type Trial = { visual: string; sound: string; isTarget: boolean };
    const [sequence, setSequence] = useState<Trial[]>([]);

    const [results, setResults] = useState<{correct: number; missed: number; falseAlarm: number; correctRts: number[]; falseAlarmRts: number[]}>({
        correct: 0,
        missed: 0,
        falseAlarm: 0,
        correctRts: [],
        falseAlarmRts: []
    });

    const respondedRef = useRef(false);
    const startTimeRef = useRef(0);
    const timersRef = useRef<number[]>([]);

    const buildSequence = (n: number, targetProb = 0.25) => {
        const seq: Trial[] = [];
        for (let i = 0; i < n; i++) {
            const visual = shapes[Math.floor(Math.random() * shapes.length)];
            const sound = sounds[Math.floor(Math.random() * sounds.length)];
            seq.push({ visual, sound, isTarget: false });
        }

        for (let i = 1; i < n; i++) {
            if (Math.random() < targetProb) {
                if (Math.random() < 0.5) seq[i].visual = seq[i - 1].visual;
                else seq[i].sound = seq[i - 1].sound;
                seq[i].isTarget = true;
            } else {
                seq[i].isTarget = (seq[i].visual === seq[i - 1].visual) || (seq[i].sound === seq[i - 1].sound);
            }
        }

        seq[0].isTarget = false;
        return seq;
    };

    useEffect(() => {
        setSequence(buildSequence(TOTAL_TRIALS, 0.25));
    }, []);

    const clearAllTimers = () => {
        timersRef.current.forEach(id => clearTimeout(id));
        timersRef.current = [];
    };

    const startTest = () => {
        setCurrentScreen("test");
        setCurrentIndex(0);
        setResults({ correct: 0, missed: 0, falseAlarm: 0, correctRts: [], falseAlarmRts: [] });
        setTestFinished(false);
        clearAllTimers();
        const t = window.setTimeout(() => runTrial(0), 300);
        timersRef.current.push(t);
    };

    const playSound = (soundType: string) => {
        try {
            const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
            const audioContext = new AudioContext();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            const frequencies: {[key: string]: number} = { bell: 800, beep: 400, dong: 300 };
            oscillator.frequency.value = frequencies[soundType] || 400;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.25);
        } catch (err) {
            console.error('Audio error:', err);
        }
    };

    const runTrial = (index: number) => {
        if (index >= sequence.length) {
            setTestFinished(true);
            return;
        }

        respondedRef.current = false;

        const trial = sequence[index];
        setShowStimulus(true);
        startTimeRef.current = performance.now();

        playSound(trial.sound);

        const stimDur = 1500;
        const isi = 500;

        const endId = window.setTimeout(() => {
            if (trial.isTarget && !respondedRef.current) {
                setResults(prev => ({ ...prev, missed: prev.missed + 1 }));
            }

            setShowStimulus(false);
            setCurrentIndex(prev => prev + 1);

            const nextId = window.setTimeout(() => runTrial(index + 1), isi);
            timersRef.current.push(nextId);
        }, stimDur);

        timersRef.current.push(endId);
    };

    const handleResponse = () => {
        if (!showStimulus) return;
        if (respondedRef.current) return;

        respondedRef.current = true;
        const index = currentIndex;
        const trial = sequence[index];
        const rt = performance.now() - startTimeRef.current;

        if (!trial) return;

        if (trial.isTarget) {
            setResults(prev => ({ ...prev, correct: prev.correct + 1, correctRts: [...prev.correctRts, rt] }));
        } else {
            setResults(prev => ({ ...prev, falseAlarm: prev.falseAlarm + 1, falseAlarmRts: [...prev.falseAlarmRts, rt] }));
        }
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === "Space" && currentScreen === "test") {
                e.preventDefault();
                handleResponse();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [currentScreen, showStimulus, currentIndex, sequence]);

    useEffect(() => {
        return () => clearAllTimers();
    }, []);

    const currentTrial = sequence[currentIndex] || null;
    const progress = Math.min(currentIndex + (showStimulus ? 1 : 0), TOTAL_TRIALS);
    const correctCount = results.correct;

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
                        onClick={startTest}
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
                    <div className="absolute top-4 right-[130px] w-[100px] h-[30px] bg-white text-[12px] font-medium flex justify-center items-center border border-[#CDD0D4] text-[#474747]">
                        맞춘개수 : {correctCount}/{progress}
                    </div>

                    <div className="absolute top-4 right-4 w-[100px] h-[30px] bg-white text-[12px] font-medium flex justify-center items-center border border-[#CDD0D4] text-[#474747]">
                        진행률 : {progress}/{TOTAL_TRIALS}
                    </div>

                    <div className="w-[120px] h-[120px] border border-[#CDD0D4] flex items-center justify-center">
                        {showStimulus && currentTrial?.visual === "circle" && (
                            <div className="w-[70px] h-[70px] rounded-full bg-white border-3 border-black"></div>
                        )}
                        {showStimulus && currentTrial?.visual === "square" && (
                            <div className="w-[70px] h-[70px] bg-white border-3 border-black"></div>
                        )}
                        {showStimulus && currentTrial?.visual === "triangle" && (
                            <div className="w-0 h-0 border-l-[35px] border-l-transparent border-r-[35px] border-r-transparent border-b-[70px] border-b-black"></div>
                        )}
                        {!showStimulus && (
                            <div className="text-[#CCCCCC] text-[14px]">+</div>
                        )}
                    </div>
                    
                </div>

                <div className="w-[800px] h-[50px] mt-7 text-center bg-[#F9FAFB] border border-[#CDD0D4]">
                    <p className="mt-3 text-[14px] font-medium text-[#474747]">
                        {showStimulus ? "이전 자극과 같으면 스페이스바를 누르세요" : "다음 자극 준비 중..."}
                    </p>
                </div>

                {testFinished && (
                    <>
                        {/* <div className="mt-6 text-center">
                            <p className="text-[16px] font-bold text-[#474747]">검사 완료!</p>
                            <div className="mt-4 text-[14px] text-[#737373] space-y-1">
                                <p>정답: {results.correct} / 오답: {results.falseAlarm} / 놓침: {results.missed}</p>
                                <p className="font-bold text-[#4A8AEE]">정확도: {Math.round((results.correct / TOTAL_TRIALS) * 100)}%</p>
                                {results.correctRts.length > 0 && (
                                    <>
                                        <p>
                                            정답 반응시간: {Math.round(results.correctRts.reduce((a,b)=>a+b,0)/results.correctRts.length)} ms
                                            {results.correctRts.length > 1 && (
                                                <span className="ml-2">
                                                    (±{Math.round(
                                                        Math.sqrt(
                                                            results.correctRts.reduce((sq, n) => {
                                                                const mean = results.correctRts.reduce((a,b)=>a+b,0)/results.correctRts.length;
                                                                return sq + Math.pow(n - mean, 2);
                                                            }, 0) / results.correctRts.length
                                                        )
                                                    )} ms)
                                                </span>
                                            )}
                                        </p>
                                    </>
                                )}
                                {results.falseAlarmRts.length > 0 && (
                                    <p>오답 반응시간: {Math.round(results.falseAlarmRts.reduce((a,b)=>a+b,0)/results.falseAlarmRts.length)} ms</p>
                                )}
                            </div>
                        </div> */}
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