import React, { useState, useEffect, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import ToolTemplate from "@/components/ToolTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bomb,
  Flag,
  Timer,
  RefreshCw,
  Trophy,
  Smile,
  Frown,
  Meh,
  Eye
} from "lucide-react";

const ROWS = 9;
const COLS = 9;
const MINES = 10;

interface Cell {
  r: number;
  c: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborCount: number;
}

const NUMBER_COLORS = [
  "",
  "text-blue-500 font-extrabold",
  "text-emerald-500 font-extrabold",
  "text-rose-500 font-extrabold",
  "text-indigo-600 font-extrabold",
  "text-amber-600 font-extrabold",
  "text-teal-500 font-extrabold",
  "text-purple-600 font-extrabold",
  "text-gray-900 dark:text-gray-100 font-extrabold"
];

export default function Minesweeper() {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<"IDLE" | "PLAYING" | "WON" | "LOST">("IDLE");
  const [flagMode, setFlagMode] = useState<boolean>(false); // For mobile touch toggle
  const [timer, setTimer] = useState<number>(0);
  const [flagsUsed, setFlagsUsed] = useState<number>(0);
  const firstClickRef = useRef<boolean>(true);

  // Initialize empty safe board
  const initBoard = useCallback(() => {
    const newBoard: Cell[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < COLS; c++) {
        row.push({
          r,
          c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborCount: 0
        });
      }
      newBoard.push(row);
    }
    setBoard(newBoard);
    setGameState("IDLE");
    setTimer(0);
    setFlagsUsed(0);
    firstClickRef.current = true;
  }, []);

  useEffect(() => {
    initBoard();
  }, [initBoard]);

  // Timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === "PLAYING") {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  // Place mines ensuring the first clicked cell (and neighbors) are safe
  const placeMines = (grid: Cell[][], startR: number, startC: number) => {
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);

      // Safe zone around start cell
      const isStartZone = Math.abs(r - startR) <= 1 && Math.abs(c - startC) <= 1;

      if (!grid[r][c].isMine && !isStartZone) {
        grid[r][c].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighboring mine counts
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!grid[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc].isMine) {
                count++;
              }
            }
          }
          grid[r][c].neighborCount = count;
        }
      }
    }
  };

  // Reveal flood-fill algorithm
  const revealCell = (r: number, c: number) => {
    if (gameState === "WON" || gameState === "LOST") return;

    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    const target = newBoard[r][c];

    if (target.isFlagged || target.isRevealed) return;

    // Handle first click
    if (firstClickRef.current) {
      placeMines(newBoard, r, c);
      firstClickRef.current = false;
      setGameState("PLAYING");
    }

    // Hit a mine!
    if (target.isMine) {
      // Reveal all mines
      for (let row of newBoard) {
        for (let cell of row) {
          if (cell.isMine) cell.isRevealed = true;
        }
      }
      setBoard(newBoard);
      setGameState("LOST");
      return;
    }

    // Flood fill recursive reveal
    const queue: [number, number][] = [[r, c]];
    target.isRevealed = true;

    while (queue.length > 0) {
      const [currR, currC] = queue.shift()!;
      const currCell = newBoard[currR][currC];

      if (currCell.neighborCount === 0 && !currCell.isMine) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = currR + dr;
            const nc = currC + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
              const neighbor = newBoard[nr][nc];
              if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isMine) {
                neighbor.isRevealed = true;
                if (neighbor.neighborCount === 0) {
                  queue.push([nr, nc]);
                }
              }
            }
          }
        }
      }
    }

    // Check Win Condition: all safe cells revealed
    let unrevealedSafeCells = 0;
    for (let row of newBoard) {
      for (let cell of row) {
        if (!cell.isMine && !cell.isRevealed) {
          unrevealedSafeCells++;
        }
      }
    }

    if (unrevealedSafeCells === 0) {
      setGameState("WON");
    }

    setBoard(newBoard);
  };

  const toggleFlag = (r: number, c: number, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (gameState === "WON" || gameState === "LOST") return;

    const target = board[r][c];
    if (target.isRevealed) return;

    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    const newCell = newBoard[r][c];

    newCell.isFlagged = !newCell.isFlagged;
    setFlagsUsed((prev) => (newCell.isFlagged ? prev + 1 : prev - 1));
    setBoard(newBoard);
  };

  const handleCellClick = (r: number, c: number) => {
    if (flagMode) {
      toggleFlag(r, c);
    } else {
      revealCell(r, c);
    }
  };

  return (
    <ToolTemplate
      title="Classic Minesweeper"
      description="Sweep the grid, flag the hidden bombs, and uncover all safe cells in this timeless logic puzzle. Guaranteed safe first click!"
    >
      <Helmet>
        <title>Classic Minesweeper - Play Free Online Logic Game | Axevora</title>
        <meta
          name="description"
          content="Play classic Minesweeper online for free. Clean retro design, mobile flag mode toggle, and guaranteed safe first click."
        />
        <link rel="canonical" href="https://axevora.com/tools/minesweeper" />
      </Helmet>

      <div className="max-w-md mx-auto space-y-6">
        {/* Status Dashboard Header */}
        <Card className="bg-card/60 backdrop-blur border-border/80 shadow-md">
          <CardContent className="p-4 flex items-center justify-between">
            {/* Mines Left */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <Bomb className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Mines</p>
                <p className="text-xl font-extrabold font-mono text-foreground">
                  {Math.max(0, MINES - flagsUsed)}
                </p>
              </div>
            </div>

            {/* Face / Reset Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={initBoard}
              className="w-12 h-12 rounded-2xl border-2 border-border/80 bg-background hover:scale-105 transition-transform"
              aria-label="Restart Game"
            >
              {gameState === "WON" ? (
                <Smile className="w-6 h-6 text-emerald-500 fill-emerald-500/20" />
              ) : gameState === "LOST" ? (
                <Frown className="w-6 h-6 text-rose-500 fill-rose-500/20" />
              ) : (
                <Meh className="w-6 h-6 text-amber-500 fill-amber-500/20" />
              )}
            </Button>

            {/* Timer */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Timer className="w-4 h-4" />
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Time</p>
                <p className="text-xl font-extrabold font-mono text-foreground">
                  {timer.toString().padStart(3, "0")}s
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Flag Mode Toggle */}
        <div className="flex items-center justify-between px-2">
          <Badge variant="outline" className="text-xs border-border">
            9x9 Grid • 10 Mines
          </Badge>

          <Button
            size="sm"
            variant={flagMode ? "default" : "outline"}
            onClick={() => setFlagMode(!flagMode)}
            className={`rounded-xl text-xs font-bold gap-1.5 transition-all ${
              flagMode
                ? "bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20"
                : "text-muted-foreground"
            }`}
          >
            {flagMode ? <Flag className="w-3.5 h-3.5 fill-current" /> : <Eye className="w-3.5 h-3.5" />}
            {flagMode ? "Mode: Flagging 🚩" : "Mode: Digging ⛏️"}
          </Button>
        </div>

        {/* Minesweeper Grid */}
        <div className="rounded-2xl p-3 bg-slate-950 border-2 border-border/80 shadow-2xl overflow-hidden">
          <div
            className="grid gap-1.5 aspect-square max-w-[360px] mx-auto select-none"
            style={{
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              gridTemplateRows: `repeat(${ROWS}, 1fr)`
            }}
          >
            {board.map((row, r) =>
              row.map((cell, c) => {
                let cellContent: React.ReactNode = null;

                if (cell.isRevealed) {
                  if (cell.isMine) {
                    cellContent = <Bomb className="w-4 h-4 text-rose-500 fill-current animate-bounce" />;
                  } else if (cell.neighborCount > 0) {
                    cellContent = (
                      <span className={`text-sm ${NUMBER_COLORS[cell.neighborCount]}`}>
                        {cell.neighborCount}
                      </span>
                    );
                  }
                } else if (cell.isFlagged) {
                  cellContent = <Flag className="w-4 h-4 text-amber-400 fill-current" />;
                }

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    onContextMenu={(e) => toggleFlag(r, c, e)}
                    disabled={gameState === "WON" || gameState === "LOST"}
                    className={`aspect-square rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-150 ${
                      cell.isRevealed
                        ? cell.isMine
                          ? "bg-rose-950/80 border border-rose-600/50"
                          : "bg-slate-900 border border-slate-800"
                        : "bg-slate-800 hover:bg-slate-700 active:scale-95 border-t border-l border-slate-700 shadow-sm"
                    }`}
                  >
                    {cellContent}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Game End Banner */}
        {gameState === "WON" && (
          <Card className="bg-emerald-500/10 border-emerald-500/30 text-center p-4 rounded-2xl animate-in zoom-in-95">
            <Trophy className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Board Cleared!</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-3">
              You found all mines safely in {timer} seconds.
            </p>
            <Button onClick={initBoard} size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Play Again
            </Button>
          </Card>
        )}

        {gameState === "LOST" && (
          <Card className="bg-rose-500/10 border-rose-500/30 text-center p-4 rounded-2xl animate-in zoom-in-95">
            <Bomb className="w-10 h-10 text-rose-500 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-rose-600 dark:text-rose-400">Boom! Mine Exploded</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-3">
              Careful next time! Tap below to restart.
            </p>
            <Button onClick={initBoard} size="sm" variant="outline" className="font-bold border-rose-500/30 text-rose-500">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Try Again
            </Button>
          </Card>
        )}

        {/* Quick Instructions */}
        <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-xs text-muted-foreground space-y-1">
          <p>• <strong>Desktop:</strong> Left-click to dig, Right-click to flag a mine.</p>
          <p>• <strong>Mobile:</strong> Toggle the <strong>Mode: Digging / Flagging</strong> button above.</p>
        </div>
      </div>
    </ToolTemplate>
  );
}
