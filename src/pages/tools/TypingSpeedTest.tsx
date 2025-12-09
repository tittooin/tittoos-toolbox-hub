import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Play, Trophy, Timer, Keyboard } from 'lucide-react';
import ToolTemplate from '../../components/ToolTemplate';

const WORDS = [
    "the", "be", "of", "and", "a", "to", "in", "he", "have", "it", "that", "for", "they", "i", "with", "as", "not", "on", "she", "at", "by", "this", "we", "you", "do", "but", "from", "or", "which", "one", "would", "all", "will", "there", "say", "who", "make", "when", "can", "more", "if", "no", "man", "out", "other", "so", "what", "time", "up", "go", "about", "than", "into", "could", "state", "only", "new", "year", "some", "take", "come", "these", "know", "see", "use", "get", "like", "then", "first", "any", "work", "now", "may", "such", "give", "over", "think", "most", "even", "find", "day", "also", "after", "way", "many", "must", "look", "before", "great", "back", "through", "long", "where", "much", "should", "well", "people", "down", "own", "just", "because", "good", "each", "those", "feel", "seem", "how", "high", "too", "place", "little", "world", "very", "still", "nation", "hand", "old", "life", "tell", "write", "become", "here", "show", "house", "both", "between", "need", "mean", "call", "develop", "under", "last", "right", "move", "thing", "general", "school", "never", "same", "another", "begin", "while", "number", "part", "turn", "real", "leave", "might", "want", "point", "form", "off", "child", "few", "small", "since", "against", "ask", "late", "home", "interest", "large", "person", "end", "open", "public", "follow", "during", "present", "without", "again", "hold", "govern", "around", "possible", "head", "consider", "word", "program", "problem", "however", "lead", "system", "set", "order", "eye", "plan", "run", "keep", "face", "fact", "group", "play", "stand", "increase", "early", "course", "change", "help", "line"
];

const TypingSpeedTest = () => {
    const [words, setWords] = useState<string[]>([]);
    const [currentInput, setCurrentInput] = useState('');
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [correctWords, setCorrectWords] = useState(0);
    const [incorrectWords, setIncorrectWords] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);

    const inputRef = useRef<HTMLInputElement>(null);
    const wordContainerRef = useRef<HTMLDivElement>(null);

    const generateWords = useCallback(() => {
        const shuffled = [...WORDS].sort(() => 0.5 - Math.random());
        setWords(shuffled.slice(0, 100));
    }, []);

    useEffect(() => {
        generateWords();
    }, [generateWords]);

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

    const startGame = () => {
        setIsActive(true);
        setIsFinished(false);
        setTimeLeft(60);
        setCorrectWords(0);
        setIncorrectWords(0);
        setCurrentWordIndex(0);
        setCurrentInput('');
        setWpm(0);
        setAccuracy(100);
        generateWords();
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const endGame = () => {
        setIsActive(false);
        setIsFinished(true);
        calculateResults();
    };

    const calculateResults = () => {
        const totalWords = correctWords + incorrectWords;
        const calculatedWpm = Math.round((correctWords)); // Simplified WPM
        const calculatedAccuracy = totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0;
        setWpm(calculatedWpm);
        setAccuracy(calculatedAccuracy);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (!isActive && !isFinished) {
            setIsActive(true);
        }

        if (value.endsWith(' ')) {
            const wordToCheck = value.trim();
            if (wordToCheck === words[currentWordIndex]) {
                setCorrectWords((prev) => prev + 1);
            } else {
                setIncorrectWords((prev) => prev + 1);
            }
            setCurrentWordIndex((prev) => prev + 1);
            setCurrentInput('');

            // Auto scroll
            if (currentWordIndex > 0 && currentWordIndex % 5 === 0) {
                // Simple logic to keep current word in view could be added here
            }
        } else {
            setCurrentInput(value);
        }
    };

    return (
        <ToolTemplate
            title="Typing Speed Test"
            description="Test your typing speed and accuracy with our free online typing test. Improve your WPM (Words Per Minute) and become a faster typist."
        >
            <Helmet>
                <title>Typing Speed Test - Check Your WPM | Axevora</title>
                <meta name="description" content="Test your typing speed online for free. Check your WPM and accuracy, practice typing, and improve your keyboard skills with Axevora's Typing Speed Test." />
            </Helmet>

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-card/50 backdrop-blur">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Time Left</p>
                                <h3 className="text-3xl font-bold text-primary">{timeLeft}s</h3>
                            </div>
                            <Timer className="w-8 h-8 text-primary/50" />
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 backdrop-blur">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">WPM</p>
                                <h3 className="text-3xl font-bold text-green-500">{isActive ? Math.round(correctWords * (60 / (60 - timeLeft || 1))) : wpm}</h3>
                            </div>
                            <Keyboard className="w-8 h-8 text-green-500/50" />
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 backdrop-blur">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Accuracy</p>
                                <h3 className="text-3xl font-bold text-blue-500">
                                    {correctWords + incorrectWords > 0
                                        ? Math.round((correctWords / (correctWords + incorrectWords)) * 100)
                                        : 100}%
                                </h3>
                            </div>
                            <Trophy className="w-8 h-8 text-blue-500/50" />
                        </CardContent>
                    </Card>
                </div>

                {/* Game Area */}
                <Card className="border-2 border-primary/20">
                    <CardContent className="p-8 space-y-8">
                        {!isFinished ? (
                            <>
                                <div
                                    ref={wordContainerRef}
                                    className="bg-muted/30 p-6 rounded-xl text-2xl leading-relaxed font-mono min-h-[150px] max-h-[200px] overflow-hidden relative select-none"
                                >
                                    <div className="flex flex-wrap gap-3">
                                        {words.map((word, index) => {
                                            let colorClass = "text-muted-foreground";
                                            if (index < currentWordIndex) {
                                                // We don't track exact history of correct/incorrect per word in this simple view, 
                                                // but we could. For now, let's just fade them out.
                                                colorClass = "text-muted-foreground/30";
                                            } else if (index === currentWordIndex) {
                                                colorClass = "bg-primary/20 text-primary px-1 rounded";
                                            }

                                            return (
                                                <span key={index} className={`${colorClass} transition-colors`}>
                                                    {word}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={currentInput}
                                        onChange={handleInputChange}
                                        className="flex-1 bg-background border-2 border-input focus:border-primary rounded-lg px-6 py-4 text-xl outline-none transition-all"
                                        placeholder={isActive ? "Type here..." : "Start typing to begin..."}
                                        autoFocus
                                    />
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        onClick={startGame}
                                        className="h-auto px-8"
                                    >
                                        <RefreshCw className={`w-6 h-6 ${isActive ? 'animate-spin' : ''}`} />
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center space-y-8 py-8">
                                <div className="space-y-2">
                                    <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                                    <h2 className="text-4xl font-bold">Test Complete!</h2>
                                    <p className="text-muted-foreground text-lg">Here is how you performed</p>
                                </div>

                                <div className="grid grid-cols-2 gap-8 max-w-md mx-auto">
                                    <div className="bg-muted/50 p-6 rounded-xl">
                                        <p className="text-sm text-muted-foreground mb-1">Words Per Minute</p>
                                        <p className="text-5xl font-bold text-primary">{wpm}</p>
                                    </div>
                                    <div className="bg-muted/50 p-6 rounded-xl">
                                        <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
                                        <p className="text-5xl font-bold text-blue-500">{accuracy}%</p>
                                    </div>
                                </div>

                                <Button size="lg" onClick={startGame} className="px-12 text-lg">
                                    <Play className="w-5 h-5 mr-2" /> Try Again
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Instructions */}
                <div className="prose dark:prose-invert max-w-none">
                    <h2>How to Improve Your Typing Speed</h2>
                    <p>
                        Typing speed is measured in Words Per Minute (WPM). The average typing speed is around 40 WPM, while professional typists can reach speeds of 70-80 WPM or higher.
                    </p>
                    <ul>
                        <li><strong>Posture:</strong> Sit straight with your feet flat on the floor. Keep your wrists straight and hovering above the keyboard.</li>
                        <li><strong>Home Row:</strong> Place your fingers on the home row keys (ASDF for left hand, JKL; for right hand).</li>
                        <li><strong>Practice:</strong> Regular practice is key. Use this tool daily to track your progress.</li>
                        <li><strong>Accuracy over Speed:</strong> Focus on typing correctly first. Speed will come naturally with muscle memory.</li>
                    </ul>
                </div>
            </div>
        </ToolTemplate>
    );
};

export default TypingSpeedTest;
