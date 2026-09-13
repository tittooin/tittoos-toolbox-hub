import React, { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import ToolTemplate from "@/components/ToolTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  RefreshCw,
  Play,
  Pause,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Flame
} from "lucide-react";

const GRID_SIZE = 20;
const INITIAL_SPEED = 140; // ms per tick
const MIN_SPEED = 60;

type Point = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export default function Snake() {
  const [snake, setSnake] = useState<Point[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 }
  ]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>("UP");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem("axevora_snake_highscore") || "0", 10);
  });

  const directionRef = useRef<Direction>("UP");
  const isPlayingRef = useRef<boolean>(false);
  const isGameOverRef = useRef<boolean>(false);

  directionRef.current = direction;
  isPlayingRef.current = isPlaying;
  isGameOverRef.current = isGameOver;

  // Generate random food not on snake body
  const spawnFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      const onSnake = currentSnake.some((seg) => seg.x === newFood.x && seg.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    const initialSnake: Point[] = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 }
    ];
    setSnake(initialSnake);
    setFood(spawnFood(initialSnake));
    setDirection("UP");
    directionRef.current = "UP";
    setScore(0);
    setIsGameOver(false);
    isGameOverRef.current = false;
    setIsPlaying(true);
  };

  const changeDirection = useCallback((newDir: Direction) => {
    const current = directionRef.current;
    if (newDir === "UP" && current !== "DOWN") setDirection("UP");
    if (newDir === "DOWN" && current !== "UP") setDirection("DOWN");
    if (newDir === "LEFT" && current !== "RIGHT") setDirection("LEFT");
    if (newDir === "RIGHT" && current !== "LEFT") setDirection("RIGHT");
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        e.preventDefault();
      }

      if (!isPlayingRef.current) {
        if (e.code === "Space" || e.code === "Enter") {
          resetGame();
          return;
        }
      }

      switch (e.code) {
        case "ArrowUp":
        case "KeyW":
          changeDirection("UP");
          break;
        case "ArrowDown":
        case "KeyS":
          changeDirection("DOWN");
          break;
        case "ArrowLeft":
        case "KeyA":
          changeDirection("LEFT");
          break;
        case "ArrowRight":
        case "KeyD":
          changeDirection("RIGHT");
          break;
        case "Space":
          setIsPlaying((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeDirection]);

  // Main game tick loop
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    // Speed increases with score
    const speed = Math.max(MIN_SPEED, INITIAL_SPEED - Math.floor(score / 5) * 8);

    const timer = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        const currentDir = directionRef.current;

        switch (currentDir) {
          case "UP":
            head.y -= 1;
            break;
          case "DOWN":
            head.y += 1;
            break;
          case "LEFT":
            head.x -= 1;
            break;
          case "RIGHT":
            head.x += 1;
            break;
        }

        // Wall collision check
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setIsGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        // Self collision check
        if (prevSnake.some((seg) => seg.x === head.x && seg.y === head.y)) {
          setIsGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Food collision check
        if (head.x === food.x && head.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem("axevora_snake_highscore", newScore.toString());
          }
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail segment
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [isPlaying, isGameOver, score, food, highScore, spawnFood]);

  return (
    <ToolTemplate
      title="Snake Classic Game"
      description="Play the legendary retro Snake arcade game. Guide your snake, eat glowing food, grow longer, and set new high scores with zero lag."
    >
      <Helmet>
        <title>Snake Classic Game - Play Free Online Arcade | Axevora</title>
        <meta
          name="description"
          content="Play free classic Snake game in your browser. Responsive touch D-pad for mobile and smooth keyboard controls for desktop."
        />
        <link rel="canonical" href="https://axevora.com/tools/snake" />
      </Helmet>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Score & Header Bar */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-card/50 backdrop-blur border-border/60">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Score</span>
              <span className="text-2xl font-extrabold text-foreground">{score}</span>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/60">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-xs text-muted-foreground uppercase font-semibold flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-500" /> Best
              </span>
              <span className="text-2xl font-extrabold text-amber-500">{highScore}</span>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/60">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Button
                variant={isPlaying ? "outline" : "default"}
                size="sm"
                onClick={() => {
                  if (isGameOver) resetGame();
                  else setIsPlaying(!isPlaying);
                }}
                className="w-full font-bold"
              >
                {isGameOver ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1.5" /> Restart
                  </>
                ) : isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 mr-1.5" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1.5" /> Play
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Game Canvas Container */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/30 bg-slate-950 p-2 shadow-2xl">
          <div
            className="w-full aspect-square max-w-[440px] mx-auto grid bg-slate-900/90 rounded-xl relative overflow-hidden"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
            }}
          >
            {/* Snake Segments */}
            {snake.map((segment, idx) => (
              <div
                key={`${segment.x}-${segment.y}-${idx}`}
                className={`rounded-[3px] transition-all duration-75 ${
                  idx === 0
                    ? "bg-emerald-400 shadow-md shadow-emerald-400/50 z-10"
                    : "bg-emerald-600/90 border border-emerald-500/30"
                }`}
                style={{
                  gridColumnStart: segment.x + 1,
                  gridRowStart: segment.y + 1
                }}
              />
            ))}

            {/* Food */}
            <div
              className="rounded-full bg-rose-500 shadow-lg shadow-rose-500/80 animate-pulse"
              style={{
                gridColumnStart: food.x + 1,
                gridRowStart: food.y + 1
              }}
            />

            {/* Start / Game Over Overlay */}
            {(!isPlaying || isGameOver) && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20 animate-in fade-in">
                {isGameOver ? (
                  <>
                    <Badge className="bg-rose-500/20 text-rose-400 border-none font-bold text-xs mb-3">
                      GAME OVER
                    </Badge>
                    <h3 className="text-3xl font-extrabold text-white mb-1">Crashed!</h3>
                    <p className="text-sm text-slate-400 mb-6">Final Score: {score}</p>
                    <Button
                      onClick={resetGame}
                      size="lg"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-8"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" /> Play Again
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                      <Flame className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Snake Classic</h3>
                    <p className="text-xs text-slate-400 max-w-xs mb-6">
                      Use Arrow Keys or WASD to steer. Collect glowing food to grow and boost your score.
                    </p>
                    <Button
                      onClick={() => {
                        if (score === 0 && snake.length === 3) resetGame();
                        else setIsPlaying(true);
                      }}
                      size="lg"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-8"
                    >
                      <Play className="w-4 h-4 mr-2 fill-current" /> Start Game
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile On-Screen D-Pad Controls */}
        <div className="block md:hidden pt-2">
          <div className="max-w-[200px] mx-auto grid grid-cols-3 gap-2">
            <div />
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-xl bg-card border-border active:scale-95"
              onClick={() => changeDirection("UP")}
              aria-label="Up"
            >
              <ArrowUp className="w-6 h-6" />
            </Button>
            <div />

            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-xl bg-card border-border active:scale-95"
              onClick={() => changeDirection("LEFT")}
              aria-label="Left"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div />
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-xl bg-card border-border active:scale-95"
              onClick={() => changeDirection("RIGHT")}
              aria-label="Right"
            >
              <ArrowRight className="w-6 h-6" />
            </Button>

            <div />
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-xl bg-card border-border active:scale-95"
              onClick={() => changeDirection("DOWN")}
              aria-label="Down"
            >
              <ArrowDown className="w-6 h-6" />
            </Button>
            <div />
          </div>
        </div>

        {/* Controls Guide */}
        <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-xs text-muted-foreground flex items-center justify-between">
          <span>Desktop: <strong>Arrow Keys</strong> or <strong>W, A, S, D</strong></span>
          <span>Mobile: <strong>Virtual D-Pad</strong></span>
        </div>
      </div>
    </ToolTemplate>
  );
}
