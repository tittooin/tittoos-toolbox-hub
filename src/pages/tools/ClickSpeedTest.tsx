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
                <div className="prose prose-lg dark:prose-invert max-w-none mt-16 mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Click Speed Test – How Fast Are Your Fingers?</h1>

                    <p className="lead text-xl text-muted-foreground mb-10 leading-relaxed font-light">
                        The <strong>CPS Test</strong> (Clicks Per Second) is the ultimate benchmark for gamers, competitors, and anyone looking to test their reflexes. Whether you want to improve your Minecraft PvP skills or just challenge your friends, accurate measurement is the first step to becoming faster.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 my-12">
                        <div className="bg-card p-8 rounded-2xl border shadow-sm">
                            <h3 className="text-2xl font-bold mb-4 flex items-center">
                                <span className="text-3xl mr-3">🎮</span> Why Gamer's Care?
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                In competitive gaming (like Minecraft, Call of Duty, or Fortnite), a higher CPS often means dealing more damage in less time, building structures faster, or reacting quicker than your opponent. It can be the difference between victory and defeat.
                            </p>
                        </div>
                        <div className="bg-card p-8 rounded-2xl border shadow-sm">
                            <h3 className="text-2xl font-bold mb-4 flex items-center">
                                <span className="text-3xl mr-3">🧪</span> The Science
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Clicking speed is a combination of muscle memory, hand-eye coordination, and the physical mechanism of your mouse. Regular practice can physically alter how your fast-twitch muscle fibers respond.
                            </p>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold mt-16 mb-6">Advanced Clicking Techniques</h2>
                    <p className="mb-6">
                        Want to go beyond the average 6-7 CPS? Professional gamers use specialized techniques to achieve superhuman speeds.
                    </p>

                    <div className="space-y-8">
                        <div className="bg-muted/30 p-6 rounded-xl border">
                            <h3 className="text-xl font-bold mb-2 text-primary">1. Jitter Clicking</h3>
                            <p className="mb-2"><strong>Speed Potential:</strong> 10 - 14 CPS</p>
                            <p className="text-sm text-muted-foreground">This involves vibrating the muscles in your forearm and wrist to click the mouse button rapidly. It requires a stiff arm and can be tiring, but it's effective for short bursts.</p>
                        </div>

                        <div className="bg-muted/30 p-6 rounded-xl border">
                            <h3 className="text-xl font-bold mb-2 text-blue-500">2. Butterfly Clicking</h3>
                            <p className="mb-2"><strong>Speed Potential:</strong> 15 - 25 CPS</p>
                            <p className="text-sm text-muted-foreground">Using two fingers (index and middle) to alternate clicks on the <em>same</em> mouse button. This effectively doubles your clicking speed but requires a mouse with double-click support to truly shine.</p>
                        </div>

                        <div className="bg-muted/30 p-6 rounded-xl border">
                            <h3 className="text-xl font-bold mb-2 text-purple-500">3. Drag Clicking</h3>
                            <p className="mb-2"><strong>Speed Potential:</strong> 25+ CPS</p>
                            <p className="text-sm text-muted-foreground">The most extreme technique. By dragging your finger across a textured mouse button, friction causes the switch to bounce multiple times per drag. Used primarily for "god bridging" in Minecraft.</p>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold mt-16 mb-6">Global Rank System</h2>
                    <p className="mb-6">
                        Where do you stand compared to the rest of the world? Here is our official tier list based on your 5-second test score:
                    </p>
                    <div className="grid md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                            <div className="text-4xl mb-2">🐢</div>
                            <h4 className="font-bold text-green-700 dark:text-green-300">Turtle</h4>
                            <p className="text-xs font-mono mt-1">&lt; 5 CPS</p>
                        </div>
                        <div className="p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                            <div className="text-4xl mb-2">🐇</div>
                            <h4 className="font-bold text-yellow-700 dark:text-yellow-300">Rabbit</h4>
                            <p className="text-xs font-mono mt-1">5 - 8 CPS</p>
                        </div>
                        <div className="p-4 rounded-lg bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                            <div className="text-4xl mb-2">🐆</div>
                            <h4 className="font-bold text-orange-700 dark:text-orange-300">Cheetah</h4>
                            <p className="text-xs font-mono mt-1">8 - 10 CPS</p>
                        </div>
                        <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                            <div className="text-4xl mb-2">⚡</div>
                            <h4 className="font-bold text-red-700 dark:text-red-300">Flash</h4>
                            <p className="text-xs font-mono mt-1">10+ CPS</p>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold mt-16 mb-6">Frequently Asked Questions</h2>
                    <dl className="space-y-6">
                        <div className="group border-b pb-6">
                            <dt className="font-bold text-lg mb-2 cursor-pointer flex items-center justify-between">
                                What is the world record for CPS?
                            </dt>
                            <dd className="text-muted-foreground leading-relaxed">
                                The generally accepted world record for the standard 1-second CPS test is around **16-18 CPS** using regular clicking methods. With drag clicking, some players have registered over **100 CPS** (though this is often considered a hardware exploit).
                            </dd>
                        </div>
                        <div className="group border-b pb-6">
                            <dt className="font-bold text-lg mb-2 cursor-pointer flex items-center justify-between">
                                Does mouse choice matter?
                            </dt>
                            <dd className="text-muted-foreground leading-relaxed">
                                Yes. Gaming mice with high-quality Omron or mechanical switches are more responsive. For jitter/butterfly clicking, a mouse with a lighter actuation force is preferred.
                            </dd>
                        </div>
                        <div className="group pb-6">
                            <dt className="font-bold text-lg mb-2 cursor-pointer flex items-center justify-between">
                                Is this test accuracy?
                            </dt>
                            <dd className="text-muted-foreground leading-relaxed">
                                Our tool measures time down to the millisecond to ensure 100% precision. However, your own internet latency or browser lag can sometimes affect the perceived start time, so we recommend taking the average of 3 attempts.
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </ToolTemplate>
    );
};

export default ClickSpeedTest;
