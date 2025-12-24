'use client';

interface RadarChartProps {
  previousData?: {
    simple: number;
    sustained: number;
    interference: number;
    divided: number;
    working_memory: number;
  };
  currentData: {
    simple: number;
    sustained: number;
    interference: number;
    divided: number;
    working_memory: number;
  };
}

export default function RadarChart({ previousData, currentData }: RadarChartProps) {
  const labels = ['단순\n주의력', '지속\n주의력', '간섭\n통제', '분할\n주의력', '작업\n기억력'];
  const currentValues = [
    currentData.simple,
    currentData.sustained,
    currentData.interference,
    currentData.divided,
    currentData.working_memory,
  ];
  
  const previousValues = previousData ? [
    previousData.simple,
    previousData.sustained,
    previousData.interference,
    previousData.divided,
    previousData.working_memory,
  ] : null;

  // SVG 좌표 계산
  const centerX = 150;
  const centerY = 150;
  const maxRadius = 120;
  const levels = 5; // 5단계 (0, 20, 40, 60, 80, 100)

  // 각 축의 각도 계산 (5개 항목이므로 72도씩)
  const angleStep = (Math.PI * 2) / 5;

  // 점수를 반지름으로 변환
  const scoreToRadius = (score: number) => (score / 100) * maxRadius;

  // 좌표 계산 함수
  const getPoint = (value: number, index: number) => {
    const angle = angleStep * index - Math.PI / 2; // -90도부터 시작
    const radius = scoreToRadius(value);
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  // 현재 데이터 경로 생성
  const currentPath = currentValues
    .map((value, index) => {
      const point = getPoint(value, index);
      return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    })
    .join(' ') + ' Z';

  // 이전 데이터 경로 생성
  const previousPath = previousValues
    ? previousValues
        .map((value, index) => {
          const point = getPoint(value, index);
          return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
        })
        .join(' ') + ' Z'
    : null;

  return (
    <div className="w-full flex flex-col items-center">
      <svg width="300" height="300" viewBox="0 0 300 300">
        {/* 배경 레벨 원 */}
        {[...Array(levels)].map((_, i) => {
          const radius = (maxRadius / levels) * (i + 1);
          return (
            <circle
              key={i}
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          );
        })}

        {/* 축 선 */}
        {labels.map((_, index) => {
          const angle = angleStep * index - Math.PI / 2;
          const endX = centerX + maxRadius * Math.cos(angle);
          const endY = centerY + maxRadius * Math.sin(angle);
          return (
            <line
              key={index}
              x1={centerX}
              y1={centerY}
              x2={endX}
              y2={endY}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          );
        })}

        {/* 이전 데이터 (있는 경우) */}
        {previousPath && (
          <path
            d={previousPath}
            fill="rgba(156, 163, 175, 0.3)"
            stroke="#9CA3AF"
            strokeWidth="2"
          />
        )}

        {/* 현재 데이터 */}
        <path
          d={currentPath}
          fill="rgba(74, 138, 238, 0.3)"
          stroke="#4A8AEE"
          strokeWidth="2"
        />

        {/* 레이블 */}
        {labels.map((label, index) => {
          const angle = angleStep * index - Math.PI / 2;
          const labelRadius = maxRadius + 30;
          const x = centerX + labelRadius * Math.cos(angle);
          const y = centerY + labelRadius * Math.sin(angle);
          
          return (
            <text
              key={index}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[11px] font-medium fill-[#474747]"
            >
              {label.split('\n').map((line, i) => (
                <tspan key={i} x={x} dy={i === 0 ? 0 : 14}>
                  {line}
                </tspan>
              ))}
            </text>
          );
        })}
      </svg>

      {/* 범례 */}
      <div className="flex gap-4 mt-4">
        {previousData && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#9CA3AF] rounded-sm"></div>
            <p className="text-xs text-[#737373] font-medium">이전 검사</p>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#4A8AEE] rounded-sm"></div>
          <p className="text-xs text-[#737373] font-medium">최근 검사</p>
        </div>
      </div>
    </div>
  );
}

