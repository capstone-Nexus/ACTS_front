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

  const centerX = 170;
  const centerY = 170;
  const maxRadius = 120;
  const levels = 5;

  const angleStep = (Math.PI * 2) / 5;

  const scoreToRadius = (score: number) => (score / 100) * maxRadius;

  const getPoint = (value: number, index: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const radius = scoreToRadius(value);
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  const currentPath = currentValues
    .map((value, index) => {
      const point = getPoint(value, index);
      return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    })
    .join(' ') + ' Z';

  const previousPath = previousValues
    ? previousValues
        .map((value, index) => {
          const point = getPoint(value, index);
          return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
        })
        .join(' ') + ' Z'
    : null;

  return (
    <div className="w-full flex flex-col items-center py-4">
      <svg width="340" height="340" viewBox="0 0 340 340" className="overflow-visible">
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
        {previousPath && (
          <path
            d={previousPath}
            fill="rgba(156, 163, 175, 0.3)"
            stroke="#9CA3AF"
            strokeWidth="2"
          />
        )}

        <path
          d={currentPath}
          fill="rgba(74, 138, 238, 0.3)"
          stroke="#4A8AEE"
          strokeWidth="2"
        />

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

