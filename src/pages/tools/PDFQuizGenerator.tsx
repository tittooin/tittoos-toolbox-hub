
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, BookOpen, Trophy, RefreshCcw, CheckCircle, XCircle } from "lucide-react";
import { PDFHelper } from "@/utils/pdfAIUtils";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
}

const PDFQuizGenerator = () => {
    const [apiKey, setApiKey] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [pdfText, setPdfText] = useState('');
    const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pdfHelper, setPdfHelper] = useState<PDFHelper | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) {
            setApiKey(savedKey);
            setPdfHelper(new PDFHelper(savedKey));
        }
    }, []);

    const handleSaveKey = () => {
        if (!apiKey.trim()) return;
        localStorage.setItem('gemini_api_key', apiKey);
        setPdfHelper(new PDFHelper(apiKey));
        toast.success("API Key saved!");
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        if (selectedFile.type !== 'application/pdf') {
            toast.error("Please upload a PDF.");
            return;
        }
        if (!apiKey) {
            toast.error("Please enter API Key.");
            return;
        }
        setFile(selectedFile);
        setIsProcessing(true);
        try {
            if (!pdfHelper) throw new Error("Init failed");
            const text = await pdfHelper.extractText(selectedFile);
            setPdfText(text);
            toast.success("PDF Ready. Click Generate Quiz!");
            setQuiz([]);
            setCurrentQuestionIndex(0);
            setSelectedAnswers({});
            setShowResults(false);
        } catch (e) {
            toast.error("Failed to read PDF.");
        } finally {
            setIsProcessing(false);
        }
    };

    const generateQuiz = async () => {
        if (!pdfHelper || !pdfText) return;
        setIsProcessing(true);
        try {
            const response = await pdfHelper.generateQuiz(pdfText, 'medium');
            if (response.error) throw new Error(response.error);

            // Parse JSON strictly
            const questions = JSON.parse(response.text);
            if (Array.isArray(questions)) {
                setQuiz(questions);
                toast.success("Quiz Generated! Good luck.");
            } else {
                throw new Error("Invalid format");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate quiz. Try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAnswerSelect = (optionIndex: number) => {
        if (showResults) return; // Lock if finished
        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: optionIndex
        }));
    };

    const calculateScore = () => {
        let score = 0;
        quiz.forEach((q, i) => {
            if (selectedAnswers[i] === q.correctAnswer) score++;
        });
        return score;
    };

    return (
        <div className="container mx-auto py-10 max-w-3xl space-y-8">
            <SEO
                title="AI Quiz Generator from PDF"
                description="Turn your study notes and textbooks into an interactive quiz instantly using AI."
                keywords="pdf to quiz, ai quiz generator, study tool, exam prep ai"
            />

            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500">
                    PDF to Quiz (AI)
                </h1>
                <p className="text-muted-foreground text-lg">
                    Test your knowledge. Upload notes, get a quiz.
                </p>
            </div>

            {/* Config Panel - Simplified if quiz is active */}
            {!quiz.length && (
                <Card className="border-dashed border-2">
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                type="password"
                                placeholder="Gemini API Key..."
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                            />
                            <Input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileUpload}
                                disabled={!apiKey || isProcessing}
                            />
                        </div>
                        <Button
                            className="w-full text-lg h-12"
                            onClick={generateQuiz}
                            disabled={!pdfText || isProcessing}
                        >
                            {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <BookOpen className="mr-2" />}
                            {isProcessing ? "Reading & Generating Questions..." : "Generate Quiz"}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Quiz Interface */}
            {quiz.length > 0 && (
                <Card className="overflow-hidden border-2 border-primary/20 shadow-xl">
                    <CardHeader className="bg-primary/5 border-b pb-8">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-medium text-muted-foreground">Question {currentQuestionIndex + 1} of {quiz.length}</span>
                            {showResults && (
                                <span className="font-bold text-xl text-primary">Score: {calculateScore()}/{quiz.length}</span>
                            )}
                        </div>
                        <CardTitle className="text-2xl leading-relaxed">
                            {quiz[currentQuestionIndex].question}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-8 space-y-4">
                        <RadioGroup
                            value={selectedAnswers[currentQuestionIndex]?.toString()}
                            onValueChange={(val) => handleAnswerSelect(parseInt(val))}
                            className="space-y-3"
                        >
                            {quiz[currentQuestionIndex].options.map((option, idx) => {
                                const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                                const isCorrect = quiz[currentQuestionIndex].correctAnswer === idx;

                                let itemClass = "flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all hover:bg-accent/50";

                                if (showResults) {
                                    if (isCorrect) itemClass = "flex items-center space-x-3 p-4 rounded-lg border border-green-500 bg-green-50 text-green-900";
                                    else if (isSelected && !isCorrect) itemClass = "flex items-center space-x-3 p-4 rounded-lg border border-red-500 bg-red-50 text-red-900";
                                    else itemClass += " opacity-60"; // dim others
                                } else {
                                    if (isSelected) itemClass = "flex items-center space-x-3 p-4 rounded-lg border-primary bg-primary/10 shadow-sm";
                                }

                                return (
                                    <div key={idx} className={itemClass} onClick={() => !showResults && handleAnswerSelect(idx)}>
                                        <RadioGroupItem value={idx.toString()} id={`opt-${idx}`} className="sr-only" />
                                        <div className="flex-1 font-medium">{option}</div>
                                        {showResults && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                                        {showResults && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                                    </div>
                                );
                            })}
                        </RadioGroup>
                    </CardContent>

                    <CardFooter className="bg-muted/10 p-6 flex justify-between">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                            disabled={currentQuestionIndex === 0}
                        >
                            Previous
                        </Button>

                        {currentQuestionIndex < quiz.length - 1 ? (
                            <Button onClick={() => setCurrentQuestionIndex(prev => prev + 1)}>
                                Next Question
                            </Button>
                        ) : (
                            !showResults ? (
                                <Button onClick={() => setShowResults(true)} className="bg-green-600 hover:bg-green-700">
                                    Finish & See Score
                                </Button>
                            ) : (
                                <Button onClick={() => { setQuiz([]); setPdfText(''); setFile(null); }}>
                                    <RefreshCcw className="mr-2 h-4 w-4" /> Start New Quiz
                                </Button>
                            )
                        )}
                    </CardFooter>
                </Card>
            )}
        </div>
    );
};

export default PDFQuizGenerator;
