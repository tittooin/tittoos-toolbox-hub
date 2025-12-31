import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { RefreshCw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Gamepad2, Move, Undo2, Volume2, VolumeX } from 'lucide-react';
import ToolTemplate from '../../components/ToolTemplate';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// Simple Audio Synthesizer for Game Sounds
class SoundManager {
    private ctx: AudioContext | null = null;
    private enabled: boolean = true;

    constructor() {
        try {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            console.error("AudioContext not supported");
        }
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
        if (enabled && this.ctx?.state === 'suspended') {
            this.ctx.resume();
        }
    }

    private playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1) {
        if (!this.enabled || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    move() { this.playTone(150, 'sine', 0.1, 0.05); }
    merge(value: number) {
        // Higher pitch for higher values
        const baseFreq = 220;
        const semitones = Math.log2(value) * 2;
        const freq = baseFreq * Math.pow(2, semitones / 12);
        this.playTone(freq, 'triangle', 0.15, 0.1);
    }
    win() {
        if (!this.enabled || !this.ctx) return;
        [440, 554, 659, 880].forEach((f, i) => setTimeout(() => this.playTone(f, 'sine', 0.3, 0.1), i * 100));
    }
    gameOver() { this.playTone(110, 'sawtooth', 0.5, 0.1); }
}

const Game2048 = () => {
    const [grid, setGrid] = useState<number[][]>(Array(4).fill(Array(4).fill(0)));
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [keepPlaying, setKeepPlaying] = useState(false);
    const [history, setHistory] = useState<{ grid: number[][], score: number }[]>([]);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const soundManager = useRef<SoundManager | null>(null);

    // Initialize game
    useEffect(() => {
        soundManager.current = new SoundManager();
        const savedBest = localStorage.getItem('2048-best-score');
        if (savedBest) setBestScore(parseInt(savedBest));
        startNewGame();
    }, []);

    const toggleSound = () => {
        const newState = !soundEnabled;
        setSoundEnabled(newState);
        soundManager.current?.setEnabled(newState);
    };

    const startNewGame = () => {
        const newGrid = Array(4).fill(0).map(() => Array(4).fill(0));
        addRandomTile(newGrid);
        addRandomTile(newGrid);
        setGrid(newGrid);
        setScore(0);
        setHistory([]);
        setGameOver(false);
        setWon(false);
        setKeepPlaying(false);
    };

    const addRandomTile = (currentGrid: number[][]) => {
        const emptyCells = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (currentGrid[r][c] === 0) emptyCells.push({ r, c });
            }
        }
        if (emptyCells.length > 0) {
            const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            currentGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    };

    const saveToHistory = () => {
        setHistory(prev => {
            const newHistory = [...prev, { grid: grid.map(row => [...row]), score }];
            // Limit history to 5 moves to prevent memory issues and make it strategic
            if (newHistory.length > 5) newHistory.shift();
            return newHistory;
        });
    };

    const undo = () => {
        if (history.length === 0 || gameOver) return;
        const lastState = history[history.length - 1];
        setGrid(lastState.grid);
        setScore(lastState.score);
        setHistory(prev => prev.slice(0, -1));
        setWon(false); // Reset win state if they undo back
    };

    const move = useCallback((direction: Direction) => {
        if (gameOver || (won && !keepPlaying)) return;

        let newGrid = grid.map(row => [...row]);
        let moved = false;
        let scoreToAdd = 0;
        let mergedValue = 0;

        const rotateGrid = (g: number[][]) => g[0].map((_, i) => g.map(row => row[i]).reverse());
        const rotateGridCounter = (g: number[][]) => g[0].map((_, i) => g.map(row => row[g.length - 1 - i]));

        // Normalize to LEFT movement logic
        if (direction === 'RIGHT') newGrid = newGrid.map(row => row.reverse());
        if (direction === 'UP') newGrid = rotateGridCounter(newGrid);
        if (direction === 'DOWN') newGrid = rotateGrid(newGrid);

        // Process each row (LEFT logic)
        for (let r = 0; r < 4; r++) {
            let row = newGrid[r].filter(val => val !== 0);
            for (let c = 0; c < row.length - 1; c++) {
                if (row[c] === row[c + 1]) {
                    row[c] *= 2;
                    scoreToAdd += row[c];
                    mergedValue = Math.max(mergedValue, row[c]);
                    row.splice(c + 1, 1);
                    moved = true; // Merge happened
                }
            }
            while (row.length < 4) row.push(0);
            if (JSON.stringify(newGrid[r]) !== JSON.stringify(row)) moved = true;
            newGrid[r] = row;
        }

        // Restore orientation
        if (direction === 'RIGHT') newGrid = newGrid.map(row => row.reverse());
        if (direction === 'UP') newGrid = rotateGrid(newGrid);
        if (direction === 'DOWN') newGrid = rotateGridCounter(newGrid);

        if (moved) {
            saveToHistory();
            soundManager.current?.move();
            if (mergedValue > 0) soundManager.current?.merge(mergedValue);
            if (navigator.vibrate) navigator.vibrate(20); // Haptic feedback

            addRandomTile(newGrid);
            setGrid(newGrid);
            setScore(prev => {
                const newScore = prev + scoreToAdd;
                if (newScore > bestScore) {
                    setBestScore(newScore);
                    localStorage.setItem('2048-best-score', newScore.toString());
                }
                return newScore;
            });

            if (checkWin(newGrid) && !won && !keepPlaying) {
                setWon(true);
                soundManager.current?.win();
                if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
            } else if (checkGameOver(newGrid)) {
                setGameOver(true);
                soundManager.current?.gameOver();
                if (navigator.vibrate) navigator.vibrate(200);
            }
        }
    }, [grid, gameOver, won, bestScore, keepPlaying]);

    const checkWin = (g: number[][]) => {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (g[r][c] === 2048) return true;
            }
        }
        return false;
    };

    const checkGameOver = (g: number[][]) => {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (g[r][c] === 0) return false;
                if (r < 3 && g[r][c] === g[r + 1][c]) return false;
                if (c < 3 && g[r][c] === g[r][c + 1]) return false;
            }
        }
        return true;
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                move(e.key.replace('Arrow', '').toUpperCase() as Direction);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [move]);

    // Touch handling
    const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart) return;
        const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
        const dx = touchEnd.x - touchStart.x;
        const dy = touchEnd.y - touchStart.y;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (Math.abs(dx) > 30) move(dx > 0 ? 'RIGHT' : 'LEFT');
        } else {
            if (Math.abs(dy) > 30) move(dy > 0 ? 'DOWN' : 'UP');
        }
        setTouchStart(null);
    };

    const getTileStyle = (value: number) => {
        // Neon Theme Colors
        const baseStyle = "shadow-[0_0_10px_rgba(0,0,0,0.3)] border border-white/10 backdrop-blur-md";

        switch (value) {
            case 0: return "bg-white/5 border-transparent";
            case 2: return `${baseStyle} bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.4)]`;
            case 4: return `${baseStyle} bg-teal-500/20 text-teal-400 border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.4)]`;
            case 8: return `${baseStyle} bg-green-500/20 text-green-400 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.4)]`;
            case 16: return `${baseStyle} bg-lime-500/20 text-lime-400 border-lime-500/50 shadow-[0_0_15px_rgba(132,204,22,0.4)]`;
            case 32: return `${baseStyle} bg-yellow-500/20 text-yellow-400 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.4)]`;
            case 64: return `${baseStyle} bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.5)]`;
            case 128: return `${baseStyle} bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.5)]`;
            case 256: return `${baseStyle} bg-pink-500/20 text-pink-400 border-pink-500/50 shadow-[0_0_25px_rgba(236,72,153,0.5)]`;
            case 512: return `${baseStyle} bg-purple-500/20 text-purple-400 border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.5)]`;
            case 1024: return `${baseStyle} bg-indigo-500/20 text-indigo-400 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.6)]`;
            case 2048: return `${baseStyle} bg-yellow-400/30 text-yellow-300 border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.8)] animate-pulse`;
            default: return `${baseStyle} bg-gray-500/20 text-white`;
        }
    };

    return (
        <ToolTemplate
            title="2048 Neon"
            description="Experience the classic puzzle game with a futuristic neon look. Join the glowing tiles to reach 2048!"
        >
            <Helmet>
                <title>2048 Neon - Play Free Online Logic Game | Axevora</title>
                <meta name="description" content="Play the enhanced 2048 Neon game online. Features glowing Cyberpunk visuals, sound effects, undo move, and haptic feedback. Fully responsive and free." />
            </Helmet>

            <div className="max-w-md mx-auto space-y-6">
                {/* Header Stats */}
                <div className="flex justify-between items-center gap-2">
                    <div className="flex gap-2">
                        <div className="bg-neutral-900/80 border border-white/10 p-3 rounded-xl min-w-[80px] text-center">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Score</p>
                            <p className="text-xl font-bold text-white shadow-cyan-500/50">{score}</p>
                        </div>
                        <div className="bg-neutral-900/80 border border-white/10 p-3 rounded-xl min-w-[80px] text-center">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Best</p>
                            <p className="text-xl font-bold text-white">{bestScore}</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={undo} variant="outline" size="icon" disabled={history.length === 0 || gameOver} className="bg-neutral-900 border-white/10 hover:bg-neutral-800">
                            <Undo2 className="w-5 h-5" />
                        </Button>
                        <Button onClick={toggleSound} variant="outline" size="icon" className="bg-neutral-900 border-white/10 hover:bg-neutral-800">
                            {soundEnabled ? <Volume2 className="w-5 h-5 text-green-400" /> : <VolumeX className="w-5 h-5 text-red-400" />}
                        </Button>
                        <Button onClick={startNewGame} variant="outline" size="icon" className="bg-neutral-900 border-white/10 hover:bg-neutral-800">
                            <RefreshCw className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Game Grid */}
                <div
                    className="relative bg-black p-4 rounded-2xl aspect-square touch-none select-none border border-white/5 shadow-2xl shadow-blue-900/20"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Grid Background Lines to simulate slots */}
                    <div className="absolute inset-4 grid grid-cols-4 grid-rows-4 gap-3 z-0 pointer-events-none">
                        {Array(16).fill(0).map((_, i) => (
                            <div key={i} className="bg-white/5 rounded-lg border border-white/5"></div>
                        ))}
                    </div>

                    <div className="grid grid-cols-4 grid-rows-4 gap-3 h-full relative z-10">
                        {grid.map((row, r) => (
                            row.map((cell, c) => (
                                <div
                                    key={`${r}-${c}`}
                                    className={`rounded-lg flex items-center justify-center text-3xl md:text-4xl font-black transition-all duration-200 transform ${getTileStyle(cell)} ${cell > 0 ? 'scale-100' : 'scale-0'}`}
                                >
                                    {cell !== 0 && cell}
                                </div>
                            ))
                        ))}
                    </div>

                    {/* Overlays */}
                    {(gameOver || (won && !keepPlaying)) && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center rounded-2xl z-20 animate-in fade-in duration-500">
                            {won ? (
                                <Trophy className="w-24 h-24 text-yellow-400 mb-6 animate-bounce drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                            ) : (
                                <Gamepad2 className="w-24 h-24 text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                            )}
                            <h2 className={`text-5xl font-black mb-2 ${won ? 'text-yellow-400' : 'text-red-500'} tracking-tighter drop-shadow-lg`}>
                                {won ? 'VICTORY!' : 'GAME OVER'}
                            </h2>
                            <p className="text-gray-300 text-lg mb-8">Final Score: <span className="text-white font-bold">{score}</span></p>

                            <div className="flex flex-col gap-3 w-48">
                                <Button size="lg" onClick={startNewGame} className="w-full bg-white text-black hover:bg-gray-200 font-bold">
                                    {won ? 'Play Again' : 'Try Again'}
                                </Button>
                                {won && (
                                    <Button variant="outline" size="lg" onClick={() => setKeepPlaying(true)} className="w-full border-white/20 hover:bg-white/10 text-white">
                                        Keep Playing
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls Hint */}
                <div className="grid grid-cols-3 gap-4 text-center text-muted-foreground text-xs font-medium opacity-60">
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex gap-1">
                            <span className="p-1.5 border border-white/20 rounded bg-white/5"><ArrowUp className="w-3 h-3" /></span>
                        </div>
                        <div className="flex gap-1">
                            <span className="p-1.5 border border-white/20 rounded bg-white/5"><ArrowLeft className="w-3 h-3" /></span>
                            <span className="p-1.5 border border-white/20 rounded bg-white/5"><ArrowDown className="w-3 h-3" /></span>
                            <span className="p-1.5 border border-white/20 rounded bg-white/5"><ArrowRight className="w-3 h-3" /></span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-base font-bold">OR</span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2">
                        <Move className="w-6 h-6" />
                        <span>Swipe</span>
                    </div>
                </div>

                {/* Instructions */}
                <div className="prose prose-invert max-w-none text-sm bg-neutral-900/50 p-4 rounded-xl border border-white/5">
                    <h3 className="text-white mt-0">How to Play</h3>
                    <p className="text-gray-400">
                        Use your <strong>arrow keys</strong> or <strong>swipe</strong> to move the glowing tiles. When two tiles with the same number touch, they <strong>merge into one!</strong>
                    </p>
                    <p className="text-gray-400 mb-0">
                        Join the numbers to create the legendary <strong>2048 tile!</strong>
                    </p>
                </div>
            </div>
        </ToolTemplate>
    );
};

export default Game2048;
