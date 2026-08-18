import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Board as BoardType, GameStatus, GameStats } from './types';
import {
  createEmptyBoard,
  populateMines,
  revealCell,
  chordCell,
  checkWin,
  revealAllMines,
  autoFlagMinesOnWin,
} from './utils/minesweeper';
import { soundManager } from './utils/audio';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { ControlsBar } from './components/ControlsBar';
import { WinModal } from './components/WinModal';
import { HelpModal, StatsModal } from './components/InfoModals';

const ROWS = 9;
const COLS = 9;
const TOTAL_MINES = 10;

const STATS_STORAGE_KEY = 'minesweeper_stats_9x9';

export default function App() {
  // Game states
  const [board, setBoard] = useState<BoardType>(() => createEmptyBoard(ROWS, COLS));
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [flagsCount, setFlagsCount] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [isMouseDownOnBoard, setIsMouseDownOnBoard] = useState<boolean>(false);
  const [isMobileFlagMode, setIsMobileFlagMode] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Modals & Celebrations
  const [showWinModal, setShowWinModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  // Statistics
  const [stats, setStats] = useState<GameStats>(() => {
    if (typeof window === 'undefined') {
      return { bestTime: null, gamesPlayed: 0, gamesWon: 0 };
    }
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore JSON error
    }
    return { bestTime: null, gamesPlayed: 0, gamesWon: 0 };
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timer helper
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Timer interval effect
  useEffect(() => {
    if (gameStatus === 'playing') {
      timerRef.current = setInterval(() => {
        setTimer((prev) => Math.min(999, prev + 1));
      }, 1000);
    } else {
      stopTimer();
    }

    return () => stopTimer();
  }, [gameStatus, stopTimer]);

  // Reset/Start new game
  const resetGame = useCallback(() => {
    stopTimer();
    setBoard(createEmptyBoard(ROWS, COLS));
    setGameStatus('idle');
    setFlagsCount(0);
    setTimer(0);
    setIsMouseDownOnBoard(false);
    setShowWinModal(false);
    setIsNewRecord(false);
  }, [stopTimer]);

  // Handle cell reveal (Left Click)
  const handleReveal = useCallback(
    (row: number, col: number) => {
      if (gameStatus === 'won' || gameStatus === 'lost') return;

      let currentBoard = board;

      // If it's the first click, initialize mines guaranteeing first cell is safe
      if (gameStatus === 'idle') {
        currentBoard = populateMines(board, ROWS, COLS, TOTAL_MINES, row, col);
        setGameStatus('playing');
        setStats((prev) => {
          const updated = { ...prev, gamesPlayed: prev.gamesPlayed + 1 };
          localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
      }

      const { newBoard, hitMine, revealedCount } = revealCell(currentBoard, row, col);

      if (hitMine) {
        // Boom! Game Over
        soundManager.playExplode();
        setBoard(revealAllMines(newBoard, row, col));
        setGameStatus('lost');
        stopTimer();
        return;
      }

      if (revealedCount > 0) {
        soundManager.playClick();
      }

      // Check win condition
      if (checkWin(newBoard, TOTAL_MINES)) {
        const finalTime = timer === 0 ? 1 : timer;
        soundManager.playWin();
        const wonBoard = autoFlagMinesOnWin(newBoard);
        setBoard(wonBoard);
        setFlagsCount(TOTAL_MINES);
        setGameStatus('won');
        stopTimer();

        // Update stats
        setStats((prev) => {
          const isBest = prev.bestTime === null || finalTime < prev.bestTime;
          setIsNewRecord(isBest);
          const updated = {
            ...prev,
            gamesWon: prev.gamesWon + 1,
            bestTime: isBest ? finalTime : prev.bestTime,
          };
          localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });

        setShowWinModal(true);
      } else {
        setBoard(newBoard);
      }
    },
    [board, gameStatus, timer, stopTimer]
  );

  // Handle cell flag (Right Click / Mobile Flag)
  const handleFlag = useCallback(
    (row: number, col: number) => {
      if (gameStatus === 'won' || gameStatus === 'lost') return;

      const cell = board[row][col];
      if (cell.isRevealed) return;

      const newBoard: BoardType = board.map((r) => r.map((c) => ({ ...c })));
      const target = newBoard[row][col];

      if (target.isFlagged) {
        target.isFlagged = false;
        soundManager.playUnflag();
        setFlagsCount((prev) => Math.max(0, prev - 1));
      } else {
        target.isFlagged = true;
        soundManager.playFlag();
        setFlagsCount((prev) => prev + 1);
      }

      setBoard(newBoard);
    },
    [board, gameStatus]
  );

  // Handle Chording (Clicking a revealed number with satisfied flags)
  const handleChord = useCallback(
    (row: number, col: number) => {
      if (gameStatus !== 'playing') return;

      const { newBoard, hitMine, revealedCount } = chordCell(board, row, col);

      if (hitMine) {
        soundManager.playExplode();
        setBoard(revealAllMines(newBoard));
        setGameStatus('lost');
        stopTimer();
        return;
      }

      if (revealedCount > 0) {
        soundManager.playClick();
        if (checkWin(newBoard, TOTAL_MINES)) {
          const finalTime = timer === 0 ? 1 : timer;
          soundManager.playWin();
          const wonBoard = autoFlagMinesOnWin(newBoard);
          setBoard(wonBoard);
          setFlagsCount(TOTAL_MINES);
          setGameStatus('won');
          stopTimer();

          setStats((prev) => {
            const isBest = prev.bestTime === null || finalTime < prev.bestTime;
            setIsNewRecord(isBest);
            const updated = {
              ...prev,
              gamesWon: prev.gamesWon + 1,
              bestTime: isBest ? finalTime : prev.bestTime,
            };
            localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(updated));
            return updated;
          });

          setShowWinModal(true);
        } else {
          setBoard(newBoard);
        }
      }
    },
    [board, gameStatus, timer, stopTimer]
  );

  // Toggle Sound Mute
  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      soundManager.setMuted(next);
      return next;
    });
  }, []);

  // Reset Stats
  const handleResetStats = useCallback(() => {
    const fresh: GameStats = { bestTime: null, gamesPlayed: 0, gamesWon: 0 };
    setStats(fresh);
    localStorage.removeItem(STATS_STORAGE_KEY);
    setShowStatsModal(false);
  }, []);

  const remainingMines = TOTAL_MINES - flagsCount;

  return (
    <div
      id="minesweeper-app"
      className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-4 selection:bg-[#333] font-mono text-[#e0e0e0]"
    >
      {/* Main High Density Game Panel */}
      <main className="w-full max-w-sm sm:max-w-md bg-[#222] border-2 border-[#555] p-4 sm:p-5 shadow-[0_0_30px_rgba(0,0,0,0.7)] flex flex-col items-center">
        {/* Game Title Bar */}
        <div className="w-full flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">💣</span>
            <h1 className="text-base sm:text-lg font-bold tracking-wider text-white uppercase">
              MINESWEEPER
            </h1>
          </div>
          <span className="text-[11px] px-2 py-0.5 bg-black text-[#aaa] font-bold border border-[#444] tracking-wider uppercase">
            9×9 • 10 MINES
          </span>
        </div>

        {/* Digital Header (Counters + Face + Timer) */}
        <Header
          remainingMines={remainingMines}
          timer={timer}
          gameStatus={gameStatus}
          isMouseDownOnBoard={isMouseDownOnBoard}
          isMuted={isMuted}
          onReset={resetGame}
          onToggleMute={handleToggleMute}
        />

        {/* 9x9 Minesweeper Board */}
        <div className="mt-3 w-full flex justify-center">
          <Board
            board={board}
            gameStatus={gameStatus}
            onReveal={handleReveal}
            onFlag={handleFlag}
            onChord={handleChord}
            onCellMouseDown={() => setIsMouseDownOnBoard(true)}
            onCellMouseUp={() => setIsMouseDownOnBoard(false)}
            isMobileFlagMode={isMobileFlagMode}
          />
        </div>

        {/* Controls Bar & Mobile Switcher */}
        <ControlsBar
          isMobileFlagMode={isMobileFlagMode}
          onToggleMobileFlagMode={() => setIsMobileFlagMode((prev) => !prev)}
          stats={stats}
          onOpenHelp={() => setShowHelpModal(true)}
          onOpenStats={() => setShowStatsModal(true)}
        />
      </main>

      {/* Footer Notes in High Density style */}
      <footer className="mt-4 flex gap-6 text-xs text-[#888] text-center uppercase tracking-widest opacity-70">
        <span>Left Click: Open</span>
        <span>•</span>
        <span>Right Click: Flag</span>
      </footer>

      {/* Win Celebration Modal */}
      <WinModal
        isOpen={showWinModal}
        clearTime={timer}
        isNewRecord={isNewRecord}
        stats={stats}
        onPlayAgain={resetGame}
      />

      {/* Rule / Help Modal */}
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />

      {/* Stats Modal */}
      <StatsModal
        isOpen={showStatsModal}
        stats={stats}
        onClose={() => setShowStatsModal(false)}
        onResetStats={handleResetStats}
      />
    </div>
  );
}
