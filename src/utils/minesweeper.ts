import { Board, CellData } from '../types';

export const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export function createEmptyBoard(rows: number = 9, cols: number = 9): Board {
  const board: Board = [];
  for (let r = 0; r < rows; r++) {
    const row: CellData[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
        isExploded: false,
      });
    }
    board.push(row);
  }
  return board;
}

export function populateMines(
  board: Board,
  rows: number,
  cols: number,
  totalMines: number,
  firstClickRow: number,
  firstClickCol: number
): Board {
  // Deep clone board
  const newBoard: Board = board.map(row => row.map(cell => ({ ...cell })));

  // Identify safe positions (first clicked cell and its 8 neighbors if space permits)
  const safePositions = new Set<string>();
  safePositions.add(`${firstClickRow},${firstClickCol}`);
  
  // Try to keep the immediate 3x3 surrounding zone clear for a good opening if board is large enough
  if (rows * cols - 9 >= totalMines) {
    for (const [dr, dc] of DIRECTIONS) {
      const nr = firstClickRow + dr;
      const nc = firstClickCol + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        safePositions.add(`${nr},${nc}`);
      }
    }
  }

  // Generate candidate cells
  const candidates: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!safePositions.has(`${r},${c}`)) {
        candidates.push([r, c]);
      }
    }
  }

  // Shuffle candidates (Fisher-Yates)
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  // Place mines
  const minesToPlace = Math.min(totalMines, candidates.length);
  for (let i = 0; i < minesToPlace; i++) {
    const [r, c] = candidates[i];
    newBoard[r][c].isMine = true;
  }

  // Calculate neighbor mine counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newBoard[r][c].isMine) continue;

      let count = 0;
      for (const [dr, dc] of DIRECTIONS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          if (newBoard[nr][nc].isMine) {
            count++;
          }
        }
      }
      newBoard[r][c].neighborMines = count;
    }
  }

  return newBoard;
}

export function revealCell(
  board: Board,
  startRow: number,
  startCol: number
): { newBoard: Board; hitMine: boolean; revealedCount: number } {
  const newBoard: Board = board.map(row => row.map(cell => ({ ...cell })));
  const rows = newBoard.length;
  const cols = newBoard[0].length;
  const target = newBoard[startRow][startCol];

  if (target.isRevealed || target.isFlagged) {
    return { newBoard, hitMine: false, revealedCount: 0 };
  }

  if (target.isMine) {
    target.isRevealed = true;
    target.isExploded = true;
    return { newBoard, hitMine: true, revealedCount: 1 };
  }

  // Flood fill algorithm for revealing empty areas (BFS)
  let revealedCount = 0;
  const queue: [number, number][] = [[startRow, startCol]];
  target.isRevealed = true;
  revealedCount++;

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const current = newBoard[r][c];

    // If current cell has 0 neighbor mines, reveal all unrevealed unflagged neighbors
    if (current.neighborMines === 0) {
      for (const [dr, dc] of DIRECTIONS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          const neighbor = newBoard[nr][nc];
          if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isMine) {
            neighbor.isRevealed = true;
            revealedCount++;
            if (neighbor.neighborMines === 0) {
              queue.push([nr, nc]);
            }
          }
        }
      }
    }
  }

  return { newBoard, hitMine: false, revealedCount };
}

export function chordCell(
  board: Board,
  row: number,
  col: number
): { newBoard: Board; hitMine: boolean; revealedCount: number } {
  const current = board[row][col];
  if (!current.isRevealed || current.neighborMines === 0) {
    return { newBoard: board, hitMine: false, revealedCount: 0 };
  }

  const rows = board.length;
  const cols = board[0].length;

  // Count adjacent flags
  let flagCount = 0;
  for (const [dr, dc] of DIRECTIONS) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
      if (board[nr][nc].isFlagged) {
        flagCount++;
      }
    }
  }

  // If flags count equals the clue number, reveal remaining neighbors
  if (flagCount === current.neighborMines) {
    let newBoard: Board = board.map(r => r.map(c => ({ ...c })));
    let totalRevealed = 0;
    let hitMine = false;

    for (const [dr, dc] of DIRECTIONS) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const neighbor = newBoard[nr][nc];
        if (!neighbor.isRevealed && !neighbor.isFlagged) {
          const result = revealCell(newBoard, nr, nc);
          newBoard = result.newBoard;
          totalRevealed += result.revealedCount;
          if (result.hitMine) {
            hitMine = true;
            break;
          }
        }
      }
    }

    return { newBoard, hitMine, revealedCount: totalRevealed };
  }

  return { newBoard: board, hitMine: false, revealedCount: 0 };
}

export function checkWin(board: Board, totalMines: number): boolean {
  const rows = board.length;
  const cols = board[0].length;
  const totalSafeCells = rows * cols - totalMines;

  let revealedCount = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isRevealed && !board[r][c].isMine) {
        revealedCount++;
      }
    }
  }

  return revealedCount === totalSafeCells;
}

export function revealAllMines(board: Board, hitRow?: number, hitCol?: number): Board {
  return board.map((row, r) =>
    row.map((cell, c) => {
      if (cell.isMine) {
        return {
          ...cell,
          isRevealed: true,
          isExploded: r === hitRow && c === hitCol,
        };
      }
      return cell;
    })
  );
}

export function autoFlagMinesOnWin(board: Board): Board {
  return board.map(row =>
    row.map(cell => {
      if (cell.isMine) {
        return {
          ...cell,
          isFlagged: true,
        };
      }
      return cell;
    })
  );
}
