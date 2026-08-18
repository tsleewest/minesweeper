import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MousePointer, Flag, RotateCcw, Zap, Trophy } from 'lucide-react';
import { GameStats } from '../types';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm font-mono">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm bg-[#222] border-2 border-[#555] p-6 shadow-2xl relative text-[#e0e0e0]"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-[#888] hover:text-white bg-[#111] border border-[#444] transition-none cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-yellow-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Zap className="w-4 h-4 text-yellow-400" />
              게임 규칙 및 조작법
            </h3>

            <div className="space-y-2.5 text-xs text-[#ccc]">
              <div className="flex items-start gap-2.5 bg-black p-2.5 border border-[#333]">
                <MousePointer className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block uppercase mb-0.5">좌클릭 (Open)</strong>
                  <span>칸을 열어 숨겨진 지뢰나 숫자를 확인합니다. 첫 클릭은 항상 안전합니다.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-black p-2.5 border border-[#333]">
                <Flag className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block uppercase mb-0.5">우클릭 (Flag)</strong>
                  <span>지뢰로 의심되는 칸에 깃발을 꽂거나 해제합니다.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-black p-2.5 border border-[#333]">
                <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block uppercase mb-0.5">빠른 열기 (Chording)</strong>
                  <span>열린 숫자 주변에 깃발이 숫자만큼 꽂혀있으면 숫자를 클릭해 주변을 한 번에 엽니다.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-black p-2.5 border border-[#333]">
                <RotateCcw className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block uppercase mb-0.5">스마일 버튼</strong>
                  <span>상단의 스마일 얼굴을 클릭하면 즉시 새 미션을 시작합니다.</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-5 w-full py-2 bg-white text-black font-bold uppercase tracking-wider hover:bg-neutral-200 cursor-pointer text-xs"
            >
              확인 / 닫기
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface StatsModalProps {
  isOpen: boolean;
  stats: GameStats;
  onClose: () => void;
  onResetStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  stats,
  onClose,
  onResetStats,
}) => {
  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm font-mono">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm bg-[#222] border-2 border-[#555] p-6 shadow-2xl relative text-[#e0e0e0]"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-[#888] hover:text-white bg-[#111] border border-[#444] transition-none cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-yellow-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-yellow-400" />
              미션 통계 기록
            </h3>

            <div className="grid grid-cols-2 gap-2.5 mb-5 text-center">
              <div className="bg-black p-2.5 border border-[#333]">
                <span className="text-[11px] text-[#777] font-bold block mb-1 uppercase">플레이</span>
                <span className="text-xl font-bold text-white font-mono">{stats.gamesPlayed}</span>
              </div>
              <div className="bg-black p-2.5 border border-[#333]">
                <span className="text-[11px] text-[#777] font-bold block mb-1 uppercase">승리</span>
                <span className="text-xl font-bold text-white font-mono">{stats.gamesWon}</span>
              </div>
              <div className="bg-black p-2.5 border border-[#333]">
                <span className="text-[11px] text-[#777] font-bold block mb-1 uppercase">승률</span>
                <span className="text-xl font-bold text-emerald-400 font-mono">{winRate}%</span>
              </div>
              <div className="bg-black p-2.5 border border-[#333]">
                <span className="text-[11px] text-[#777] font-bold block mb-1 uppercase">최고 기록</span>
                <span className="text-xl font-bold text-yellow-400 font-mono">
                  {stats.bestTime !== null ? `${stats.bestTime}s` : '--'}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onResetStats}
                className="flex-1 py-2 text-xs font-bold text-red-400 hover:text-red-300 bg-black hover:bg-[#1a0000] border border-red-900 transition-none uppercase cursor-pointer"
              >
                초기화
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 bg-white text-black font-bold uppercase hover:bg-neutral-200 transition-none text-xs cursor-pointer"
              >
                닫기
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
