export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export interface CellData {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
  isExploded?: boolean;
}

export type Board = CellData[][];

export interface Difficulty {
  name: string;
  rows: number;
  cols: number;
  mines: number;
}

export interface GameStats {
  bestTime: number | null;
  gamesPlayed: number;
  gamesWon: number;
}
