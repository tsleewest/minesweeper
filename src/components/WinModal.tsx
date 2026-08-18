import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Clock, Sparkles, RotateCcw, Award } from 'lucide-react';
import { GameStats } from '../types';

interface WinModalProps {
  isOpen: boolean;
  clearTime: number;
  isNewRecord: boolean;
  stats: GameStats;
  onPlayAgain: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({
  isOpen,
  clearTime,
  isNewRecord,
  stats,
  onPlayAgain,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm font-mono">
          <motion.div
            id="win-celebration-dialog"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-md bg-[#222] border-2 border-[#555] p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] text-center relative"
          >
            {/* Victory Icon Badge */}
            <div className="mx-auto w-16 h-16 bg-black border-2 border-yellow-500 text-yellow-400 flex items-center justify-center mb-4 shadow-inner">
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-yellow-400 tracking-wider mb-1 uppercase">
              CONGRATULATIONS!
            </h2>
            <p className="text-sm sm:text-base text-[#bbb] mb-6 font-mono tracking-wide">
              Area Secured. No Casualties.
            </p>

            {/* Time & Record Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-black border border-[#444] p-3 flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-[#888] text-[11px] font-bold uppercase mb-1">
                  <Clock className="w-3 h-3 text-[#aaa]" />
                  클리어 시간
                </div>
                <span className="text-2xl font-black text-red-500 font-mono tracking-widest" style={{ textShadow: '0 0 6px rgba(239, 68, 68, 0.6)' }}>
                  {clearTime}s
                </span>
                {isNewRecord && (
                  <span className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500">
                    <Sparkles className="w-2.5 h-2.5" /> 신기록!
                  </span>
                )}
              </div>

              <div className="bg-black border border-[#444] p-3 flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-[#888] text-[11px] font-bold uppercase mb-1">
                  <Award className="w-3 h-3 text-[#aaa]" />
                  최고 기록
                </div>
                <span className="text-2xl font-black text-yellow-400 font-mono tracking-widest">
                  {stats.bestTime !== null ? `${stats.bestTime}s` : `${clearTime}s`}
                </span>
                <span className="mt-1 text-[10px] text-[#777] font-mono">
                  승률 {stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 100}% ({stats.gamesWon}/{stats.gamesPlayed})
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button
              id="play-again-btn"
              type="button"
              onClick={onPlayAgain}
              className="w-full py-3 px-6 bg-white hover:bg-neutral-200 active:bg-neutral-300 text-black font-bold uppercase tracking-widest transition-none shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer border-2 border-white"
            >
              <RotateCcw className="w-4 h-4 text-black" />
              NEW MISSION
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
