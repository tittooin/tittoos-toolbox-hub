import React, { useState, useEffect, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import ToolTemplate from "@/components/ToolTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Dices,
  RefreshCw,
  Trophy,
  Bot,
  UserCheck,
  Shield,
  Zap,
  HelpCircle,
  Play,
  ChevronRight,
  Sparkles
} from "lucide-react";

type PlayerColor = "red" | "green" | "yellow" | "blue";

interface Token {
  id: number;
  color: PlayerColor;
  step: number; // -1: in yard, 0..51: on common track, 52..57: home column & center
}

const PLAYERS: PlayerColor[] = ["red", "green", "yellow", "blue"];

const COLOR_STYLES: Record<PlayerColor, { name: string; bg: string; text: string; border: string; tokenBg: string }> = {
  red: { name: "Red", bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", border: "border-rose-500/30", tokenBg: "bg-rose-600" },
  green: { name: "Green", bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/30", tokenBg: "bg-emerald-600" },
  yellow: { name: "Yellow", bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/30", tokenBg: "bg-amber-500" },
  blue: { name: "Blue", bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/30", tokenBg: "bg-blue-600" }
};

const START_OFFSETS: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39
};

const SAFE_STEPS = [0, 8, 13, 21, 26, 34, 39, 47];

export default function LudoGame() {
  const [tokens, setTokens] = useState<Token[]>(() => {
    const list: Token[] = [];
    let id = 0;
    PLAYERS.forEach((c) => {
      for (let i = 0; i < 4; i++) {
        list.push({ id: id++, color: c, step: -1 });
      }
    });
    return list;
  });

  const [currentTurn, setCurrentTurn] = useState<PlayerColor>("red");
  const [diceValue, setDiceValue] = useState<number>(6);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [hasRolled, setHasRolled] = useState<boolean>(false);
  const [vsAI, setVsAI] = useState<boolean>(true);
  const [winner, setWinner] = useState<PlayerColor | null>(null);
  const [gameLog, setGameLog] = useState<string>("Welcome to Ludo! Roll the dice to start.");

  // Check if player has any movable tokens for current dice value
  const getMovableTokens = useCallback(
    (color: PlayerColor, dice: number) => {
      return tokens.filter((t) => {
        if (t.color !== color) return false;
        if (t.step === 57) return false; // Already reached home
        if (t.step === -1) return dice === 6; // Needs 6 to exit yard
        if (t.step + dice > 57) return false; // Must land exactly or within bounds
        return true;
      });
    },
    [tokens]
  );

  // Switch turn to next player
  const nextTurn = useCallback(() => {
    setCurrentTurn((prev) => {
      const idx = PLAYERS.indexOf(prev);
      const nextP = PLAYERS[(idx + 1) % PLAYERS.length];
      return nextP;
    });
    setHasRolled(false);
  }, []);

  // Roll dice action
  const rollDice = () => {
    if (isRolling || hasRolled || winner) return;

    setIsRolling(true);
    let count = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 6) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalRoll);
        setIsRolling(false);
        setHasRolled(true);

        const movable = getMovableTokens(currentTurn, finalRoll);

        if (movable.length === 0) {
          setGameLog(`${COLOR_STYLES[currentTurn].name} rolled a ${finalRoll}. No valid moves!`);
          setTimeout(nextTurn, 900);
        } else if (movable.length === 1) {
          setGameLog(`${COLOR_STYLES[currentTurn].name} rolled a ${finalRoll}. Auto-moving token!`);
          setTimeout(() => handleTokenMove(movable[0]), 400);
        } else {
          setGameLog(`${COLOR_STYLES[currentTurn].name} rolled a ${finalRoll}. Click a token to move!`);
        }
      }
    }, 60);
  };

  // Move token
  const handleTokenMove = (token: Token) => {
    if (!hasRolled || token.color !== currentTurn || winner) return;

    setTokens((prev) => {
      const next = prev.map((t) => ({ ...t }));
      const target = next.find((t) => t.id === token.id);
      if (!target) return prev;

      if (target.step === -1) {
        if (diceValue === 6) {
          target.step = 0; // Enter board
        } else {
          return prev;
        }
      } else {
        if (target.step + diceValue <= 57) {
          target.step += diceValue;
        } else {
          return prev;
        }
      }

      // Check capture on common track (0 to 51)
      if (target.step >= 0 && target.step <= 51) {
        const targetAbsPos = (START_OFFSETS[target.color] + target.step) % 52;
        const isSafe = SAFE_STEPS.includes(target.step);

        if (!isSafe) {
          next.forEach((other) => {
            if (other.id !== target.id && other.color !== target.color && other.step >= 0 && other.step <= 51) {
              const otherAbsPos = (START_OFFSETS[other.color] + other.step) % 52;
              if (otherAbsPos === targetAbsPos) {
                other.step = -1; // Captured! Send back to yard
                setGameLog(`Captured! ${COLOR_STYLES[target.color].name} sent ${COLOR_STYLES[other.color].name}'s token back to the yard!`);
              }
            }
          });
        }
      }

      // Check win condition (all 4 tokens at step 57)
      const playerTokens = next.filter((t) => t.color === target.color);
      if (playerTokens.every((t) => t.step === 57)) {
        setWinner(target.color);
        setGameLog(`🏆 Congratulations! ${COLOR_STYLES[target.color].name} has won the Ludo championship!`);
      }

      return next;
    });

    // If rolled a 6, player gets another turn, otherwise next player
    if (diceValue === 6) {
      setHasRolled(false);
      setGameLog(`${COLOR_STYLES[currentTurn].name} rolled a 6! Roll again!`);
    } else {
      nextTurn();
    }
  };

  // AI Turn handler
  useEffect(() => {
    if (!vsAI || currentTurn === "red" || winner) return;

    // Trigger AI roll
    const timer = setTimeout(() => {
      if (!hasRolled && !isRolling) {
        rollDice();
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [vsAI, currentTurn, hasRolled, isRolling, winner]);

  const resetGame = () => {
    const list: Token[] = [];
    let id = 0;
    PLAYERS.forEach((c) => {
      for (let i = 0; i < 4; i++) {
        list.push({ id: id++, color: c, step: -1 });
      }
    });
    setTokens(list);
    setCurrentTurn("red");
    setDiceValue(6);
    setIsRolling(false);
    setHasRolled(false);
    setWinner(null);
    setGameLog("New game started! Red player, roll the dice.");
  };

  return (
    <ToolTemplate
      title="Play Ludo Online - Free Classic Board Game"
      description="Play authentic Ludo board game online for free. Roll the dice, move your 4 tokens safely around the track, capture opponent pieces, and reach home."
    >
      <Helmet>
        <title>Play Ludo Online - Free Classic Board Game | Axevora</title>
        <meta
          name="description"
          content="Play Ludo online for free on Axevora. Play against smart computer AI bots or local friends. Authentic dice roll, token capturing, and home triangle progression."
        />
        <meta
          name="keywords"
          content="ludo, play ludo online, ludo game, ludo online free, browser ludo, parchisi, ludo board game, play ludo with friends"
        />
        <link rel="canonical" href="https://axevora.com/tools/ludo" />
        <meta property="og:title" content="Play Ludo Online - Free Classic Board Game | Axevora" />
        <meta
          property="og:description"
          content="Roll the dice and race your tokens home in classic Ludo. Single player vs AI or pass-and-play."
        />
        <meta property="og:url" content="https://axevora.com/tools/ludo" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Play Ludo Online - Free Classic Board Game | Axevora" />
        <meta
          name="twitter:description"
          content="Free browser Ludo game with authentic rules, dice physics, and mobile touch controls."
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
                  { "@type": "ListItem", "position": 4, "name": "Ludo", "item": "https://axevora.com/tools/ludo" }
                ]
              },
              {
                "@type": "VideoGame",
                "name": "Axevora Ludo Online",
                "description": "Authentic Ludo board game online. Race 4 tokens around the board, capture enemy pawns, roll 6s for bonus turns, and reach home.",
                "genre": ["Board Game", "Family", "Classic"],
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
                    "name": "What number is needed to release a token in Ludo?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "In Ludo, a player must roll a 6 on the die to release a token from the yard onto the starting track square."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What are safe squares in Ludo?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Safe squares (often marked with a star or colored base) prevent tokens from being captured. Opponent tokens sharing a safe square can coexist without sending anyone back."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can I play Ludo on my mobile browser?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes! The Ludo board is built with responsive grid layouts that adapt seamlessly to iPhones, Android devices, and tablets with simple touch taps."
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
        <span className="text-foreground font-semibold">Ludo</span>
      </nav>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-card/60 backdrop-blur p-4 rounded-2xl border border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Dices className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                Classic Ludo Board
                <Badge variant="outline" className={`text-[10px] uppercase font-bold ${COLOR_STYLES[currentTurn].border} ${COLOR_STYLES[currentTurn].text}`}>
                  Current Turn: {COLOR_STYLES[currentTurn].name}
                </Badge>
              </h2>
              <p className="text-xs text-muted-foreground">{gameLog}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVsAI(!vsAI)}
              className="text-xs font-semibold"
            >
              {vsAI ? <Bot className="w-3.5 h-3.5 mr-1.5" /> : <UserCheck className="w-3.5 h-3.5 mr-1.5" />}
              {vsAI ? "vs Computer" : "Pass & Play"}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={resetGame}
              className="text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> New Game
            </Button>
          </div>
        </div>

        {/* Ludo Board & Interactive Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Visual Board Display (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col items-center">
            <div className="w-full max-w-[420px] aspect-square rounded-2xl border-4 border-slate-950/60 shadow-2xl bg-card p-2 grid grid-cols-3 grid-rows-3 gap-1 relative">
              {/* Red Yard (Top Left) */}
              <div className="rounded-xl bg-rose-600/20 border-2 border-rose-500/40 p-2 flex flex-col items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-rose-500">Red Yard</span>
                <div className="grid grid-cols-2 gap-2">
                  {tokens.filter((t) => t.color === "red" && t.step === -1).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleTokenMove(t)}
                      className={`w-6 h-6 rounded-full bg-rose-600 border-2 border-white shadow-md flex items-center justify-center text-[10px] text-white font-bold transition-transform ${
                        currentTurn === "red" && hasRolled && diceValue === 6 ? "animate-bounce ring-2 ring-rose-400" : ""
                      }`}
                    >
                      ●
                    </button>
                  ))}
                </div>
                <span className="text-[9px] text-muted-foreground">Home: {tokens.filter((t) => t.color === "red" && t.step === 57).length}/4</span>
              </div>

              {/* Top Track (Green Home Column) */}
              <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-border/40 text-center">
                <span className="text-[10px] font-bold text-muted-foreground">Track</span>
                <div className="flex flex-wrap gap-1 items-center justify-center mt-1">
                  {tokens.filter((t) => t.step >= 0 && t.step < 57 && (t.color === "red" || t.color === "green")).slice(0, 4).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleTokenMove(t)}
                      className={`w-5 h-5 rounded-full ${COLOR_STYLES[t.color].tokenBg} border border-white text-[8px] text-white font-bold flex items-center justify-center`}
                    >
                      {t.step}
                    </button>
                  ))}
                </div>
              </div>

              {/* Green Yard (Top Right) */}
              <div className="rounded-xl bg-emerald-600/20 border-2 border-emerald-500/40 p-2 flex flex-col items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-emerald-500">Green Yard</span>
                <div className="grid grid-cols-2 gap-2">
                  {tokens.filter((t) => t.color === "green" && t.step === -1).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleTokenMove(t)}
                      className={`w-6 h-6 rounded-full bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-[10px] text-white font-bold transition-transform ${
                        currentTurn === "green" && hasRolled && diceValue === 6 ? "animate-bounce ring-2 ring-emerald-400" : ""
                      }`}
                    >
                      ●
                    </button>
                  ))}
                </div>
                <span className="text-[9px] text-muted-foreground">Home: {tokens.filter((t) => t.color === "green" && t.step === 57).length}/4</span>
              </div>

              {/* Left Track */}
              <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-border/40 text-center">
                <span className="text-[10px] font-bold text-muted-foreground">West Track</span>
              </div>

              {/* Center Home Triangle */}
              <div className="rounded-xl bg-gradient-to-br from-rose-500 via-amber-500 to-blue-500 p-2 flex flex-col items-center justify-center text-white shadow-inner">
                <Trophy className="w-8 h-8 text-yellow-300 drop-shadow animate-pulse" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider">HOME</span>
              </div>

              {/* Right Track */}
              <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-border/40 text-center">
                <span className="text-[10px] font-bold text-muted-foreground">East Track</span>
              </div>

              {/* Blue Yard (Bottom Left) */}
              <div className="rounded-xl bg-blue-600/20 border-2 border-blue-500/40 p-2 flex flex-col items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-blue-500">Blue Yard</span>
                <div className="grid grid-cols-2 gap-2">
                  {tokens.filter((t) => t.color === "blue" && t.step === -1).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleTokenMove(t)}
                      className={`w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center text-[10px] text-white font-bold transition-transform ${
                        currentTurn === "blue" && hasRolled && diceValue === 6 ? "animate-bounce ring-2 ring-blue-400" : ""
                      }`}
                    >
                      ●
                    </button>
                  ))}
                </div>
                <span className="text-[9px] text-muted-foreground">Home: {tokens.filter((t) => t.color === "blue" && t.step === 57).length}/4</span>
              </div>

              {/* Bottom Track (Blue Home Column) */}
              <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-border/40 text-center">
                <span className="text-[10px] font-bold text-muted-foreground">Track</span>
                <div className="flex flex-wrap gap-1 items-center justify-center mt-1">
                  {tokens.filter((t) => t.step >= 0 && t.step < 57 && (t.color === "blue" || t.color === "yellow")).slice(0, 4).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleTokenMove(t)}
                      className={`w-5 h-5 rounded-full ${COLOR_STYLES[t.color].tokenBg} border border-white text-[8px] text-white font-bold flex items-center justify-center`}
                    >
                      {t.step}
                    </button>
                  ))}
                </div>
              </div>

              {/* Yellow Yard (Bottom Right) */}
              <div className="rounded-xl bg-amber-500/20 border-2 border-amber-500/40 p-2 flex flex-col items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-amber-500">Yellow Yard</span>
                <div className="grid grid-cols-2 gap-2">
                  {tokens.filter((t) => t.color === "yellow" && t.step === -1).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleTokenMove(t)}
                      className={`w-6 h-6 rounded-full bg-amber-500 border-2 border-white shadow-md flex items-center justify-center text-[10px] text-white font-bold transition-transform ${
                        currentTurn === "yellow" && hasRolled && diceValue === 6 ? "animate-bounce ring-2 ring-amber-400" : ""
                      }`}
                    >
                      ●
                    </button>
                  ))}
                </div>
                <span className="text-[9px] text-muted-foreground">Home: {tokens.filter((t) => t.color === "yellow" && t.step === 57).length}/4</span>
              </div>
            </div>
          </div>

          {/* Dice & Turn Control Panel (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="bg-card/50 backdrop-blur border-border/60">
              <CardContent className="p-5 flex flex-col items-center text-center space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Dice Control
                </span>

                {/* Animated Dice Cube */}
                <div
                  className={`w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 border-4 ${COLOR_STYLES[currentTurn].border} shadow-xl flex items-center justify-center text-4xl font-extrabold text-foreground transition-transform ${
                    isRolling ? "animate-spin scale-110" : ""
                  }`}
                >
                  {diceValue}
                </div>

                <Button
                  size="lg"
                  onClick={rollDice}
                  disabled={isRolling || hasRolled || Boolean(winner) || (vsAI && currentTurn !== "red")}
                  className={`w-full font-bold text-white shadow-md ${
                    currentTurn === "red"
                      ? "bg-rose-600 hover:bg-rose-500"
                      : currentTurn === "green"
                      ? "bg-emerald-600 hover:bg-emerald-500"
                      : currentTurn === "yellow"
                      ? "bg-amber-600 hover:bg-amber-500"
                      : "bg-blue-600 hover:bg-blue-500"
                  }`}
                >
                  <Dices className="w-5 h-5 mr-2" />
                  {isRolling ? "Rolling..." : hasRolled ? "Select Token to Move" : "Roll Dice"}
                </Button>

                <p className="text-[11px] text-muted-foreground">
                  Roll a <strong>6</strong> to bring tokens out of your yard or get another roll!
                </p>
              </CardContent>
            </Card>

            {/* Active Tokens List for manual selection */}
            <Card className="bg-card/50 backdrop-blur border-border/60">
              <CardContent className="p-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Your Tokens ({COLOR_STYLES[currentTurn].name})
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {tokens.filter((t) => t.color === currentTurn).map((t, idx) => {
                    const canMove = hasRolled && (t.step === -1 ? diceValue === 6 : t.step + diceValue <= 57);
                    return (
                      <Button
                        key={t.id}
                        variant={canMove ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTokenMove(t)}
                        disabled={!canMove}
                        className="text-xs font-bold justify-between"
                      >
                        <span>Token #{idx + 1}</span>
                        <Badge variant="secondary" className="text-[9px]">
                          {t.step === -1 ? "Yard" : t.step === 57 ? "Home" : `Step ${t.step}`}
                        </Badge>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comprehensive SEO Content Section */}
        <section className="pt-8 border-t border-border/60 space-y-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Play Free Ludo Online - Roll the Dice & Race to Home
            </h1>
            <p className="mt-3 text-muted-foreground leading-relaxed text-sm sm:text-base">
              <strong>Axevora Ludo</strong> brings the world’s favorite family board game directly to your browser.
              Derived from the traditional Indian game <em>Pachisi</em>, Ludo combines strategy, calculated risk, and
              the thrill of the dice roll. Challenge our built-in computer AI or play pass-and-play with friends on desktop or mobile.
            </p>
          </div>

          {/* Rules and Strategy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/40 border-border/60">
              <CardContent className="p-6 space-y-3">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Shield className="w-5 h-5 text-rose-500" /> Complete Ludo Game Rules
                </h2>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-2.5">
                  <li><strong>The Starting Roll:</strong> Tokens stay in their colored yard until a player rolls a 6 on the die, which deploys one token onto the track.</li>
                  <li><strong>Track Movement:</strong> Tokens travel clockwise along the 52 common track squares according to the exact number shown on the dice.</li>
                  <li><strong>Capturing Opponents:</strong> Landing on an enemy pawn sends it back to its yard, while granting you a free bonus dice roll.</li>
                  <li><strong>Safe Stars:</strong> Tokens resting on safe squares (marked with star symbols or colored starting points) cannot be captured.</li>
                  <li><strong>Winning:</strong> Guide all 4 of your tokens through your home stretch and into the center triangle to claim victory.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-border/60">
              <CardContent className="p-6 space-y-3">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" /> Winning Strategy & Tactics
                </h2>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-2.5">
                  <li><strong>Spread Your Tokens:</strong> Don’t just move one token all the way home while the others remain trapped in the yard. Bring out multiple tokens to give yourself tactical move options.</li>
                  <li><strong>Anchor on Safe Squares:</strong> If an opponent is right behind you, park your token on a safe square and wait for them to pass before continuing.</li>
                  <li><strong>Hunt Vulnerable Enemy Pawns:</strong> Knocking out an opponent's high-progress token creates a massive tempo advantage.</li>
                  <li><strong>Manage Risk near Home:</strong> Inside the final colored stretch, tokens are safe from capture—focus on moving vulnerable pawns into this zone first.</li>
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
                  <h3 className="text-sm font-bold text-foreground">Can I play Ludo alone against the computer?</h3>
                  <p className="text-xs text-muted-foreground">Yes! In single-player mode, you command the Red tokens while our smart AI bots automatically manage the other three colors.</p>
                </CardContent>
              </Card>

              <Card className="bg-card/30 border-border/50">
                <CardContent className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground">What happens when you roll a 6 in Ludo?</h3>
                  <p className="text-xs text-muted-foreground">Rolling a 6 allows you to move a token out of the yard, advance an active token 6 steps, and you earn an immediate bonus roll.</p>
                </CardContent>
              </Card>

              <Card className="bg-card/30 border-border/50">
                <CardContent className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground">Is this Ludo game free with no ads?</h3>
                  <p className="text-xs text-muted-foreground">Axevora Ludo is 100% free with clean UI, zero app store downloads, and zero intrusive ads blocking the board.</p>
                </CardContent>
              </Card>

              <Card className="bg-card/30 border-border/50">
                <CardContent className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground">What is the origin of Ludo?</h3>
                  <p className="text-xs text-muted-foreground">Ludo was created in England in 1896, adapted from the ancient Indian game Pachisi, which dates back to the 6th century.</p>
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
              <Link to="/tools/checkers" className="px-3 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border/60 text-xs font-semibold text-foreground hover:text-primary transition-colors">
                Play Checkers →
              </Link>
              <Link to="/tools/8-ball-pool" className="px-3 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border/60 text-xs font-semibold text-foreground hover:text-primary transition-colors">
                8 Ball Pool →
              </Link>
              <Link to="/tools/2048-game" className="px-3 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border/60 text-xs font-semibold text-foreground hover:text-primary transition-colors">
                2048 Puzzle →
              </Link>
              <Link to="/games" className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-bold text-rose-600 dark:text-rose-400 transition-colors">
                All Games in Games Hub →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </ToolTemplate>
  );
}
