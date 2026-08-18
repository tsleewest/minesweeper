import React from 'react';
import { Eye, Flag, HelpCircle, Trophy } from 'lucide-react';
import { GameStats } from '../types';

interface ControlsBarProps {
  isMobileFlagMode: boolean;
  onToggleMobileFlagMode: () => void;
  stats: GameStats;
  onOpenHelp: () => void;
  onOpenStats: () => void;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  isMobileFlagMode,
  onToggleMobileFlagMode,
  stats,
  onOpenHelp,
  onOpenStats,
}) => {
  return (
    <div className="w-full flex flex-col gap-3 mt-3 font-mono">
      {/* Mobile Mode Switcher */}
      <div className="flex items-center justify-center gap-2 bg-[#181818] p-1.5 border border-[#444] shadow-inner sm:hidden">
        <button
          type="button"
          onClick={() => isMobileFlagMode && onToggleMobileFlagMode()}
          className={`flex-1 py-1.5 px-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-none ${
            !isMobileFlagMode
              ? 'bg-[#bdbdbd] text-black border-2 border-t-white border-l-white border-r-[#777] border-b-[#777]'
              : 'text-[#888] hover:text-[#bbb]'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-blue-700" />
          열기 모드
        </button>
        <button
          type="button"
          onClick={() => !isMobileFlagMode && onToggleMobileFlagMode()}
          className={`flex-1 py-1.5 px-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-none ${
            isMobileFlagMode
              ? 'bg-[#bdbdbd] text-black border-2 border-t-white border-l-white border-r-[#777] border-b-[#777]'
              : 'text-[#888] hover:text-[#bbb]'
          }`}
        >
          <Flag className="w-3.5 h-3.5 text-red-600" />
          깃발 모드
        </button>
      </div>

      {/* Info & Secondary Buttons */}
      <div className="flex items-center justify-between text-xs text-[#aaa] px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[#777] uppercase tracking-wider text-[11px]">최고 기록:</span>
          <span className="font-mono font-bold text-yellow-400">
            {stats.bestTime !== null ? `${stats.bestTime}초` : '--'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenStats}
            className="flex items-center gap-1 text-[#e0e0e0] hover:text-white bg-[#2a2a2a] hover:bg-[#383838] active:bg-[#1a1a1a] px-2.5 py-1 border border-[#555] transition-none text-[11px] font-bold uppercase tracking-wider cursor-pointer"
          >
            <Trophy className="w-3 h-3 text-yellow-400" />
            기록
          </button>
          <button
            type="button"
            onClick={onOpenHelp}
            className="flex items-center gap-1 text-[#e0e0e0] hover:text-white bg-[#2a2a2a] hover:bg-[#383838] active:bg-[#1a1a1a] px-2.5 py-1 border border-[#555] transition-none text-[11px] font-bold uppercase tracking-wider cursor-pointer"
          >
            <HelpCircle className="w-3 h-3 text-blue-400" />
            도움말
          </button>
        </div>
      </div>
    </div>
  );
};
