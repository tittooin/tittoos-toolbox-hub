import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Trophy, Undo2, Volume2, VolumeX } from 'lucide-react';
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

    setEnabled(enabled: boolean) { this.enabled = enabled; }

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
        // "Clap" Sound Effect for Merge
        if (!this.enabled || !this.ctx) return;
        const bufferSize = this.ctx.sampleRate * 0.1; // 100ms
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3)); // Decaying noise
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        noise.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noise.start();
    }
    win() {
        if (!this.enabled || !this.ctx) return;
        // Fanfare
        const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50];
        notes.forEach((f, i) => {
            setTimeout(() => {
                this.playTone(f, 'square', 0.2, 0.1);
                this.playTone(f * 1.01, 'sawtooth', 0.2, 0.05);
            }, i * 150);
        });
        // Applause
        setTimeout(() => {
            const bufferSize = this.ctx!.sampleRate * 2;
            const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = this.ctx!.createBufferSource();
            noise.buffer = buffer;
            const noiseGain = this.ctx!.createGain();
            noiseGain.gain.setValueAtTime(0.1, this.ctx!.currentTime);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + 2);
            noise.connect(noiseGain);
            noiseGain.connect(this.ctx!.destination);
            noise.start();
        }, 800);
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
    const [recentScores, setRecentScores] = useState<number[]>([]);
    const soundManager = useRef<SoundManager | null>(null);

    // Initialize game
    useEffect(() => {
        soundManager.current = new SoundManager();
        const savedBest = localStorage.getItem('2048-best-score');
        if (savedBest) setBestScore(parseInt(savedBest));

        const savedRecent = localStorage.getItem('2048-recent-scores');
        if (savedRecent) setRecentScores(JSON.parse(savedRecent));

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

    const triggerEmoji = (r: number, c: number) => {
        const id = Date.now() + Math.random();
        setEmojis(prev => [...prev, { id, x: c, y: r, text: '👏' }]);
        setTimeout(() => setEmojis(prev => prev.filter(e => e.id !== id)), 1000);
    };

    const move = useCallback((direction: Direction) => {
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
            case 2: return `${baseStyle} bg-blue-900 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)]`;
            case 4: return `${baseStyle} bg-indigo-900 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.6)]`;
            case 8: return `${baseStyle} bg-violet-900 border-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.6)]`;
            case 16: return `${baseStyle} bg-purple-900 border-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.6)]`;
            case 32: return `${baseStyle} bg-fuchsia-900 border-fuchsia-500 text-white shadow-[0_0_20px_rgba(217,70,239,0.6)]`;
            case 64: return `${baseStyle} bg-pink-900 border-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.6)]`;
            case 128: return `${baseStyle} bg-red-900 border-red-500 text-white shadow-[0_0_25px_rgba(239,68,68,0.8)] animate-pulse`; // Dark Red
            case 256: return `${baseStyle} bg-orange-900 border-orange-500 text-white shadow-[0_0_25px_rgba(249,115,22,0.8)]`;
            case 512: return `${baseStyle} bg-amber-900 border-amber-500 text-white shadow-[0_0_25px_rgba(245,158,11,0.8)]`;
            case 1024: return `${baseStyle} bg-yellow-900 border-yellow-500 text-white shadow-[0_0_30px_rgba(234,179,8,0.9)]`; // Dark Yellow
            case 2048: return `${baseStyle} bg-white border-white text-black shadow-[0_0_50px_rgba(255,255,255,1)] animate-bounce`; // White
            default: return `${baseStyle} bg-gray-900 border-gray-500 text-white`;
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

                <div
                    className="relative w-full max-w-[350px] mx-auto aspect-square bg-gray-900 rounded-xl p-3 border border-white/20 shadow-2xl overflow-hidden touch-none select-none"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {emojis.map(e => (
                        <div
                            key={e.id}
                            className="absolute z-50 text-4xl animate-[bounce_1s_infinite] transition-opacity duration-1000 pointer-events-none"
                            style={{
                                top: `calc(${e.y * 25 + 10}%)`,
                                left: `calc(${e.x * 25 + 10}%)`
                            }}
                        >
                            {e.text}
                        </div>
                    ))}

                    {grid.map((row, r) => (
                        row.map((val, c) => (
                            <div
                                key={`bg-${r}-${c}`}
                                className="absolute transition-all duration-200"
                            />
                        ))
                    ))}

                    <div className="grid grid-cols-4 grid-rows-4 gap-2 w-full h-full">
                        {grid.map((row, r) => (
                            row.map((val, c) => (
                                <div
                                    key={`${r}-${c}`}
                                    className={`${getTileStyle(val)} rounded-lg font-bold text-2xl md:text-3xl transition-all duration-200 transform ${val ? 'scale-100' : 'scale-0'} flex items-center justify-center`}
                                >
                                    {val !== 0 && val}
                                </div>
                            ))
                        ))}
                    </div>

                    {gameOver && !won && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 animate-in fade-in">
                            <h2 className="text-4xl font-bold text-red-500 mb-4 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">Game Over</h2>
                            <Button onClick={startNewGame} className="bg-white text-black hover:bg-gray-200 font-bold px-8">Try Again</Button>
                        </div>
                    )}

                    {won && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 animate-in zoom-in">
                            <Trophy className="w-16 h-16 text-yellow-400 mb-4 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)] animate-bounce" />
                            <h2 className="text-4xl font-bold text-yellow-400 mb-2 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">You Win!</h2>
                            <p className="text-white mb-6">You reached 2048!</p>
                            <div className="flex gap-3">
                                <Button onClick={() => setKeepPlaying(true)} variant="outline" className="border-white/20 text-white hover:bg-white/10">Keep Playing</Button>
                                <Button onClick={startNewGame} className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold">New Game</Button>
                            </div>
                        </div>
                    )}
                </div>

                <Card className="bg-neutral-900 border-white/10 mt-6">
                    <CardContent className="p-4">
                        <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            Recent History
                        </h3>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20">
                            {recentScores.length > 0 ? recentScores.map((s, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-gray-300 whitespace-nowrap">
                                    Game {i + 1}: <span className="text-white font-bold">{s}</span>
                                </div>
                            )) : <span className="text-muted-foreground text-sm">Play a game to see history!</span>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ToolTemplate>
    );
};

export default Game2048;
