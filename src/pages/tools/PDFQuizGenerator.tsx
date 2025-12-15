
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
import ToolTemplate from "@/components/ToolTemplate";

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

    const features = [
        "AI-Powered Quiz Generation",
        "Active Recall Study Tool",
        "Instant Scoring & Feedback",
        "Unlimited Quiz Variations",
        "Supports Any PDF Textbook"
    ];

    return (
        <ToolTemplate
            title="AI Quiz Generator from PDF"
            description="Turn your study notes and textbooks into an interactive quiz instantly using AI."
            icon={Trophy}
            features={features}
        >
            <div className="space-y-8">
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
                {/* Detailed SEO Content */}
                <div className="prose dark:prose-invert max-w-none mt-24">
                    <h2 className="text-3xl font-bold mb-6">Study Smarter, Not Harder: The AI PDF Quiz Generator</h2>
                    <p className="lead text-xl text-muted-foreground mb-8">
                        Reading notes is passive. Taking quizzes is active. Psychology tells us that **Active Recall**
                        is the #1 most effective way to learn. Our **PDF Quiz Generator** instantly transforms your
                        static study materials into dynamic, interactive exams, forcing your brain to retain information up to 50% better.
                    </p>

                    <img
                        src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000&auto=format&fit=crop"
                        alt="Student successfully passing exam with high grades using AI tools"
                        className="w-full h-64 object-cover rounded-xl shadow-lg mb-8"
                    />

                    <h3>Why generate quizzes from PDFs?</h3>
                    <p>
                        Creating flashcards or writing your own questions takes hours. By the time you're done making the study materials,
                        you're too tired to actually study.
                    </p>
                    <p>
                        Our AI does the heavy lifting. It scans your uploaded PDF—whether it's a history textbook, a biology paper,
                        or employee handbook—and identifies the <em>core facts</em> that are likely to appear on a test.
                        It then constructs trick questions (distractors) to challenge your understanding.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 my-10">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                            <h4 className="font-bold text-xl mb-3 flex items-center text-green-800 dark:text-green-300">
                                <Trophy className="mr-2 w-5 h-5" /> Instant Feedback loop
                            </h4>
                            <p className="text-sm">
                                Don't wait for the teacher to grade your paper. Get instant results. See exactly which questions you got wrong
                                and, more importantly, <em>why</em>.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                            <h4 className="font-bold text-xl mb-3 flex items-center text-blue-800 dark:text-blue-300">
                                <RefreshCcw className="mr-2 w-5 h-5" /> Unlimited Variations
                            </h4>
                            <p className="text-sm">
                                Finished the quiz? Generate another one! The AI picks different random questions each time, giving you
                                an endless supply of practice exams.
                            </p>
                        </div>
                    </div>

                    <h3>How to use the Quiz Maker</h3>
                    <ol>
                        <li><strong>Upload:</strong> Select any PDF file (Lecture notes, eBooks, Manuals).</li>
                        <li><strong>Generate:</strong> Click the button. The AI reads the content in seconds.</li>
                        <li><strong>Solve:</strong> An interactive interface appears. Select the correct option for each question.</li>
                        <li><strong>Review:</strong> Click "Finish" to see your score and review the correct answers.</li>
                    </ol>

                    <img
                        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop"
                        alt="Online digital learning platform interface"
                        className="w-full h-80 object-cover rounded-xl shadow-lg my-8"
                    />

                    <h3>Who is this for?</h3>
                    <ul>
                        <li><strong>Students (SAT/ACT/GRE):</strong> Turn prep books into practice tests.</li>
                        <li><strong>Medical Students:</strong> Memorize complex anatomy definitions and drug interactions.</li>
                        <li><strong>Corporate Trainers:</strong> Create compliance quizzes for employee handbooks automatically.</li>
                        <li><strong>Lifelong Learners:</strong> Test your understanding of that non-fiction book you just read.</li>
                    </ul>

                    <h3>Frequently Asked Questions</h3>
                    <div className="space-y-4">
                        <div className="border-l-4 border-primary pl-4">
                            <h4 className="font-bold">Can I save the quiz?</h4>
                            <p>Currently, the quiz facilitates instant practice. We are working on a feature to export questions to Anki or PDF.</p>
                        </div>
                        <div className="border-l-4 border-primary pl-4">
                            <h4 className="font-bold">Does it work with Math/Equations?</h4>
                            <p>It works best with text-based concepts. Complex mathematical formulas might not render perfectly in this version, but conceptual physics/math questions work great.</p>
                        </div>
                        <div className="border-l-4 border-primary pl-4">
                            <h4 className="font-bold">Is it cheating?</h4>
                            <p>No! Using AI to generate study materials is a smart study strategy. It's like having a study buddy who quizzes you.</p>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-muted rounded-lg text-center">
                        <p className="text-lg font-medium">Ready to test your knowledge?</p>
                        <p className="text-muted-foreground">Scroll up and upload your first document now.</p>
                    </div>
                </div>
            </div>
        </ToolTemplate>
    );
};

export default PDFQuizGenerator;
