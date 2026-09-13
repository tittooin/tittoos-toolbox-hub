import React, { useState, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import ToolTemplate from "@/components/ToolTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Crown,
  RefreshCw,
  Trophy,
  ArrowRight,
  HelpCircle,
  Sparkles,
  Bot,
  UserCheck,
  Shield,
  Zap,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

type PieceType = "p" | "n" | "b" | "r" | "q" | "k";
type PieceColor = "w" | "b";

interface Piece {
  type: PieceType;
  color: PieceColor;
}

type Board = (Piece | null)[][];

const INITIAL_BOARD: Board = [
  [
    { type: "r", color: "b" },
    { type: "n", color: "b" },
    { type: "b", color: "b" },
    { type: "q", color: "b" },
    { type: "k", color: "b" },
    { type: "b", color: "b" },
    { type: "n", color: "b" },
    { type: "r", color: "b" }
  ],
  Array(8).fill(null).map(() => ({ type: "p" as PieceType, color: "b" as PieceColor })),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null).map(() => ({ type: "p" as PieceType, color: "w" as PieceColor })),
  [
    { type: "r", color: "w" },
    { type: "n", color: "w" },
    { type: "b", color: "w" },
    { type: "q", color: "w" },
    { type: "k", color: "w" },
    { type: "b", color: "w" },
    { type: "n", color: "w" },
    { type: "r", color: "w" }
  ]
];

const PIECE_SYMBOLS: Record<PieceColor, Record<PieceType, string>> = {
  w: { k: "♔", q: "♕", r: "♖", b: "♗", n: "♘", p: "♙" },
  b: { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" }
};

const COLS = ["a", "b", "c", "d", "e", "f", "g", "h"];

export default function ChessGame() {
  const [board, setBoard] = useState<Board>(() => JSON.parse(JSON.stringify(INITIAL_BOARD)));
  const [turn, setTurn] = useState<PieceColor>("w");
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [vsAI, setVsAI] = useState<boolean>(true);
  const [capturedWhite, setCapturedWhite] = useState<Piece[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<Piece[]>([]);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<"PLAYING" | "CHECK" | "CHECKMATE" | "DRAW">("PLAYING");
  const [winner, setWinner] = useState<PieceColor | null>(null);

  // Helper: check bounds
  const inBounds = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;

  // Generate pseudo-legal moves for a piece at (r, c)
  const getMoves = useCallback((b: Board, r: number, c: number): [number, number][] => {
    const piece = b[r][c];
    if (!piece) return [];
    const moves: [number, number][] = [];
    const color = piece.color;
    const enemyColor = color === "w" ? "b" : "w";

    if (piece.type === "p") {
      const dir = color === "w" ? -1 : 1;
      const startRank = color === "w" ? 6 : 1;

      // 1 square forward
      if (inBounds(r + dir, c) && !b[r + dir][c]) {
        moves.push([r + dir, c]);
        // 2 squares forward from start rank
        if (r === startRank && inBounds(r + 2 * dir, c) && !b[r + 2 * dir][c]) {
          moves.push([r + 2 * dir, c]);
        }
      }
      // Diagonal captures
      [-1, 1].forEach((dc) => {
        if (inBounds(r + dir, c + dc)) {
          const target = b[r + dir][c + dc];
          if (target && target.color === enemyColor) {
            moves.push([r + dir, c + dc]);
          }
        }
      });
    } else if (piece.type === "n") {
      const offsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      offsets.forEach(([dr, dc]) => {
        const nr = r + dr;
        const nc = c + dc;
        if (inBounds(nr, nc)) {
          const target = b[nr][nc];
          if (!target || target.color === enemyColor) {
            moves.push([nr, nc]);
          }
        }
      });
    } else if (piece.type === "b" || piece.type === "r" || piece.type === "q") {
      const directions: [number, number][] = [];
      if (piece.type === "b" || piece.type === "q") {
        directions.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
      }
      if (piece.type === "r" || piece.type === "q") {
        directions.push([-1, 0], [1, 0], [0, -1], [0, 1]);
      }

      directions.forEach(([dr, dc]) => {
        let step = 1;
        while (true) {
          const nr = r + dr * step;
          const nc = c + dc * step;
          if (!inBounds(nr, nc)) break;
          const target = b[nr][nc];
          if (!target) {
            moves.push([nr, nc]);
          } else {
            if (target.color === enemyColor) moves.push([nr, nc]);
            break;
          }
          step++;
        }
      });
    } else if (piece.type === "k") {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (inBounds(nr, nc)) {
            const target = b[nr][nc];
            if (!target || target.color === enemyColor) {
              moves.push([nr, nc]);
            }
          }
        }
      }
    }

    return moves;
  }, []);

  // Compute valid moves for selected square
  const validMoves = useMemo(() => {
    if (!selectedSquare) return [];
    const [r, c] = selectedSquare;
    const piece = board[r][c];
    if (!piece || piece.color !== turn) return [];
    return getMoves(board, r, c);
  }, [selectedSquare, board, turn, getMoves]);

  // Execute a move on board
  const executeMove = useCallback((fromR: number, fromC: number, toR: number, toC: number) => {
    setBoard((prev) => {
      const next = prev.map((row) => [...row]);
      const piece = next[fromR][fromC];
      const target = next[toR][toC];
      if (!piece) return prev;

      // Handle capture
      if (target) {
        if (target.color === "w") setCapturedWhite((c) => [...c, target]);
        else setCapturedBlack((c) => [...c, target]);
      }

      // Check for pawn promotion (auto-promote to Queen)
      let finalPiece = piece;
      if (piece.type === "p" && (toR === 0 || toR === 7)) {
        finalPiece = { type: "q", color: piece.color };
      }

      next[toR][toC] = finalPiece;
      next[fromR][fromC] = null;

      // Record move
      const moveNot = `${piece.type.toUpperCase()}${COLS[fromC]}${8 - fromR}→${COLS[toC]}${8 - toR}`;
      setMoveHistory((m) => [...m.slice(-9), moveNot]);

      // Switch turn
      const nextTurn = piece.color === "w" ? "b" : "w";
      setTurn(nextTurn);

      // Check win if King was taken
      if (target && target.type === "k") {
        setGameStatus("CHECKMATE");
        setWinner(piece.color);
      }

      return next;
    });

    setSelectedSquare(null);
  }, []);

  // Simple AI move for Black
  const triggerAIMove = useCallback(() => {
    setTimeout(() => {
      setBoard((currentBoard) => {
        const blackMoves: { from: [number, number]; to: [number, number]; score: number }[] = [];

        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const piece = currentBoard[r][c];
            if (piece && piece.color === "b") {
              const moves = getMoves(currentBoard, r, c);
              moves.forEach(([toR, toC]) => {
                const target = currentBoard[toR][toC];
                let score = 0;
                if (target) {
                  if (target.type === "q") score = 90;
                  else if (target.type === "r") score = 50;
                  else if (target.type === "b" || target.type === "n") score = 30;
                  else if (target.type === "p") score = 10;
                  else if (target.type === "k") score = 1000;
                }
                // Center control bias
                score += (3.5 - Math.abs(3.5 - toR)) + (3.5 - Math.abs(3.5 - toC));
                blackMoves.push({ from: [r, c], to: [toR, toC], score });
              });
            }
          }
        }

        if (blackMoves.length === 0) return currentBoard;

        // Sort by score and pick best or near-best
        blackMoves.sort((a, b) => b.score - a.score);
        const choice = blackMoves[0];

        executeMove(choice.from[0], choice.from[1], choice.to[0], choice.to[1]);
        return currentBoard;
      });
    }, 400);
  }, [getMoves, executeMove]);

  // Handle square click
  const handleSquareClick = (r: number, c: number) => {
    if (gameStatus === "CHECKMATE") return;

    // If already selected, check if destination is valid move
    if (selectedSquare) {
      const [sr, sc] = selectedSquare;
      const isMoveValid = validMoves.some(([vr, vc]) => vr === r && vc === c);

      if (isMoveValid) {
        executeMove(sr, sc, r, c);

        // If playing vs AI and it was white's move, schedule black's response
        if (vsAI && turn === "w") {
          setTimeout(triggerAIMove, 200);
        }
        return;
      }
    }

    // Select piece if it belongs to current player
    const piece = board[r][c];
    if (piece && piece.color === turn) {
      setSelectedSquare([r, c]);
    } else {
      setSelectedSquare(null);
    }
  };

  const resetGame = () => {
    setBoard(JSON.parse(JSON.stringify(INITIAL_BOARD)));
    setTurn("w");
    setSelectedSquare(null);
    setCapturedWhite([]);
    setCapturedBlack([]);
    setMoveHistory([]);
    setGameStatus("PLAYING");
    setWinner(null);
  };

  return (
    <ToolTemplate
      title="Play Chess Online - Free Browser Chess Game"
      description="Play free online chess with no registration required. Challenge computer AI or play local pass-and-play with friend. Enjoy smooth moves and clean design."
    >
      <Helmet>
        <title>Play Chess Online - Free Browser Chess Game | Axevora</title>
        <meta
          name="description"
          content="Play Chess online for free on Axevora. Single player against smart computer AI or local two player. Learn chess rules, opening strategies, and checkmate tactics."
        />
        <meta
          name="keywords"
          content="chess, play chess online, chess online, free chess, play chess free, browser chess, 2 player chess, chess game online, chess ai"
        />
        <link rel="canonical" href="https://axevora.com/tools/chess" />
        <meta property="og:title" content="Play Chess Online - Free Browser Chess Game | Axevora" />
        <meta
          property="og:description"
          content="Play Chess online for free. Clean board, valid move indicators, smart AI opponent, and zero installation."
        />
        <meta property="og:url" content="https://axevora.com/tools/chess" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Play Chess Online - Free Browser Chess Game | Axevora" />
        <meta
          name="twitter:description"
          content="Challenge computer AI or play with a friend. 100% free browser chess on Axevora."
        />

        {/* Structured Data: VideoGame & FAQ */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://axevora.com/" },
                  { "@type": "ListItem", "position": 2, "name": "Games", "item": "https://axevora.com/games" },
                  { "@type": "ListItem", "position": 3, "name": "Board & Classic", "item": "https://axevora.com/games" },
                  { "@type": "ListItem", "position": 4, "name": "Chess", "item": "https://axevora.com/tools/chess" }
                ]
              },
              {
                "@type": "VideoGame",
                "name": "Axevora Chess Online",
                "description": "Play chess online in browser against AI or local two player. Features move hints, captured piece counters, and game replay.",
                "genre": ["Board Game", "Strategy", "Classic"],
                "gamePlatform": "Web Browser",
                "applicationCategory": "Game",
                "operatingSystem": "Any",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "How does the Knight move in Chess?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "The Knight moves in an 'L' shape: two squares in one horizontal or vertical direction, then one square perpendicular. It is the only piece that can jump over other pieces."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can I play Chess online against computer for free?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes! Axevora Chess offers free single-player gameplay against built-in AI directly in your web browser with zero registration or download required."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What is Checkmate?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Checkmate occurs when a player's King is directly attacked (in check) and there is no legal move to escape, block the attack, or capture the attacking piece. Checkmate immediately wins the game."
                    }
                  }
                ]
              }
            ]
          })}
        </script>
      </Helmet>

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground flex items-center gap-1.5">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/games" className="hover:text-primary transition-colors">Games Hub</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground font-semibold">Chess</span>
      </nav>

      {/* Main Game Interface */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-card/60 backdrop-blur p-4 rounded-2xl border border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                Classic Chess
                <Badge variant="outline" className="text-[10px] uppercase font-bold border-amber-500/30 text-amber-600 dark:text-amber-400">
                  {vsAI ? "vs Computer" : "2 Players"}
                </Badge>
              </h2>
              <p className="text-xs text-muted-foreground">
                Turn: <strong className={turn === "w" ? "text-emerald-500" : "text-rose-500"}>{turn === "w" ? "White" : "Black"}</strong>
                {gameStatus === "CHECKMATE" && ` • Game Over! ${winner === "w" ? "White" : "Black"} won!`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVsAI(!vsAI)}
              className="text-xs font-semibold"
            >
              {vsAI ? <UserCheck className="w-3.5 h-3.5 mr-1.5" /> : <Bot className="w-3.5 h-3.5 mr-1.5" />}
              {vsAI ? "Pass & Play" : "vs Computer"}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={resetGame}
              className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> New Game
            </Button>
          </div>
        </div>

        {/* Chessboard & Info Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Board (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col items-center">
            {/* Black Captured Bar */}
            <div className="w-full max-w-[440px] flex items-center justify-between px-2 py-1.5 text-xs text-muted-foreground">
              <span className="font-semibold text-[11px] flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 inline-block" /> Black
              </span>
              <div className="flex gap-1 text-sm">{capturedWhite.map((p, i) => <span key={i}>{PIECE_SYMBOLS.w[p.type]}</span>)}</div>
            </div>

            {/* The 8x8 Board Container */}
            <div className="w-full max-w-[440px] aspect-square rounded-2xl overflow-hidden border-4 border-amber-950/40 shadow-2xl bg-amber-950/30 grid grid-cols-8 grid-rows-8">
              {board.map((row, r) =>
                row.map((piece, c) => {
                  const isDark = (r + c) % 2 === 1;
                  const isSelected = selectedSquare && selectedSquare[0] === r && selectedSquare[1] === c;
                  const isValidMove = validMoves.some(([vr, vc]) => vr === r && vc === c);

                  return (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => handleSquareClick(r, c)}
                      className={`relative flex items-center justify-center text-3xl sm:text-4xl select-none transition-colors duration-150 ${
                        isDark ? "bg-[#b58863]" : "bg-[#f0d9b5]"
                      } ${isSelected ? "!bg-amber-400/80 ring-2 ring-amber-600 inset-0" : ""} hover:brightness-105`}
                      aria-label={`Square ${COLS[c]}${8 - r}`}
                    >
                      {/* Square Coordinate labels on edges */}
                      {c === 0 && (
                        <span className={`absolute top-0.5 left-1 text-[9px] font-bold ${isDark ? "text-[#f0d9b5]/80" : "text-[#b58863]/80"}`}>
                          {8 - r}
                        </span>
                      )}
                      {r === 7 && (
                        <span className={`absolute bottom-0.5 right-1 text-[9px] font-bold ${isDark ? "text-[#f0d9b5]/80" : "text-[#b58863]/80"}`}>
                          {COLS[c]}
                        </span>
                      )}

                      {/* Valid move indicator dot or capture ring */}
                      {isValidMove && !piece && (
                        <span className="w-3.5 h-3.5 rounded-full bg-emerald-600/60 shadow-sm pointer-events-none" />
                      )}
                      {isValidMove && piece && (
                        <span className="absolute inset-1 rounded-full border-2 border-rose-500/80 bg-rose-500/20 pointer-events-none animate-pulse" />
                      )}

                      {/* The Piece */}
                      {piece && (
                        <span
                          className={`transform transition-transform active:scale-95 ${
                            piece.color === "w"
                              ? "text-slate-50 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] font-bold"
                              : "text-slate-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)] font-bold"
                          }`}
                        >
                          {PIECE_SYMBOLS[piece.color][piece.type]}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* White Captured Bar */}
            <div className="w-full max-w-[440px] flex items-center justify-between px-2 py-1.5 text-xs text-muted-foreground mt-1">
              <span className="font-semibold text-[11px] flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-100 border border-slate-300 inline-block" /> White
              </span>
              <div className="flex gap-1 text-sm">{capturedBlack.map((p, i) => <span key={i}>{PIECE_SYMBOLS.b[p.type]}</span>)}</div>
            </div>
          </div>

          {/* Move Log & Help Card (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="bg-card/50 backdrop-blur border-border/60">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recent Moves</span>
                  <Badge variant="outline" className="text-[10px]">
                    {moveHistory.length} moves
                  </Badge>
                </div>
                <div className="max-h-40 overflow-y-auto font-mono text-xs space-y-1 text-muted-foreground pr-2">
                  {moveHistory.length === 0 ? (
                    <p className="italic text-center py-4">Game just started. Click a white piece to move!</p>
                  ) : (
                    moveHistory.map((m, idx) => (
                      <div key={idx} className="flex justify-between py-0.5 border-b border-border/20">
                        <span>Move #{idx + 1}</span>
                        <span className="font-bold text-foreground">{m}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/60">
              <CardContent className="p-4 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-500" /> Quick Guide
                </h3>
                <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                  <li>Click a piece to reveal green move dots.</li>
                  <li>Click dot or enemy piece to complete move.</li>
                  <li>Pawns reaching opposite end auto-promote to Queen.</li>
                  <li>Toggle <em>vs Computer</em> or <em>Pass & Play</em> at top.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comprehensive SEO Content Section */}
        <section className="pt-8 border-t border-border/60 space-y-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Play Free Chess Online - Master the Board with Strategic Tactics
            </h1>
            <p className="mt-3 text-muted-foreground leading-relaxed text-sm sm:text-base">
              Welcome to <strong>Axevora Chess</strong>, a browser-native implementation of the world’s most celebrated
              strategy game. Whether you are practicing your openings against our computer AI or enjoying a relaxing game
              with a friend on mobile, our chess engine provides smooth piece moves, clear visual move validation, and zero lag.
            </p>
          </div>

          {/* Rules and Piece Movement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/40 border-border/60">
              <CardContent className="p-6 space-y-3">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-500" /> How Pieces Move in Chess
                </h2>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-2.5">
                  <li><strong>King (♔/♚):</strong> Moves exactly 1 square in any direction (horizontal, vertical, or diagonal). Protecting the King is the ultimate goal.</li>
                  <li><strong>Queen (♕/♛):</strong> The most powerful piece. Moves any number of squares along ranks, files, or diagonals.</li>
                  <li><strong>Rook (♖/♜):</strong> Moves any number of squares horizontally or vertically along straight ranks and files.</li>
                  <li><strong>Bishop (♗/♝):</strong> Moves diagonally any number of squares, always staying on squares of its initial color.</li>
                  <li><strong>Knight (♘/♞):</strong> Moves in an "L" pattern (two squares in one direction, one square perpendicular). Only piece that can leap over obstacles.</li>
                  <li><strong>Pawn (♙/♟):</strong> Moves forward one square (or two on its initial move) and captures diagonally forward.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-border/60">
              <CardContent className="p-6 space-y-3">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-500" /> Beginner & Intermediate Strategy Tips
                </h2>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-2.5">
                  <li><strong>Control the Center:</strong> Squares e4, d4, e5, and d5 provide the best vantage points for Knights and Bishops to maximize their board range.</li>
                  <li><strong>Develop Minor Pieces Early:</strong> Move your Knights and Bishops out before moving your Queen into action so you don't lose tempo.</li>
                  <li><strong>King Safety:</strong> Keep your King defended behind solid pawn structures and be cautious of open diagonal checks.</li>
                  <li><strong>Think One Step Ahead:</strong> Before making any move, ask yourself what piece your opponent might attack or capture next.</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* FAQs Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Frequently Asked Questions about Online Chess</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-card/30 border-border/50">
                <CardContent className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground">Is this Chess game free without sign-up?</h3>
                  <p className="text-xs text-muted-foreground">Yes! Axevora Chess is 100% free with no account creation, email signups, or software downloads required.</p>
                </CardContent>
              </Card>

              <Card className="bg-card/30 border-border/50">
                <CardContent className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground">Can I play Chess on my mobile phone?</h3>
                  <p className="text-xs text-muted-foreground">Yes! The chessboard is fully touch-optimized with responsive square scaling for iPhone, Android, and tablets.</p>
                </CardContent>
              </Card>

              <Card className="bg-card/30 border-border/50">
                <CardContent className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground">What happens when a pawn reaches the back rank?</h3>
                  <p className="text-xs text-muted-foreground">In our game, pawns reaching the 8th rank automatically promote into a Queen, giving you an immediate tactical boost.</p>
                </CardContent>
              </Card>

              <Card className="bg-card/30 border-border/50">
                <CardContent className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground">What is the difference between Check and Checkmate?</h3>
                  <p className="text-xs text-muted-foreground">Check means the King is threatened but has legal escape moves. Checkmate means the King is attacked and cannot escape, ending the game.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Games Internal Links */}
          <div className="pt-6 border-t border-border/40">
            <h2 className="text-base font-bold text-foreground mb-3">Explore More Classic & Strategy Games</h2>
            <div className="flex flex-wrap gap-2.5">
              <Link to="/tools/checkers" className="px-3 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border/60 text-xs font-semibold text-foreground hover:text-primary transition-colors">
                Play Checkers →
              </Link>
              <Link to="/tools/ludo" className="px-3 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border/60 text-xs font-semibold text-foreground hover:text-primary transition-colors">
                Play Ludo Online →
              </Link>
              <Link to="/tools/2048-game" className="px-3 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border/60 text-xs font-semibold text-foreground hover:text-primary transition-colors">
                Play 2048 Puzzle →
              </Link>
              <Link to="/tools/sudoku" className="px-3 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border/60 text-xs font-semibold text-foreground hover:text-primary transition-colors">
                Play 9x9 Sudoku →
              </Link>
              <Link to="/games" className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-600 dark:text-emerald-400 transition-colors">
                All 22 Games in Games Hub →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </ToolTemplate>
  );
}
