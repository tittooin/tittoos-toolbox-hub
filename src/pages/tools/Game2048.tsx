import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Trophy, Undo2, Volume2, VolumeX } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// import ToolTemplate from '../../components/ToolTemplate';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// Simple Audio Synthesizer for Game Sounds
class SoundManager {
    private ctx: AudioContext | null = null;
    private enabled: boolean = true;
    private applauseAudio: HTMLAudioElement | null = null;

    constructor() {
        try {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            // Preload Applause Sound from GitHub Raw
            this.applauseAudio = new Audio('https://raw.githubusercontent.com/WoofJS/docs/master/sounds/applause.mp3');
            this.applauseAudio.volume = 0.8;
            this.applauseAudio.load();
        } catch (e) {
            console.error("AudioContext not supported");
        }
    }

    setEnabled(enabled: boolean) { this.enabled = enabled; }

    resizeAudioContext() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(console.error);
        }
    }

    private playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1) {
        if (!this.enabled || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    move() { this.playTone(150, 'sine', 0.1, 0.05); }

    merge(value: number) {
        if (!this.enabled || !this.ctx) return;

        // "Pop" Sound (Sine sweep) - cleaner than "tuk" noise
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.1); // Quick up-sweep
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);

        // Musical Chime
        this.playTone(value * 10 + 400, 'sine', 0.15, 0.1);
    }

    newRecord() {
        if (!this.enabled) return;

        // Play Real Applause MP3
        if (this.applauseAudio) {
            this.applauseAudio.currentTime = 0;
            this.applauseAudio.play().catch(e => console.error("Audio play failed", e));
        }

        // Celebration Fanfare Overlay
        if (this.ctx) {
            [440, 554, 659, 880, 1108].forEach((f, i) => {
                setTimeout(() => this.playTone(f, 'triangle', 0.3, 0.2), i * 80);
            });
        }
    }

    win() {
        if (!this.enabled) return;
        this.newRecord();

        if (this.ctx) {
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((f, i) => {
                setTimeout(() => this.playTone(f, 'square', 0.2, 0.15), i * 150 + 500);
            });
        }
    }

    gameOver() {
        this.playTone(150, 'sawtooth', 0.3, 0.1);
        setTimeout(() => this.playTone(100, 'sawtooth', 0.5, 0.1), 300);
    }
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
    const [emojis, setEmojis] = useState<{ id: number, x: number, y: number, text: string }[]>([]);
    const [showCelebration, setShowCelebration] = useState(false);
    const [recentScores, setRecentScores] = useState<number[]>([]);
    const soundManager = useRef<SoundManager | null>(null);
    const hasBeatenBest = useRef(false);

    // Initialize game
    useEffect(() => {
        console.log("🚀 2048 GAME LOADED: FINAL NEON VERSION 2.0");
        soundManager.current = new SoundManager();
        try {
            const savedBest = localStorage.getItem('2048-best-score');
            if (savedBest) setBestScore(parseInt(savedBest));

            const savedRecent = localStorage.getItem('2048-recent-scores');
            if (savedRecent) setRecentScores(JSON.parse(savedRecent));
        } catch (e) {
            console.warn("Storage access blocked", e);
        }

        startNewGame();
    }, []);

    // Save Score Logic
    useEffect(() => {
        if (gameOver) {
            const newRecent = [score, ...recentScores].slice(0, 5); // Keep last 5
            setRecentScores(newRecent);
            localStorage.setItem('2048-recent-scores', JSON.stringify(newRecent));
        }
    }, [gameOver]);

    const toggleSound = () => {
        const newState = !soundEnabled;
        setSoundEnabled(newState);
        soundManager.current?.setEnabled(newState);
        // Try to resume on toggle
        if (newState) soundManager.current?.resizeAudioContext();
    };

    const startNewGame = () => {
        soundManager.current?.resizeAudioContext();
        const newGrid = Array(4).fill(0).map(() => Array(4).fill(0));
        addRandomTile(newGrid);
        addRandomTile(newGrid);
        setGrid(newGrid);
        setScore(0);
        setHistory([]);
        setGameOver(false);
        setWon(false);
        setKeepPlaying(false);
        hasBeatenBest.current = false;
        setShowCelebration(false);
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

    const triggerEmoji = (r: number, c: number) => {
        const id = Date.now() + Math.random();
        setEmojis(prev => [...prev, { id, x: c, y: r, text: '👏' }]);
        setTimeout(() => setEmojis(prev => prev.filter(e => e.id !== id)), 1000);
    };

    const move = useCallback((direction: Direction) => {
        // Force audio resume
        soundManager.current?.resizeAudioContext();

        if (gameOver || (won && !keepPlaying)) return;

        let newGrid = grid.map(row => [...row]);
        let moved = false;
        let scoreToAdd = 0;
        let mergedPositions: { r: number, c: number }[] = [];

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
                    row.splice(c + 1, 1);
                    moved = true; // Merge happened
                    mergedPositions.push({ r, c });
                }
            }
            while (row.length < 4) row.push(0);
            if (JSON.stringify(newGrid[r]) !== JSON.stringify(row)) moved = true;
            newGrid[r] = row;
        }

        // Restore orientation
        if (direction === 'RIGHT') {
            newGrid = newGrid.map(row => row.reverse());
            mergedPositions = mergedPositions.map(p => ({ ...p, c: 3 - p.c }));
        }
        if (direction === 'UP') {
            newGrid = rotateGrid(newGrid);
            mergedPositions = mergedPositions.map(p => ({ r: p.c, c: 3 - p.r }));
        }
        if (direction === 'DOWN') {
            newGrid = rotateGridCounter(newGrid);
            mergedPositions = mergedPositions.map(p => ({ r: 3 - p.c, c: p.r }));
        }

        if (moved) {
            saveToHistory();
            soundManager.current?.move();

            if (mergedPositions.length > 0) {
                soundManager.current?.merge(2);
                mergedPositions.forEach(pos => triggerEmoji(pos.r, pos.c));
            }

            if (navigator.vibrate) navigator.vibrate(20); // Haptic feedback

            addRandomTile(newGrid);
            setGrid(newGrid);
            setScore(prev => {
                const newScore = prev + scoreToAdd;
                if (newScore > bestScore) {
                    setBestScore(newScore);
                    if (!hasBeatenBest.current && bestScore > 0) {
                        try {
                            localStorage.setItem('2048-best-score', newScore.toString());
                        } catch (e) { console.warn("Storage blocked"); }

                        soundManager.current?.newRecord();
                        // Trigger Full Screen Celebration
                        setShowCelebration(true);
                        setTimeout(() => setShowCelebration(false), 3000); // Hide after 3s
                        hasBeatenBest.current = true;
                    }
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

    // ... (rest of standard functions)
    const checkWin = (g: number[][]) => {
        for (let r = 0; r < 4; r++) { for (let c = 0; c < 4; c++) { if (g[r][c] === 2048) return true; } }
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
    const handleTouchStart = (e: React.TouchEvent) => { setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY }); };
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart) return;
        const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
        const dx = touchEnd.x - touchStart.x;
        const dy = touchEnd.y - touchStart.y;
        if (Math.abs(dx) > Math.abs(dy)) { if (Math.abs(dx) > 30) move(dx > 0 ? 'RIGHT' : 'LEFT'); }
        else { if (Math.abs(dy) > 30) move(dy > 0 ? 'DOWN' : 'UP'); }
        setTouchStart(null);
    };

    const getTileStyle = (value: number) => {
        // High Contrast Neon Colors
        const base = "shadow-[0_0_15px_rgba(0,0,0,0.5)] border-2 backdrop-blur-md flex items-center justify-center relative z-10";
        switch (value) {
            case 0: return "bg-white/5 border-transparent z-0";
            // 2 -> Green
            case 2: return `${base} bg-green-600 border-green-400 text-white shadow-[0_0_20px_rgba(34,197,94,0.6)]`;
            // 4 -> Red
            case 4: return `${base} bg-red-600 border-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)]`;
            // 8 -> Yellow
            case 8: return `${base} bg-yellow-500 border-yellow-300 text-black shadow-[0_0_20px_rgba(234,179,8,0.6)]`;
            // 16 -> Blue
            case 16: return `${base} bg-blue-600 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)]`;
            // 32 -> Orange
            case 32: return `${base} bg-orange-600 border-orange-400 text-white shadow-[0_0_20px_rgba(249,115,22,0.6)]`;
            // 64 -> Dark Blue / Indigo
            case 64: return `${base} bg-indigo-700 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.6)]`;
            // 128+ -> Purple/Pink variants
            case 128: return `${base} bg-purple-600 border-purple-400 text-white shadow-[0_0_25px_rgba(168,85,247,0.7)]`;
            case 256: return `${base} bg-pink-600 border-pink-400 text-white shadow-[0_0_25px_rgba(236,72,153,0.7)]`;
            case 512: return `${base} bg-teal-600 border-teal-400 text-white shadow-[0_0_25px_rgba(20,184,166,0.7)]`;
            case 1024: return `${base} bg-cyan-600 border-cyan-400 text-white shadow-[0_0_30px_rgba(6,182,212,0.8)]`;
            case 2048: return `${base} bg-white border-white text-black shadow-[0_0_50px_rgba(255,255,255,1)] animate-bounce`;
            default: return `${base} bg-gray-800 border-gray-600 text-white`;
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white selection:bg-green-500/30 font-sans">
            <Helmet>
                <title>2048 Neon | Axevora Tools</title>
                <meta name="description" content="Play the ultimate Neon 2048 game online. Combine tiles, beat your high score, and enjoy the satisfying visuals and sounds. Free and Unblocked." />
                <meta name="keywords" content="2048 game, neon 2048, classic 2048, puzzle game, math game, unblocked games" />
            </Helmet>

            <Header />

            <div className="container mx-auto px-4 py-8 flex flex-col items-center max-w-md">
                <div className="w-full flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-5xl font-black bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                            2048
                        </h1>
                        <p className="text-gray-400 text-sm font-medium tracking-wider mt-1">NEON EDITION</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-gray-900/80 backdrop-blur-sm p-3 rounded-xl border border-gray-800 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                            <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider text-center">Score</span>
                            <span className="block text-2xl font-bold text-white text-center">{score}</span>
                        </div>
                        <div className="bg-gray-900/80 backdrop-blur-sm p-3 rounded-xl border border-gray-800 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                            <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider text-center">Best</span>
                            <span className="block text-2xl font-bold text-green-400 text-center">{bestScore}</span>
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-between mb-6">
                    <Button onClick={startNewGame} variant="outline" className="bg-gray-900 border-gray-700 hover:bg-green-600 hover:border-green-500 hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.3)]">
                        <RefreshCw className="mr-2 h-4 w-4" /> New Game
                    </Button>
                    <div className="flex gap-2">
                        <Button onClick={toggleSound} variant="ghost" size="icon" className="text-gray-400 hover:text-green-400 hover:bg-gray-900/50">
                            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                        </Button>
                        <Button onClick={undo} variant="ghost" size="icon" className="text-gray-400 hover:text-blue-400 hover:bg-gray-900/50" disabled={history.length === 0 || gameOver}>
                            <Undo2 className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <Card className="w-full max-w-[400px] aspect-square bg-gray-900/90 border-gray-800 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-sm rounded-2xl">
                    <CardContent className="p-4 h-full">
                        <div
                            className="bg-gray-950/50 rounded-xl h-full w-full p-2 grid grid-cols-4 grid-rows-4 gap-2 relative touch-none"
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            {/* Unified Grid Rendering for Perfect Alignment */}
                            {grid.map((row, r) => row.map((val, c) => (
                                <div
                                    key={`${r}-${c}`}
                                    className="relative w-full h-full bg-gray-800/30 rounded-lg flex items-center justify-center"
                                >
                                    {val > 0 && (
                                        <div className={`${getTileStyle(val)} w-full h-full rounded-lg flex items-center justify-center text-3xl font-bold shadow-lg select-none animate-in zoom-in duration-200`}>
                                            {val}
                                        </div>
                                    )}
                                </div>
                            )))}

                            {/* Overlays */}
                            {gameOver && (
                                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 animate-in fade-in duration-500 rounded-xl">
                                    <h2 className="text-4xl font-black text-red-500 mb-2 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">GAME OVER</h2>
                                    <p className="text-gray-300 mb-6 font-medium">Final Score: {score}</p>
                                    <Button onClick={startNewGame} size="lg" className="bg-green-600 hover:bg-green-500 text-white border-0 shadow-[0_0_20px_rgba(34,197,94,0.4)] animate-pulse">
                                        Try Again
                                    </Button>
                                </div>
                            )}

                            {won && !keepPlaying && (
                                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 animate-in fade-in duration-500 rounded-xl">
                                    <Trophy className="h-16 w-16 text-yellow-400 mb-4 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)] animate-bounce" />
                                    <h2 className="text-4xl font-black text-yellow-400 mb-2 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">YOU WIN!</h2>
                                    <div className="flex gap-4 mt-6">
                                        <Button onClick={() => setKeepPlaying(true)} variant="outline" className="border-green-500 text-green-400 hover:bg-green-500/10">
                                            Keep Going
                                        </Button>
                                        <Button onClick={startNewGame} className="bg-green-600 hover:bg-green-500 text-white border-0 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                                            New Game
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Instructions */}
                <div className="mt-8 text-center text-gray-500 text-sm font-medium">
                    <p>Use <span className="text-gray-300 font-bold">Arrow Keys</span> or <span className="text-gray-300 font-bold">Swipe</span> to move tiles</p>
                    <p className="mt-1">Join numbers to get to <span className="text-green-400 font-bold">2048</span>!</p>
                </div>

                {/* Emojis & Celebration (Visual Effects) */}
                {emojis.map(e => (
                    <div key={e.id} className="absolute pointer-events-none animate-bounce text-4xl z-50 transition-opacity duration-1000"
                        style={{ left: `calc(50% - 150px + ${e.x * 75}px)`, top: `calc(200px + ${e.y * 75}px)`, opacity: 0 }}>
                        {e.text}
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
};
export default Game2048;
