
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
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

    const handleSingleDeploy = async (blogToDeploy: any) => {
        if (!githubToken) {
            toast.error("Please enter your GitHub Token first.");
            return;
        }

        const toastId = toast.loading(`Deploying "${blogToDeploy.title}"...`);

        try {
            const client = new GitHubClient(githubToken);
            const path = 'src/data/generated_blogs.json';

            // 1. Get Live Data from GitHub
            // Note: getFile returns base64 encoded content
            const currentFile = await client.getFile(path);
            const sha = currentFile ? currentFile.sha : undefined;

            let content: any[] = [];
            if (currentFile && currentFile.content) {
                try {
                    content = JSON.parse(atob(currentFile.content));
                } catch (e) {
                    console.error("Failed to parse live JSON", e);
                    content = [];
                }
            }

            // 2. Smart Merge
            let updatedContent = Array.isArray(content) ? [...content] : [];
            const index = updatedContent.findIndex((b: any) => b.id === blogToDeploy.id);

            if (index !== -1) {
                // Update existing
                updatedContent[index] = blogToDeploy;
            } else {
                // Append new
                updatedContent.push(blogToDeploy);
            }

            // 3. Push and Update
            const jsonString = JSON.stringify(updatedContent, null, 2);
            await client.updateFile(path, jsonString, `feat: update blog post "${blogToDeploy.title}"`, sha);

            toast.success("Single blog deployed successfully! 🚀", { id: toastId });

        } catch (error) {
            console.error(error);
            toast.error("Failed to deploy single blog. Check console.", { id: toastId });
        }
    };

    // Editor State
    const [editingBlog, setEditingBlog] = useState<any | null>(null);

    const handleEditClick = (blog: any) => {
        setEditingBlog({ ...blog });
    };

    const handleSaveEdit = () => {
        if (!editingBlog) return;

        // Update localBlogs
        const updatedBlogs = localBlogs.map(b => b.id === editingBlog.id ? editingBlog : b);
        setLocalBlogs(updatedBlogs);

        // Update LocalStorage
        localStorage.setItem('generated_blogs', JSON.stringify(updatedBlogs));

        setEditingBlog(null);
        toast.success("Blog updated locally! Don't forget to Deploy.");
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
                                    <th className="p-3 w-20">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {localBlogs.length === 0 ? (
                                    <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">No generated blogs found.</td></tr>
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
                                            <td className="p-3 flex gap-2">
                                                <Button size="sm" variant="outline" onClick={() => handleEditClick(blog)}>Edit</Button>
                                                <Button size="sm" variant="secondary" onClick={() => handleSingleDeploy(blog)} title="Deploy Only This Post">
                                                    <Rocket className="w-3 h-3 text-purple-600" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Editor Dialog */}
            {editingBlog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <Card className="w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <CardHeader className="flex-none border-b">
                            <div className="flex justify-between items-center">
                                <CardTitle>Edit Blog Post</CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => setEditingBlog(null)}>
                                    <Trash2 className="h-4 w-4 rotate-45" /> {/* Close Icon substitute */}
                                </Button>
                            </div>
                            <CardDescription>
                                Add affiliate links, banners, or refine the content. Changes are saved locally.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">

                            {/* Amazon Product Fetcher */}
                            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg space-y-3">
                                <h3 className="font-semibold text-orange-800 flex items-center">
                                    <Rocket className="w-4 h-4 mr-2" />
                                    Insert Amazon Product (No API)
                                </h3>

                                <div className="grid gap-3">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="1. Paste Amazon Product URL"
                                            id="amazon-link-input"
                                        />
                                        <Button variant="outline" onClick={async () => {
                                            const urlInput = document.getElementById('amazon-link-input') as HTMLInputElement;
                                            const url = urlInput.value;
                                            if (!url) return toast.error("Please enter a URL");

                                            const toastId = toast.loading("Fetching metadata...");

                                            try {
                                                // Try AllOrigins Proxy (returns JSON)
                                                const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
                                                const response = await fetch(proxyUrl);
                                                const data = await response.json();
                                                const html = data.contents;

                                                // Parse HTML
                                                const parser = new DOMParser();
                                                const doc = parser.parseFromString(html, 'text/html');

                                                // Extract Meta Tags
                                                const title = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
                                                    doc.querySelector('#productTitle')?.textContent?.trim() ||
                                                    "";

                                                const cleanTitle = title.replace(/Amazon\.in\s*:/i, '').replace(/Amazon\.com\s*:/i, '').trim();

                                                const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
                                                    doc.querySelector('#landingImage')?.getAttribute('src') ||
                                                    "";

                                                // Populate Inputs
                                                const titleInput = document.getElementById('amazon-title-input') as HTMLInputElement;
                                                const imageInput = document.getElementById('amazon-image-input') as HTMLInputElement;

                                                if (titleInput) titleInput.value = cleanTitle;
                                                if (imageInput) imageInput.value = image;

                                                if (!cleanTitle && !image) {
                                                    toast.warning("Could not auto-fetch. Please enter details manually.", { id: toastId });
                                                } else {
                                                    toast.success("Details fetched into fields below!", { id: toastId });
                                                }

                                            } catch (error) {
                                                console.error(error);
                                                toast.error("Fetch failed. Enter details manually below.", { id: toastId });
                                            }
                                        }}>
                                            Fetch Details
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Input
                                            placeholder="2. Product Title (Edit if needed)"
                                            id="amazon-title-input"
                                        />
                                        <Input
                                            placeholder="3. Image URL (Right click image -> Copy Address)"
                                            id="amazon-image-input"
                                        />
                                    </div>

                                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white" onClick={() => {
                                        const linkInput = document.getElementById('amazon-link-input') as HTMLInputElement;
                                        const titleInput = document.getElementById('amazon-title-input') as HTMLInputElement;
                                        const imageInput = document.getElementById('amazon-image-input') as HTMLInputElement;

                                        const url = linkInput?.value;
                                        const title = titleInput?.value || "Recommended Product";
                                        const image = imageInput?.value || "https://placehold.co/300x300?text=No+Image";

                                        if (!url) return toast.error("URL is required");

                                        // Create Card HTML
                                        const cardHtml = `
                                        <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 25px 0; background: #fff; display: flex; flex-direction: column; align-items: center; text-align: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                                            <img src="${image}" alt="${title}" style="max-height: 200px; max-width: 100%; object-fit: contain; margin-bottom: 15px;" />
                                            <h3 style="font-size: 1.1rem; font-weight: 700; margin: 0 0 10px 0; color: #1f2937; line-height: 1.4;">${title}</h3>
                                            <div style="margin-top: 15px;">
                                                <a href="${url}" target="_blank" rel="noopener noreferrer" style="background-color: #FF9900; color: #111; padding: 10px 25px; border-radius: 20px; text-decoration: none; font-weight: bold; display: inline-block; border: 1px solid #e1e1e1;">
                                                    Check Price on Amazon
                                                </a>
                                            </div>
                                            <small style="color: #6b7280; margin-top: 10px; display: block; font-size: 0.75rem;">As an Amazon Associate, we earn from qualifying purchases.</small>
                                        </div>
                                        <p><br/></p>
                                        `;

                                        // Append to Editor
                                        setEditingBlog(prev => ({
                                            ...prev,
                                            content: prev.content + cardHtml
                                        }));

                                        toast.success("Card Inserted Successfully!");

                                        // Clear inputs
                                        if (linkInput) linkInput.value = "";
                                        if (titleInput) titleInput.value = "";
                                        if (imageInput) imageInput.value = "";

                                    }}>
                                        Insert Generated Card
                                    </Button>
                                </div>

                                <p className="text-xs text-orange-800/70 mt-1">
                                    Tip: This extracts image/title from the link and creates a styled card.
                                </p>
                            </div>

                            <div className="grid gap-4">
                                <div>
                                    <label className="text-sm font-medium">Title</label>
                                    <Input
                                        value={editingBlog.title}
                                        onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Date</label>
                                        <Input
                                            value={editingBlog.date}
                                            onChange={(e) => setEditingBlog({ ...editingBlog, date: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Author</label>
                                        <Input
                                            value={editingBlog.author}
                                            onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Excerpt</label>
                                    <Textarea
                                        value={editingBlog.excerpt}
                                        onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                                        className="mt-1 h-20"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col min-h-[400px]">
                                    <label className="text-sm font-medium mb-1">Content (Rich Text Editor)</label>
                                    <div className="text-xs text-muted-foreground mb-2 p-2 bg-muted rounded border border-l-4 border-l-blue-500">
                                        <strong>Pro Tip:</strong> Use the toolbar to design your blog. For affiliate banners, you can still paste HTML using the "Code View" if valid, or just insert images and links directly.
                                    </div>
                                    <ReactQuill
                                        theme="snow"
                                        value={editingBlog.content}
                                        onChange={(content) => setEditingBlog({ ...editingBlog, content })}
                                        className="h-[400px] mb-12"
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [1, 2, 3, false] }],
                                                ['bold', 'italic', 'underline', 'strike'],
                                                [{ 'color': [] }, { 'background': [] }],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                ['link', 'image', 'video'],
                                                ['clean']
                                            ]
                                        }}
                                    />
                                </div>
                            </div>
                        </CardContent >
                        <div className="p-4 border-t bg-muted/20 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setEditingBlog(null)}>Cancel</Button>
                            <Button onClick={handleSaveEdit} className="w-32">
                                <Save className="w-4 h-4 mr-2" /> Save
                            </Button>
                        </div>
                    </Card >
                </div >
            )}

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
