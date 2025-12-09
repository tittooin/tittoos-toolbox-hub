import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, MousePointer2, Trophy, Timer, Zap } from 'lucide-react';
import ToolTemplate from '../../components/ToolTemplate';

const DURATIONS = [1, 5, 10, 30, 60];

const ClickSpeedTest = () => {
    const [duration, setDuration] = useState(5);
    const [timeLeft, setTimeLeft] = useState(5);
    const [clicks, setClicks] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [cps, setCps] = useState(0);
    const [rank, setRank] = useState('');

    const clickAreaRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 0.1) { // Use small threshold to avoid float issues
                        endGame();
                        return 0;
                    }
                    return parseFloat((prev - 0.1).toFixed(1));
                });
            }, 100);
        } else if (isActive && timeLeft <= 0) {
            endGame();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const startGame = () => {
        setIsActive(true);
        setIsFinished(false);
        setClicks(0);
        setTimeLeft(duration);
        setCps(0);
        setRank('');
    };

    const handleClick = () => {
        if (!isActive && !isFinished) {
            startGame();
            setClicks(1);
        } else if (isActive) {
            setClicks((prev) => prev + 1);
        }
    };

    const endGame = () => {
        setIsActive(false);
        setIsFinished(true);
        const finalCps = clicks / duration;
        setCps(parseFloat(finalCps.toFixed(2)));
        calculateRank(finalCps);
    };

    const calculateRank = (score: number) => {
        if (score < 5) setRank("Turtle 🐢");
        else if (score < 8) setRank("Rabbit 🐇");
        else if (score < 10) setRank("Cheetah 🐆");
        else setRank("Flash ⚡");
    };

    const resetGame = () => {
        setIsActive(false);
        setIsFinished(false);
        setClicks(0);
        setTimeLeft(duration);
        setCps(0);
        setRank('');
    };

    return (
        <ToolTemplate
            title="Click Speed Test (CPS Test)"
            description="Test your clicking speed with our CPS (Clicks Per Second) test. Challenge yourself and see how fast you can click!"
        >
            <Helmet>
                <title>Click Speed Test - Check Your CPS | Axevora</title>
                <meta name="description" content="Test your mouse clicking speed with Axevora's CPS Test. Check how many clicks per second you can achieve in 1, 5, 10, 30, or 60 seconds." />
            </Helmet>

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Settings */}
                <div className="flex justify-center gap-4 flex-wrap">
                    {DURATIONS.map((d) => (
                        <Button
                            key={d}
                            variant={duration === d ? "default" : "outline"}
                            onClick={() => { setDuration(d); setTimeLeft(d); setIsFinished(false); setIsActive(false); setClicks(0); }}
                            disabled={isActive}
                        >
                            {d} Seconds
                        </Button>
                    ))}
                </div>

                {/* Game Area */}
                <Card className="border-2 border-primary/20 overflow-hidden">
                    <CardContent className="p-0">
                        <button
                            ref={clickAreaRef}
                            onClick={handleClick}
                            disabled={isFinished}
                            className={`w-full h-80 flex flex-col items-center justify-center gap-4 transition-all active:scale-[0.99] outline-none select-none ${isActive ? 'bg-primary/10 hover:bg-primary/20' : 'bg-muted/30 hover:bg-muted/50'
                                }`}
                        >
                            {!isFinished ? (
                                <>
                                    <MousePointer2 className={`w-16 h-16 ${isActive ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
                                    <div className="text-center">
                                        <h3 className="text-4xl font-bold mb-2">
                                            {isActive ? clicks : "Click to Start"}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {isActive ? "Keep clicking!" : "Start clicking as fast as you can"}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center animate-in zoom-in">
                                    <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                                    <h2 className="text-4xl font-bold mb-2">Time's Up!</h2>
                                    <p className="text-xl text-muted-foreground">You clicked {clicks} times</p>
                                </div>
                            )}
                        </button>
                    </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-card/50 backdrop-blur">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Time Left</p>
                                <h3 className="text-3xl font-bold text-primary">{Math.max(0, timeLeft).toFixed(1)}s</h3>
                            </div>
                            <Timer className="w-8 h-8 text-primary/50" />
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 backdrop-blur">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">CPS Score</p>
                                <h3 className="text-3xl font-bold text-green-500">{isFinished ? cps : (clicks / (duration - timeLeft || 1)).toFixed(1)}</h3>
                            </div>
                            <Zap className="w-8 h-8 text-green-500/50" />
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 backdrop-blur">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Rank</p>
                                <h3 className="text-2xl font-bold text-blue-500">{rank || "-"}</h3>
                            </div>
                            <Trophy className="w-8 h-8 text-blue-500/50" />
                        </CardContent>
                    </Card>
                </div>

                {isFinished && (
                    <div className="flex justify-center">
                        <Button size="lg" onClick={resetGame} className="px-12 text-lg">
                            <RefreshCw className="w-5 h-5 mr-2" /> Try Again
                        </Button>
                    </div>
                )}

                {/* Info */}
                <div className="prose dark:prose-invert max-w-none">
                    <h3>What is CPS?</h3>
                    <p>
                        CPS stands for <strong>Clicks Per Second</strong>. It is a measure of how fast you can click your mouse button.
                        Gamers often use this test to improve their speed for games like Minecraft (PvP) or shooter games.
                    </p>
                    <h3>CPS Ranks</h3>
                    <ul>
                        <li><strong>Turtle (&lt; 5 CPS):</strong> Slow and steady.</li>
                        <li><strong>Rabbit (5-8 CPS):</strong> Average speed.</li>
                        <li><strong>Cheetah (8-10 CPS):</strong> Fast!</li>
                        <li><strong>Flash (&gt; 10 CPS):</strong> Superhuman speed!</li>
                    </ul>
                </div>
            </div>
        </ToolTemplate>
    );
};

export default ClickSpeedTest;
