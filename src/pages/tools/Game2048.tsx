import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Gamepad2, Move } from 'lucide-react';
import ToolTemplate from '../../components/ToolTemplate';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const Game2048 = () => {
    const [grid, setGrid] = useState<number[][]>(Array(4).fill(Array(4).fill(0)));
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);

    // Initialize game
    useEffect(() => {
        const savedBest = localStorage.getItem('2048-best-score');
        if (savedBest) setBestScore(parseInt(savedBest));
        startNewGame();
    }, []);

    const startNewGame = () => {
        const newGrid = Array(4).fill(0).map(() => Array(4).fill(0));
        addRandomTile(newGrid);
        addRandomTile(newGrid);
        setGrid(newGrid);
        setScore(0);
        setGameOver(false);
        setWon(false);
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

    const move = useCallback((direction: Direction) => {
        if (gameOver || won) return;

        let newGrid = grid.map(row => [...row]);
        let moved = false;
        let scoreToAdd = 0;

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
                }
            }
            while (row.length < 4) row.push(0);
            if (JSON.stringify(newGrid[r]) !== JSON.stringify(row)) moved = true;
            newGrid[r] = row;
        }

        // Restore orientation
        if (direction === 'RIGHT') newGrid = newGrid.map(row => row.reverse());
        if (direction === 'UP') newGrid = rotateGrid(newGrid); // Rotate back (counter of counter is normal, wait. UP was counter, so rotate clockwise to fix)
        if (direction === 'DOWN') newGrid = rotateGridCounter(newGrid); // DOWN was clockwise, so rotate counter to fix

        if (moved) {
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

            if (checkWin(newGrid)) setWon(true);
            if (checkGameOver(newGrid)) setGameOver(true);
        }
    }, [grid, gameOver, won, bestScore]);

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

    const getTileColor = (value: number) => {
        const colors: { [key: number]: string } = {
            0: 'bg-muted/30',
            2: 'bg-blue-100 text-blue-900 dark:bg-blue-900/50 dark:text-blue-100',
            4: 'bg-blue-200 text-blue-900 dark:bg-blue-800/50 dark:text-blue-100',
            8: 'bg-cyan-200 text-cyan-900 dark:bg-cyan-800/50 dark:text-cyan-100',
            16: 'bg-teal-200 text-teal-900 dark:bg-teal-800/50 dark:text-teal-100',
            32: 'bg-green-200 text-green-900 dark:bg-green-800/50 dark:text-green-100',
            64: 'bg-lime-200 text-lime-900 dark:bg-lime-800/50 dark:text-lime-100',
            128: 'bg-yellow-200 text-yellow-900 dark:bg-yellow-800/50 dark:text-yellow-100',
            256: 'bg-orange-200 text-orange-900 dark:bg-orange-800/50 dark:text-orange-100',
            512: 'bg-red-200 text-red-900 dark:bg-red-800/50 dark:text-red-100',
            1024: 'bg-pink-200 text-pink-900 dark:bg-pink-800/50 dark:text-pink-100',
            2048: 'bg-purple-200 text-purple-900 dark:bg-purple-800/50 dark:text-purple-100',
        };
        return colors[value] || 'bg-primary text-primary-foreground';
    };

    return (
        <ToolTemplate
            title="2048 Game"
            description="Play the classic 2048 puzzle game online. Join the numbers and get to the 2048 tile! A fun and addictive logic puzzle."
        >
            <Helmet>
                <title>2048 Game - Play Online Free | Axevora</title>
                <meta name="description" content="Play 2048 online for free. The addictive sliding tile puzzle game. Merge numbers to reach the 2048 tile. Mobile friendly and responsive." />
            </Helmet>

            <div className="max-w-md mx-auto space-y-8">
                {/* Header Stats */}
                <div className="flex justify-between items-center bg-card/50 p-4 rounded-xl border border-border">
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground uppercase font-bold">Score</p>
                        <p className="text-2xl font-bold text-primary">{score}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground uppercase font-bold">Best</p>
                        <p className="text-2xl font-bold text-primary">{bestScore}</p>
                    </div>
                    <Button onClick={startNewGame} variant="outline" size="icon">
                        <RefreshCw className="w-5 h-5" />
                    </Button>
                </div>

                {/* Game Grid */}
                <div
                    className="bg-muted p-4 rounded-xl aspect-square relative touch-none select-none"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="grid grid-cols-4 grid-rows-4 gap-3 h-full">
                        {grid.map((row, r) => (
                            row.map((cell, c) => (
                                <div
                                    key={`${r}-${c}`}
                                    className={`rounded-lg flex items-center justify-center text-3xl font-bold transition-all duration-100 ${getTileColor(cell)}`}
                                >
                                    {cell !== 0 && cell}
                                </div>
                            ))
                        ))}
                    </div>

                    {/* Overlays */}
                    {(gameOver || won) && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-10 animate-in fade-in">
                            {won ? (
                                <Trophy className="w-20 h-20 text-yellow-500 mb-4 animate-bounce" />
                            ) : (
                                <Gamepad2 className="w-20 h-20 text-muted-foreground mb-4" />
                            )}
                            <h2 className="text-4xl font-bold mb-2">{won ? 'You Win!' : 'Game Over!'}</h2>
                            <p className="text-muted-foreground mb-6">Score: {score}</p>
                            <Button size="lg" onClick={startNewGame}>
                                {won ? 'Play Again' : 'Try Again'}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Controls Hint */}
                <div className="grid grid-cols-3 gap-4 text-center text-muted-foreground text-sm">
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex gap-1">
                            <span className="p-1 border rounded"><ArrowUp className="w-4 h-4" /></span>
                        </div>
                        <div className="flex gap-1">
                            <span className="p-1 border rounded"><ArrowLeft className="w-4 h-4" /></span>
                            <span className="p-1 border rounded"><ArrowDown className="w-4 h-4" /></span>
                            <span className="p-1 border rounded"><ArrowRight className="w-4 h-4" /></span>
                        </div>
                        <span>Use Arrow Keys</span>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <span className="font-bold text-lg">OR</span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2">
                        <Move className="w-8 h-8" />
                        <span>Swipe on Screen</span>
                    </div>
                </div>

                {/* Instructions */}
                <div className="prose dark:prose-invert max-w-none text-sm">
                    <h3>How to Play</h3>
                    <p>
                        Use your <strong>arrow keys</strong> or <strong>swipe</strong> to move the tiles. When two tiles with the same number touch, they <strong>merge into one!</strong>
                    </p>
                    <p>
                        Join the numbers and get to the <strong>2048 tile!</strong>
                    </p>
                </div>
            </div>
        </ToolTemplate>
    );
};

export default Game2048;
