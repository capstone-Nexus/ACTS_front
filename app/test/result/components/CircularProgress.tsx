interface CircularProgressProps {
  score: number;
}

export default function CircularProgress({ score }: CircularProgressProps) {
  // 점수에 따른 색상 결정 (높을수록 빨강, 낮을수록 초록)
  const getColor = (score: number) => {
    if (score >= 80) return '#FF3B3B';
    if (score >= 60) return '#FF8C42';
    if (score >= 40) return '#FFD93D';
    if (score >= 20) return '#A7D948';
    return '#6BCF7F';
  };

  const color = getColor(score);
  const circumference = 2 * Math.PI * 70; // 반지름 70
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-[160px] h-[160px]">
      <svg className="transform -rotate-90" width="160" height="160">
        {/* 배경 원 */}
        <circle
          cx="80"
          cy="80"
          r="70"
          stroke="#E5E7EB"
          strokeWidth="12"
          fill="none"
        />
        {/* 진행 원 */}
        <circle
          cx="80"
          cy="80"
          r="70"
          stroke={color}
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* 중앙 점수 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-[36px] font-bold" style={{ color }}>{score}</p>
      </div>
    </div>
  );
}

