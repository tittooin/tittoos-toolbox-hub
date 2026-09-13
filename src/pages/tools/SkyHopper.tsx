import React, { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import ToolTemplate from "@/components/ToolTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, RefreshCw, Play, Rocket, Sparkles } from "lucide-react";

interface Pipe {
  x: number;
  topHeight: number;
  bottomHeight: number;
  passed: boolean;
}

export default function SkyHopper() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem("axevora_skyhopper_highscore") || "0", 10);
  });
  const [gameState, setGameState] = useState<"IDLE" | "PLAYING" | "GAMEOVER">("IDLE");

  // Physics constants
  const GRAVITY = 0.35;
  const JUMP_FORCE = -6.5;
  const PIPE_SPEED = 2.4;
  const PIPE_SPAWN_INTERVAL = 110; // frames
  const PIPE_GAP = 135;

  const hopperRef = useRef({
    x: 80,
    y: 200,
    velocity: 0,
    radius: 16
  });

  const pipesRef = useRef<Pipe[]>([]);
  const frameCountRef = useRef<number>(0);
  const animationFrameId = useRef<number>(0);
  const gameStateRef = useRef<"IDLE" | "PLAYING" | "GAMEOVER">("IDLE");
  const scoreRef = useRef<number>(0);

  gameStateRef.current = gameState;
  scoreRef.current = score;

  const jump = useCallback(() => {
    if (gameStateRef.current === "IDLE") {
      setGameState("PLAYING");
      gameStateRef.current = "PLAYING";
      hopperRef.current.velocity = JUMP_FORCE;
    } else if (gameStateRef.current === "PLAYING") {
      hopperRef.current.velocity = JUMP_FORCE;
    }
  }, [JUMP_FORCE]);

  const restartGame = useCallback(() => {
    hopperRef.current = {
      x: 80,
      y: 220,
      velocity: JUMP_FORCE,
      radius: 16
    };
    pipesRef.current = [];
    frameCountRef.current = 0;
    setScore(0);
    scoreRef.current = 0;
    setGameState("PLAYING");
    gameStateRef.current = "PLAYING";
  }, [JUMP_FORCE]);

  // Keyboard interaction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        if (gameStateRef.current === "GAMEOVER") {
          restartGame();
        } else {
          jump();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jump, restartGame]);

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // 1. Clear background & draw sky gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#090d16");
      gradient.addColorStop(0.7, "#0f172a");
      gradient.addColorStop(1, "#064e3b");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Stars in background
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      for (let i = 0; i < 25; i++) {
        const sx = ((i * 47) % width);
        const sy = ((i * 83) % (height - 80));
        ctx.fillRect(sx, sy, 2, 2);
      }

      // Ground platform
      ctx.fillStyle = "#022c22";
      ctx.fillRect(0, height - 30, width, 30);
      ctx.fillStyle = "#10b981";
      ctx.fillRect(0, height - 30, width, 4);

      const hopper = hopperRef.current;

      // 2. Physics & Logic when Playing
      if (gameStateRef.current === "PLAYING") {
        hopper.velocity += GRAVITY;
        hopper.y += hopper.velocity;

        // Ground collision
        if (hopper.y + hopper.radius >= height - 30) {
          hopper.y = height - 30 - hopper.radius;
          setGameState("GAMEOVER");
          gameStateRef.current = "GAMEOVER";
        }

        // Ceiling collision
        if (hopper.y - hopper.radius <= 0) {
          hopper.y = hopper.radius;
          hopper.velocity = 0;
        }

        // Spawn Pipes
        frameCountRef.current++;
        if (frameCountRef.current % PIPE_SPAWN_INTERVAL === 0) {
          const minPipe = 50;
          const maxPipe = height - 30 - PIPE_GAP - minPipe;
          const topHeight = Math.floor(Math.random() * (maxPipe - minPipe + 1)) + minPipe;
          const bottomHeight = height - 30 - (topHeight + PIPE_GAP);

          pipesRef.current.push({
            x: width,
            topHeight,
            bottomHeight,
            passed: false
          });
        }

        // Move Pipes & Check Collision
        for (let i = pipesRef.current.length - 1; i >= 0; i--) {
          const pipe = pipesRef.current[i];
          pipe.x -= PIPE_SPEED;

          const pipeWidth = 52;

          // Check if passed for score
          if (!pipe.passed && pipe.x + pipeWidth < hopper.x) {
            pipe.passed = true;
            const newScore = scoreRef.current + 1;
            setScore(newScore);
            scoreRef.current = newScore;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem("axevora_skyhopper_highscore", newScore.toString());
            }
          }

          // AABB vs Circle collision
          const inXRange = hopper.x + hopper.radius > pipe.x && hopper.x - hopper.radius < pipe.x + pipeWidth;
          const hitTop = hopper.y - hopper.radius < pipe.topHeight;
          const hitBottom = hopper.y + hopper.radius > height - 30 - pipe.bottomHeight;

          if (inXRange && (hitTop || hitBottom)) {
            setGameState("GAMEOVER");
            gameStateRef.current = "GAMEOVER";
          }

          // Remove offscreen pipes
          if (pipe.x + pipeWidth < -20) {
            pipesRef.current.splice(i, 1);
          }
        }
      }

      // 3. Draw Pipes (Cyber Energy Pillars)
      const pipeWidth = 52;
      pipesRef.current.forEach((pipe) => {
        // Top Pipe
        const topGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
        topGrad.addColorStop(0, "#059669");
        topGrad.addColorStop(0.5, "#34d399");
        topGrad.addColorStop(1, "#047857");
        ctx.fillStyle = topGrad;
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.fillStyle = "#10b981";
        ctx.fillRect(pipe.x - 3, pipe.topHeight - 16, pipeWidth + 6, 16);

        // Bottom Pipe
        const bottomY = height - 30 - pipe.bottomHeight;
        ctx.fillStyle = topGrad;
        ctx.fillRect(pipe.x, bottomY, pipeWidth, pipe.bottomHeight);
        ctx.fillStyle = "#10b981";
        ctx.fillRect(pipe.x - 3, bottomY, pipeWidth + 6, 16);
      });

      // 4. Draw Hopper Character (Glowing Cyber Winged Drone)
      ctx.save();
      ctx.translate(hopper.x, hopper.y);

      // Rotation based on velocity
      const angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (hopper.velocity * 4 * Math.PI) / 180));
      ctx.rotate(angle);

      // Outer glow
      ctx.shadowColor = "#34d399";
      ctx.shadowBlur = 14;

      // Body
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(0, 0, hopper.radius, 0, Math.PI * 2);
      ctx.fill();

      // Inner visor/eye
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ecfdf5";
      ctx.beginPath();
      ctx.arc(6, -2, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#064e3b";
      ctx.beginPath();
      ctx.arc(8, -2, 3, 0, Math.PI * 2);
      ctx.fill();

      // Cyber wing
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.ellipse(-6, 2, 7, 4, -0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 5. In-Game Live Score Display
      if (gameStateRef.current === "PLAYING") {
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 32px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(scoreRef.current.toString(), width / 2, 50);
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationFrameId.current);
  }, [highScore]);

  return (
    <ToolTemplate
      title="Sky Hopper Arcade"
      description="Tap, hop, and glide through cyber energy pillars in this thrilling instant arcade reflex challenge. Easy to learn, addictive to master!"
    >
      <Helmet>
        <title>Sky Hopper - Play Free Online Arcade Game | Axevora</title>
        <meta
          name="description"
          content="Play free Sky Hopper arcade game online. Tap or press space to hop between energy gates. Responsive on both mobile touch and desktop."
        />
        <link rel="canonical" href="https://axevora.com/tools/sky-hopper" />
      </Helmet>

      <div className="max-w-md mx-auto space-y-6">
        {/* Score Top Bar */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card/50 backdrop-blur border-border/60">
            <CardContent className="p-3.5 flex flex-col items-center justify-center text-center">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Current Score</span>
              <span className="text-2xl font-extrabold text-foreground">{score}</span>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/60">
            <CardContent className="p-3.5 flex flex-col items-center justify-center text-center">
              <span className="text-xs text-muted-foreground uppercase font-semibold flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-500" /> Best Score
              </span>
              <span className="text-2xl font-extrabold text-amber-500">{highScore}</span>
            </CardContent>
          </Card>
        </div>

        {/* Canvas Game Area */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-2xl bg-slate-950">
          <canvas
            ref={canvasRef}
            width={380}
            height={520}
            onClick={() => {
              if (gameState === "GAMEOVER") restartGame();
              else jump();
            }}
            className="w-full h-auto cursor-pointer block touch-none select-none"
          />

          {/* Idle Start Overlay */}
          {gameState === "IDLE" && (
            <div
              onClick={jump}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 animate-bounce">
                <Rocket className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Sky Hopper</h2>
              <p className="text-xs text-slate-300 max-w-[240px] mb-6 leading-relaxed">
                Tap anywhere or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono text-[10px]">Space</kbd> to hop. Avoid the green energy gates!
              </p>
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-8 shadow-lg shadow-emerald-600/30">
                <Play className="w-4 h-4 mr-2 fill-current" /> Tap To Play
              </Button>
            </div>
          )}

          {/* Game Over Overlay */}
          {gameState === "GAMEOVER" && (
            <div
              onClick={restartGame}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10 cursor-pointer animate-in fade-in"
            >
              <Badge className="bg-rose-500/20 text-rose-400 border-none font-bold text-xs mb-3">
                CRASHED!
              </Badge>
              <h3 className="text-3xl font-extrabold text-white mb-1">Game Over</h3>
              <div className="my-4 space-y-1">
                <p className="text-xs text-slate-400">Pillars Cleared: <strong className="text-white text-base">{score}</strong></p>
                <p className="text-xs text-amber-400">All-Time Best: <strong className="text-white text-base">{highScore}</strong></p>
              </div>
              <Button size="lg" onClick={restartGame} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-8 shadow-lg">
                <RefreshCw className="w-4 h-4 mr-2" /> Tap to Restart
              </Button>
            </div>
          )}
        </div>

        {/* Quick Instructions */}
        <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-xs text-muted-foreground flex items-center justify-between">
          <span>Tap/Click: <strong>Jump</strong></span>
          <span>Desktop: <strong>Spacebar</strong> / <strong>↑ Arrow</strong></span>
        </div>
      </div>
    </ToolTemplate>
  );
}
