import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Timer, Zap, Trophy, RefreshCw, MousePointerClick } from 'lucide-react';
import ToolTemplate from '../../components/ToolTemplate';

type GameState = 'IDLE' | 'WAITING' | 'READY' | 'TOO_EARLY' | 'RESULT';

const ReactionTimeTest = () => {
    const [gameState, setGameState] = useState<GameState>('IDLE');
    const [startTime, setStartTime] = useState(0);
    const [reactionTime, setReactionTime] = useState(0);
    const [history, setHistory] = useState<number[]>([]);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const startGame = () => {
        setGameState('WAITING');
        const randomDelay = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds

        timeoutRef.current = setTimeout(() => {
            setGameState('READY');
            setStartTime(Date.now());
        }, randomDelay);
    };

    const handleClick = () => {
        if (gameState === 'IDLE' || gameState === 'RESULT') {
            startGame();
        } else if (gameState === 'WAITING') {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setGameState('TOO_EARLY');
        } else if (gameState === 'READY') {
            const endTime = Date.now();
            const time = endTime - startTime;
            setReactionTime(time);
            setHistory(prev => [...prev, time]);
            setGameState('RESULT');
        } else if (gameState === 'TOO_EARLY') {
            startGame();
        }
    };

    const getAverageTime = () => {
        if (history.length === 0) return 0;
        return Math.round(history.reduce((a, b) => a + b, 0) / history.length);
    };

    const getBestTime = () => {
        if (history.length === 0) return 0;
        return Math.min(...history);
    };

    const resetHistory = (e: React.MouseEvent) => {
        e.stopPropagation();
        setHistory([]);
        setGameState('IDLE');
    };

    return (
        <ToolTemplate
            title="Reaction Time Test"
            description="Test your visual reflexes with this simple reaction time test. How fast can you click when the color changes?"
        >
            <Helmet>
                <title>Reaction Time Test - Check Your Reflexes | Axevora</title>
                <meta name="description" content="Test your reaction time online. Measure your reflexes in milliseconds. Great for gamers and athletes looking to improve their speed." />
            </Helmet>

            <div className="max-w-4xl mx-auto space-y-8">

                {/* Game Area */}
                <Card className="border-0 overflow-hidden shadow-xl">
                    <div
                        onClick={handleClick}
                        className={`
              h-[400px] flex flex-col items-center justify-center cursor-pointer transition-all duration-200 select-none p-8 text-center
              ${gameState === 'IDLE' ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}
              ${gameState === 'WAITING' ? 'bg-red-500 text-white' : ''}
              ${gameState === 'READY' ? 'bg-green-500 text-white' : ''}
              ${gameState === 'TOO_EARLY' ? 'bg-orange-500 text-white' : ''}
              ${gameState === 'RESULT' ? 'bg-blue-500 text-white' : ''}
            `}
                    >
                        {gameState === 'IDLE' && (
                            <>
                                <Zap className="w-24 h-24 mb-6 animate-pulse" />
                                <h2 className="text-4xl font-bold mb-2">Reaction Time Test</h2>
                                <p className="text-xl opacity-90">Click anywhere to start</p>
                            </>
                        )}

                        {gameState === 'WAITING' && (
                            <>
                                <Timer className="w-24 h-24 mb-6" />
                                <h2 className="text-4xl font-bold mb-2">Wait for Green...</h2>
                                <p className="text-xl opacity-90">Do not click yet!</p>
                            </>
                        )}

                        {gameState === 'READY' && (
                            <>
                                <MousePointerClick className="w-24 h-24 mb-6" />
                                <h2 className="text-5xl font-bold mb-2">CLICK!</h2>
                                <p className="text-xl opacity-90">Click now!</p>
                            </>
                        )}

                        {gameState === 'TOO_EARLY' && (
                            <>
                                <Timer className="w-24 h-24 mb-6" />
                                <h2 className="text-4xl font-bold mb-2">Too Early!</h2>
                                <p className="text-xl opacity-90">Click to try again</p>
                            </>
                        )}

                        {gameState === 'RESULT' && (
                            <>
                                <Timer className="w-24 h-24 mb-6" />
                                <h2 className="text-6xl font-bold mb-4">{reactionTime} ms</h2>
                                <p className="text-xl opacity-90">Click to keep going</p>
                            </>
                        )}
                    </div>
                </Card>

                {/* Stats */}
                {history.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-card/50 backdrop-blur">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Average</p>
                                    <h3 className="text-3xl font-bold text-primary">{getAverageTime()} ms</h3>
                                </div>
                                <Timer className="w-8 h-8 text-primary/50" />
                            </CardContent>
                        </Card>
                        <Card className="bg-card/50 backdrop-blur">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Best</p>
                                    <h3 className="text-3xl font-bold text-green-500">{getBestTime()} ms</h3>
                                </div>
                                <Trophy className="w-8 h-8 text-green-500/50" />
                            </CardContent>
                        </Card>
                        <Card className="bg-card/50 backdrop-blur flex items-center justify-center">
                            <Button variant="outline" size="lg" onClick={resetHistory}>
                                <RefreshCw className="w-4 h-4 mr-2" /> Reset Stats
                            </Button>
                        </Card>
                    </div>
                )}

                {/* Educational Content */}
                <div className="prose dark:prose-invert max-w-none mt-12">
                    <h2 className="text-3xl font-bold mb-6">The Ultimate Guide to Human Reaction Time</h2>

                    <p className="text-lg leading-relaxed mb-6">
                        Have you ever wondered why some gamers seem to have "superhuman" reflexes, or why professional F1 drivers can react to a crash in milliseconds? It all comes down to <strong>Reaction Time</strong>. This isn't just a number; it's a fundamental measure of your nervous system's efficiency. Whether you're a competitive esports player, an athlete, or just someone who wants to stay sharp, understanding and training your reaction time can give you a significant edge.
                    </p>

                    <div className="my-8 p-6 bg-muted/50 rounded-xl border-l-4 border-primary">
                        <h3 className="text-xl font-bold mb-2">What Exactly is Reaction Time?</h3>
                        <p>
                            Reaction time is the interval between the presentation of a stimulus (like a screen turning green) and the initiation of the muscular response (clicking the mouse). It involves three key stages:
                        </p>
                        <ol className="list-decimal ml-6 mt-4 space-y-2">
                            <li><strong>Perception:</strong> Your eyes see the color change.</li>
                            <li><strong>Processing:</strong> Your brain identifies the change and decides to act.</li>
                            <li><strong>Response:</strong> Your brain sends a signal to your finger muscles to click.</li>
                        </ol>
                    </div>

                    <h3 className="text-2xl font-bold mt-12 mb-4">The Science Behind the Speed</h3>
                    <p className="mb-4">
                        When you see the green light, a signal travels from your retina to your visual cortex. From there, it goes to the motor cortex, which fires a signal down your spinal cord to your hand. This entire journey happens in a fraction of a second. The average human visual reaction time is around <strong>250 milliseconds (0.25s)</strong>. However, this can vary wildly based on the type of stimulus.
                    </p>

                    <div className="overflow-x-auto my-8">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b-2 border-muted">
                                    <th className="p-4 font-bold">Stimulus Type</th>
                                    <th className="p-4 font-bold">Average Speed</th>
                                    <th className="p-4 font-bold">Why?</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-muted/50">
                                    <td className="p-4">Visual (Sight)</td>
                                    <td className="p-4">~250 ms</td>
                                    <td className="p-4">Complex processing required by the visual cortex.</td>
                                </tr>
                                <tr className="border-b border-muted/50">
                                    <td className="p-4">Audio (Sound)</td>
                                    <td className="p-4">~170 ms</td>
                                    <td className="p-4">Sound reaches the brain faster (fewer synapses).</td>
                                </tr>
                                <tr className="border-b border-muted/50">
                                    <td className="p-4">Touch (Tactile)</td>
                                    <td className="p-4">~150 ms</td>
                                    <td className="p-4">Direct sensory pathway to the brain.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h3 className="text-2xl font-bold mt-12 mb-4">Factors That Influence Your Reflexes</h3>
                    <p className="mb-6">
                        Why are you faster on some days and slower on others? Several biological and environmental factors play a role.
                    </p>

                    <h4 className="text-xl font-bold mb-2">1. Age</h4>
                    <p className="mb-4">
                        Reaction time peaks in your late teens to mid-20s. After age 24, there is a slow but steady decline. However, experience often outweighs raw speed. A 40-year-old driver might react slower but anticipate danger sooner than a 20-year-old.
                    </p>

                    <h4 className="text-xl font-bold mb-2">2. Fatigue & Sleep</h4>
                    <p className="mb-4">
                        Lack of sleep is a reflex killer. Studies show that being awake for 24 hours impairs your reaction time as much as having a blood alcohol content of 0.10% (legally drunk!). Your brain needs rest to process signals efficiently.
                    </p>

                    <h4 className="text-xl font-bold mb-2">3. Hydration & Nutrition</h4>
                    <p className="mb-4">
                        Even mild dehydration can reduce cognitive performance by 10-20%. Your brain is 73% water; keep it fueled. Caffeine can provide a temporary boost, but the "crash" afterwards can make you slower.
                    </p>

                    <h4 className="text-xl font-bold mb-2">4. Hardware (Input Lag)</h4>
                    <p className="mb-4">
                        Sometimes, it's not you—it's your gear. In the digital world, <strong>Input Lag</strong> is the delay between your physical action and the screen updating.
                    </p>
                    <ul className="list-disc ml-6 mb-6 space-y-2">
                        <li><strong>Monitor Refresh Rate:</strong> A 144Hz monitor updates more than twice as fast as a 60Hz one, giving you "fresher" information.</li>
                        <li><strong>Mouse Polling Rate:</strong> A 1000Hz mouse reports its position every 1ms, while a standard office mouse might take 8-10ms.</li>
                        <li><strong>Wireless vs. Wired:</strong> Modern wireless gaming mice are just as fast as wired ones, but cheap Bluetooth mice can add significant delay.</li>
                    </ul>

                    <h3 className="text-2xl font-bold mt-12 mb-4">Reaction Time in Gaming & Esports</h3>
                    <p className="mb-4">
                        In competitive games like CS:GO, Valorant, or League of Legends, milliseconds matter. A "good" reaction time for a gamer is often considered to be under <strong>200ms</strong>. Professional players often clock in around <strong>150-160ms</strong>.
                    </p>
                    <p className="mb-6">
                        However, raw reaction time isn't everything. <strong>Prediction</strong> and <strong>Crosshair Placement</strong> are equally important. If you know where an enemy will appear, you don't need to react—you just need to click. This is why veteran players often beat younger, faster players.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                        <div className="bg-card p-6 rounded-xl border shadow-sm">
                            <h4 className="font-bold text-lg mb-2">For FPS Gamers</h4>
                            <p className="text-sm text-muted-foreground">
                                Focus on "Click Timing". Use aim trainers to practice clicking exactly when a target moves over your crosshair.
                            </p>
                        </div>
                        <div className="bg-card p-6 rounded-xl border shadow-sm">
                            <h4 className="font-bold text-lg mb-2">For MOBA Gamers</h4>
                            <p className="text-sm text-muted-foreground">
                                Focus on "Choice Reaction". You often have to react to a specific spell (Flash/Ult) rather than just any movement.
                            </p>
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold mt-12 mb-4">How to Train & Improve</h3>
                    <p className="mb-4">
                        Can you actually get faster? Yes, but there's a biological limit. You can't train your nerves to transmit signals faster than physics allows, but you <em>can</em> train your brain to process them quicker.
                    </p>

                    <ol className="list-decimal ml-6 space-y-4 mb-8">
                        <li>
                            <strong>Use Reaction Training Tools:</strong> Regularly using this tool (Axevora Reaction Test) establishes a baseline and tracks progress.
                        </li>
                        <li>
                            <strong>Physical Exercise:</strong> Aerobic exercise increases blood flow to the brain. A 2015 study found that athletes have significantly faster reaction times than non-athletes.
                        </li>
                        <li>
                            <strong>Play Fast-Paced Games:</strong> Action games force your brain to make rapid decisions, improving your cognitive processing speed over time.
                        </li>
                        <li>
                            <strong>Meditation:</strong> Mindfulness helps clear "mental noise," allowing you to focus purely on the stimulus.
                        </li>
                    </ol>

                    <h3 className="text-2xl font-bold mt-12 mb-4">Frequently Asked Questions (FAQ)</h3>

                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-lg">What is a "good" reaction time?</h4>
                            <p className="text-muted-foreground">
                                For visual stimuli, anything under 250ms is average. Under 200ms is excellent. Under 150ms is elite/professional level.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Does gender affect reaction time?</h4>
                            <p className="text-muted-foreground">
                                Historically, studies showed men had slightly faster reaction times than women. However, recent research suggests this gap is narrowing, possibly due to increased participation in sports and gaming across all genders.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Can I improve my reaction time for driving?</h4>
                            <p className="text-muted-foreground">
                                Yes! While you can't change your age, staying fit, alert, and practicing defensive driving (anticipation) can make you a much safer driver.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Is this test accurate?</h4>
                            <p className="text-muted-foreground">
                                This test is accurate for web-based standards. However, your browser, operating system, and monitor add a small amount of latency (usually 10-50ms). For scientific precision, specialized hardware is required, but for self-improvement and comparison, this tool is perfect.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-primary/5 rounded-xl text-center">
                        <h3 className="text-2xl font-bold mb-4">Ready to test yourself again?</h3>
                        <p className="mb-6">Scroll up and click the blue box to start a new round. Challenge your friends and see who has the fastest reflexes!</p>
                        <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} size="lg">
                            Scroll to Top
                        </Button>
                    </div>
                </div>
            </div>
        </ToolTemplate>
    );
};

export default ReactionTimeTest;
