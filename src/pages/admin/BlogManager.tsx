
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BlogGenerator, BlogPostGenerated } from "@/utils/aiGenerator";
import { GitHubClient } from "@/utils/githubClient";
import { toast } from "sonner";
import { Loader2, CheckCircle, AlertTriangle, Save, Play, Download, Rocket, Github, Trash2, RefreshCw } from "lucide-react";
import generatedBlogsFile from '@/data/generated_blogs.json';

// Type for the schedule
interface ScheduledPost {
    id: string;
    topic: string;
    publishDate: string;
    status: 'pending' | 'generating' | 'completed' | 'failed';
    generatedPost?: BlogPostGenerated;
}

const BlogManager = () => {
    const [apiKey, setApiKey] = useState('');
    const [githubToken, setGithubToken] = useState('');
    const [topicsInput, setTopicsInput] = useState('');
    const [schedule, setSchedule] = useState<ScheduledPost[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);
    const [currentProgress, setCurrentProgress] = useState('');

    // Blog Management State
    const [localBlogs, setLocalBlogs] = useState<any[]>([]); // Using any for flexibility with json import
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Load data on mount
    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) setApiKey(savedKey);

        const savedToken = localStorage.getItem('github_token');
        if (savedToken) setGithubToken(savedToken);

        const savedSchedule = localStorage.getItem('blog_schedule');
        if (savedSchedule) setSchedule(JSON.parse(savedSchedule));

        // Load generated blogs (Local Storage > File)
        const storedBlogs = localStorage.getItem('generated_blogs');
        if (storedBlogs) {
            setLocalBlogs(JSON.parse(storedBlogs));
        } else {
            // Initial seed from file if local storage is empty
            setLocalBlogs(generatedBlogsFile);
            localStorage.setItem('generated_blogs', JSON.stringify(generatedBlogsFile));
        }
    }, []);

    // Blog Management Handlers
    const toggleSelectBlog = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === localBlogs.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(localBlogs.map(b => b.id));
        }
    };

    const handleDeleteSelected = () => {
        const remaining = localBlogs.filter(b => !selectedIds.includes(b.id));
        setLocalBlogs(remaining);
        localStorage.setItem('generated_blogs', JSON.stringify(remaining));
        setSelectedIds([]);
        toast.success(`Deleted ${selectedIds.length} blogs locally. Don't forget to Auto-Deploy!`);
    };

    const handleResetToDefault = () => {
        if (confirm("This will discard local changes and reload from the generated_blogs.json file. Continue?")) {
            setLocalBlogs(generatedBlogsFile);
            localStorage.setItem('generated_blogs', JSON.stringify(generatedBlogsFile));
            toast.success("Reset to file version.");
        }
    };

    // Save API Keys
    const handleSaveKey = () => {
        localStorage.setItem('gemini_api_key', apiKey);
        toast.success("Gemini API Key saved!");
    };

    const handleSaveGithubToken = () => {
        localStorage.setItem('github_token', githubToken);
        toast.success("GitHub Token saved securely!");
    };

    // Parse topics and create schedule
    const handleSchedule = () => {
        const topics = topicsInput.split('\n').filter(t => t.trim());

        // Determine start date (Last scheduled date + 1 day, or Today)
        let startDate = new Date();
        if (schedule.length > 0) {
            const lastPost = schedule[schedule.length - 1];
            // Safe parsing of the date string
            const lastDate = new Date(lastPost.publishDate);
            if (!isNaN(lastDate.getTime())) {
                startDate = new Date(lastDate);
                startDate.setDate(startDate.getDate() + 1); // Start from next day
            }
        }

        const newSchedule: ScheduledPost[] = topics.map((topic, index) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + index); // Increment from determined start date

            return {
                id: Math.random().toString(36).substr(2, 9),
                topic: topic.trim(),
                publishDate: date.toISOString().split('T')[0],
                status: 'pending'
            };
        });

        setSchedule(prev => [...prev, ...newSchedule]);
        setTopicsInput('');
        toast.success(`Scheduled ${newSchedule.length} posts! Starting from ${startDate.toISOString().split('T')[0]}`);
        localStorage.setItem('blog_schedule', JSON.stringify([...schedule, ...newSchedule]));
    };

    // The Magic Button
    const handleGenerateAll = async () => {
        if (!apiKey) {
            toast.info("No Gemini Key found. Switching to Free Unlimited Mode (Pollinations.ai).");
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

    const handleDownloadForDeployment = () => {
        const blogs = localStorage.getItem('generated_blogs');
        if (!blogs) {
            toast.error("No generated blogs found to download.");
            return;
        }

        const blob = new Blob([blogs], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated_blogs.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Downloaded! Move this file to src/data/generated_blogs.json");
    };

    const handleAutoDeploy = async () => {
        if (!githubToken) {
            toast.error("Please enter your GitHub Token first.");
            return;
        }

        const blogs = localStorage.getItem('generated_blogs');
        if (!blogs) {
            toast.error("No generated blogs to deploy.");
            return;
        }

        try {
            setIsDeploying(true);
            const client = new GitHubClient(githubToken);
            const path = 'src/data/generated_blogs.json';

            // 1. Get current SHA
            const currentFile = await client.getFile(path);
            const sha = currentFile ? currentFile.sha : undefined;

            // 2. Update File
            await client.updateFile(path, blogs, "feat: auto-deploy new blogs from admin panel", sha);

            toast.success("Successfully deployed to GitHub! Live site will update in a few minutes.");
        } catch (error) {
            console.error(error);
            toast.error("Deployment failed. Check console and token.");
        } finally {
            setIsDeploying(false);
        }
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

            {/* Maintenance Instructions */}
            <Card className="bg-muted/50 border-dashed">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        Bot Maintenance Instructions
                    </CardTitle>
                    <CardDescription>Run these commands in your terminal to keep data fresh.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-black/90 p-3 rounded-md font-mono text-sm text-green-400">
                        <div className="flex justify-between items-center mb-2">
                            <span>1. Fetch Hot Topics</span>
                            <span className="text-gray-500 text-xs text-right">Run daily for fresh trends</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-800 p-2 rounded">
                            <span className="flex-1">npm run fetch-trends</span>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => { navigator.clipboard.writeText('npm run fetch-trends'); toast.success('Command copied!'); }}>
                                <Download className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                    <div className="bg-black/90 p-3 rounded-md font-mono text-sm text-green-400">
                        <div className="flex justify-between items-center mb-2">
                            <span>2. Check Content Quality</span>
                            <span className="text-gray-500 text-xs text-right">Run after generating blogs</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-800 p-2 rounded">
                            <span className="flex-1">npm run check-plagiarism</span>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => { navigator.clipboard.writeText('npm run check-plagiarism'); toast.success('Command copied!'); }}>
                                <Download className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Configuration Section */}
            <Card>
                <CardHeader>
                    <CardTitle>1. Configuration</CardTitle>
                    <CardDescription>Setup your API keys for AI generation and Auto-Deployment.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-1 block">Gemini API Key (Optional - Leave empty for Free Mode)</label>
                            <div className="flex gap-2">
                                <Input
                                    type="password"
                                    placeholder="Ex: AIzaSy..."
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                />
                                <Button onClick={handleSaveKey} size="icon"><Save className="w-4 h-4" /></Button>
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-1 block">GitHub Token (for Auto-Deploy)</label>
                            <div className="flex gap-2">
                                <Input
                                    type="password"
                                    placeholder="Ex: ghp_..."
                                    value={githubToken}
                                    onChange={(e) => setGithubToken(e.target.value)}
                                />
                                <Button onClick={handleSaveGithubToken} size="icon"><Save className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Input Section */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>2. Schedule Content</CardTitle>
                            <CardDescription>Paste titles or import trending topics.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => {
                            import('@/data/trending_topics.json').then(mod => {
                                const topics = mod.default.map((t: any) => `${t.query} (Traffic: ${t.traffic})`).join('\n');
                                setTopicsInput(prev => prev ? prev + '\n' + topics : topics);
                                toast.success(`Imported ${mod.default.length} trending topics!`);
                            }).catch(() => toast.error("No trending topics found. Run 'npm run fetch-trends' first."));
                        }}>
                            <Rocket className="h-4 w-4 mr-2" />
                            Import Trends
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder="How to make money online 2025&#10;The ultimate guide to Keto diet&#10;Best coding languages to learn"
                        rows={10}
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

            {/* Manage Existing Blogs Section */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>4. Manage Generated Blogs ({localBlogs.length})</CardTitle>
                            <CardDescription>Select and delete blogs before deploying.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleResetToDefault}>
                                <RefreshCw className="h-4 w-4 mr-2" /> Reset
                            </Button>
                            {selectedIds.length > 0 && (
                                <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete ({selectedIds.length})
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md max-h-96 overflow-y-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted sticky top-0">
                                <tr>
                                    <th className="p-3 w-10">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300"
                                            checked={localBlogs.length > 0 && selectedIds.length === localBlogs.length}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="p-3">Title</th>
                                    <th className="p-3 w-32">Date</th>
                                    <th className="p-3 w-20">ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {localBlogs.length === 0 ? (
                                    <tr><td colSpan={4} className="p-4 text-center text-muted-foreground">No generated blogs found.</td></tr>
                                ) : (
                                    localBlogs.slice().reverse().map((blog) => (
                                        <tr key={blog.id} className="border-t hover:bg-muted/50">
                                            <td className="p-3">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300"
                                                    checked={selectedIds.includes(blog.id)}
                                                    onChange={() => toggleSelectBlog(blog.id)}
                                                />
                                            </td>
                                            <td className="p-3 font-medium truncate max-w-md" title={blog.title}>
                                                {blog.title}
                                            </td>
                                            <td className="p-3 text-muted-foreground">{blog.date}</td>
                                            <td className="p-3 font-mono text-xs text-muted-foreground">{blog.id}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Deployment Section */}
            <Card className="border-purple-500 bg-purple-50/10">
                <CardHeader>
                    <CardTitle className="flex items-center"><Rocket className="w-5 h-5 mr-2" /> 5. Auto-Deploy</CardTitle>
                    <CardDescription>
                        Push your new blogs directly to GitHub. The live site will rebuild automatically.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        size="lg"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={handleAutoDeploy}
                        disabled={isDeploying || !githubToken}
                    >
                        {isDeploying ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Github className="w-5 h-5 mr-2" />}
                        {isDeploying ? 'Deploying to GitHub...' : 'Auto-Deploy to Live Site'}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or Manual fallback</span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full" onClick={handleDownloadForDeployment}>
                        <Download className="w-4 h-4 mr-2" />
                        Download JSON (Manual Upload)
                    </Button>
                </CardContent>
            </Card>
        </div >
    );
};

export default BlogManager;
