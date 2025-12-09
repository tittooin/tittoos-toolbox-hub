import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Trophy, Brain, Timer, Move } from 'lucide-react';
import ToolTemplate from '../../components/ToolTemplate';

const ICONS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

interface CardType {
    id: number;
    icon: string;
    isFlipped: boolean;
    isMatched: boolean;
}

const MemoryMatchGame = () => {
    const [cards, setCards] = useState<CardType[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);
    const [isWon, setIsWon] = useState(false);
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        startNewGame();
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && !isWon) {
            interval = setInterval(() => {
                setTime((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, isWon]);

    const startNewGame = () => {
        const shuffledIcons = [...ICONS, ...ICONS]
            .sort(() => Math.random() - 0.5)
            .map((icon, index) => ({
                id: index,
                icon,
                isFlipped: false,
                isMatched: false,
            }));

        setCards(shuffledIcons);
        setFlippedCards([]);
        setMoves(0);
        setMatches(0);
        setIsWon(false);
        setTime(0);
        setIsActive(true);
    };

    const handleCardClick = (id: number) => {
        if (flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched || isWon) return;

        const newCards = [...cards];
        newCards[id].isFlipped = true;
        setCards(newCards);

        const newFlipped = [...flippedCards, id];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setMoves((prev) => prev + 1);
            checkForMatch(newFlipped);
        }
    };

    const checkForMatch = (flipped: number[]) => {
        const [first, second] = flipped;
        if (cards[first].icon === cards[second].icon) {
            const newCards = [...cards];
            newCards[first].isMatched = true;
            newCards[second].isMatched = true;
            setCards(newCards);
            setFlippedCards([]);
            setMatches((prev) => prev + 1);

            if (matches + 1 === ICONS.length) {
                setIsWon(true);
                setIsActive(false);
            }
        } else {
            setTimeout(() => {
                const newCards = [...cards];
                newCards[first].isFlipped = false;
                newCards[second].isFlipped = false;
                setCards(newCards);
                setFlippedCards([]);
            }, 1000);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <ToolTemplate
            title="Memory Match Game"
            description="Train your brain with this classic memory card matching game. Find all the matching pairs in the fewest moves possible."
        >
            <Helmet>
                <title>Memory Match Game - Brain Training | Axevora</title>
                <meta name="description" content="Play free online memory match game. Improve your short-term memory and concentration. Fun brain training exercise for all ages." />
            </Helmet>

            <div className="max-w-4xl mx-auto space-y-8">

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-card/50 backdrop-blur">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <p className="text-sm text-muted-foreground mb-1">Moves</p>
                            <div className="flex items-center gap-2">
                                <Move className="w-5 h-5 text-primary" />
                                <span className="text-2xl font-bold">{moves}</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 backdrop-blur">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <p className="text-sm text-muted-foreground mb-1">Time</p>
                            <div className="flex items-center gap-2">
                                <Timer className="w-5 h-5 text-primary" />
                                <span className="text-2xl font-bold">{formatTime(time)}</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 backdrop-blur">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <Button onClick={startNewGame} variant="outline" size="sm" className="w-full h-full min-h-[50px]">
                                <RefreshCw className="w-4 h-4 mr-2" /> Restart
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Game Grid */}
                <div className="relative">
                    <div className="grid grid-cols-4 gap-3 md:gap-4 aspect-square max-w-md mx-auto">
                        {cards.map((card, index) => (
                            <div
                                key={card.id}
                                onClick={() => handleCardClick(index)}
                                className={`
                  relative w-full h-full cursor-pointer transition-all duration-300 transform preserve-3d
                  ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}
                `}
                                style={{ perspective: '1000px' }}
                            >
                                <div className={`
                  absolute w-full h-full rounded-xl flex items-center justify-center text-4xl shadow-md transition-all duration-300
                  ${card.isFlipped || card.isMatched
                                        ? 'bg-primary text-primary-foreground rotate-y-180'
                                        : 'bg-muted hover:bg-muted/80'}
                `}>
                                    {(card.isFlipped || card.isMatched) ? card.icon : <Brain className="w-8 h-8 text-muted-foreground/50" />}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Win Overlay */}
                    {isWon && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-10 animate-in fade-in">
                            <Trophy className="w-24 h-24 text-yellow-500 mb-6 animate-bounce" />
                            <h2 className="text-4xl font-bold mb-2">You Won!</h2>
                            <p className="text-xl text-muted-foreground mb-6">
                                Completed in {moves} moves and {formatTime(time)}
                            </p>
                            <Button size="lg" onClick={startNewGame}>
                                Play Again
                            </Button>
                        </div>
                    )}
                </div>

                {/* Educational Content */}
                <div className="prose dark:prose-invert max-w-none mt-12">
                    <h2 className="text-3xl font-bold mb-6">Master Your Mind: The Science of Memory Training</h2>

                    <p className="text-lg leading-relaxed mb-6">
                        We've all been there—walking into a room and forgetting why, or struggling to recall a name that's on the tip of our tongue. In our digital age, where information is always a click away, our natural memory muscles are getting a bit flabby. But here's the good news: <strong>Your brain is like a muscle</strong>. The more you use it, the stronger it gets. This Memory Match Game isn't just a fun way to pass time; it's a legitimate workout for your cognitive functions.
                    </p>

                    <div className="my-8 p-6 bg-muted/50 rounded-xl border-l-4 border-primary">
                        <h3 className="text-xl font-bold mb-2">What is Working Memory?</h3>
                        <p>
                            This game specifically targets your <strong>Working Memory</strong>. Unlike long-term memory (where you store childhood memories) or short-term memory (remembering a phone number for 10 seconds), working memory is your brain's "scratchpad." It's the ability to hold information in your mind <em>and</em> manipulate it.
                        </p>
                        <p className="mt-4">
                            When you flip a card, you have to hold that image in your mind while scanning for its pair. This constant "load and retrieve" cycle triggers neuroplasticity—the brain's ability to form new neural connections.
                        </p>
                    </div>

                    <h3 className="text-2xl font-bold mt-12 mb-4">The Neuroscience of "Use It or Lose It"</h3>
                    <p className="mb-4">
                        Your brain contains approximately 86 billion neurons. These neurons communicate via synapses. Every time you learn something new or challenge your memory, you strengthen these synaptic connections.
                    </p>
                    <p className="mb-6">
                        Research suggests that engaging in cognitively stimulating activities can build up a "Cognitive Reserve." Think of this as a buffer against aging. People with a higher cognitive reserve may show fewer signs of decline even if their brain physically ages.
                    </p>

                    <div className="overflow-x-auto my-8">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b-2 border-muted">
                                    <th className="p-4 font-bold">Memory Type</th>
                                    <th className="p-4 font-bold">Function</th>
                                    <th className="p-4 font-bold">How This Game Helps</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-muted/50">
                                    <td className="p-4">Visual Spatial</td>
                                    <td className="p-4">Remembering locations & shapes</td>
                                    <td className="p-4">Directly trains recalling card positions.</td>
                                </tr>
                                <tr className="border-b border-muted/50">
                                    <td className="p-4">Working Memory</td>
                                    <td className="p-4">Processing current info</td>
                                    <td className="p-4">Holding multiple card identities in mind.</td>
                                </tr>
                                <tr className="border-b border-muted/50">
                                    <td className="p-4">Episodic</td>
                                    <td className="p-4">Personal experiences</td>
                                    <td className="p-4">Remembering the "story" of the current game round.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h3 className="text-2xl font-bold mt-12 mb-4">5 Proven Strategies to Boost Your Memory</h3>
                    <p className="mb-6">
                        Want to take your memory skills beyond this game? Here are scientifically-backed techniques used by World Memory Champions.
                    </p>

                    <h4 className="text-xl font-bold mb-2">1. The Method of Loci (Memory Palace)</h4>
                    <p className="mb-4">
                        This ancient Greek technique involves visualizing a familiar place (like your house) and placing items you want to remember in specific rooms. To recall them, you simply "walk" through your house in your mind.
                    </p>

                    <h4 className="text-xl font-bold mb-2">2. Chunking</h4>
                    <p className="mb-4">
                        Our brains struggle to remember long strings of data. "Chunking" breaks them down. It's easier to remember "1990 2023 5555" than "199020235555". In this game, try to remember cards in small groups (e.g., "top row has the dog and cat").
                    </p>

                    <h4 className="text-xl font-bold mb-2">3. Visualization & Association</h4>
                    <p className="mb-4">
                        The brain loves pictures. If you meet someone named "Baker," visualize them wearing a chef's hat. The weirder the image, the better it sticks.
                    </p>

                    <h4 className="text-xl font-bold mb-2">4. Spaced Repetition</h4>
                    <p className="mb-4">
                        Cramming doesn't work. Reviewing information at increasing intervals (1 day, 3 days, 1 week) cements it into long-term memory.
                    </p>

                    <h4 className="text-xl font-bold mb-2">5. Sleep & Consolidation</h4>
                    <p className="mb-4">
                        Sleep is when the magic happens. During deep sleep, your brain moves memories from the hippocampus (short-term storage) to the cortex (long-term storage). Pulling an all-nighter is the worst thing you can do for memory.
                    </p>

                    <h3 className="text-2xl font-bold mt-12 mb-4">Lifestyle Factors: Feed Your Brain</h3>
                    <p className="mb-4">
                        You can't out-train a bad diet. Your brain is an energy-hog, consuming 20% of your body's calories.
                    </p>
                    <ul className="list-disc ml-6 mb-6 space-y-2">
                        <li><strong>Omega-3 Fatty Acids:</strong> Found in fish like salmon. Essential for building brain cells.</li>
                        <li><strong>Antioxidants:</strong> Berries, dark chocolate, and nuts protect the brain from oxidative stress.</li>
                        <li><strong>Water:</strong> Dehydration shrinks brain tissue and impairs short-term memory.</li>
                        <li><strong>Exercise:</strong> Aerobic exercise increases the size of the hippocampus, the brain area involved in verbal memory and learning.</li>
                    </ul>

                    <h3 className="text-2xl font-bold mt-12 mb-4">Frequently Asked Questions (FAQ)</h3>

                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-lg">Does this game prevent Alzheimer's?</h4>
                            <p className="text-muted-foreground">
                                While no single game can prevent dementia, research shows that lifelong cognitive stimulation helps build a "cognitive reserve," which can delay the onset of symptoms. Think of it as building a savings account for your brain.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">How often should I play?</h4>
                            <p className="text-muted-foreground">
                                Consistency beats intensity. Playing for 10-15 minutes daily is better than a 2-hour marathon once a week.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Why do I forget names so easily?</h4>
                            <p className="text-muted-foreground">
                                Usually, this is an attention issue, not a memory issue. You weren't fully listening because you were thinking about what to say next. Try repeating the name immediately after hearing it.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Is photographic memory real?</h4>
                            <p className="text-muted-foreground">
                                True "photographic" (eidetic) memory is extremely rare in adults. Most people who seem to have it actually use advanced mnemonic techniques like the Memory Palace.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-primary/5 rounded-xl text-center">
                        <h3 className="text-2xl font-bold mb-4">Ready to challenge your brain?</h3>
                        <p className="mb-6">Scroll up and hit "Restart" to try and beat your best time. Remember, fewer moves means a stronger memory!</p>
                        <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} size="lg">
                            Scroll to Top
                        </Button>
                    </div>
                </div>
            </div>
        </ToolTemplate>
    );
};

export default MemoryMatchGame;
