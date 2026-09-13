import React, { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import ToolTemplate from "@/components/ToolTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, RefreshCw, Play, Zap, Flame, Timer } from "lucide-react";

interface ColorItem {
  name: string;
  colorClass: string;
  bgClass: string;
  hex: string;
}

const COLORS: ColorItem[] = [
  { name: "RED", colorClass: "text-rose-500", bgClass: "bg-rose-500 hover:bg-rose-600", hex: "#f43f5e" },
  { name: "BLUE", colorClass: "text-blue-500", bgClass: "bg-blue-500 hover:bg-blue-600", hex: "#3b82f6" },
  { name: "GREEN", colorClass: "text-emerald-500", bgClass: "bg-emerald-500 hover:bg-emerald-600", hex: "#10b981" },
  { name: "YELLOW", colorClass: "text-amber-400", bgClass: "bg-amber-400 hover:bg-amber-500 text-slate-950", hex: "#facc15" }
];

export default function ColorReaction() {
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem("axevora_colorreaction_highscore") || "0", 10);
  });
  const [wordItem, setWordItem] = useState<ColorItem>(COLORS[0]);
  const [inkItem, setInkItem] = useState<ColorItem>(COLORS[1]);
  const [rule, setRule] = useState<"INK" | "WORD">("INK"); // Test ink color or word text
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [timeLeftPercent, setTimeLeftPercent] = useState<number>(100);

  const roundStartTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const totalRoundTimeRef = useRef<number>(2200); // ms allowed per round

  const generateNextRound = useCallback((currentScore: number) => {
    const randomWord = COLORS[Math.floor(Math.random() * COLORS.length)];
    const randomInk = COLORS[Math.floor(Math.random() * COLORS.length)];
    const nextRule: "INK" | "WORD" = Math.random() < 0.65 ? "INK" : "WORD";

    setWordItem(randomWord);
    setInkItem(randomInk);
    setRule(nextRule);

    // Speed up as score increases
    const allowedTime = Math.max(950, 2200 - currentScore * 45);
    totalRoundTimeRef.current = allowedTime;
    roundStartTimeRef.current = Date.now();
    setTimeLeftPercent(100);
  }, []);

  const handleGameOver = useCallback(() => {
    setIsPlaying(false);
    setIsGameOver(true);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  }, []);

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setIsGameOver(false);
    setIsPlaying(true);
    generateNextRound(0);
  };

  // Timer decay loop
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    timerIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - roundStartTimeRef.current;
      const remaining = Math.max(0, totalRoundTimeRef.current - elapsed);
      const percent = (remaining / totalRoundTimeRef.current) * 100;

      setTimeLeftPercent(percent);

      if (remaining <= 0) {
        handleGameOver();
      }
    }, 25);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isPlaying, isGameOver, handleGameOver]);

  const handleColorChoice = (chosenColorName: string) => {
    if (!isPlaying || isGameOver) return;

    const targetColor = rule === "INK" ? inkItem.name : wordItem.name;

    if (chosenColorName === targetColor) {
      // Correct!
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem("axevora_colorreaction_highscore", newScore.toString());
      }

      generateNextRound(newScore);
    } else {
      // Wrong choice
      handleGameOver();
    }
  };

  return (
    <ToolTemplate
      title="Color Reaction Challenge"
      description="Train cognitive inhibition and split-second reflex speed! Read the prompt carefully—tap the correct color before the fuse runs out!"
    >
      <Helmet>
        <title>Color Reaction Challenge - Brain Reflex Game | Axevora</title>
        <meta
          name="description"
          content="Play free Color Reaction Challenge. A fast-paced Stroop reflex test. React to ink colors vs word text in milliseconds on desktop or mobile."
        />
        <link rel="canonical" href="https://axevora.com/tools/color-reaction" />
      </Helmet>

      <div className="max-w-md mx-auto space-y-6">
        {/* Score & Streak Bar */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-card/50 backdrop-blur border-border/60">
            <CardContent className="p-3.5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Score</span>
              <span className="text-2xl font-extrabold text-foreground">{score}</span>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/60">
            <CardContent className="p-3.5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" /> Streak
              </span>
              <span className="text-2xl font-extrabold text-rose-500">{streak}</span>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/60">
            <CardContent className="p-3.5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-500" /> Best
              </span>
              <span className="text-2xl font-extrabold text-amber-500">{highScore}</span>
            </CardContent>
          </Card>
        </div>

        {/* Reaction Card Container */}
        <div className="relative rounded-3xl p-6 bg-slate-950 border-2 border-border/80 shadow-2xl overflow-hidden min-h-[360px] flex flex-col justify-between">
          {/* Progress Time Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-75 ${
                timeLeftPercent > 50
                  ? "bg-emerald-500"
                  : timeLeftPercent > 25
                  ? "bg-amber-500"
                  : "bg-rose-500"
              }`}
              style={{ width: `${timeLeftPercent}%` }}
            />
          </div>

          {/* Active Prompt Area */}
          <div className="my-auto py-8 text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase border border-border/60 bg-slate-900">
              TAP THE {rule === "INK" ? "🎨 INK COLOR" : "📝 WORD TEXT"}
            </div>

            <div className="select-none">
              <span
                className={`text-5xl sm:text-6xl font-black tracking-tight ${inkItem.colorClass} drop-shadow-md`}
              >
                {wordItem.name}
              </span>
            </div>
          </div>

          {/* 4 Color Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            {COLORS.map((col) => (
              <Button
                key={col.name}
                onClick={() => handleColorChoice(col.name)}
                disabled={!isPlaying}
                className={`h-14 rounded-2xl font-extrabold text-sm tracking-wider text-white shadow-md active:scale-95 transition-all ${col.bgClass}`}
              >
                {col.name}
              </Button>
            ))}
          </div>

          {/* Start Screen Overlay */}
          {!isPlaying && !isGameOver && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10 animate-in fade-in">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-2">Color Reaction</h2>
              <p className="text-xs text-slate-300 max-w-xs mb-6 leading-relaxed">
                Watch the instruction badge! It will ask you to match the <strong>INK COLOR</strong> or the <strong>WORD TEXT</strong>. Think fast!
              </p>
              <Button
                onClick={startGame}
                size="lg"
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl px-8 shadow-lg shadow-rose-600/30"
              >
                <Play className="w-4 h-4 mr-2 fill-current" /> Start Challenge
              </Button>
            </div>
          )}

          {/* Game Over Overlay */}
          {isGameOver && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10 animate-in fade-in">
              <Badge className="bg-rose-500/20 text-rose-400 border-none font-bold text-xs mb-2">
                ROUND OVER
              </Badge>
              <h3 className="text-3xl font-extrabold text-white mb-1">Final Score: {score}</h3>
              <p className="text-xs text-slate-400 mb-6">Streak achieved: {streak}</p>
              <Button
                onClick={startGame}
                size="lg"
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl px-8 shadow-lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Try Again
              </Button>
            </div>
          )}
        </div>

        {/* Quick Instructions */}
        <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-xs text-muted-foreground flex items-center justify-between">
          <span>Stroop Effect: <strong>Don't let your eyes fool you!</strong></span>
          <span>Time: <strong>Gets faster every 5 rounds</strong></span>
        </div>
      </div>
    </ToolTemplate>
  );
}
