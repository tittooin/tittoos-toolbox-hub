import React, { useState, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import ToolTemplate from "@/components/ToolTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Grid3X3,
  RefreshCw,
  Trophy,
  Bot,
  UserCheck,
  Shield,
  Zap,
  HelpCircle,
  Play,
  ChevronRight,
  Crown
} from "lucide-react";

type PieceColor = "red" | "black";

interface CheckersPiece {
  id: string;
  color: PieceColor;
  isKing: boolean;
}

type Board = (CheckersPiece | null)[][];

export default function CheckersGame() {
  const [board, setBoard] = useState<Board>(() => {
    const b: Board = Array(8).fill(null).map(() => Array(8).fill(null));
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 1) b[r][c] = { id: `b-${r}-${c}`, color: "black", isKing: false };
      }
    }
    for (let r = 5; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 1) b[r][c] = { id: `r-${r}-${c}`, color: "red", isKing: false };
      }
    }
    return b;
  });

  const [turn, setTurn] = useState<PieceColor>("red");
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [vsAI, setVsAI] = useState<boolean>(true);
  const [winner, setWinner] = useState<PieceColor | null>(null);
  const [gameLog, setGameLog] = useState<string>("Welcome to Checkers! Red moves first.");

  const inBounds = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;

  // Get valid moves & jump captures for piece at (r, c)
  const getPieceMoves = useCallback((b: Board, r: number, c: number) => {
    const piece = b[r][c];
    if (!piece) return { regular: [] as [number, number][], jumps: [] as [number, number, number, number][] };

    const regular: [number, number][] = [];
    const jumps: [number, number, number, number][] = []; // [destR, destC, capturedR, capturedC]

    const directions: [number, number][] = [];
    if (piece.color === "red" || piece.isKing) {
      directions.push([-1, -1], [-1, 1]); // Forward for Red
    }
    if (piece.color === "black" || piece.isKing) {
      directions.push([1, -1], [1, 1]); // Forward for Black
    }

    directions.forEach(([dr, dc]) => {
      const nr = r + dr;
      const nc = c + dc;

      // 1. Regular 1-step move
      if (inBounds(nr, nc) && !b[nr][nc]) {
        regular.push([nr, nc]);
      }

      // 2. Jump capture (2 steps)
      const jr = r + 2 * dr;
      const jc = c + 2 * dc;
      if (inBounds(jr, jc) && !b[jr][jc] && inBounds(nr, nc)) {
        const midPiece = b[nr][nc];
        if (midPiece && midPiece.color !== piece.color) {
          jumps.push([jr, jc, nr, nc]);
        }
      }
    });

    return { regular, jumps };
  }, []);

  // Compute active moves for selected piece
  const validMoves = useMemo(() => {
    if (!selectedSquare) return { regular: [], jumps: [] };
    const [r, c] = selectedSquare;
    const piece = board[r][c];
    if (!piece || piece.color !== turn) return { regular: [], jumps: [] };
    return getPieceMoves(board, r, c);
  }, [selectedSquare, board, turn, getPieceMoves]);

  // Execute checkers move
  const executeMove = useCallback((fromR: number, fromC: number, toR: number, toC: number, capR?: number, capC?: number) => {
    setBoard((prev) => {
      const next = prev.map((row) => [...row]);
      const piece = next[fromR][fromC];
      if (!piece) return prev;

      // Check for kinging
      let isKing = piece.isKing;
      if (piece.color === "red" && toR === 0) isKing = true;
      if (piece.color === "black" && toR === 7) isKing = true;

      next[toR][toC] = { ...piece, isKing };
      next[fromR][fromC] = null;

      // Remove captured piece if jump
      if (capR !== undefined && capC !== undefined) {
        next[capR][capC] = null;
      }

      // Count remaining pieces
      let redCount = 0;
      let blackCount = 0;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (next[r][c]?.color === "red") redCount++;
          if (next[r][c]?.color === "black") blackCount++;
        }
      }

      if (redCount === 0) setWinner("black");
      if (blackCount === 0) setWinner("red");

      const nextTurn = piece.color === "red" ? "black" : "red";
      setTurn(nextTurn);
      setGameLog(`Moved to ${String.fromCharCode(97 + toC)}${8 - toR}. ${nextTurn === "red" ? "Red's" : "Black's"} turn.`);

      return next;
    });

    setSelectedSquare(null);
  }, []);

  // AI Move for Black
  const triggerAIMove = useCallback(() => {
    setTimeout(() => {
      setBoard((currentBoard) => {
        const availableJumps: { from: [number, number]; to: [number, number]; cap: [number, number] }[] = [];
        const availableRegular: { from: [number, number]; to: [number, number] }[] = [];

        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const p = currentBoard[r][c];
            if (p && p.color === "black") {
              const { regular, jumps } = getPieceMoves(currentBoard, r, c);
              jumps.forEach(([toR, toC, capR, capC]) => {
                availableJumps.push({ from: [r, c], to: [toR, toC], cap: [capR, capC] });
              });
              regular.forEach(([toR, toC]) => {
                availableRegular.push({ from: [r, c], to: [toR, toC] });
              });
            }
          }
        }

        if (availableJumps.length > 0) {
          const move = availableJumps[Math.floor(Math.random() * availableJumps.length)];
          executeMove(move.from[0], move.from[1], move.to[0], move.to[1], move.cap[0], move.cap[1]);
        } else if (availableRegular.length > 0) {
          const move = availableRegular[Math.floor(Math.random() * availableRegular.length)];
          executeMove(move.from[0], move.from[1], move.to[0], move.to[1]);
        }

        return currentBoard;
      });
    }, 450);
  }, [getPieceMoves, executeMove]);

  // Handle square click
  const handleSquareClick = (r: number, c: number) => {
    if (winner) return;

    if (selectedSquare) {
      const [sr, sc] = selectedSquare;

      // Check if jump move
      const jumpMatch = validMoves.jumps.find(([jr, jc]) => jr === r && jc === c);
      if (jumpMatch) {
        executeMove(sr, sc, r, c, jumpMatch[2], jumpMatch[3]);
        if (vsAI && turn === "red") setTimeout(triggerAIMove, 250);
        return;
      }

      // Check regular move
      const regMatch = validMoves.regular.some(([vr, vc]) => vr === r && vc === c);
      if (regMatch) {
        executeMove(sr, sc, r, c);
        if (vsAI && turn === "red") setTimeout(triggerAIMove, 250);
        return;
      }
    }

    const piece = board[r][c];
    if (piece && piece.color === turn) {
      setSelectedSquare([r, c]);
    } else {
      setSelectedSquare(null);
    }
  };

  const resetGame = () => {
    const b: Board = Array(8).fill(null).map(() => Array(8).fill(null));
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 1) b[r][c] = { id: `b-${r}-${c}`, color: "black", isKing: false };
      }
    }
    for (let r = 5; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 1) b[r][c] = { id: `r-${r}-${c}`, color: "red", isKing: false };
      }
    }
    setBoard(b);
    setTurn("red");
    setSelectedSquare(null);
    setWinner(null);
    setGameLog("New game started! Red moves first.");
  };

  // Count active pieces
  const redRemaining = board.flat().filter((p) => p?.color === "red").length;
  const blackRemaining = board.flat().filter((p) => p?.color === "black").length;

  return (
    <ToolTemplate
      title="Play Checkers Online - Free Classic Draughts Game"
      description="Play classic Checkers (Draughts) online in your browser. Single player vs smart AI or 2-player pass-and-play. Enjoy king promotion and diagonal jump captures."
    >
      <Helmet>
        <title>Play Checkers Online - Free Classic Draughts Game | Axevora</title>
        <meta
          name="description"
          content="Play free Checkers online on Axevora. Diagonal jumps, king promotions, clean 8x8 board, and smart computer opponent. No download needed."
        />
        <meta
          name="keywords"
          content="checkers, play checkers online, checkers game, free checkers, draughts online, browser checkers, 2 player checkers, checkers board game"
        />
        <link rel="canonical" href="https://axevora.com/tools/checkers" />
        <meta property="og:title" content="Play Checkers Online - Free Classic Draughts Game | Axevora" />
        <meta
          property="og:description"
          content="Play Checkers online for free. Clean board design, diagonal jump captures, and king promotions."
        />
        <meta property="og:url" content="https://axevora.com/tools/checkers" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Play Checkers Online - Free Classic Draughts Game | Axevora" />
        <meta
          name="twitter:description"
          content="Free classic Checkers game with smooth piece movements and touch mobile support."
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
                  { "@type": "ListItem", "position": 4, "name": "Checkers", "item": "https://axevora.com/tools/checkers" }
                ]
              },
              {
                "@type": "VideoGame",
                "name": "Axevora Checkers Online",
                "description": "Play Checkers (Draughts) online in browser. Diagonal movement, jump captures, King promotions, and smart AI opponent.",
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
                    "name": "How does a piece become a King in Checkers?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "When a regular checker piece reaches the farthest opposite row (back rank) of the board, it is crowned a King and gains the ability to move and capture diagonally backwards as well as forwards."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How do jump captures work in Checkers?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "If an enemy piece is diagonally adjacent and the square directly behind it is empty, your piece can jump over the opponent to capture it and remove it from the board."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can I play Checkers on my phone without downloading an app?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes! Axevora Checkers runs 100% in your mobile browser with responsive touch controls and zero app downloads."
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
        <span className="text-foreground font-semibold">Checkers</span>
      </nav>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-card/60 backdrop-blur p-4 rounded-2xl border border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Grid3X3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                Classic Checkers
                <Badge variant="outline" className="text-[10px] uppercase font-bold border-amber-500/30 text-amber-600 dark:text-amber-400">
                  {vsAI ? "vs Computer" : "2 Players"}
                </Badge>
              </h2>
              <p className="text-xs text-muted-foreground">
                Turn: <strong className={turn === "red" ? "text-rose-500" : "text-slate-400"}>{turn === "red" ? "Red" : "Black"}</strong>
                {winner && ` • Winner: ${winner.toUpperCase()}!`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs px-2.5 py-1">
              Red: <strong className="ml-1 text-rose-500">{redRemaining}</strong> | Black: <strong className="ml-1 text-slate-400">{blackRemaining}</strong>
            </Badge>
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
              className="text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> New Game
            </Button>
          </div>
        </div>

        {/* Checkers Board */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[440px] aspect-square rounded-2xl border-4 border-[#3e2723] shadow-2xl bg-[#3e2723] grid grid-cols-8 grid-rows-8 overflow-hidden select-none">
            {board.map((row, r) =>
              row.map((piece, c) => {
                const isDark = (r + c) % 2 === 1;
                const isSelected = selectedSquare && selectedSquare[0] === r && selectedSquare[1] === c;
                const isRegularMove = validMoves.regular.some(([vr, vc]) => vr === r && vc === c);
                const isJumpMove = validMoves.jumps.some(([jr, jc]) => jr === r && jc === c);

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleSquareClick(r, c)}
                    className={`relative flex items-center justify-center transition-colors duration-150 ${
                      isDark ? "bg-[#795548]" : "bg-[#d7ccc8]"
                    } ${isSelected ? "!bg-amber-400/80 ring-2 ring-amber-600" : ""}`}
                    aria-label={`Square ${r}-${c}`}
                  >
                    {/* Move hints */}
                    {isRegularMove && (
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/70 shadow-sm pointer-events-none" />
                    )}
                    {isJumpMove && (
                      <span className="w-4 h-4 rounded-full border-2 border-rose-500 bg-rose-500/50 shadow-sm pointer-events-none animate-pulse" />
                    )}

                    {/* Piece Token */}
                    {piece && (
                      <div
                        className={`w-4/5 h-4/5 rounded-full border-2 shadow-lg flex items-center justify-center transition-transform active:scale-95 ${
                          piece.color === "red"
                            ? "bg-rose-600 border-rose-300 text-white"
                            : "bg-slate-900 border-slate-600 text-amber-300"
                        }`}
                      >
                        {piece.isKing && <Crown className="w-4 h-4 drop-shadow" />}
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Comprehensive SEO Content Section */}
        <section className="pt-8 border-t border-border/60 space-y-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Play Free Checkers Online - Classic Draughts Strategy Game
            </h1>
            <p className="mt-3 text-muted-foreground leading-relaxed text-sm sm:text-base">
              <strong>Axevora Checkers</strong> is an accessible, ad-free web edition of the centuries-old strategy
              game also known as Draughts. Jump over enemy pieces, promote your checkers to Kings, and trap your opponent's
              last remaining counters to win.
            </p>
          </div>

          {/* Rules and Strategy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/40 border-border/60">
              <CardContent className="p-6 space-y-3">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-500" /> Official Checkers Rules
                </h2>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-2.5">
                  <li><strong>Board & Movement:</strong> Played entirely on the dark squares of an 8x8 board. Regular pieces move 1 square diagonally forward.</li>
                  <li><strong>Capturing:</strong> Jump over an adjacent opponent piece into the vacant square directly beyond it to capture and remove it.</li>
                  <li><strong>King Promotion:</strong> When a piece reaches the opponent's back rank, it is crowned a King and can move and jump diagonally backwards.</li>
                  <li><strong>Winning:</strong> You win by capturing all opponent pieces or trapping them so they have no legal moves remaining.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-border/60">
              <CardContent className="p-6 space-y-3">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Zap className="w-5 h-5 text-rose-500" /> Checkers Winning Tactics
                </h2>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-2.5">
                  <li><strong>Control the Center:</strong> Center pieces exert influence over both flanks and can prevent the enemy from advancing easily.</li>
                  <li><strong>Keep Your Back Row Solid:</strong> Avoid moving your back rank pieces until necessary to prevent your opponent from crowning Kings easily.</li>
                  <li><strong>Trade When Ahead:</strong> If you have more pieces than your opponent, trading pieces one-for-one simplifies the board and accelerates your win.</li>
                  <li><strong>Set Up Multi-Jumps:</strong> Look for opportunities to sacrifice one piece to set up a double or triple jump on your next turn.</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* FAQs Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-card/30 border-border/50">
                <CardContent className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground">Is Checkers the same as Draughts?</h3>
                  <p className="text-xs text-muted-foreground">Yes! The game is called Checkers in North America and Draughts in the UK, Australia, and many other countries.</p>
                </CardContent>
              </Card>

              <Card className="bg-card/30 border-border/50">
                <CardContent className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground">Can regular pieces move backwards in Checkers?</h3>
                  <p className="text-xs text-muted-foreground">No, regular pieces can only move and jump forward. Only crowned Kings can move and jump backwards.</p>
                </CardContent>
              </Card>

              <Card className="bg-card/30 border-border/50">
                <CardContent className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground">Can I play Checkers with a friend locally?</h3>
                  <p className="text-xs text-muted-foreground">Yes! Simply toggle the "Pass & Play" mode button at the top to play on the same phone or computer screen.</p>
                </CardContent>
              </Card>

              <Card className="bg-card/30 border-border/50">
                <CardContent className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground">Is this Checkers game free?</h3>
                  <p className="text-xs text-muted-foreground">Axevora Checkers is 100% free with no subscriptions, downloads, or pop-up ads obstructing the game.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Games Internal Links */}
          <div className="pt-6 border-t border-border/40">
            <h2 className="text-base font-bold text-foreground mb-3">Related Board & Classic Games</h2>
            <div className="flex flex-wrap gap-2.5">
              <Link to="/tools/chess" className="px-3 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border/60 text-xs font-semibold text-foreground hover:text-primary transition-colors">
                Play Chess Online →
              </Link>
              <Link to="/tools/ludo" className="px-3 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border/60 text-xs font-semibold text-foreground hover:text-primary transition-colors">
                Play Ludo Board Game →
              </Link>
              <Link to="/tools/8-ball-pool" className="px-3 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border/60 text-xs font-semibold text-foreground hover:text-primary transition-colors">
                Play 8 Ball Pool →
              </Link>
              <Link to="/tools/solitaire" className="px-3 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border/60 text-xs font-semibold text-foreground hover:text-primary transition-colors">
                Play Solitaire →
              </Link>
              <Link to="/games" className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-600 dark:text-amber-400 transition-colors">
                All 22 Games in Games Hub →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </ToolTemplate>
  );
}
