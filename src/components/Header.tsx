import React from 'react';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { GameStatus } from '../types';
import { DigitalDisplay } from './DigitalDisplay';

interface HeaderProps {
  remainingMines: number;
  timer: number;
  gameStatus: GameStatus;
  isMouseDownOnBoard: boolean;
  isMuted: boolean;
  onReset: () => void;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  remainingMines,
  timer,
  gameStatus,
  isMouseDownOnBoard,
  isMuted,
  onReset,
  onToggleMute,
}) => {
  // Determine smiley face icon
  let faceEmoji = '🙂';
  let faceLabel = '정상';

  if (gameStatus === 'won') {
    faceEmoji = '😎';
    faceLabel = '승리!';
  } else if (gameStatus === 'lost') {
    faceEmoji = '😵';
    faceLabel = '패배!';
  } else if (isMouseDownOnBoard) {
    faceEmoji = '😮';
    faceLabel = '조심...';
  }

  return (
    <div className="w-full bg-[#bdbdbd] border-4 border-b-white border-r-white border-t-[#777] border-l-[#777] p-3 sm:p-4 flex items-center justify-between shadow-inner">
      {/* Remaining mines counter */}
      <div className="flex flex-col items-center">
        <span className="text-[11px] uppercase font-bold text-neutral-800 font-mono tracking-wider mb-0.5">
          지뢰
        </span>
        <DigitalDisplay value={remainingMines} id="mine-counter" />
      </div>

      {/* Center Face / Reset Button */}
      <div className="flex items-center gap-2">
        <button
          id="reset-face-button"
          type="button"
          onClick={onReset}
          className="w-13 h-13 sm:w-14 sm:h-14 bg-[#bdbdbd] border-4 border-t-white border-l-white border-r-[#777] border-b-[#777] active:border-t-[#777] active:border-l-[#777] active:border-r-white active:border-b-white flex items-center justify-center text-3xl select-none transition-none shadow-sm cursor-pointer"
          title={`새 게임 시작 (${faceLabel})`}
          aria-label="새 게임 시작"
        >
          {faceEmoji}
        </button>
      </div>

      {/* Timer display & Mute toggle */}
      <div className="flex flex-col items-center">
        <span className="text-[11px] uppercase font-bold text-neutral-800 font-mono tracking-wider mb-0.5">
          시간
        </span>
        <div className="flex items-center gap-2">
          <DigitalDisplay value={timer} id="timer-display" />
          <button
            id="sound-toggle-btn"
            type="button"
            onClick={onToggleMute}
            className="p-1.5 bg-[#bdbdbd] hover:bg-[#cacaca] active:bg-[#a8a8a8] border-2 border-t-white border-l-white border-r-[#777] border-b-[#777] text-neutral-900 transition-none cursor-pointer"
            title={isMuted ? '소리 켜기' : '소리 끄기'}
            aria-label={isMuted ? '소리 켜기' : '소리 끄기'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-neutral-900" />}
          </button>
        </div>
      </div>
    </div>
  );
};
