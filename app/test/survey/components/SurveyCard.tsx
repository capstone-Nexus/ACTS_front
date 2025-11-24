'use client';

import { useState } from 'react';

type SurveyCardProps = {
  title: string;
  selected?: number;
  onSelect: (value: number) => void;
};

export default function SurveyCard({ title, selected, onSelect }: SurveyCardProps) {
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleSelect = (num: number) => {
    if (!hasAnswered) setHasAnswered(true);
    onSelect(num);
  };

  return (
    <div className="w-full h-[200px] border-b border-[#CDD0D4] flex flex-col items-center justify-center p-[20px]">
      <p className="self-start text-[18px] font-semibold text-[#3C3C3C]">{title}</p>
      <div className="w-full h-[70px] flex flex-col items-center justify-between mt-[25px]">
        <div className="w-full h-[15px] flex justify-between">
          <p className="text-[12px] text-[#737373] font-medium ml-2">전혀 그렇지 않다</p>
          <p className="text-[12px] text-[#737373] font-medium mr-4">매우 그렇다</p>
        </div>
        <div className="w-full h-[45px] flex flex-row items-center justify-center gap-[100px] select-none">
          {[1, 2, 3, 4, 5, 6].map(num => (
            <div
              key={num}
              onClick={() => handleSelect(num)}
              className={`w-[45px] h-[45px] rounded-[60px] border-2 flex items-center justify-center cursor-pointer hover:scale-105 transition duration-300
              ${selected === num ? 'border-none bg-[#4A8AEE]' : 'border-[#D2D2D2] bg-white'}`}
            >
              <p className={`text-[18px] font-bold ${selected === num ? 'text-white' : 'text-[#3C3C3C]'}`}>{num}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
