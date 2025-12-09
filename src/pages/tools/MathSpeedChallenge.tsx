import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RefreshCw, Trophy, Calculator, Timer, Check, X } from 'lucide-react';
import ToolTemplate from '../../components/ToolTemplate';

type Operation = '+' | '-' | '*';

const MathSpeedChallenge = () => {
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [operation, setOperation] = useState<Operation>('+');
    const [answer, setAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            endGame();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const generateQuestion = () => {
        const ops: Operation[] = ['+', '-', '*'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        setOperation(op);

        let n1, n2;
        if (op === '+') {
            n1 = Math.floor(Math.random() * 50) + 1;
            n2 = Math.floor(Math.random() * 50) + 1;
        } else if (op === '-') {
            n1 = Math.floor(Math.random() * 50) + 10;
            n2 = Math.floor(Math.random() * n1); // Ensure positive result
        } else {
            n1 = Math.floor(Math.random() * 12) + 1;
            n2 = Math.floor(Math.random() * 12) + 1;
        }
        setNum1(n1);
        setNum2(n2);
        setAnswer('');
    };

    const startGame = () => {
        setIsActive(true);
        setIsFinished(false);
        setScore(0);
        setTimeLeft(60);
        setFeedback(null);
        generateQuestion();
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const endGame = () => {
        setIsActive(false);
        setIsFinished(true);
    };

    const checkAnswer = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isActive) return;

        const userAnswer = parseInt(answer);
        let correctAnswer;
        switch (operation) {
            case '+': correctAnswer = num1 + num2; break;
            case '-': correctAnswer = num1 - num2; break;
            case '*': correctAnswer = num1 * num2; break;
        }

        if (userAnswer === correctAnswer) {
            setScore((prev) => prev + 1);
            setFeedback('correct');
            setTimeout(() => setFeedback(null), 500);
            generateQuestion();
        } else {
            setFeedback('incorrect');
            setTimeout(() => setFeedback(null), 500);
            // Optional: Penalty or just shake effect
        }
    };

    return (
        <ToolTemplate
            title="Math Speed Challenge"
            description="Test your mental math skills with this rapid-fire arithmetic challenge. Solve as many problems as you can in 60 seconds!"
        >
            <Helmet>
                <title>Math Speed Challenge - Mental Math Game | Axevora</title>
                <meta name="description" content="Improve your calculation speed with our free online math game. Practice addition, subtraction, and multiplication against the clock." />
            </Helmet>

            <div className="max-w-4xl mx-auto space-y-8">

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <Card className="bg-card/50 backdrop-blur">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Time</p>
                                <h3 className="text-3xl font-bold text-primary">{timeLeft}s</h3>
                            </div>
                            <Timer className="w-8 h-8 text-primary/50" />
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 backdrop-blur">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Score</p>
                                <h3 className="text-3xl font-bold text-green-500">{score}</h3>
                            </div>
                            <Trophy className="w-8 h-8 text-green-500/50" />
                        </CardContent>
                    </Card>
                </div>

                {/* Game Area */}
                <Card className="border-2 border-primary/20">
                    <CardContent className="p-8 md:p-12 text-center space-y-8">
                        {!isFinished ? (
                            isActive ? (
                                <div className="space-y-8 animate-in fade-in zoom-in duration-300">
                                    <div className="text-6xl md:text-8xl font-bold font-mono tracking-wider flex items-center justify-center gap-4">
                                        <span>{num1}</span>
                                        <span className="text-primary">{operation === '*' ? '×' : operation}</span>
                                        <span>{num2}</span>
                                        <span>=</span>
                                        <span className="text-muted-foreground">?</span>
                                    </div>

                                    <form onSubmit={checkAnswer} className="max-w-xs mx-auto relative">
                                        <Input
                                            ref={inputRef}
                                            type="number"
                                            value={answer}
                                            onChange={(e) => setAnswer(e.target.value)}
                                            className={`text-center text-4xl h-20 font-bold transition-all duration-200 ${feedback === 'correct' ? 'border-green-500 bg-green-500/10' :
                                                feedback === 'incorrect' ? 'border-red-500 bg-red-500/10' : ''
                                                }`}
                                            placeholder=""
                                            autoFocus
                                        />
                                        {feedback === 'correct' && (
                                            <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-green-500 animate-in fade-in zoom-in" />
                                        )}
                                        {feedback === 'incorrect' && (
                                            <X className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-red-500 animate-in fade-in zoom-in" />
                                        )}
                                    </form>
                                    <p className="text-muted-foreground">Press Enter to submit</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <Calculator className="w-24 h-24 mx-auto text-primary animate-bounce" />
                                    <h2 className="text-4xl font-bold">Ready to Calculate?</h2>
                                    <p className="text-xl text-muted-foreground">You have 60 seconds to solve as many problems as possible.</p>
                                    <Button size="lg" onClick={startGame} className="px-12 text-lg">
                                        Start Challenge
                                    </Button>
                                </div>
                            )
                        ) : (
                            <div className="space-y-8 animate-in zoom-in">
                                <Trophy className="w-24 h-24 mx-auto text-yellow-500" />
                                <div>
                                    <h2 className="text-4xl font-bold mb-2">Time's Up!</h2>
                                    <p className="text-2xl text-muted-foreground">Final Score: <span className="text-primary font-bold">{score}</span></p>
                                </div>
                                <Button size="lg" onClick={startGame} className="px-12 text-lg">
                                    <RefreshCw className="w-5 h-5 mr-2" /> Play Again
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Educational Content */}
                <div className="prose dark:prose-invert max-w-none mt-12">
                    <h2 className="text-3xl font-bold mb-6">Unlock Your Inner Genius: The Power of Mental Math</h2>

                    <p className="text-lg leading-relaxed mb-6">
                        "Why do I need to learn math when I have a calculator in my pocket?" It's a question every teacher has heard. But mental math isn't just about finding the answer; it's about <strong>Number Sense</strong>. It's the ability to understand relationships between quantities, spot errors instantly, and make quick decisions. In a world drowning in data, being comfortable with numbers is a superpower.
                    </p>

                    <div className="my-8 p-6 bg-muted/50 rounded-xl border-l-4 border-primary">
                        <h3 className="text-xl font-bold mb-2">What is Number Sense?</h3>
                        <p>
                            Think of number sense like "street smarts" for math. A person with good number sense might not know exactly what <em>48 × 12</em> is instantly, but they know it's close to <em>50 × 12 = 600</em>, so if the calculator says 4800, they know something is wrong.
                        </p>
                        <p className="mt-4">
                            This game trains that instinct. By forcing you to calculate against the clock, you bypass the slow, analytical part of your brain and train your intuitive, rapid-fire processing.
                        </p>
                    </div>

                    <h3 className="text-2xl font-bold mt-12 mb-4">Why Mental Math Still Matters</h3>
                    <p className="mb-4">
                        Beyond just impressing your friends at dinner by splitting the bill instantly, mental math has profound cognitive benefits.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                        <div className="bg-card p-6 rounded-xl border shadow-sm">
                            <h4 className="font-bold text-lg mb-2">1. Working Memory Workout</h4>
                            <p className="text-sm text-muted-foreground">
                                Holding numbers in your head while manipulating them is one of the best exercises for your working memory. It's like weightlifting for your brain.
                            </p>
                        </div>
                        <div className="bg-card p-6 rounded-xl border shadow-sm">
                            <h4 className="font-bold text-lg mb-2">2. Financial Confidence</h4>
                            <p className="text-sm text-muted-foreground">
                                People who are comfortable with numbers are less likely to be scammed, make better investment decisions, and manage debt more effectively.
                            </p>
                        </div>
                        <div className="bg-card p-6 rounded-xl border shadow-sm">
                            <h4 className="font-bold text-lg mb-2">3. Career Success</h4>
                            <p className="text-sm text-muted-foreground">
                                From coding to construction, almost every high-paying job requires some level of estimation and quantitative reasoning.
                            </p>
                        </div>
                        <div className="bg-card p-6 rounded-xl border shadow-sm">
                            <h4 className="font-bold text-lg mb-2">4. Standardized Tests</h4>
                            <p className="text-sm text-muted-foreground">
                                Exams like the SAT, GMAT, and GRE are timed. Saving 10 seconds on a calculation can be the difference between finishing the section or running out of time.
                            </p>
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold mt-12 mb-4">Secret Tricks for Lightning Fast Calculation</h3>
                    <p className="mb-6">
                        Math magicians aren't necessarily smarter; they just know shortcuts. Here are a few you can use right now.
                    </p>

                    <h4 className="text-xl font-bold mb-2">1. The "Left-to-Right" Rule</h4>
                    <p className="mb-4">
                        In school, we learn to add from right to left (ones column first). But for mental math, go left to right.
                        <br />
                        <strong>Example: 45 + 34</strong>
                        <br />
                        Step 1: 40 + 30 = 70
                        <br />
                        Step 2: 5 + 4 = 9
                        <br />
                        Step 3: 70 + 9 = 79.
                        <br />
                        It feels more natural because you say the biggest part of the number first.
                    </p>

                    <h4 className="text-xl font-bold mb-2">2. Subtracting by Adding</h4>
                    <p className="mb-4">
                        Subtraction is hard. Addition is easy. Flip the problem.
                        <br />
                        <strong>Example: 100 - 73</strong>
                        <br />
                        Instead of borrowing, think: "What do I add to 73 to get to 100?"
                        <br />
                        73 + <strong>7</strong> = 80.
                        <br />
                        80 + <strong>20</strong> = 100.
                        <br />
                        20 + 7 = 27.
                    </p>

                    <h4 className="text-xl font-bold mb-2">3. Multiplying by 11</h4>
                    <p className="mb-4">
                        To multiply a two-digit number by 11, add the digits and put the sum in the middle.
                        <br />
                        <strong>Example: 23 × 11</strong>
                        <br />
                        2 + 3 = 5.
                        <br />
                        Put 5 between 2 and 3.
                        <br />
                        Answer: <strong>253</strong>.
                    </p>

                    <h4 className="text-xl font-bold mb-2">4. The 5 Trick</h4>
                    <p className="mb-4">
                        To multiply by 5, multiply by 10 (add a zero) and then cut it in half.
                        <br />
                        <strong>Example: 48 × 5</strong>
                        <br />
                        48 × 10 = 480.
                        <br />
                        Half of 480 = <strong>240</strong>.
                    </p>

                    <h3 className="text-2xl font-bold mt-12 mb-4">Overcoming Math Anxiety</h3>
                    <p className="mb-4">
                        Many people "freeze" when they see numbers. This is called Math Anxiety. It's an emotional response, not an intellectual one.
                    </p>
                    <ul className="list-disc ml-6 mb-6 space-y-2">
                        <li><strong>Start Small:</strong> Don't jump to calculus. Start with simple addition games like this one.</li>
                        <li><strong>Focus on Growth:</strong> You aren't "bad at math." You just haven't practiced enough yet.</li>
                        <li><strong>Gamify It:</strong> Making it a game removes the fear of failure. If you get a low score, just hit reset!</li>
                    </ul>

                    <h3 className="text-2xl font-bold mt-12 mb-4">Frequently Asked Questions (FAQ)</h3>

                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-lg">Can adults learn mental math?</h4>
                            <p className="text-muted-foreground">
                                Absolutely. While kids have more "plastic" brains, adults have better discipline and can understand abstract concepts (like the tricks above) faster.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Is this helpful for coding?</h4>
                            <p className="text-muted-foreground">
                                Yes. Programming is logic-based. While you don't do much arithmetic in code, the logical thinking and problem-solving muscles are exactly the same.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">How can I get faster?</h4>
                            <p className="text-muted-foreground">
                                Practice, practice, practice. Play this game for 5 minutes every morning. Try to beat your high score by just 1 point each day.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-primary/5 rounded-xl text-center">
                        <h3 className="text-2xl font-bold mb-4">Ready to crunch some numbers?</h3>
                        <p className="mb-6">Scroll up and hit "Start Challenge". Remember: Accuracy first, speed second!</p>
                        <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} size="lg">
                            Scroll to Top
                        </Button>
                    </div>
                </div>
            </div>
        </ToolTemplate>
    );
};

export default MathSpeedChallenge;
