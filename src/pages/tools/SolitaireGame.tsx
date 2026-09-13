import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import ToolTemplate from "@/components/ToolTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Layers,
  RefreshCw,
  Trophy,
  Undo2,
  Sparkles,
  Shield,
  Zap,
  HelpCircle,
  Play,
  ChevronRight
} from "lucide-react";

type Suit = "♠" | "♥" | "♦" | "♣";
type CardColor = "red" | "black";

interface PlayingCard {
  id: string;
  suit: Suit;
  rank: number; // 1 = Ace, 11 = Jack, 12 = Queen, 13 = King
  color: CardColor;
  faceUp: boolean;
}

const SUITS: { suit: Suit; color: CardColor }[] = [
  { suit: "♠", color: "black" },
  { suit: "♥", color: "red" },
  { suit: "♦", color: "red" },
  { suit: "♣", color: "black" }
];

const RANK_LABELS: Record<number, string> = {
  1: "A",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "10",
  11: "J",
  12: "Q",
  13: "K"
};

export default function SolitaireGame() {
  const [stock, setStock] = useState<PlayingCard[]>([]);
  const [waste, setWaste] = useState<PlayingCard[]>([]);
  const [foundations, setFoundations] = useState<PlayingCard[][]>([[], [], [], []]);
  const [tableau, setTableau] = useState<PlayingCard[][]>([[], [], [], [], [], [], []]);
  const [moves, setMoves] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);

  // Initialize and shuffle full 52 card deck
  const dealNewGame = useCallback(() => {
    const deck: PlayingCard[] = [];
    SUITS.forEach(({ suit, color }) => {
      for (let r = 1; r <= 13; r++) {
        deck.push({
          id: `${suit}-${r}`,
          suit,
          rank: r,
          color,
          faceUp: false
        });
      }
    });

    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    // Deal 7 tableau columns
    const newTableau: PlayingCard[][] = [[], [], [], [], [], [], []];
    let cardIdx = 0;
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row <= col; row++) {
        const card = { ...deck[cardIdx++] };
        if (row === col) card.faceUp = true; // Top card is face-up
        newTableau[col].push(card);
      }
    }

    const remainingStock = deck.slice(cardIdx).map((c) => ({ ...c, faceUp: false }));

    setStock(remainingStock);
    setWaste([]);
    setFoundations([[], [], [], []]);
    setTableau(newTableau);
    setMoves(0);
    setScore(0);
    setTimer(0);
    setIsWon(false);
  }, []);

  useEffect(() => {
    dealNewGame();
  }, [dealNewGame]);

  // Elapsed timer
  useEffect(() => {
    if (isWon) return;
    const interval = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isWon]);

  // Draw card from Stock to Waste
  const handleStockClick = () => {
    if (stock.length > 0) {
      const nextCard = { ...stock[stock.length - 1], faceUp: true };
      setStock((s) => s.slice(0, -1));
      setWaste((w) => [...w, nextCard]);
      setMoves((m) => m + 1);
    } else if (waste.length > 0) {
      // Recycle waste back to stock
      const recycled = [...waste].reverse().map((c) => ({ ...c, faceUp: false }));
      setStock(recycled);
      setWaste([]);
      setMoves((m) => m + 1);
    }
  };

  // Check if card can go to a Foundation pile
  const canMoveToFoundation = (card: PlayingCard, pile: PlayingCard[]) => {
    if (pile.length === 0) return card.rank === 1; // Must be Ace
    const top = pile[pile.length - 1];
    return top.suit === card.suit && top.rank + 1 === card.rank;
  };

  // Check if card can go to a Tableau column
  const canMoveToTableau = (card: PlayingCard, column: PlayingCard[]) => {
    if (column.length === 0) return card.rank === 13; // Only Kings on empty spots
    const top = column[column.length - 1];
    return top.faceUp && top.color !== card.color && top.rank - 1 === card.rank;
  };

  // Tap-to-move card from Waste
  const handleWasteCardClick = () => {
    if (waste.length === 0) return;
    const card = waste[waste.length - 1];

    // Try Foundation first
    for (let i = 0; i < 4; i++) {
      if (canMoveToFoundation(card, foundations[i])) {
        setFoundations((f) => {
          const next = f.map((p) => [...p]);
          next[i].push(card);
          return next;
        });
        setWaste((w) => w.slice(0, -1));
        setScore((s) => s + 10);
        setMoves((m) => m + 1);
        checkWin(foundations, i);
        return;
      }
    }

    // Try Tableau
    for (let c = 0; c < 7; c++) {
      if (canMoveToTableau(card, tableau[c])) {
        setTableau((t) => {
          const next = t.map((col) => [...col]);
          next[c].push(card);
          return next;
        });
        setWaste((w) => w.slice(0, -1));
        setScore((s) => s + 5);
        setMoves((m) => m + 1);
        return;
      }
    }
  };

  // Tap-to-move card from Tableau
  const handleTableauCardClick = (colIdx: number, cardIdx: number) => {
    const col = tableau[colIdx];
    const card = col[cardIdx];
    if (!card.faceUp) {
      // If it's top face down card, reveal it
      if (cardIdx === col.length - 1) {
        setTableau((t) => {
          const next = t.map((c) => [...c]);
          next[colIdx][cardIdx].faceUp = true;
          return next;
        });
        setScore((s) => s + 5);
      }
      return;
    }

    // If it's the top card of tableau, try moving to Foundation
    if (cardIdx === col.length - 1) {
      for (let i = 0; i < 4; i++) {
        if (canMoveToFoundation(card, foundations[i])) {
          setFoundations((f) => {
            const next = f.map((p) => [...p]);
            next[i].push(card);
            return next;
          });
          setTableau((t) => {
            const next = t.map((c) => [...c]);
            next[colIdx].pop();
            // Reveal newly exposed card
            if (next[colIdx].length > 0) {
              next[colIdx][next[colIdx].length - 1].faceUp = true;
            }
            return next;
          });
          setScore((s) => s + 10);
          setMoves((m) => m + 1);
          checkWin(foundations, i);
          return;
        }
      }
    }

    // Try moving sequence of cards to another Tableau column
    const movingCards = col.slice(cardIdx);
    for (let targetCol = 0; targetCol < 7; targetCol++) {
      if (targetCol === colIdx) continue;
      if (canMoveToTableau(card, tableau[targetCol])) {
        setTableau((t) => {
          const next = t.map((c) => [...c]);
          next[colIdx] = next[colIdx].slice(0, cardIdx);
          // Reveal newly exposed card
          if (next[colIdx].length > 0) {
            next[colIdx][next[colIdx].length - 1].faceUp = true;
          }
          next[targetCol].push(...movingCards);
          return next;
        });
        setScore((s) => s + 5);
        setMoves((m) => m + 1);
        return;
      }
    }
  };

  const checkWin = (f: PlayingCard[][], updatedIdx: number) => {
    let totalInFoundations = 0;
    for (let i = 0; i < 4; i++) {
      totalInFoundations += i === updatedIdx ? f[i].length + 1 : f[i].length;
    }
    if (totalInFoundations === 52) {
      setIsWon(true);
    }
  };

  return (
    <ToolTemplate
      title="Play Solitaire Online - Free Klondike Card Game"
      description="Play classic Klondike Solitaire online in your browser. Single-card draw, auto-move tap support, smooth cards layout, and zero downloads needed."
    >
      <Helmet>
        <title>Play Solitaire Online - Free Klondike Card Game | Axevora</title>
        <meta
          name="description"
          content="Play free Klondike Solitaire online on Axevora. Unlimited deals, card move hints, foundation auto-transfer, and responsive mobile touch support."
        />
        <meta
          name="keywords"
          content="solitaire, play solitaire online, free solitaire, solitaire game, klondike solitaire, patience card game, browser solitaire, classic solitaire"
        />
        <link rel="canonical" href="https://axevora.com/tools/solitaire" />
        <meta property="og:title" content="Play Solitaire Online - Free Klondike Card Game | Axevora" />
        <meta
          property="og:description"
          content="Play classic Klondike Solitaire online for free. Clean card design, tap-to-move convenience, and win animations."
        />
        <meta property="og:url" content="https://axevora.com/tools/solitaire" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Play Solitaire Online - Free Klondike Card Game | Axevora" />
        <meta
          name="twitter:description"
          content="Free Klondike Solitaire game with smart tap-to-move and auto-finish detection."
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
                  { "@type": "ListItem", "position": 4, "name": "Solitaire", "item": "https://axevora.com/tools/solitaire" }
                ]
              },
              {
                "@type": "VideoGame",
                "name": "Axevora Klondike Solitaire",
                "description": "Play Klondike Solitaire online in browser. Build 4 foundation suits from Ace to King with alternating colors tableau stacks.",
                "genre": ["Card Game", "Patience", "Classic"],
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
                    "name": "How do you win Klondike Solitaire?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "You win by moving all 52 cards into the four foundation piles, starting with the Ace and building up sequentially to the King in each suit."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What can be placed on an empty Tableau column?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "In traditional Klondike Solitaire, only a King (or a stack starting with a King) can be placed on an empty tableau column."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is Solitaire free on Axevora?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes! Axevora Solitaire is 100% free with unlimited games, no downloads, and smooth mobile touch controls."
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
        <span className="text-foreground font-semibold">Solitaire</span>
      </nav>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-card/60 backdrop-blur p-4 rounded-2xl border border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                Klondike Solitaire
                <Badge variant="outline" className="text-[10px] uppercase font-bold border-blue-500/30 text-blue-600 dark:text-blue-400">
                  Turn 1 Card
                </Badge>
              </h2>
              <p className="text-xs text-muted-foreground">
                Score: <strong className="text-emerald-500 mr-2">{score}</strong>
                Moves: <strong className="text-foreground mr-2">{moves}</strong>
                Time: <strong className="text-foreground">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={dealNewGame}
              className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> New Deal
            </Button>
          </div>
        </div>

        {/* Solitaire Felt Table */}
        <div className="bg-[#0f382a] p-4 sm:p-6 rounded-2xl border-4 border-[#241a15] shadow-2xl space-y-6 select-none">
          {/* Top Row: Stock & Waste (Left) + 4 Foundations (Right) */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {/* Stock Pile */}
            <button
              onClick={handleStockClick}
              className="aspect-[5/7] rounded-lg border-2 border-dashed border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-300 relative transition-transform active:scale-95 bg-emerald-950/40"
            >
              {stock.length > 0 ? (
                <div className="w-full h-full rounded-md bg-blue-900 border border-blue-400 flex items-center justify-center shadow-md">
                  <span className="text-xs text-blue-200">🂠 {stock.length}</span>
                </div>
              ) : (
                <RefreshCw className="w-5 h-5 text-emerald-400/60" />
              )}
            </button>

            {/* Waste Pile */}
            <div
              onClick={handleWasteCardClick}
              className="aspect-[5/7] rounded-lg border-2 border-emerald-500/20 flex items-center justify-center relative cursor-pointer"
            >
              {waste.length > 0 && (
                <div
                  className={`w-full h-full rounded-md bg-white border border-slate-300 shadow-md flex flex-col justify-between p-1 text-sm font-bold ${
                    waste[waste.length - 1].color === "red" ? "text-rose-600" : "text-slate-900"
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span>{RANK_LABELS[waste[waste.length - 1].rank]}</span>
                    <span>{waste[waste.length - 1].suit}</span>
                  </div>
                  <div className="text-center text-xl">{waste[waste.length - 1].suit}</div>
                  <div className="flex justify-between items-center text-xs rotate-180">
                    <span>{RANK_LABELS[waste[waste.length - 1].rank]}</span>
                    <span>{waste[waste.length - 1].suit}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Gap Column */}
            <div className="hidden sm:block" />

            {/* 4 Foundations */}
            {foundations.map((pile, fIdx) => (
              <div
                key={fIdx}
                className="aspect-[5/7] rounded-lg border-2 border-dashed border-emerald-400/30 flex items-center justify-center relative bg-emerald-950/30"
              >
                {pile.length === 0 ? (
                  <span className="text-emerald-500/40 text-lg font-bold">A</span>
                ) : (
                  <div
                    className={`w-full h-full rounded-md bg-white border border-slate-300 shadow-md flex flex-col justify-between p-1 text-sm font-bold ${
                      pile[pile.length - 1].color === "red" ? "text-rose-600" : "text-slate-900"
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span>{RANK_LABELS[pile[pile.length - 1].rank]}</span>
                      <span>{pile[pile.length - 1].suit}</span>
                    </div>
                    <div className="text-center text-xl">{pile[pile.length - 1].suit}</div>
                    <div className="flex justify-between items-center text-xs rotate-180">
                      <span>{RANK_LABELS[pile[pile.length - 1].rank]}</span>
                      <span>{pile[pile.length - 1].suit}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Row: 7 Tableau Columns */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3 min-h-[340px]">
            {tableau.map((col, colIdx) => (
              <div
                key={colIdx}
                className="relative min-h-[220px] rounded-lg border border-dashed border-emerald-500/10 flex flex-col"
              >
                {col.length === 0 ? (
                  <div className="w-full aspect-[5/7] rounded-lg border-2 border-dashed border-emerald-500/20 flex items-center justify-center text-emerald-500/30 text-xs font-bold">
                    K
                  </div>
                ) : (
                  col.map((card, cardIdx) => (
                    <div
                      key={card.id}
                      onClick={() => handleTableauCardClick(colIdx, cardIdx)}
                      style={{ top: `${cardIdx * 20}px` }}
                      className={`absolute w-full aspect-[5/7] rounded-md transition-transform cursor-pointer shadow-md ${
                        card.faceUp
                          ? "bg-white border border-slate-300 p-1 flex flex-col justify-between"
                          : "bg-blue-900 border-2 border-blue-400 flex items-center justify-center text-blue-200 text-xs font-bold"
                      } ${card.color === "red" ? "text-rose-600" : "text-slate-900"}`}
                    >
                      {card.faceUp ? (
                        <>
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span>{RANK_LABELS[card.rank]}</span>
                            <span>{card.suit}</span>
                          </div>
                          <div className="text-center text-lg">{card.suit}</div>
                          <div className="flex justify-between items-center text-xs font-bold rotate-180">
                            <span>{RANK_LABELS[card.rank]}</span>
                            <span>{card.suit}</span>
                          </div>
                        </>
                      ) : (
                        <span>🂠</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Win Modal Banner */}
        {isWon && (
          <Card className="bg-emerald-500/20 border-emerald-500/40 p-6 text-center space-y-3 animate-in zoom-in">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto" />
            <h3 className="text-2xl font-extrabold text-foreground">You Won Solitaire!</h3>
            <p className="text-sm text-muted-foreground">
              All 52 cards have been placed on their foundations in {moves} moves!
            </p>
            <Button onClick={dealNewGame} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
              Play Another Game
            </Button>
          </Card>
        )}

        {/* Comprehensive SEO Content Section */}
        <section className="pt-8 border-t border-border/60 space-y-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Play Free Klondike Solitaire Online - Classic Patience Card Game
            </h1>
            <p className="mt-3 text-muted-foreground leading-relaxed text-sm sm:text-base">
              <strong>Axevora Solitaire</strong> is a beautifully rendered, ad-light digital rendition of traditional
              Klondike Solitaire. Built for players who value clean aesthetics, intuitive tap-to-move card controls, and
              instant in-browser loading, this game requires zero downloads or logins.
            </p>
          </div>

          {/* Rules and Strategy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/40 border-border/60">
              <CardContent className="p-6 space-y-3">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" /> Essential Klondike Solitaire Rules
                </h2>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-2.5">
                  <li><strong>The Tableau:</strong> Seven columns where cards are built downwards in descending rank with alternating red and black suits (e.g., Red 7 onto Black 8).</li>
                  <li><strong>The Foundations:</strong> Four target piles at the top, built upwards from Ace to King matching the same suit.</li>
                  <li><strong>The Stock & Waste:</strong> Draw unplayed cards from the stock pile to find helpful moves. When empty, reset the pile to cycle through.</li>
                  <li><strong>Empty Columns:</strong> Only a King (or a sequence headed by a King) can fill an empty space in the tableau.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-border/60">
              <CardContent className="p-6 space-y-3">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-500" /> Solitaire Pro Tips & Strategy
                </h2>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-2.5">
                  <li><strong>Prioritize Face-Down Cards:</strong> Always move cards that reveal face-down cards in the tableau before drawing from the stock pile.</li>
                  <li><strong>Don’t Empty Columns Prematurely:</strong> An empty column is useless unless you have a King ready to occupy it.</li>
                  <li><strong>Balance Foundations:</strong> Avoid rushing cards into the foundation if you might need them later in the tableau to build lower sequences.</li>
                  <li><strong>Use Tap-to-Move:</strong> Simply tap any movable card, and our game will automatically place it on the best legal foundation or column.</li>
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
                  <h3 className="text-sm font-bold text-foreground">Is all Solitaire games winnable?</h3>
                  <p className="text-xs text-muted-foreground">About 80% of standard Klondike Solitaire deals are theoretically solvable, though player choices impact the outcome.</p>
                </CardContent>
              </Card>

              <Card className="bg-card/30 border-border/50">
                <CardContent className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground">How does tap-to-move work?</h3>
                  <p className="text-xs text-muted-foreground">Tap any face-up card and the engine automatically detects if a valid foundation or tableau slot exists, saving you tedious dragging.</p>
                </CardContent>
              </Card>

              <Card className="bg-card/30 border-border/50">
                <CardContent className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground">Can I play Solitaire offline or on mobile?</h3>
                  <p className="text-xs text-muted-foreground">Yes! Axevora Solitaire is client-side lightweight JavaScript that runs fast on mobile phones and tablets.</p>
                </CardContent>
              </Card>

              <Card className="bg-card/30 border-border/50">
                <CardContent className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground">What is the difference between Klondike and Spider Solitaire?</h3>
                  <p className="text-xs text-muted-foreground">Klondike uses 1 deck with 4 suit foundations, while Spider Solitaire uses 2 decks with 10 tableau columns and suit sequence builds.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Games Internal Links */}
          <div className="pt-6 border-t border-border/40">
            <h2 className="text-base font-bold text-foreground mb-3">Related Card & Classic Games</h2>
            <div className="flex flex-wrap gap-2.5">
              <Link to="/tools/spades" className="px-3 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border/60 text-xs font-semibold text-foreground hover:text-primary transition-colors">
                Play Spades Card Game →
              </Link>
              <Link to="/tools/chess" className="px-3 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border/60 text-xs font-semibold text-foreground hover:text-primary transition-colors">
                Play Chess Online →
              </Link>
              <Link to="/tools/ludo" className="px-3 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border/60 text-xs font-semibold text-foreground hover:text-primary transition-colors">
                Play Ludo Board Game →
              </Link>
              <Link to="/tools/memory-match-game" className="px-3 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border/60 text-xs font-semibold text-foreground hover:text-primary transition-colors">
                Play Memory Match →
              </Link>
              <Link to="/games" className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-xs font-bold text-blue-600 dark:text-blue-400 transition-colors">
                All 22 Games in Games Hub →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </ToolTemplate>
  );
}
