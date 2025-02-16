import type React from 'react';

interface StagesListProps {
  stages: string[];
}

export const StagesList: React.FC<StagesListProps> = ({ stages }) => {
  return (
    <div className="relative">
      {/* Вертикальная линия */}
      <div className="absolute left-[0.3rem] top-0 bottom-0 w-0.5 bg-gray-200"></div>

      <ul className="space-y-6">
        {stages.map((stage, index) => (
          <li key={index} className="flex items-center">
            {/* Кружок */}
            <div className="relative z-10 flex items-center justify-center w-3 h-3 bg-white border-[1px] border-black rounded-full">
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
            {/* Текст этапа */}
            <span className="ml-4 text-sm font-medium">{stage}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
