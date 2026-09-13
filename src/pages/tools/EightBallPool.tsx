import React, { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import ToolTemplate from "@/components/ToolTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";
import {
  CircleDot,
  RefreshCw,
  Trophy,
  Target,
  Sparkles,
  Zap,
  Shield,
  HelpCircle,
  Play,
  ChevronRight
} from "lucide-react";

interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  isStriped: boolean;
  potted: boolean;
}

const TABLE_WIDTH = 640;
const TABLE_HEIGHT = 340;
const BALL_RADIUS = 9;
const FRICTION = 0.985;

const BALL_COLORS = [
  "#ffffff", // 0: Cue Ball
  "#eab308", // 1: Yellow
  "#3b82f6", // 2: Blue
  "#ef4444", // 3: Red
  "#a855f7", // 4: Purple
  "#f97316", // 5: Orange
  "#10b981", // 6: Green
  "#991b1b", // 7: Maroon
  "#09090b", // 8: Black 8-Ball
  "#eab308", // 9: Yellow Stripe
  "#3b82f6", // 10: Blue Stripe
  "#ef4444", // 11: Red Stripe
  "#a855f7", // 12: Purple Stripe
  "#f97316", // 13: Orange Stripe
  "#10b981", // 14: Green Stripe
  "#991b1b"  // 15: Maroon Stripe
];

const POCKETS = [
  { x: 26, y: 26, r: 18 },
  { x: TABLE_WIDTH / 2, y: 20, r: 16 },
  { x: TABLE_WIDTH - 26, y: 26, r: 18 },
  { x: 26, y: TABLE_HEIGHT - 26, r: 18 },
  { x: TABLE_WIDTH / 2, y: TABLE_HEIGHT - 20, r: 16 },
  { x: TABLE_WIDTH - 26, y: TABLE_HEIGHT - 26, r: 18 }
];

export default function EightBallPool() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [power, setPower] = useState<number>(50);
  const [shotAngle, setShotAngle] = useState<number>(0);
  const [isAiming, setIsAiming] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [assignedGroup, setAssignedGroup] = useState<"SOLIDS" | "STRIPES" | null>(null);
  const [score, setScore] = useState<number>(0);
  const [gameMessage, setGameMessage] = useState<string>("Aim with mouse/touch, adjust power, and click Shoot!");
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const ballsRef = useRef<Ball[]>([]);

  // Initialize triangle rack of balls
  const initRack = useCallback(() => {
    const balls: Ball[] = [];
    // Cue Ball at head string
    balls.push({
      id: 0,
      x: 160,
      y: TABLE_HEIGHT / 2,
      vx: 0,
      vy: 0,
      color: BALL_COLORS[0],
      isStriped: false,
      potted: false
    });

    // 15 balls rack starting at foot spot
    const startX = 440;
    const startY = TABLE_HEIGHT / 2;
    const ids = [1, 9, 2, 8, 10, 3, 11, 4, 12, 5, 13, 6, 14, 7, 15]; // 8 in center
    let idIdx = 0;

    for (let col = 0; col < 5; col++) {
      const colX = startX + col * (BALL_RADIUS * 1.75);
      const startRowY = startY - col * BALL_RADIUS;
      for (let row = 0; row <= col; row++) {
        const ballId = ids[idIdx++];
        balls.push({
          id: ballId,
          x: colX,
          y: startRowY + row * (BALL_RADIUS * 2.1),
          vx: 0,
          vy: 0,
          color: BALL_COLORS[ballId],
          isStriped: ballId >= 9,
          potted: false
        });
      }
    }

    ballsRef.current = balls;
    setAssignedGroup(null);
    setScore(0);
    setIsGameOver(false);
    setGameMessage("Break shot ready! Aim towards the rack and shoot.");
  }, []);

  useEffect(() => {
    initRack();
  }, [initRack]);

  // Main canvas animation and physics loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, TABLE_WIDTH, TABLE_HEIGHT);

      // 1. Draw Table Cushion Rails & Felt
      // Outer wooden rim
      ctx.fillStyle = "#3e2723";
      ctx.fillRect(0, 0, TABLE_WIDTH, TABLE_HEIGHT);

      // Inner green felt playfield
      ctx.fillStyle = "#065f46";
      ctx.fillRect(20, 20, TABLE_WIDTH - 40, TABLE_HEIGHT - 40);

      // Subtle table cloth felt texture
      ctx.fillStyle = "#047857";
      ctx.fillRect(24, 24, TABLE_WIDTH - 48, TABLE_HEIGHT - 48);

      // Head string line & spot
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(160, 24);
      ctx.lineTo(160, TABLE_HEIGHT - 24);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. Draw Pockets
      POCKETS.forEach((p) => {
        ctx.fillStyle = "#0a0a0a";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#27272a";
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      const balls = ballsRef.current;
      let moving = false;

      // 3. Physics update
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];
        if (b.potted) continue;

        // Apply friction
        b.vx *= FRICTION;
        b.vy *= FRICTION;

        if (Math.abs(b.vx) < 0.05) b.vx = 0;
        if (Math.abs(b.vy) < 0.05) b.vy = 0;

        if (b.vx !== 0 || b.vy !== 0) moving = true;

        b.x += b.vx;
        b.y += b.vy;

        // Cushion bounces
        const minX = 24 + BALL_RADIUS;
        const maxX = TABLE_WIDTH - 24 - BALL_RADIUS;
        const minY = 24 + BALL_RADIUS;
        const maxY = TABLE_HEIGHT - 24 - BALL_RADIUS;

        if (b.x < minX) {
          b.x = minX;
          b.vx = -b.vx * 0.85;
        } else if (b.x > maxX) {
          b.x = maxX;
          b.vx = -b.vx * 0.85;
        }

        if (b.y < minY) {
          b.y = minY;
          b.vy = -b.vy * 0.85;
        } else if (b.y > maxY) {
          b.y = maxY;
          b.vy = -b.vy * 0.85;
        }

        // Pocket detection
        POCKETS.forEach((pocket) => {
          const dx = b.x - pocket.x;
          const dy = b.y - pocket.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < pocket.r) {
            b.potted = true;
            b.vx = 0;
            b.vy = 0;

            if (b.id === 0) {
              // Scratch!
              setTimeout(() => {
                b.potted = false;
                b.x = 160;
                b.y = TABLE_HEIGHT / 2;
                b.vx = 0;
                b.vy = 0;
                setGameMessage("Cue ball scratched! Re-placed behind the head string.");
              }, 800);
            } else if (b.id === 8) {
              setIsGameOver(true);
              setGameMessage("8-Ball pocketed! Game Complete.");
            } else {
              setScore((s) => s + 10);
              if (!assignedGroup) {
                const group = b.id <= 7 ? "SOLIDS" : "STRIPES";
                setAssignedGroup(group);
                setGameMessage(`Group assigned: You are ${group}!`);
              }
            }
          }
        });

        // Ball-to-ball elastic collision
        for (let j = i + 1; j < balls.length; j++) {
          const b2 = balls[j];
          if (b2.potted) continue;

          const dx = b2.x - b.x;
          const dy = b2.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < BALL_RADIUS * 2) {
            const overlap = (BALL_RADIUS * 2 - dist) / 2;
            const nx = dx / (dist || 1);
            const ny = dy / (dist || 1);

            b.x -= nx * overlap;
            b.y -= ny * overlap;
            b2.x += nx * overlap;
            b2.y += ny * overlap;

            // Elastic velocity resolution along normal
            const kx = b.vx - b2.vx;
            const ky = b.vy - b2.vy;
            const p = 2 * (nx * kx + ny * ky) / 2;

            b.vx -= p * nx;
            b.vy -= p * ny;
            b2.vx += p * nx;
            b2.vy += p * ny;
          }
        }
      }

      setIsMoving(moving);

      // 4. Draw Balls
      balls.forEach((b) => {
        if (b.potted) return;

        // Shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.beginPath();
        ctx.arc(b.x + 2, b.y + 2, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        // Ball body
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        // Stripe band
        if (b.isStriped) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(b.x - BALL_RADIUS + 2, b.y - 3, (BALL_RADIUS - 2) * 2, 6);
        }

        // Center number circle
        if (b.id !== 0) {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#000000";
          ctx.font = "bold 6px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(b.id.toString(), b.x, b.y);
        }

        // 3D Highlight specular
        const gradient = ctx.createRadialGradient(
          b.x - 3, b.y - 3, 1,
          b.x, b.y, BALL_RADIUS
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.6)");
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0.4)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(b.x, b.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. Draw Cue Aim Line when balls are stationary
      const cue = balls[0];
      if (cue && !cue.potted && !moving && !isGameOver) {
        const aimLength = 120;
        const targetX = cue.x + Math.cos(shotAngle) * aimLength;
        const targetY = cue.y + Math.sin(shotAngle) * aimLength;

        // Projected aim line
        ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(cue.x, cue.y);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Cue stick visual
        const stickLength = 140;
        const stickOffset = 18 + (power / 100) * 15;
        const stickStartX = cue.x - Math.cos(shotAngle) * stickOffset;
        const stickStartY = cue.y - Math.sin(shotAngle) * stickOffset;
        const stickEndX = cue.x - Math.cos(shotAngle) * (stickOffset + stickLength);
        const stickEndY = cue.y - Math.sin(shotAngle) * (stickOffset + stickLength);

        ctx.strokeStyle = "#d97706";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(stickStartX, stickStartY);
        ctx.lineTo(stickEndX, stickEndY);
        ctx.stroke();

        ctx.strokeStyle = "#fef3c7";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(stickStartX, stickStartY);
        ctx.lineTo(stickStartX - Math.cos(shotAngle) * 12, stickStartY - Math.sin(shotAngle) * 12);
        ctx.stroke();
      }

      animId = requestAnimationFrame(updateAndDraw);
    };

    animId = requestAnimationFrame(updateAndDraw);
    return () => cancelAnimationFrame(animId);
  }, [shotAngle, power, isGameOver, assignedGroup]);

  // Handle canvas aiming interaction
  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isMoving || isGameOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const mouseX = (clientX - rect.left) * (TABLE_WIDTH / rect.width);
    const mouseY = (clientY - rect.top) * (TABLE_HEIGHT / rect.height);

    const cue = ballsRef.current[0];
    if (!cue || cue.potted) return;

    const angle = Math.atan2(mouseY - cue.y, mouseX - cue.x);
    setShotAngle(angle);
  };

  // Execute pool shot
  const executeShot = () => {
    if (isMoving || isGameOver) return;
    const cue = ballsRef.current[0];
    if (!cue || cue.potted) return;

    const impulse = (power / 100) * 16;
    cue.vx = Math.cos(shotAngle) * impulse;
    cue.vy = Math.sin(shotAngle) * impulse;
    setIsMoving(true);
    setGameMessage("Shot taken! Waiting for balls to settle...");
  };

  return (
    <ToolTemplate
      title="Play 8 Ball Pool Online - Free Browser Billiards Game"
      description="Play classic 8 Ball Pool billiards in your browser. Realistic 2D physics, accurate bank shots, power slider control, and zero downloads needed."
    >
      <Helmet>
        <title>Play 8 Ball Pool Online - Free 2D Billiards Game | Axevora</title>
        <meta
          name="description"
          content="Play 8 Ball Pool online for free on Axevora. Practice real pool physics, aim trick shots, pocket solids and stripes, and pot the 8-ball in browser."
        />
        <meta
          name="keywords"
          content="8 ball pool, play 8 ball pool online, 8 ball pool free, pool game online, billiards online, browser pool, 8 ball game, cue sports"
        />
        <link rel="canonical" href="https://axevora.com/tools/8-ball-pool" />
        <meta property="og:title" content="Play 8 Ball Pool Online - Free 2D Billiards Game | Axevora" />
        <meta
          property="og:description"
          content="Realistic 2D billiards simulation with bank shot physics, power gauge, and authentic pocket mechanics."
        />
        <meta property="og:url" content="https://axevora.com/tools/8-ball-pool" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Play 8 Ball Pool Online - Free 2D Billiards Game | Axevora" />
        <meta
          name="twitter:description"
          content="Free online 8 Ball Pool game with smooth physics and mobile touch support."
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
                  { "@type": "ListItem", "position": 4, "name": "8 Ball Pool", "item": "https://axevora.com/tools/8-ball-pool" }
                ]
              },
              {
                "@type": "VideoGame",
                "name": "Axevora 8 Ball Pool",
                "description": "Play 8 Ball Pool online in browser. Accurate billiards physics, aim indicators, power control, and authentic solids vs stripes rules.",
                "genre": ["Sports Game", "Billiards", "Classic"],
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
                    "name": "How are Solids and Stripes determined in 8 Ball Pool?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "The table is open after the break. The first player to legally pocket an object ball (other than the 8-ball) claims that group (Solids numbered 1-7 or Stripes numbered 9-15)."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What happens if you pocket the 8-Ball too early?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Pocketing the black 8-ball before clearing all your assigned group balls results in an immediate loss of the game."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can I play 8 Ball Pool on mobile phone?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes! The game features touch-friendly drag-aiming and an intuitive power slider perfectly sized for mobile phones and tablets."
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
        <span className="text-foreground font-semibold">8 Ball Pool</span>
      </nav>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-card/60 backdrop-blur p-4 rounded-2xl border border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <CircleDot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                Classic 8 Ball Pool
                {assignedGroup && (
                  <Badge variant="outline" className="text-[10px] uppercase font-bold border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                    Your Group: {assignedGroup}
                  </Badge>
                )}
              </h2>
              <p className="text-xs text-muted-foreground">{gameMessage}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs px-2.5 py-1">
              Score: <strong className="ml-1 text-emerald-500">{score}</strong>
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={initRack}
              className="text-xs font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Re-Rack
            </Button>
          </div>
        </div>

        {/* Pool Table Canvas Container */}
        <div className="flex flex-col items-center bg-card/40 p-4 rounded-2xl border border-border/60 shadow-xl space-y-4">
          <div className="w-full max-w-[640px] aspect-[640/340] rounded-xl overflow-hidden shadow-2xl border-4 border-[#27150c] relative select-none">
            <canvas
              ref={canvasRef}
              width={TABLE_WIDTH}
              height={TABLE_HEIGHT}
              onMouseDown={handleCanvasInteraction}
              onMouseMove={(e) => {
                if (e.buttons === 1) handleCanvasInteraction(e);
              }}
              onTouchStart={handleCanvasInteraction}
              onTouchMove={handleCanvasInteraction}
              className="w-full h-full cursor-crosshair block"
            />
          </div>

          {/* Bottom Aim & Shoot Controls */}
          <div className="w-full max-w-[640px] grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-card/60 p-3 rounded-xl border border-border/40">
            <div className="sm:col-span-8 flex items-center gap-3">
              <span className="text-xs font-bold uppercase text-muted-foreground shrink-0 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-amber-500" /> Power: {power}%
              </span>
              <Slider
                value={[power]}
                onValueChange={(val) => setPower(val[0])}
                min={15}
                max={100}
                step={1}
                className="w-full"
                disabled={isMoving || isGameOver}
              />
            </div>

            <div className="sm:col-span-4 flex justify-end">
              <Button
                onClick={executeShot}
                disabled={isMoving || isGameOver}
                className="w-full sm:w-auto font-bold bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-6"
              >
                <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                {isMoving ? "Rolling..." : "Shoot!"}
              </Button>
            </div>
          </div>
        </div>

        {/* Comprehensive SEO Content Section */}
        <section className="pt-8 border-t border-border/60 space-y-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Play Free 8 Ball Pool Online - Browser Billiards Simulation
            </h1>
            <p className="mt-3 text-muted-foreground leading-relaxed text-sm sm:text-base">
              Step up to the green felt in <strong>Axevora 8 Ball Pool</strong>, an online cue sports experience
              built right into your browser. Featuring realistic momentum physics, cushioned rail bounces, and smooth
              touch aiming, this game delivers the tactile excitement of real billiards without needing to download large app bundles.
            </p>
          </div>

          {/* Rules and Strategy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/40 border-border/60">
              <CardContent className="p-6 space-y-3">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-500" /> Official 8-Ball Rules Summary
                </h2>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-2.5">
                  <li><strong>The Break:</strong> The balls are racked in a triangle with the 8-ball in the center. The break shot drives the cue ball into the rack to scatter the balls.</li>
                  <li><strong>Open Table:</strong> The table remains open until the first non-8 ball is pocketed, assigning either Solids (1-7) or Stripes (9-15) to the player.</li>
                  <li><strong>Clearing Your Group:</strong> You must pot all 7 of your assigned group balls before you are eligible to take on the 8-ball.</li>
                  <li><strong>The Winning Shot:</strong> Cleanly pocket the black 8-ball into any pocket after all your group balls are cleared to win the match.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-border/60">
              <CardContent className="p-6 space-y-3">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-500" /> Aiming & Cue Ball Control Tips
                </h2>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-2.5">
                  <li><strong>Use Ghost Ball Aiming:</strong> Visualize where the cue ball needs to be at the exact moment of impact to send the object ball into the pocket.</li>
                  <li><strong>Regulate Shot Power:</strong> Hitting the ball at 100% power makes the cue ball bounce wildly. Use 40-60% power for controlled positional play.</li>
                  <li><strong>Bank Off Cushions:</strong> When direct paths are blocked by opponent balls, use cushion reflections to execute clever carom and bank shots.</li>
                  <li><strong>Avoid Scratches:</strong> Always consider where the cue ball will stop rolling to avoid accidentally sinking it into a corner or side pocket.</li>
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
                  <h3 className="text-sm font-bold text-foreground">Is 8 Ball Pool free to play?</h3>
                  <p className="text-xs text-muted-foreground">Yes! Axevora 8 Ball Pool is 100% free with unlimited re-racks, realistic physics, and zero advertisements obstructing gameplay.</p>
                </CardContent>
              </Card>

              <Card className="bg-card/30 border-border/50">
                <CardContent className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground">How do I aim on touchscreen phones?</h3>
                  <p className="text-xs text-muted-foreground">Simply tap or drag your finger anywhere on the table to adjust the projected cue direction, adjust the power slider, and tap Shoot.</p>
                </CardContent>
              </Card>

              <Card className="bg-card/30 border-border/50">
                <CardContent className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground">What happens on a scratch?</h3>
                  <p className="text-xs text-muted-foreground">If the white cue ball is pocketed, it automatically resets behind the head string line so you can continue your run.</p>
                </CardContent>
              </Card>

              <Card className="bg-card/30 border-border/50">
                <CardContent className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground">What is the difference between pool and snooker?</h3>
                  <p className="text-xs text-muted-foreground">8 Ball Pool is played on a smaller table with 16 balls (solids, stripes, 8-ball, cue ball), whereas snooker uses a 12-foot table with 22 smaller balls and point scoring.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Games Internal Links */}
          <div className="pt-6 border-t border-border/40">
            <h2 className="text-base font-bold text-foreground mb-3">Related Classic & Arcade Games</h2>
            <div className="flex flex-wrap gap-2.5">
              <Link to="/tools/pool-shooter" className="px-3 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border/60 text-xs font-semibold text-foreground hover:text-primary transition-colors">
                Play Pool Bubble Shooter →
              </Link>
              <Link to="/tools/chess" className="px-3 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border/60 text-xs font-semibold text-foreground hover:text-primary transition-colors">
                Play Chess Online →
              </Link>
              <Link to="/tools/checkers" className="px-3 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border/60 text-xs font-semibold text-foreground hover:text-primary transition-colors">
                Play Checkers →
              </Link>
              <Link to="/tools/click-speed-test" className="px-3 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border/60 text-xs font-semibold text-foreground hover:text-primary transition-colors">
                Click Speed Test →
              </Link>
              <Link to="/games" className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-600 dark:text-emerald-400 transition-colors">
                Explore All 22 Games in Games Hub →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </ToolTemplate>
  );
}
