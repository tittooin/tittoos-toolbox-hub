import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import ToolTemplate from "@/components/ToolTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  RefreshCw,
  Timer,
  Eraser,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

// Pre-tested valid Sudoku puzzles: [Initial Clues (0 = empty), Complete Solution]
const SUDOKU_PUZZLES = {
  easy: {
    initial: [
      5, 3, 0, 0, 7, 0, 0, 0, 0,
      6, 0, 0, 1, 9, 5, 0, 0, 0,
      0, 9, 8, 0, 0, 0, 0, 6, 0,
      8, 0, 0, 0, 6, 0, 0, 0, 3,
      4, 0, 0, 8, 0, 3, 0, 0, 1,
      7, 0, 0, 0, 2, 0, 0, 0, 6,
      0, 6, 0, 0, 0, 0, 2, 8, 0,
      0, 0, 0, 4, 1, 9, 0, 0, 5,
      0, 0, 0, 0, 8, 0, 0, 7, 9
    ],
    solution: [
      5, 3, 4, 6, 7, 8, 9, 1, 2,
      6, 7, 2, 1, 9, 5, 3, 4, 8,
      1, 9, 8, 3, 4, 2, 5, 6, 7,
      8, 5, 9, 7, 6, 1, 4, 2, 3,
      4, 2, 6, 8, 5, 3, 7, 9, 1,
      7, 1, 3, 9, 2, 4, 8, 5, 6,
      9, 6, 1, 5, 3, 7, 2, 8, 4,
      2, 8, 7, 4, 1, 9, 6, 3, 5,
      3, 4, 5, 2, 8, 6, 1, 7, 9
    ]
  },
  medium: {
    initial: [
      0, 0, 0, 2, 6, 0, 7, 0, 1,
      6, 8, 0, 0, 7, 0, 0, 9, 0,
      1, 9, 0, 0, 0, 4, 5, 0, 0,
      8, 2, 0, 1, 0, 0, 0, 4, 0,
      0, 0, 4, 6, 0, 2, 9, 0, 0,
      0, 5, 0, 0, 0, 3, 0, 2, 8,
      0, 0, 9, 3, 0, 0, 0, 7, 4,
      0, 4, 0, 0, 5, 0, 0, 3, 6,
      7, 0, 3, 0, 1, 8, 0, 0, 0
    ],
    solution: [
      4, 3, 5, 2, 6, 9, 7, 8, 1,
      6, 8, 2, 5, 7, 1, 4, 9, 3,
      1, 9, 7, 8, 3, 4, 5, 6, 2,
      8, 2, 6, 1, 9, 5, 3, 4, 7,
      3, 7, 4, 6, 8, 2, 9, 1, 5,
      9, 5, 1, 7, 4, 3, 6, 2, 8,
      5, 1, 9, 3, 2, 6, 8, 7, 4,
      2, 4, 8, 9, 5, 7, 1, 3, 6,
      7, 6, 3, 4, 1, 8, 2, 5, 9
    ]
  },
  hard: {
    initial: [
      0, 2, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 6, 0, 0, 0, 0, 3,
      0, 7, 4, 0, 8, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 3, 0, 0, 2,
      0, 8, 0, 0, 4, 0, 0, 1, 0,
      6, 0, 0, 5, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 1, 0, 7, 8, 0,
      5, 0, 0, 0, 0, 9, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 4, 0
    ],
    solution: [
      1, 2, 6, 4, 3, 7, 9, 5, 8,
      8, 9, 5, 6, 2, 1, 4, 7, 3,
      3, 7, 4, 9, 8, 5, 1, 2, 6,
      4, 5, 7, 1, 9, 3, 8, 6, 2,
      9, 8, 3, 2, 4, 6, 5, 1, 7,
      6, 1, 2, 5, 7, 8, 3, 9, 4,
      2, 6, 9, 3, 1, 4, 7, 8, 5,
      5, 4, 8, 7, 6, 9, 2, 3, 1,
      7, 3, 1, 8, 5, 2, 6, 4, 9
    ]
  }
};

type Difficulty = "easy" | "medium" | "hard";

export default function SudokuGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [board, setBoard] = useState<number[]>([]);
  const [initialMask, setInitialMask] = useState<boolean[]>([]);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState<number>(0);

  const startNewGame = useCallback((diff: Difficulty) => {
    const puzzle = SUDOKU_PUZZLES[diff];
    setBoard([...puzzle.initial]);
    setInitialMask(puzzle.initial.map((val) => val !== 0));
    setSelectedCell(null);
    setTimer(0);
    setIsCompleted(false);
    setMistakes(0);
  }, []);

  useEffect(() => {
    startNewGame(difficulty);
  }, [difficulty, startNewGame]);

  // Timer
  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted]);

  // Input number into selected cell
  const handleNumberInput = useCallback(
    (num: number) => {
      if (selectedCell === null || isCompleted) return;
      if (initialMask[selectedCell]) return; // Cannot overwrite initial clue

      const solution = SUDOKU_PUZZLES[difficulty].solution;
      const newBoard = [...board];
      newBoard[selectedCell] = num;

      // Check mistake
      if (num !== 0 && num !== solution[selectedCell]) {
        setMistakes((m) => m + 1);
      }

      setBoard(newBoard);

      // Check completion
      const isFilled = newBoard.every((val, idx) => val === solution[idx]);
      if (isFilled) {
        setIsCompleted(true);
      }
    },
    [selectedCell, isCompleted, initialMask, difficulty, board]
  );

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedCell === null) return;

      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= 9) {
        handleNumberInput(num);
      } else if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") {
        handleNumberInput(0);
      } else if (e.key === "ArrowUp" && selectedCell >= 9) {
        setSelectedCell(selectedCell - 9);
      } else if (e.key === "ArrowDown" && selectedCell < 72) {
        setSelectedCell(selectedCell + 9);
      } else if (e.key === "ArrowLeft" && selectedCell % 9 !== 0) {
        setSelectedCell(selectedCell - 1);
      } else if (e.key === "ArrowRight" && selectedCell % 9 !== 8) {
        setSelectedCell(selectedCell + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCell, handleNumberInput]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const selectedValue = selectedCell !== null ? board[selectedCell] : null;

  return (
    <ToolTemplate
      title="Classic Sudoku Puzzle"
      description="Exercise your brain with timeless 9x9 Sudoku. Choose from Easy, Medium, or Hard puzzles with smart conflict detection and mobile keypads."
    >
      <Helmet>
        <title>Sudoku Puzzle - Free Online Brain Challenge | Axevora</title>
        <meta
          name="description"
          content="Play free Sudoku online. Clean 9x9 grid with easy, medium, and hard modes. Touch number pad for mobile and keyboard shortcuts for desktop."
        />
        <link rel="canonical" href="https://axevora.com/tools/sudoku" />
      </Helmet>

      <div className="max-w-lg mx-auto space-y-6">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between gap-2">
          {/* Difficulty Selector */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl">
            {(["easy", "medium", "hard"] as Difficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  setDifficulty(diff);
                  startNewGame(diff);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                  difficulty === diff
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
            <span className="flex items-center gap-1 font-mono text-foreground">
              <Timer className="w-3.5 h-3.5 text-blue-500" /> {formatTimer(timer)}
            </span>
            <span className="flex items-center gap-1">
              Mistakes: <strong className={mistakes > 0 ? "text-rose-500" : "text-foreground"}>{mistakes}</strong>
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => startNewGame(difficulty)}
              className="w-8 h-8 rounded-lg"
              title="Reset / New Puzzle"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* 9x9 Board */}
        <div className="rounded-2xl p-2 sm:p-3 bg-slate-950 border-2 border-border/80 shadow-2xl">
          <div className="grid grid-cols-9 gap-0.5 aspect-square max-w-[420px] mx-auto select-none bg-slate-800 p-1 rounded-xl">
            {board.map((val, idx) => {
              const r = Math.floor(idx / 9);
              const c = idx % 9;
              const isInitial = initialMask[idx];
              const isSelected = selectedCell === idx;

              // Row / Column / Box Highlight
              const isRowOrCol =
                selectedCell !== null &&
                (Math.floor(selectedCell / 9) === r || selectedCell % 9 === c);
              const isSameNumber = selectedValue !== null && selectedValue !== 0 && val === selectedValue;

              // 3x3 Box borders
              const borderRight = (c + 1) % 3 === 0 && c !== 8 ? "border-r-2 border-slate-500" : "";
              const borderBottom = (r + 1) % 3 === 0 && r !== 8 ? "border-b-2 border-slate-500" : "";

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedCell(idx)}
                  className={`aspect-square flex items-center justify-center text-base sm:text-lg font-bold transition-all ${borderRight} ${borderBottom} ${
                    isSelected
                      ? "bg-amber-500 text-slate-950 shadow-md scale-105 z-10 rounded-md"
                      : isSameNumber
                      ? "bg-amber-500/30 text-amber-300"
                      : isRowOrCol
                      ? "bg-slate-800/80 text-foreground"
                      : "bg-slate-900/90 text-foreground hover:bg-slate-800"
                  } ${isInitial ? "font-extrabold text-blue-400" : "font-semibold text-slate-100"}`}
                >
                  {val !== 0 ? val : ""}
                </button>
              );
            })}
          </div>
        </div>

        {/* Victory Banner */}
        {isCompleted && (
          <Card className="bg-emerald-500/10 border-emerald-500/30 text-center p-4 rounded-2xl animate-in zoom-in-95">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Puzzle Solved!</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-3">
              Completed in {formatTimer(timer)} with {mistakes} mistakes.
            </p>
            <Button
              onClick={() => startNewGame(difficulty)}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Play Next
            </Button>
          </Card>
        )}

        {/* Mobile Number Keypad (1 to 9 + Erase) */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              variant="outline"
              onClick={() => handleNumberInput(num)}
              disabled={selectedCell === null || initialMask[selectedCell]}
              className="h-11 rounded-xl text-base font-extrabold bg-card border-border active:scale-95"
            >
              {num}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => handleNumberInput(0)}
            disabled={selectedCell === null || initialMask[selectedCell]}
            className="h-11 rounded-xl text-xs font-bold bg-card border-border text-rose-500 active:scale-95 col-span-1 sm:col-span-1"
            title="Erase cell"
          >
            <Eraser className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Instructions */}
        <div className="rounded-xl border border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground flex items-center justify-between">
          <span>Desktop: <strong>Number Keys 1-9</strong> or <strong>Backspace</strong></span>
          <span>Mobile: <strong>Tap cell then Keypad</strong></span>
        </div>
      </div>
    </ToolTemplate>
  );
}
