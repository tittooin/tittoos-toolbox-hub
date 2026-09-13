import React, { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import ToolTemplate from "@/components/ToolTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, RefreshCw, Play, Brain, Layers, CheckCircle2, XCircle } from "lucide-react";

export default function SequenceMemory() {
  const [level, setLevel] = useState<number>(1);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem("axevora_sequence_highscore") || "1", 10);
  });
  const [sequence, setSequence] = useState<number[]>([]);
  const [userStep, setUserStep] = useState<number>(0);
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [gameState, setGameState] = useState<"IDLE" | "DISPLAYING" | "PLAYING" | "GAMEOVER">("IDLE");
  const [feedback, setFeedback] = useState<"CORRECT" | "WRONG" | null>(null);

  const displayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Flash a tile during display
  const flashTile = (tileIndex: number, duration = 400) => {
    setActiveTile(tileIndex);
    setTimeout(() => {
      setActiveTile(null);
    }, duration);
  };

  // Play sequence to user
  const playSequence = useCallback((seq: number[]) => {
    setGameState("DISPLAYING");
    let step = 0;

    const interval = setInterval(() => {
      if (step < seq.length) {
        flashTile(seq[step]);
        step++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setGameState("PLAYING");
          setUserStep(0);
        }, 250);
      }
    }, 600);
  }, []);

  // Generate sequence for given level
  const startLevel = useCallback(
    (lvl: number) => {
      // Level 1 = 3 tiles, Level 2 = 4 tiles, etc.
      const length = lvl + 2;
      const newSeq: number[] = [];
      for (let i = 0; i < length; i++) {
        newSeq.push(Math.floor(Math.random() * 9));
      }

      setSequence(newSeq);
      setLevel(lvl);
      setFeedback(null);

      if (lvl > highScore) {
        setHighScore(lvl);
        localStorage.setItem("axevora_sequence_highscore", lvl.toString());
      }

      setTimeout(() => {
        playSequence(newSeq);
      }, 500);
    },
    [highScore, playSequence]
  );

  const startGame = () => {
    setGameState("DISPLAYING");
    startLevel(1);
  };

  const handleTileClick = (index: number) => {
    if (gameState !== "PLAYING") return;

    // Flash tapped tile
    flashTile(index, 200);

    if (sequence[userStep] === index) {
      // Correct tile in sequence
      const nextStep = userStep + 1;

      if (nextStep === sequence.length) {
        // Completed this level!
        setFeedback("CORRECT");
        setGameState("DISPLAYING");
        setTimeout(() => {
          startLevel(level + 1);
        }, 800);
      } else {
        setUserStep(nextStep);
      }
    } else {
      // Wrong tile! Game Over
      setFeedback("WRONG");
      setGameState("GAMEOVER");
    }
  };

  useEffect(() => {
    return () => {
      if (displayTimeoutRef.current) clearTimeout(displayTimeoutRef.current);
    };
  }, []);

  return (
    <ToolTemplate
      title="Sequence Memory Grid"
      description="Benchmark your visual working memory! Watch the grid tiles light up in order, remember their positions, and reproduce the sequence as it gets longer each level."
    >
      <Helmet>
        <title>Sequence Memory Grid - Test Working Memory | Axevora</title>
        <meta
          name="description"
          content="Play Sequence Memory Grid test online. Human Benchmark style cognitive visual memory challenge. Runs smoothly on desktop and mobile."
        />
        <link rel="canonical" href="https://axevora.com/tools/sequence-memory" />
      </Helmet>

      <div className="max-w-md mx-auto space-y-6">
        {/* Level & Highscore Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card/50 backdrop-blur border-border/60">
            <CardContent className="p-3.5 flex flex-col items-center justify-center text-center">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Current Level</span>
              <span className="text-2xl font-extrabold text-foreground">{gameState === "IDLE" ? "-" : level}</span>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/60">
            <CardContent className="p-3.5 flex flex-col items-center justify-center text-center">
              <span className="text-xs text-muted-foreground uppercase font-semibold flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-500" /> Best Level
              </span>
              <span className="text-2xl font-extrabold text-amber-500">{highScore}</span>
            </CardContent>
          </Card>
        </div>

        {/* 3x3 Memory Matrix */}
        <div className="relative rounded-3xl p-5 bg-slate-950 border-2 border-border/80 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-3 gap-3.5 aspect-square max-w-[340px] mx-auto select-none">
            {Array.from({ length: 9 }).map((_, idx) => {
              const isLit = activeTile === idx;

              return (
                <button
                  key={idx}
                  onClick={() => handleTileClick(idx)}
                  disabled={gameState !== "PLAYING"}
                  className={`aspect-square rounded-2xl border-2 transition-all duration-150 ${
                    isLit
                      ? "bg-indigo-400 border-indigo-300 shadow-xl shadow-indigo-500/80 scale-105"
                      : "bg-slate-900/90 border-slate-800 hover:bg-slate-800/90 active:scale-95"
                  } ${gameState === "PLAYING" ? "cursor-pointer" : "cursor-default"}`}
                />
              );
            })}
          </div>

          {/* Idle Start Overlay */}
          {gameState === "IDLE" && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10 animate-in fade-in">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <Layers className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-2">Sequence Memory</h2>
              <p className="text-xs text-slate-300 max-w-xs mb-6 leading-relaxed">
                Memorize the sequence of tiles that light up, then tap them in the exact same order. +1 tile added each level!
              </p>
              <Button
                onClick={startGame}
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl px-8 shadow-lg shadow-indigo-600/30"
              >
                <Play className="w-4 h-4 mr-2 fill-current" /> Start Test
              </Button>
            </div>
          )}

          {/* Game Over Overlay */}
          {gameState === "GAMEOVER" && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10 animate-in fade-in">
              <Badge className="bg-rose-500/20 text-rose-400 border-none font-bold text-xs mb-2">
                FAILED SEQUENCE
              </Badge>
              <h3 className="text-3xl font-extrabold text-white mb-1">Level {level}</h3>
              <p className="text-xs text-slate-400 mb-6">
                Max sequence reached: {sequence.length} tiles
              </p>
              <Button
                onClick={startGame}
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl px-8 shadow-lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Try Again
              </Button>
            </div>
          )}
        </div>

        {/* Dynamic Status Display */}
        <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-xs text-center text-muted-foreground">
          {gameState === "DISPLAYING" ? (
            <span className="text-indigo-400 font-bold animate-pulse flex items-center justify-center gap-1.5">
              <Brain className="w-4 h-4" /> Watch the tile sequence...
            </span>
          ) : gameState === "PLAYING" ? (
            <span className="text-emerald-400 font-bold flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Repeat the sequence ({userStep}/{sequence.length})
            </span>
          ) : gameState === "GAMEOVER" ? (
            <span className="text-rose-400 font-bold flex items-center justify-center gap-1.5">
              <XCircle className="w-4 h-4" /> Wrong tile! Click Try Again.
            </span>
          ) : (
            <span>Tap <strong>Start Test</strong> to begin level 1.</span>
          )}
        </div>
      </div>
    </ToolTemplate>
  );
}
