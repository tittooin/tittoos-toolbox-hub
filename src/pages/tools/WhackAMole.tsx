import React, { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import ToolTemplate from "@/components/ToolTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, RefreshCw, Play, Timer, Target, Sparkles, Flame } from "lucide-react";

interface MoleState {
  index: number;
  isGolden: boolean;
}

export default function WhackAMole() {
  const [activeMole, setActiveMole] = useState<MoleState | null>(null);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [whacks, setWhacks] = useState<number>(0);
  const [hits, setHits] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem("axevora_whackamole_highscore") || "0", 10);
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const moleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  isPlayingRef.current = isPlaying;

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setIsGameOver(true);
    setActiveMole(null);
    if (timerRef.current) clearInterval(timerRef.current);
    if (moleTimeoutRef.current) clearTimeout(moleTimeoutRef.current);
  }, []);

  // Spawn moles dynamically
  const spawnNextMole = useCallback(() => {
    if (!isPlayingRef.current) return;

    const randomIndex = Math.floor(Math.random() * 9);
    const isGolden = Math.random() < 0.2; // 20% chance for golden mole

    setActiveMole({ index: randomIndex, isGolden });

    // Duration mole stays up (decreases slightly as game progresses)
    const displayTime = Math.max(550, 950 - Math.random() * 300);

    moleTimeoutRef.current = setTimeout(() => {
      setActiveMole(null);
      // Wait tiny random delay before next mole
      const delay = Math.floor(Math.random() * 250) + 100;
      setTimeout(spawnNextMole, delay);
    }, displayTime);
  }, []);

  const startGame = () => {
    setScore(0);
    setHits(0);
    setWhacks(0);
    setTimeLeft(30);
    setIsGameOver(false);
    setIsPlaying(true);
    isPlayingRef.current = true;

    // Start 30s countdown
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    spawnNextMole();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (moleTimeoutRef.current) clearTimeout(moleTimeoutRef.current);
    };
  }, []);

  const handleHoleClick = (index: number) => {
    if (!isPlaying) return;

    setWhacks((w) => w + 1);

    if (activeMole && activeMole.index === index) {
      // Hit!
      const points = activeMole.isGolden ? 25 : 10;
      const newScore = score + points;
      setScore(newScore);
      setHits((h) => h + 1);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem("axevora_whackamole_highscore", newScore.toString());
      }

      // Hide mole immediately
      if (moleTimeoutRef.current) clearTimeout(moleTimeoutRef.current);
      setActiveMole(null);
      setTimeout(spawnNextMole, 150);
    }
  };

  const accuracy = whacks > 0 ? Math.round((hits / whacks) * 100) : 0;

  return (
    <ToolTemplate
      title="Whack-a-Mole Arcade"
      description="Test your reflex speed and hand-eye coordination! Whack as many moles as possible in 30 seconds. Look out for bonus golden moles!"
    >
      <Helmet>
        <title>Whack-a-Mole - Play Free Online Reflex Arcade | Axevora</title>
        <meta
          name="description"
          content="Play free Whack-a-Mole reflex game online. Fast 30-second reflex challenge with score accuracy and bonus golden moles. Mobile touch ready."
        />
        <link rel="canonical" href="https://axevora.com/tools/whack-a-mole" />
      </Helmet>

      <div className="max-w-md mx-auto space-y-6">
        {/* Score & Timer Dashboard */}
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
                <Timer className="w-3 h-3 text-blue-500" /> Time
              </span>
              <span className={`text-2xl font-extrabold font-mono ${timeLeft <= 5 ? "text-rose-500 animate-pulse" : "text-foreground"}`}>
                {timeLeft}s
              </span>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/60">
            <CardContent className="p-3.5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-500" /> High Score
              </span>
              <span className="text-2xl font-extrabold text-amber-500">{highScore}</span>
            </CardContent>
          </Card>
        </div>

        {/* 3x3 Whack Grid */}
        <div className="relative rounded-3xl p-4 bg-gradient-to-b from-amber-950/40 via-card/90 to-amber-950/20 border-2 border-amber-500/30 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-3 gap-3.5 aspect-square max-w-[360px] mx-auto select-none">
            {Array.from({ length: 9 }).map((_, idx) => {
              const isMoleHere = activeMole && activeMole.index === idx;
              const isGolden = activeMole?.isGolden;

              return (
                <div
                  key={idx}
                  onClick={() => handleHoleClick(idx)}
                  className="aspect-square relative rounded-2xl bg-amber-950/80 border-4 border-amber-900/60 shadow-inner flex items-center justify-center cursor-pointer overflow-hidden active:scale-95 transition-transform"
                >
                  {/* Dirt Hole Rim */}
                  <div className="absolute inset-x-2 bottom-2 h-4 rounded-full bg-black/40 blur-[1px]" />

                  {/* Mole Actor */}
                  {isMoleHere && (
                    <div
                      className={`w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-lg transform transition-all duration-150 animate-in zoom-in-50 ${
                        isGolden
                          ? "bg-gradient-to-b from-amber-300 to-yellow-500 shadow-yellow-500/50"
                          : "bg-gradient-to-b from-amber-600 to-amber-800 shadow-amber-900/50"
                      }`}
                    >
                      <span className="text-2xl select-none">
                        {isGolden ? "🌟" : "🐹"}
                      </span>
                      <span className="text-[9px] font-extrabold text-white tracking-wider uppercase">
                        {isGolden ? "+25" : "+10"}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Start Screen Overlay */}
          {!isPlaying && !isGameOver && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10 animate-in fade-in">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-2">Whack-a-Mole</h2>
              <p className="text-xs text-slate-300 max-w-xs mb-6 leading-relaxed">
                Whack moles as fast as they appear! Normal moles give +10 pts, Golden moles give +25 pts. 30 seconds on the clock.
              </p>
              <Button
                onClick={startGame}
                size="lg"
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl px-8 shadow-lg shadow-amber-600/30"
              >
                <Play className="w-4 h-4 mr-2 fill-current" /> Start Game
              </Button>
            </div>
          )}

          {/* Game Over Screen Overlay */}
          {isGameOver && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10 animate-in fade-in">
              <Badge className="bg-amber-500/20 text-amber-400 border-none font-bold text-xs mb-2">
                TIME UP!
              </Badge>
              <h3 className="text-3xl font-extrabold text-white mb-1">Final Score: {score}</h3>
              <div className="my-4 space-y-1 text-xs text-slate-300">
                <p>Moles Whacked: <strong className="text-white text-sm">{hits}</strong></p>
                <p>Accuracy: <strong className="text-emerald-400 text-sm">{accuracy}%</strong></p>
                <p>All-Time High: <strong className="text-amber-400 text-sm">{highScore}</strong></p>
              </div>
              <Button
                onClick={startGame}
                size="lg"
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl px-8 shadow-lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Play Again
              </Button>
            </div>
          )}
        </div>

        {/* Quick Instructions */}
        <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-xs text-muted-foreground flex items-center justify-between">
          <span>Tap/Click: <strong>Whack Mole</strong></span>
          <span>Golden Mole: <strong>Bonus +25 Pts</strong></span>
        </div>
      </div>
    </ToolTemplate>
  );
}
