
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertTriangle, Save, Play } from "lucide-react";
import { BlogGenerator, BlogPostGenerated } from "@/utils/aiGenerator";
import { toast } from "sonner";

// Type for the schedule
interface ScheduledPost {
    id: string;
    topic: string;
    publishDate: string;
    status: 'pending' | 'generating' | 'completed' | 'failed';
    generatedPost?: BlogPostGenerated;
}

const BlogManager = () => {
    const [apiKey, setApiKey] = useState('AIzaSyApnoNTD58tRsN3nICUQCaEYMeV-rh_mGM');
    const [topicsInput, setTopicsInput] = useState('');
    const [schedule, setSchedule] = useState<ScheduledPost[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentProgress, setCurrentProgress] = useState('');

    // Load data on mount
    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) setApiKey(savedKey);

        const savedSchedule = localStorage.getItem('blog_schedule');
        if (savedSchedule) setSchedule(JSON.parse(savedSchedule));
    }, []);

    // Save API Key
    const handleSaveKey = () => {
        localStorage.setItem('gemini_api_key', apiKey);
        toast.success("API Key saved securely!");
    };

    // Parse topics and create schedule
    const handleSchedule = () => {
        const topics = topicsInput.split('\n').filter(t => t.trim());
        const newSchedule: ScheduledPost[] = topics.map((topic, index) => {
            const date = new Date();
            date.setDate(date.getDate() + index); // Schedule starting today
            return {
                id: Math.random().toString(36).substr(2, 9),
                topic: topic.trim(),
                publishDate: date.toISOString().split('T')[0],
                status: 'pending'
            };
        });
        setSchedule(prev => [...prev, ...newSchedule]);
        setTopicsInput('');
        toast.success(`Scheduled ${newSchedule.length} posts!`);
        localStorage.setItem('blog_schedule', JSON.stringify([...schedule, ...newSchedule]));
    };

    // The Magic Button
    const handleGenerateAll = async () => {
        if (!apiKey) {
            toast.error("Please enter your Gemini API Key first.");
            return;
        }

        setIsGenerating(true);
        const generator = new BlogGenerator(apiKey);

        // Process one by one
        const newSchedule = [...schedule];

        for (let i = 0; i < newSchedule.length; i++) {
            const post = newSchedule[i];
            if (post.status === 'completed') continue; // Skip done

            try {
                // Update status to generating
                newSchedule[i].status = 'generating';
                setSchedule([...newSchedule]);

                setCurrentProgress(`Starting generation for: ${post.topic}`);

                // Call the AI
                const generated = await generator.generateFullPost(post.topic, (status) => {
                    setCurrentProgress(`${post.topic}: ${status}`);
                });

                // Save Success
                newSchedule[i].status = 'completed';
                newSchedule[i].generatedPost = {
                    ...generated,
                    date: post.publishDate, // Overwrite with scheduled date
                    id: parseInt(Math.random().toString().replace("0.", "").substring(0, 5)) // Random numeric ID
                };

                // Save to LocalStorage "Database"
                const existingBlogs = JSON.parse(localStorage.getItem('generated_blogs') || '[]');
                localStorage.setItem('generated_blogs', JSON.stringify([...existingBlogs, newSchedule[i].generatedPost]));

                setSchedule([...newSchedule]);
                localStorage.setItem('blog_schedule', JSON.stringify(newSchedule));

                toast.success(`Generated: ${post.topic}`);

            } catch (error) {
                console.error(error);
                newSchedule[i].status = 'failed';
                setSchedule([...newSchedule]);
                toast.error(`Failed to generate: ${post.topic}`);
            }
        }

        setIsGenerating(false);
        setCurrentProgress("All tasks completed.");
    };

    const clearSchedule = () => {
        setSchedule([]);
        localStorage.removeItem('blog_schedule');
    };

    return (
        <div className="container mx-auto py-10 max-w-4xl space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Auto-Blog Manager</h1>
                    <p className="text-muted-foreground">Set it and forget it. AI writes 1500-2000 words/post.</p>
                </div>
                <Button variant="destructive" onClick={clearSchedule} size="sm">Clear Schedule</Button>
            </div>

            {/* API Key Section */}
            <Card>
                <CardHeader>
                    <CardTitle>1. Configuration</CardTitle>
                    <CardDescription>Enter your Gemini API Key (get it from Google AI Studio)</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4">
                    <Input
                        type="password"
                        placeholder="Ex: AIzaSy..."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                    <Button onClick={handleSaveKey}><Save className="w-4 h-4 mr-2" /> Save Key</Button>
                </CardContent>
            </Card>

            {/* Input Section */}
            <Card>
                <CardHeader>
                    <CardTitle>2. Schedule Content</CardTitle>
                    <CardDescription>Paste your titles here (One per line). They will be scheduled daily starting today.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder="How to make money online 2025&#10;The ultimate guide to Keto diet&#10;Best coding languages to learn"
                        rows={5}
                        value={topicsInput}
                        onChange={(e) => setTopicsInput(e.target.value)}
                    />
                    <Button onClick={handleSchedule} className="w-full">Add to Schedule</Button>
                </CardContent>
            </Card>

            {/* Status & Action */}
            <Card>
                <CardHeader>
                    <CardTitle>3. Production Queue</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {isGenerating && (
                        <Alert className="bg-primary/10 border-primary">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <AlertTitle>AI Writer Working...</AlertTitle>
                            <AlertDescription>{currentProgress}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        {schedule.length === 0 && <p className="text-center text-muted-foreground py-8">No tasks scheduled.</p>}
                        {schedule.map((post) => (
                            <div key={post.id} className="flex justify-between items-center p-3 border rounded-lg bg-card">
                                <div>
                                    <p className="font-semibold">{post.topic}</p>
                                    <p className="text-xs text-muted-foreground">Scheduled: {post.publishDate}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {post.status === 'pending' && <span className="px-2 py-1 rounded bg-secondary text-xs">Queued</span>}
                                    {post.status === 'generating' && <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs animate-pulse">Writing...</span>}
                                    {post.status === 'completed' && <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Ready</span>}
                                    {post.status === 'failed' && <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs flex items-center"><AlertTriangle className="w-3 h-3 mr-1" /> Failed</span>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button
                        size="lg"
                        className="w-full text-lg"
                        onClick={handleGenerateAll}
                        disabled={isGenerating || schedule.length === 0}
                    >
                        {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                        {isGenerating ? 'Generating Content (This takes time)...' : 'Start Auto-Generation Sequence'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default BlogManager;
