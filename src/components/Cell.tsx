import React from 'react';
import { Flag, Bomb } from 'lucide-react';
import { CellData, GameStatus } from '../types';

interface CellProps {
  cell: CellData;
  gameStatus: GameStatus;
  onReveal: (r: number, c: number) => void;
  onFlag: (r: number, c: number) => void;
  onChord: (r: number, c: number) => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
  isMobileFlagMode: boolean;
}

const NUMBER_COLORS: Record<number, string> = {
  1: 'text-blue-700 font-extrabold',
  2: 'text-emerald-700 font-extrabold',
  3: 'text-red-600 font-extrabold',
  4: 'text-indigo-950 font-extrabold',
  5: 'text-amber-950 font-extrabold',
  6: 'text-teal-700 font-extrabold',
  7: 'text-neutral-900 font-extrabold',
  8: 'text-neutral-600 font-extrabold',
};

export const Cell: React.FC<CellProps> = ({
  cell,
  gameStatus,
  onReveal,
  onFlag,
  onChord,
  onMouseDown,
  onMouseUp,
  isMobileFlagMode,
}) => {
  const { row, col, isMine, isRevealed, isFlagged, neighborMines, isExploded } = cell;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (gameStatus === 'won' || gameStatus === 'lost') return;

    if (isMobileFlagMode && !isRevealed) {
      onFlag(row, col);
      return;
    }

    if (isRevealed) {
      if (neighborMines > 0) {
        onChord(row, col);
      }
      return;
    }

    if (!isFlagged) {
      onReveal(row, col);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (gameStatus === 'won' || gameStatus === 'lost' || isRevealed) return;
    onFlag(row, col);
  };

  // Render content based on cell status
  let content = null;
  if (isRevealed) {
    if (isMine) {
      content = (
        <Bomb
          className={`w-5 h-5 sm:w-6 sm:h-6 ${isExploded ? 'text-black stroke-[2.5]' : 'text-neutral-950 stroke-[2]'}`}
        />
      );
    } else if (neighborMines > 0) {
      content = (
        <span className={`font-mono text-xl sm:text-2xl select-none leading-none ${NUMBER_COLORS[neighborMines] || 'text-black'}`}>
          {neighborMines}
        </span>
      );
    }
  } else if (isFlagged) {
    content = <Flag className="w-5 h-5 text-red-600 fill-red-600 stroke-[2]" />;
  }

  // Determine styling
  let bgClasses = '';
  if (isRevealed) {
    if (isExploded) {
      bgClasses = 'bg-[#ff4d4d] border border-red-700 cursor-default';
    } else if (isMine) {
      bgClasses = 'bg-[#bdbdbd] border border-[#777] cursor-default';
    } else {
      bgClasses = 'bg-[#bdbdbd] border border-[#777] cursor-default';
    }
  } else {
    // Unrevealed 3D button effect from High Density theme
    bgClasses = 'bg-[#bdbdbd] hover:bg-[#c6c6c6] border-[3px] border-t-[#eee] border-l-[#eee] border-r-[#777] border-b-[#777] active:border-t-[#777] active:border-l-[#777] active:border-r-[#eee] active:border-b-[#eee] cursor-pointer';
  }

  return (
    <button
      id={`cell-${row}-${col}`}
      type="button"
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onMouseDown={(e) => {
        if (e.button === 0 && !isRevealed && !isFlagged) {
          onMouseDown();
        }
      }}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      disabled={gameStatus === 'won' || gameStatus === 'lost'}
      className={`w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center rounded-none select-none transition-none ${bgClasses}`}
      aria-label={`Row ${row + 1}, Column ${col + 1} ${isRevealed ? (isMine ? 'Mine' : `${neighborMines} neighboring mines`) : (isFlagged ? 'Flagged' : 'Unrevealed')}`}
    >
      {content}
    </button>
  );
};
