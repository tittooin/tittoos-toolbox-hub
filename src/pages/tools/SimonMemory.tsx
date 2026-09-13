import React, { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import ToolTemplate from "@/components/ToolTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, RefreshCw, Play, Brain, Volume2, VolumeX, Sparkles } from "lucide-react";

type ColorKey = "green" | "red" | "yellow" | "blue";

const PADS: { key: ColorKey; label: string; baseClass: string; activeClass: string; hex: string; freq: number }[] = [
  { key: "green", label: "Green", baseClass: "bg-emerald-600/60 border-emerald-500", activeClass: "bg-emerald-400 shadow-xl shadow-emerald-400/80 scale-105", hex: "#10b981", freq: 329.63 },
  { key: "red", label: "Red", baseClass: "bg-rose-600/60 border-rose-500", activeClass: "bg-rose-400 shadow-xl shadow-rose-400/80 scale-105", hex: "#f43f5e", freq: 261.63 },
  { key: "yellow", label: "Yellow", baseClass: "bg-amber-500/60 border-amber-400", activeClass: "bg-amber-300 shadow-xl shadow-amber-300/80 scale-105", hex: "#f59e0b", freq: 392.00 },
  { key: "blue", label: "Blue", baseClass: "bg-blue-600/60 border-blue-500", activeClass: "bg-blue-400 shadow-xl shadow-blue-400/80 scale-105", hex: "#3b82f6", freq: 440.00 }
];

export default function SimonMemory() {
  const [sequence, setSequence] = useState<ColorKey[]>([]);
  const [playerIndex, setPlayerIndex] = useState<number>(0);
  const [activePad, setActivePad] = useState<ColorKey | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isShowingSequence, setIsShowingSequence] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem("axevora_simon_highscore") || "0", 10);
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play subtle sound tone
  const playTone = (freq: number) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + 0.3);
    } catch {
      // Audio not supported, silent mode works fine
    }
  };

  const flashPad = (padKey: ColorKey, duration = 380) => {
    const pad = PADS.find((p) => p.key === padKey);
    if (pad) playTone(pad.freq);
    setActivePad(padKey);
    setTimeout(() => {
      setActivePad(null);
    }, duration);
  };

  // Play sequence step by step
  const playSequence = useCallback((seq: ColorKey[]) => {
    setIsShowingSequence(true);
    let step = 0;

    const interval = setInterval(() => {
      if (step < seq.length) {
        flashPad(seq[step]);
        step++;
      } else {
        clearInterval(interval);
        setIsShowingSequence(false);
        setPlayerIndex(0);
      }
    }, 650);
  }, []);

  const nextRound = useCallback(
    (currentSeq: ColorKey[]) => {
      const colors: ColorKey[] = ["green", "red", "yellow", "blue"];
      const nextColor = colors[Math.floor(Math.random() * colors.length)];
      const updatedSeq = [...currentSeq, nextColor];
      setSequence(updatedSeq);
      setScore(updatedSeq.length - 1);

      if (updatedSeq.length - 1 > highScore) {
        setHighScore(updatedSeq.length - 1);
        localStorage.setItem("axevora_simon_highscore", (updatedSeq.length - 1).toString());
      }

      setTimeout(() => {
        playSequence(updatedSeq);
      }, 500);
    },
    [highScore, playSequence]
  );

  const startGame = () => {
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setSequence([]);
    nextRound([]);
  };

  const handlePadClick = (padKey: ColorKey) => {
    if (!isPlaying || isShowingSequence || isGameOver) return;

    flashPad(padKey, 250);

    if (sequence[playerIndex] === padKey) {
      const nextIndex = playerIndex + 1;
      if (nextIndex === sequence.length) {
        // Round completed successfully!
        setTimeout(() => {
          nextRound(sequence);
        }, 500);
      } else {
        setPlayerIndex(nextIndex);
      }
    } else {
      // Wrong sequence! Game Over
      setIsGameOver(true);
      setIsPlaying(false);
      playTone(150); // Low error tone
    }
  };

  return (
    <ToolTemplate
      title="Simon Memory Game"
      description="Classic electronic sequence memory game. Watch the glowing quadrant sequence, remember the pattern, and repeat it back without making a mistake!"
    >
      <Helmet>
        <title>Simon Memory Game - Sequence Memory Trainer | Axevora</title>
        <meta
          name="description"
          content="Play free online Simon Memory game. Train working memory and recall. Clean visual sequence player with optional sound."
        />
        <link rel="canonical" href="https://axevora.com/tools/simon-memory" />
      </Helmet>

      <div className="max-w-md mx-auto space-y-6">
        {/* Score Top Bar */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-card/50 backdrop-blur border-border/60">
            <CardContent className="p-3.5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Round</span>
              <span className="text-2xl font-extrabold text-foreground">{score}</span>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/60">
            <CardContent className="p-3.5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-500" /> Best
              </span>
              <span className="text-2xl font-extrabold text-amber-500">{highScore}</span>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/60">
            <CardContent className="p-3.5 flex flex-col items-center justify-center text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-xs text-muted-foreground gap-1.5"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-rose-500" />}
                {soundEnabled ? "Sound ON" : "Sound OFF"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Simon Circular Console */}
        <div className="relative rounded-full aspect-square max-w-[340px] mx-auto p-4 bg-slate-950 border-4 border-slate-800 shadow-2xl flex items-center justify-center">
          {/* 4 Quadrants Grid */}
          <div className="w-full h-full grid grid-cols-2 gap-3.5 rounded-full overflow-hidden">
            {PADS.map((pad) => {
              const isActive = activePad === pad.key;

              return (
                <button
                  key={pad.key}
                  onClick={() => handlePadClick(pad.key)}
                  disabled={!isPlaying || isShowingSequence}
                  aria-label={pad.label}
                  className={`rounded-2xl border-2 transition-all duration-150 active:scale-95 ${
                    isActive ? pad.activeClass : pad.baseClass
                  } ${isShowingSequence ? "cursor-not-allowed" : "cursor-pointer"}`}
                />
              );
            })}
          </div>

          {/* Center Hub Indicator */}
          <div className="absolute w-28 h-28 rounded-full bg-slate-900 border-4 border-slate-800 flex flex-col items-center justify-center text-center shadow-2xl z-10 select-none">
            {!isPlaying && !isGameOver ? (
              <Button
                onClick={startGame}
                size="sm"
                className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-md shadow-emerald-600/50"
              >
                PLAY
              </Button>
            ) : isGameOver ? (
              <Button
                onClick={startGame}
                size="sm"
                className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-extrabold shadow-md shadow-rose-600/50"
              >
                <RefreshCw className="w-6 h-6" />
              </Button>
            ) : (
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">
                  {isShowingSequence ? "WATCH" : "YOUR TURN"}
                </span>
                <p className="text-xl font-black text-foreground">{score}</p>
              </div>
            )}
          </div>
        </div>

        {/* Status / Instructions Bar */}
        <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-xs text-center text-muted-foreground space-y-1">
          {isShowingSequence ? (
            <p className="text-amber-400 font-bold animate-pulse">👀 Simon is playing... watch the lights!</p>
          ) : isPlaying ? (
            <p className="text-emerald-400 font-bold">✨ Your turn! Repeat the sequence.</p>
          ) : isGameOver ? (
            <p className="text-rose-400 font-bold">❌ Wrong button! Tap center circle to try again.</p>
          ) : (
            <p>Tap <strong>PLAY</strong> in the center circle to start the sequence challenge.</p>
          )}
        </div>
      </div>
    </ToolTemplate>
  );
}
