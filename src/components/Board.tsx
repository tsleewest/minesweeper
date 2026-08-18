import React from 'react';
import { Board as BoardType, GameStatus } from '../types';
import { Cell } from './Cell';

interface BoardProps {
  board: BoardType;
  gameStatus: GameStatus;
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
  onChord: (row: number, col: number) => void;
  onCellMouseDown: () => void;
  onCellMouseUp: () => void;
  isMobileFlagMode: boolean;
}

export const Board: React.FC<BoardProps> = ({
  board,
  gameStatus,
  onReveal,
  onFlag,
  onChord,
  onCellMouseDown,
  onCellMouseUp,
  isMobileFlagMode,
}) => {
  return (
    <div
      id="minesweeper-grid"
      className="bg-[#777] border-4 border-b-white border-r-white border-t-[#777] border-l-[#777] p-1 flex flex-col gap-0 items-center justify-center select-none shadow-inner"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="grid grid-cols-9 gap-0 bg-[#777]">
        {board.map((row) =>
          row.map((cell) => (
            <Cell
              key={`cell-${cell.row}-${cell.col}`}
              cell={cell}
              gameStatus={gameStatus}
              onReveal={onReveal}
              onFlag={onFlag}
              onChord={onChord}
              onMouseDown={onCellMouseDown}
              onMouseUp={onCellMouseUp}
              isMobileFlagMode={isMobileFlagMode}
            />
          ))
        )}
      </div>
    </div>
  );
};
