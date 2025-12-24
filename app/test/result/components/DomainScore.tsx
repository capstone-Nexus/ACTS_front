interface DomainScoreProps {
  name: string;
  icon: string;
  score: number;
}

export default function DomainScore({ name, icon, score }: DomainScoreProps) {
  return (
    <div className="w-full bg-white border border-[#E5E7EB] rounded-[15px] p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-[24px]">{icon}</div>
          <p className="text-[16px] font-medium text-black">{name}</p>
        </div>
        <p className="text-[12px] font-medium text-[#737373]">{score}점</p>
      </div>
      <div className="w-full h-[10px] bg-[#E5E7EB] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 bg-[#4A8AEE]"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

