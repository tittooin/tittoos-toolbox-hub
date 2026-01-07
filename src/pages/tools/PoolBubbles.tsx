import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Trophy, Volume2, VolumeX, HelpCircle, Flame } from "lucide-react";
import { Link } from "react-router-dom";

import { Helmet } from "react-helmet-async";
import { toast } from "sonner";

// Game Constants
const GRID_ROWS = 14;
const GRID_COLS = 12; // Smaller balls
const BUBBLE_SPEED = 15;
const TYPE_BOMB = 99; // Special Bomb Type

// Colors for "Pool" Theme
const BALL_COLORS = [
    "#FFD700", // 1 - Yellow
    "#0000FF", // 2 - Blue
    "#FF0000", // 3 - Red
    "#800080", // 4 - Purple
    "#FFA500", // 5 - Orange
    "#006400", // 6 - Green
    "#800000", // 7 - Maroon
    "#000000", // 8 - Black
];

const PoolBubbles = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showGuide, setShowGuide] = useState(true);

    // Game State Refs
    const gameState = useRef({
        grid: [] as (number | null)[][],
        bullet: null as { x: number, y: number, angle: number, type: number } | null,
        nextBubbleType: 0,
        particles: [] as any[],
        animationId: 0,
        width: 0,
        height: 0,
        radius: 20,
        mouseX: 0,
        mouseY: 0,
        isDragging: false,
        dragAngle: -Math.PI / 2 // Default aiming up
    });

    // --- Audio System ---
    // --- Audio System (Optimized) ---
    const audioCtxRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        // Initialize AudioContext once
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
            audioCtxRef.current = new AudioContextClass();
        }
        return () => {
            if (audioCtxRef.current) {
                audioCtxRef.current.close();
            }
        };
    }, []);


    const playSound = (type: 'shoot' | 'pop' | 'bounce' | 'win' | 'lose' | 'explode') => {
        if (!soundEnabled || !audioCtxRef.current) return;

        try {
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            const now = ctx.currentTime;

            if (type === 'shoot') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
            } else if (type === 'pop') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600 + Math.random() * 200, now);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
            } else if (type === 'bounce') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(150, now);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            } else if (type === 'explode') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.exponentialRampToValueAtTime(10, now + 0.3);
                gain.gain.setValueAtTime(0.5, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
            } else if (type === 'win') {
                // Simple Win Chime
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
            } else if (type === 'lose') {
                // Simple Lose Drone
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.linearRampToValueAtTime(50, now + 0.5);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
            }

        } catch (e) {
            console.error("Audio Error:", e);
        }
    };

    // --- Initialization ---
    useEffect(() => {
        initGame(1); // Explicitly start at Level 1 on mount
        window.addEventListener('resize', handleResize);

        const loop = () => {
            update();
            draw();
            gameState.current.animationId = requestAnimationFrame(loop);
        };
        loop();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(gameState.current.animationId);
        };
    }, []);

    const handleResize = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;

        const maxWidth = Math.min(window.innerWidth - 32, 600);
        const maxHeight = window.innerHeight * 0.7;

        canvas.width = maxWidth;
        canvas.height = maxHeight;

        gameState.current.width = canvas.width;
        gameState.current.height = canvas.height;

        gameState.current.radius = (canvas.width / (GRID_COLS * 2 + 1));
    };

    const initGame = (targetLevel: number) => {
        if (!canvasRef.current) return;
        handleResize();

        // Level Logic: More colors as level increases
        const numColors = Math.min(4 + Math.floor((targetLevel - 1) / 2), 8);

        const newGrid = [];
        for (let r = 0; r < GRID_ROWS; r++) {
            const row = [];
            for (let c = 0; c < GRID_COLS - (r % 2); c++) {
                if (r < 5) { // Initial Rows
                    row.push(Math.floor(Math.random() * numColors));
                } else {
                    row.push(null);
                }
            }
            newGrid.push(row);
        }

        gameState.current.grid = newGrid;

        // Ensure starting ball is valid
        gameState.current.nextBubbleType = Math.floor(Math.random() * numColors);

        // Reset Logic
        gameState.current.bullet = null;
        gameState.current.particles = [];
        gameState.current.isDragging = false;
        gameState.current.dragAngle = -Math.PI / 2;

        setLevel(targetLevel);

        if (targetLevel === 1) {
            setScore(0);
        }
        // NOTE: We do NOT reset score if targetLevel > 1, so it accumulates.

        setGameOver(false);
        setGameWon(false);
    };

    // --- Core Game Logic ---
    const update = () => {
        if (gameOver || gameWon) return;

        const state = gameState.current;
        const { bullet, width, height, radius } = state;

        if (bullet) {
            bullet.x += Math.cos(bullet.angle) * BUBBLE_SPEED;
            bullet.y += Math.sin(bullet.angle) * BUBBLE_SPEED;

            // Wall Collisions
            if (bullet.x - radius < 0) {
                bullet.x = radius;
                bullet.angle = Math.PI - bullet.angle;
                playSound('bounce');
            } else if (bullet.x + radius > width) {
                bullet.x = width - radius;
                bullet.angle = Math.PI - bullet.angle;
                playSound('bounce');
            }

            // Ceiling Collision
            if (bullet.y - radius < 0) {
                snapBubble(bullet);
            } else {
                // Ball Collision
                if (checkCollision(bullet)) {
                    snapBubble(bullet);
                }
            }
        }

        // Particle Physics
        state.particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.02;
        });
        state.particles = state.particles.filter(p => p.alpha > 0);
    };

    const checkCollision = (bullet: any) => {
        const state = gameState.current;
        const { grid, radius } = state;

        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[r].length; c++) {
                if (grid[r][c] !== null) {
                    const { x, y } = getGridCoords(r, c);
                    const dx = bullet.x - x;
                    const dy = bullet.y - y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < radius * 2 - 4) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    const snapBubble = (bullet: any) => {
        const state = gameState.current;

        // BOMB LOGIC
        if (bullet.type === TYPE_BOMB) {
            explodeBomb(bullet.x, bullet.y);
            state.bullet = null;
            return;
        }

        const rowHeight = state.radius * Math.sqrt(3);
        const estRow = Math.round(bullet.y / rowHeight);

        let minDist = Infinity;
        let targetR = -1;
        let targetC = -1;

        for (let r = Math.max(0, estRow - 2); r < Math.min(GRID_ROWS, estRow + 2); r++) {
            const cols = GRID_COLS - (r % 2);
            for (let c = 0; c < cols; c++) {
                if (state.grid[r][c] === null) {
                    const { x, y } = getGridCoords(r, c);
                    const dist = Math.sqrt((x - bullet.x) ** 2 + (y - bullet.y) ** 2);
                    if (dist < minDist) {
                        minDist = dist;
                        targetR = r;
                        targetC = c;
                    }
                }
            }
        }

        if (targetR !== -1) {
            state.grid[targetR][targetC] = bullet.type;
            state.bullet = null;
            playSound('pop');

            handleMatches(targetR, targetC, bullet.type);
            checkGameOver();
        }
    };

    const explodeBomb = (x: number, y: number) => {
        const state = gameState.current;
        playSound('explode');

        // Simply remove balls in a radius
        const blastRadius = 100;

        for (let r = 0; r < state.grid.length; r++) {
            for (let c = 0; c < state.grid[r].length; c++) {
                if (state.grid[r][c] !== null) {
                    const coords = getGridCoords(r, c);
                    const dist = Math.sqrt((coords.x - x) ** 2 + (coords.y - y) ** 2);
                    if (dist < blastRadius) {
                        const type = state.grid[r][c]!;
                        state.grid[r][c] = null;
                        createParticles(r, c, type);
                        setScore(prev => prev + 20);
                    }
                }
            }
        }
        removeFloating();
        checkGameOver();
    };

    const handleMatches = (r: number, c: number, type: number) => {
        const state = gameState.current;
        const visited = new Set<string>();
        const matches: { r: number, c: number }[] = [];

        const queue = [{ r, c }];
        visited.add(`${r},${c}`);

        while (queue.length > 0) {
            const curr = queue.pop()!;
            matches.push(curr);

            getNeighbors(curr.r, curr.c).forEach(n => {
                if (!visited.has(`${n.r},${n.c}`) && state.grid[n.r][n.c] === type) {
                    visited.add(`${n.r},${n.c}`);
                    queue.push(n);
                }
            });
        }

        if (matches.length >= 3) {
            playSound('pop');
            matches.forEach(m => {
                state.grid[m.r][m.c] = null;
                createParticles(m.r, m.c, type);
                setScore(prev => prev + 10); // Standard Score increment
            });

            removeFloating();
        }
    };

    // LEVEL UP MONITOR
    // We check score in a slightly different way to avoid recursion loop
    useEffect(() => {
        const nextThreshold = getLevelThreshold(level);
        if (score >= nextThreshold && level < 50) { // Safety cap
            levelUp();
        }
    }, [score]);


    const getLevelThreshold = (lvl: number) => {
        // Linear Progression: 1000, 2500, 4500...
        // Level 1 needs 1000.
        // Level 2 needs 1500 more (Total 2500).
        let total = 0;
        for (let i = 1; i <= lvl; i++) {
            total += 1000 + (i - 1) * 500;
        }
        return total;
    };

    const levelUp = () => {
        playSound('win');
        toast.success(`Level Up! Welcome to Level ${level + 1}`, {
            icon: '🎱',
            position: 'top-center',
            duration: 3000
        });

        // IMPORTANT: We set level FIRST so the effect doesn't trigger again immediately
        // The cleanup logic in initGame handles the rest.
        const nextLevel = level + 1;
        // setLevel is handled in initGame
        setTimeout(() => initGame(nextLevel), 1000);
    };

    const removeFloating = () => {
        const state = gameState.current;
        const visited = new Set<string>();

        const queue = [];
        for (let c = 0; c < state.grid[0].length; c++) {
            if (state.grid[0][c] !== null) {
                queue.push({ r: 0, c });
                visited.add(`0,${c}`);
            }
        }

        while (queue.length > 0) {
            const curr = queue.pop()!;
            getNeighbors(curr.r, curr.c).forEach(n => {
                if (!visited.has(`${n.r},${n.c}`) && state.grid[n.r][n.c] !== null) {
                    visited.add(`${n.r},${n.c}`);
                    queue.push(n);
                }
            });
        }

        let dropped = 0;
        for (let r = 0; r < GRID_ROWS; r++) {
            for (let c = 0; c < state.grid[r].length; c++) {
                if (state.grid[r][c] !== null && !visited.has(`${r},${c}`)) {
                    createParticles(r, c, state.grid[r][c]!);
                    state.grid[r][c] = null;
                    dropped++;
                }
            }
        }
        if (dropped > 0) setScore(prev => prev + dropped * 20);
    };

    const getNeighbors = (r: number, c: number) => {
        const neighbors = [];
        const isEven = r % 2 === 0;
        const offsets = isEven ?
            [[-1, -1], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 0]] :
            [[-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1]];

        for (let o of offsets) {
            const nr = r + o[0];
            const nc = c + o[1];
            if (nr >= 0 && nr < GRID_ROWS && nc >= 0 && nc < (GRID_COLS - (nr % 2))) {
                neighbors.push({ r: nr, c: nc });
            }
        }
        return neighbors;
    };

    const createParticles = (r: number, c: number, type: number) => {
        const { x, y } = getGridCoords(r, c);
        const color = type === TYPE_BOMB ? "#FFFFFF" : BALL_COLORS[type];
        for (let i = 0; i < 5; i++) {
            gameState.current.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                color,
                alpha: 1
            });
        }
    };

    const checkGameOver = () => {
        const state = gameState.current;
        let hasBall = false;
        for (let r = 0; r < GRID_ROWS; r++) {
            for (let c = 0; c < state.grid[r].length; c++) {
                if (state.grid[r][c] !== null) {
                    hasBall = true;
                    if (r >= GRID_ROWS - 1) {
                        setGameOver(true);
                        playSound('lose');
                        return;
                    }
                }
            }
        }
        if (!hasBall) {
            setGameWon(true);
            playSound('win');
        }
    };

    // --- Drawing ---
    const getGridCoords = (r: number, c: number) => {
        const { radius } = gameState.current;
        const rowHeight = radius * Math.sqrt(3);
        const xOffset = (r % 2) * radius + radius;
        return {
            x: c * radius * 2 + xOffset,
            y: r * rowHeight + radius
        };
    };

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Branding
        ctx.save();
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.font = "bold 60px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 6);
        ctx.fillText("AXEVORA", 0, 0);
        ctx.restore();

        const state = gameState.current;
        const { grid, bullet, particles, radius, dragAngle } = state;

        // Draw Grid
        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[r].length; c++) {
                const val = grid[r][c];
                if (val !== null) {
                    const { x, y } = getGridCoords(r, c);
                    drawBall(ctx, x, y, radius, val);
                }
            }
        }

        // Draw Bullet
        if (bullet) {
            drawBall(ctx, bullet.x, bullet.y, radius, bullet.type);
        }

        // Draw Shooter Origin (Cue Ball) & Aim Line
        if (!bullet && !gameOver && !gameWon) {
            const shooterX = canvas.width / 2;
            const shooterY = canvas.height - radius - 10;

            // Draw Next Ball (Cue Ball)
            drawBall(ctx, shooterX, shooterY, radius, state.nextBubbleType);

            // Reflective Aim Line (Always visible essentially, or only when dragging)
            // Let's make it always visible based on dragAngle
            // If dragging, we use current mouse angle. If not, last known angle? 
            // Better: Aim line follows dragAngle.

            const aimAngle = dragAngle;

            ctx.beginPath();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
            ctx.lineWidth = 4;
            ctx.setLineDash([10, 10]);

            // Ray Casting for Bounce
            let currX = shooterX;
            let currY = shooterY;
            let currAngle = aimAngle;
            let distRemaining = 1000;

            ctx.moveTo(currX, currY);

            for (let b = 0; b < 4; b++) {
                let distToWall = Infinity;
                let wallX = 0;

                if (Math.abs(Math.cos(currAngle)) > 0.01) {
                    if (Math.cos(currAngle) > 0) { // Moving Right
                        wallX = canvas.width - radius;
                        distToWall = (wallX - currX) / Math.cos(currAngle);
                    } else { // Moving Left
                        wallX = radius;
                        distToWall = (wallX - currX) / Math.cos(currAngle);
                    }
                }

                let distToCeiling = Infinity;
                if (Math.sin(currAngle) < 0) { // Moving Up
                    distToCeiling = (radius - currY) / Math.sin(currAngle);
                }

                if (distToWall < 0) distToWall = Infinity;
                if (distToCeiling < 0) distToCeiling = Infinity;

                const dist = Math.min(distToWall, distToCeiling, distRemaining);

                if (dist === Infinity) break;

                const nextX = currX + Math.cos(currAngle) * dist;
                const nextY = currY + Math.sin(currAngle) * dist;

                ctx.lineTo(nextX, nextY);

                currX = nextX;
                currY = nextY;
                distRemaining -= dist;

                if (distRemaining <= 0 || Math.abs(dist - distToCeiling) < 1) break;

                if (Math.abs(dist - distToWall) < 1) {
                    currAngle = Math.PI - currAngle;
                }
            }

            ctx.stroke();
            ctx.setLineDash([]);

            // Draw Pool Stick
            const stickDist = radius + 20;
            const stickLen = 300;
            const stickOffset = state.isDragging ? 20 : 0; // Pull back effect

            ctx.save();
            ctx.translate(shooterX, shooterY);
            ctx.rotate(aimAngle);

            ctx.fillStyle = "#8B4513";
            ctx.fillRect(stickDist + stickOffset, -6, stickLen, 12);

            ctx.fillStyle = "#E0E0E0";
            ctx.fillRect(stickDist + stickOffset - 5, -6, 5, 12);
            ctx.fillStyle = "#0000FF";
            ctx.fillRect(stickDist + stickOffset - 8, -6, 3, 12);

            // Stick Gradient
            const grad = ctx.createLinearGradient(stickDist + stickOffset, 0, stickDist + stickOffset + stickLen, 0);
            grad.addColorStop(0, "#8B4513");
            grad.addColorStop(1, "#3E2723");
            ctx.fillStyle = grad;
            ctx.fillRect(stickDist + stickOffset, -6, stickLen, 12);

            ctx.restore();
        }

        // Draw Particles
        state.particles.forEach((p) => {
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        });

        // Deadline
        ctx.strokeStyle = '#ff000044';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - radius * 4);
        ctx.lineTo(canvas.width, canvas.height - radius * 4);
        ctx.stroke();
    };

    const drawBall = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, type: number) => {
        // Special Bomb Rendering
        if (type === TYPE_BOMB) {
            const grad = ctx.createRadialGradient(x, y, r / 4, x, y, r);
            grad.addColorStop(0, '#FFFF00');
            grad.addColorStop(0.5, '#FF4500');
            grad.addColorStop(1, '#000000');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, r - 1, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "white";
            ctx.font = `bold ${Math.floor(r)}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("💣", x, y);
            return;
        }

        const color = BALL_COLORS[type];

        const grad = ctx.createRadialGradient(x - r / 3, y - r / 3, r / 4, x, y, r);
        grad.addColorStop(0, '#ffffff'); // Shine
        grad.addColorStop(0.3, color);
        grad.addColorStop(1, '#000000'); // Shadow

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r - 1, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x, y, r / 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.font = `bold ${Math.floor(r * 0.6)}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText((type + 1).toString(), x, y);
    };

    // --- Input Handling (Drag to Aim) ---
    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
        if (gameOver || gameWon || gameState.current.bullet) return;
        gameState.current.isDragging = true;
        updateAim(e);
        setShowGuide(false);
    };

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!gameState.current.isDragging) return;
        updateAim(e);
    };

    const handleEnd = (e: React.MouseEvent | React.TouchEvent) => {
        if (!gameState.current.isDragging) return;
        gameState.current.isDragging = false;
        shootBubble();
    };

    const updateAim = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const startX = canvas.width / 2;
        const startY = canvas.height - gameState.current.radius - 10;

        // Calculate angle from shooter to pointer
        // Limit angle to prevent shooting downwards
        let angle = Math.atan2(y - startY, x - startX);

        // Clamp Angle (Must be shooting UP)
        // -PI is left, 0 is right, -PI/2 is up
        // We allow from -PI + 0.1 to -0.1
        if (angle > -0.1) angle = -0.1;
        if (angle < -Math.PI + 0.1) angle = -Math.PI + 0.1;

        gameState.current.dragAngle = angle;
    };

    const shootBubble = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const startX = canvas.width / 2;
        const startY = canvas.height - gameState.current.radius - 10;

        gameState.current.bullet = {
            x: startX,
            y: startY,
            angle: gameState.current.dragAngle,
            type: gameState.current.nextBubbleType
        };

        // Chance to get a bomb next (5%)
        const isBomb = Math.random() < 0.05;
        const nextType = isBomb ? TYPE_BOMB : Math.floor(Math.random() * Math.min(4 + Math.floor((level - 1) / 2), 8));

        gameState.current.nextBubbleType = nextType;

        playSound('shoot');
    };


    return (
        <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4 selection:bg-none touch-none scale-100 overflow-hidden">
            <Helmet>
                <title>Pool Bubbles - Axevora Tools</title>
                <meta name="description" content="Classic bubble shooter game with a pool table theme." />
            </Helmet>

            {/* Header */}
            <div className="absolute top-4 left-4 z-10 w-full max-w-2xl flex justify-between px-8">
                <Link to="/tools">
                    <Button variant="ghost" className="text-white hover:bg-white/10">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Exit
                    </Button>
                </Link>
                <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="text-white bg-black/20" onClick={() => setSoundEnabled(!soundEnabled)}>
                        {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </Button>
                    <Button size="icon" variant="ghost" className="text-white bg-black/20" onClick={() => setShowGuide(true)}>
                        <HelpCircle size={20} />
                    </Button>
                </div>
            </div>

            {/* Score Board */}
            <div className="bg-neutral-800 border-4 border-amber-900/50 rounded-xl px-8 py-3 mb-4 shadow-2xl flex gap-8 items-center z-10">
                <div className="text-center">
                    <div className="text-amber-500 text-xs font-bold uppercase tracking-wider">Score</div>
                    <div className="text-white text-2xl font-black font-mono">{score.toString().padStart(6, '0')}</div>
                </div>
                <div className="h-8 w-[2px] bg-neutral-700"></div>
                <div className="flex flex-col items-center">
                    <div className="text-xs text-neutral-400 font-bold">LEVEL</div>
                    <div className="text-2xl font-black text-white flex items-center gap-2">
                        <Trophy className="text-yellow-400 w-5 h-5" /> {level}
                    </div>
                </div>
            </div>

            {/* Game Table */}
            <div className="relative group border-[16px] border-[#3e2723] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#004d00] overflow-hidden select-none">
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/felt.png")` }}>
                </div>

                <canvas
                    ref={canvasRef}
                    onMouseDown={handleStart}
                    onMouseMove={handleMove}
                    onMouseUp={handleEnd}
                    onMouseLeave={handleEnd}
                    onTouchStart={handleStart}
                    onTouchMove={handleMove}
                    onTouchEnd={handleEnd}
                    className="block cursor-crosshair touch-none select-none relative z-10"
                />

                {showGuide && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20 pointer-events-none animate-in fade-in" onClick={() => setShowGuide(false)}>
                        <div className="text-center text-white space-y-4 px-8">
                            <div className="animate-bounce text-6xl mb-4">👆</div>
                            <h2 className="text-3xl font-black text-amber-400">HOW TO PLAY</h2>
                            <div className="text-left space-y-2 bg-black/40 p-6 rounded-xl border border-white/10">
                                <p className="text-lg">🎯 <span className="font-bold">Drag</span> to Aim the Stick</p>
                                <p className="text-lg">👋 <span className="font-bold">Release</span> to Shoot</p>
                                <p className="text-lg">🎱 Match <span className="font-bold">3 Balls</span> to clear</p>
                                <p className="text-lg">💣 Use <span className="font-bold text-red-400">Bombs</span> to explode area!</p>
                            </div>
                            <p className="text-sm opacity-50 uppercase tracking-widest">Tap anywhere to start</p>
                        </div>
                    </div>
                )}

                {(gameOver || gameWon) && (
                    <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center animate-in zoom-in text-center p-6 backdrop-blur-sm">
                        <h2 className={`text-6xl font-black mb-4 ${gameWon ? 'text-green-500' : 'text-red-500'}`}>
                            {gameWon ? 'YOU WIN!' : 'GAME OVER'}
                        </h2>
                        <div className="text-2xl text-white mb-8">
                            Final Score: <span className="text-amber-400 font-mono">{score}</span>
                        </div>
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-xl px-12 py-6 rounded-2xl font-bold shadow-xl active:scale-95 transition-transform"
                            onClick={() => initGame(1)}
                        >
                            <RefreshCw className="mr-3 w-6 h-6 animate-spin-slow" />
                            Play Again
                        </Button>
                    </div>
                )}
            </div>

            <div className="mt-8 text-neutral-500 text-sm">
                Axevora Pool Shooter • v1.1
            </div>
        </div>
    );
};

export default PoolBubbles;
