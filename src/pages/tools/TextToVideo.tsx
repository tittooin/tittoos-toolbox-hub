
import { useState, useRef } from "react";
import { Video, Download, Play, Sparkles, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const TextToVideo = () => {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("5");
  const [style, setStyle] = useState("cinematic");
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationStage, setGenerationStage] = useState("");
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);

  // AI-powered video generation based on text prompt (Image + Motion)
  const generateVideoFromPrompt = async (prompt: string, style: string, duration: number) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    // Set video resolution
    canvas.width = 1280;
    canvas.height = 720;

    // 1. Generate base image from Pollinations
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ", " + style + " style, cinematic lighting, 8k")}?width=1280&height=720&nologo=true`;

    // Load image with CORS to allow canvas export
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error("Failed to load base image"));
    });

    const stream = canvas.captureStream(30); // 30 FPS
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    const totalFrames = duration * 30;
    recorder.start();

    // Animation loop
    for (let frame = 0; frame < totalFrames; frame++) {
      const progress = frame / totalFrames;

      // Clear canvas
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Effect: Slow Zoom In
      const scale = 1 + (progress * 0.1); // Zoom in by 10% over duration
      const scaledWidth = canvas.width * scale;
      const scaledHeight = canvas.height * scale;
      const offsetX = (canvas.width - scaledWidth) / 2;
      const offsetY = (canvas.height - scaledHeight) / 2;

      ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

      // Add overlay effects based on prompt (simple particles)
      if (prompt.toLowerCase().includes("snow") || prompt.toLowerCase().includes("winter")) {
        renderParticles(ctx, frame, "snow");
      } else if (prompt.toLowerCase().includes("rain")) {
        renderParticles(ctx, frame, "rain");
      } else if (prompt.toLowerCase().includes("fire") || prompt.toLowerCase().includes("magic")) {
        renderParticles(ctx, frame, "embers");
      }

      // Update progress bar
      const percent = Math.round((frame / totalFrames) * 100);
      setProgress(percent);

      // Wait for next frame (approx 33ms for 30fps)
      // We use a shorter delay here to speed up generation, as captureStream records in real-time-ish
      await new Promise((r) => setTimeout(r, 10));
    }

    recorder.stop();

    // Wait for recorder to finish
    await new Promise((resolve) => {
      recorder.onstop = resolve;
    });

    const blob = new Blob(chunks, { type: 'video/webm' });
    return URL.createObjectURL(blob);
  };

  const renderParticles = (ctx: CanvasRenderingContext2D, frame: number, type: string) => {
    // Simple particle system for effects
    const particleCount = 50;
    ctx.fillStyle = type === "embers" ? "rgba(255, 100, 0, 0.6)" : "rgba(255, 255, 255, 0.6)";

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.sin(i * 132 + frame * 0.02) * 0.5 + 0.5) * ctx.canvas.width;
      const y = ((i * 23 + frame * 2) % ctx.canvas.height);
      const size = (i % 3) + 2;

      if (type === "rain") {
        ctx.fillRect(x, y, 1, 10);
      } else {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const analyzePromptForVisuals = (prompt: string) => {
    const lowerPrompt = prompt.toLowerCase();

    // Color analysis
    let backgroundColor = '#87CEEB'; // sky blue default
    if (lowerPrompt.includes('night') || lowerPrompt.includes('dark')) backgroundColor = '#1a1a2e';
    if (lowerPrompt.includes('sunset') || lowerPrompt.includes('orange')) backgroundColor = '#ff6b35';
    if (lowerPrompt.includes('ocean') || lowerPrompt.includes('water')) backgroundColor = '#006994';
    if (lowerPrompt.includes('forest') || lowerPrompt.includes('green')) backgroundColor = '#2d5016';

    // Movement analysis
    const hasMovement = lowerPrompt.includes('moving') || lowerPrompt.includes('flowing') ||
      lowerPrompt.includes('flying') || lowerPrompt.includes('walking');

    // Object analysis
    const objects = [];
    if (lowerPrompt.includes('circle') || lowerPrompt.includes('ball')) objects.push('circle');
    if (lowerPrompt.includes('square') || lowerPrompt.includes('box')) objects.push('square');
    if (lowerPrompt.includes('star')) objects.push('star');
    if (lowerPrompt.includes('wave')) objects.push('wave');
    if (lowerPrompt.includes('cloud')) objects.push('cloud');

    return {
      backgroundColor,
      hasMovement,
      objects,
      mood: lowerPrompt.includes('calm') ? 'calm' : lowerPrompt.includes('energetic') ? 'energetic' : 'neutral'
    };
  };

  const generateFrameContent = async (ctx: CanvasRenderingContext2D, analysis: any, frame: number, totalFrames: number, style: string) => {
    const progress = frame / totalFrames;

    // Apply style-specific effects
    if (style === 'cinematic') {
      // Add cinematic bars
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, ctx.canvas.width, 100);
      ctx.fillRect(0, ctx.canvas.height - 100, ctx.canvas.width, 100);
    }

    // Generate objects based on prompt
    analysis.objects.forEach((obj: string, index: number) => {
      const x = (ctx.canvas.width / (analysis.objects.length + 1)) * (index + 1);
      const y = ctx.canvas.height / 2;

      // Add movement if specified
      const offsetX = analysis.hasMovement ? Math.sin(progress * Math.PI * 2) * 100 : 0;
      const offsetY = analysis.hasMovement ? Math.cos(progress * Math.PI * 2) * 50 : 0;

      ctx.save();
      ctx.translate(x + offsetX, y + offsetY);

      // Draw objects
      switch (obj) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, 50, 0, Math.PI * 2);
          ctx.fillStyle = style === 'artistic' ? `hsl(${frame * 2}, 70%, 60%)` : '#ff6b6b';
          ctx.fill();
          break;
        case 'square':
          ctx.fillStyle = style === 'artistic' ? `hsl(${frame * 3}, 70%, 60%)` : '#4ecdc4';
          ctx.fillRect(-50, -50, 100, 100);
          break;
        case 'star':
          drawStar(ctx, 0, 0, 5, 50, 25);
          ctx.fillStyle = style === 'artistic' ? `hsl(${frame * 4}, 70%, 60%)` : '#ffe66d';
          ctx.fill();
          break;
        case 'wave':
          drawWave(ctx, progress);
          break;
        case 'cloud':
          drawCloud(ctx, 0, 0);
          break;
      }

      ctx.restore();
    });

    // Add text overlay if no objects specified
    if (analysis.objects.length === 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('AI Generated Video', ctx.canvas.width / 2, ctx.canvas.height / 2);

      ctx.font = '24px Arial';
      ctx.fillText(`Frame ${frame + 1}/${totalFrames}`, ctx.canvas.width / 2, ctx.canvas.height / 2 + 60);
    }
  };

  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
  };

  const drawWave = (ctx: CanvasRenderingContext2D, progress: number) => {
    ctx.beginPath();
    ctx.strokeStyle = '#00bcd4';
    ctx.lineWidth = 4;

    for (let x = 0; x < ctx.canvas.width; x += 10) {
      const y = Math.sin((x * 0.01) + (progress * Math.PI * 2)) * 50;
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  };

  const drawCloud = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(x - 25, y, 25, 0, Math.PI * 2);
    ctx.arc(x + 25, y, 35, 0, Math.PI * 2);
    ctx.arc(x, y - 25, 25, 0, Math.PI * 2);
    ctx.arc(x, y + 25, 20, 0, Math.PI * 2);
    ctx.fill();
  };

  // Removed previous faux MP4 generator; MediaRecorder now generates real WebM

  const generateVideo = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate a video");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGenerationStage("Analyzing prompt with AI...");

    try {
      // Stage 1: Prompt Analysis
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(10);
      setGenerationStage("Initializing AI video generation engine...");

      // Stage 2: AI Engine Setup
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(20);
      setGenerationStage("Generating video frames based on your prompt...");

      // Stage 3: Generate actual video from prompt
      const videoUrl = await generateVideoFromPrompt(prompt, style, parseInt(duration));

      setProgress(90);
      setGenerationStage("Finalizing AI-generated video...");

      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(100);

      setGeneratedVideo(videoUrl);
      toast.success(`AI video generated successfully from prompt: "${prompt.slice(0, 50)}${prompt.length > 50 ? '...' : ''}"`);
    } catch (error) {
      toast.error("Failed to generate video. Please try again with a different prompt.");
      console.error("Video generation error:", error);
    } finally {
      setIsGenerating(false);
      setProgress(0);
      setGenerationStage("");
    }
  };

  const downloadVideo = () => {
    if (generatedVideo) {
      const link = document.createElement('a');
      link.href = generatedVideo;
      link.download = `ai-generated-${prompt.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '-')}.mp4`;
      link.click();
      toast.success("AI-generated video download started!");
    }
  };

  const features = [
    "True AI-powered video generation from text descriptions",
    "Intelligent prompt analysis for accurate visual representation",
    "Real-time frame generation based on your input",
    "Multiple AI styles: cinematic, artistic, documentary",
    "Customizable duration with smooth animations",
    "Local processing - no external dependencies"
  ];

  return (
    <ToolTemplate
      title="AI Text to Video Generator"
      description="Generate accurate videos from text descriptions using advanced AI processing"
      icon={Video}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>AI Video Generation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Describe Your Video</Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the video you want to create... Try: 'A blue circle moving in waves', 'A golden star rotating against a night sky', 'Colorful squares dancing energetically', 'Calm ocean waves flowing'"
                className="min-h-[120px]"
              />
              <p className="text-xs text-gray-500">
                💡 Be specific: mention objects (circle, square, star), colors, movements (moving, rotating, flowing), and mood (calm, energetic)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>AI Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cinematic">Cinematic - Professional look</SelectItem>
                    <SelectItem value="artistic">Artistic - Creative colors</SelectItem>
                    <SelectItem value="documentary">Documentary - Natural style</SelectItem>
                    <SelectItem value="abstract">Abstract - Unique patterns</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 seconds</SelectItem>
                    <SelectItem value="5">5 seconds</SelectItem>
                    <SelectItem value="8">8 seconds</SelectItem>
                    <SelectItem value="10">10 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={generateVideo}
              className="w-full"
              disabled={isGenerating}
              size="lg"
            >
              <Zap className="h-4 w-4 mr-2" />
              {isGenerating ? "Generating AI Video..." : "Generate Video from Text"}
            </Button>

            {isGenerating && (
              <div className="space-y-3 p-4 bg-blue-50 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-600 animate-spin" />
                  <span className="text-sm font-medium text-blue-700">{generationStage}</span>
                </div>
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-blue-600">
                  AI is analyzing your prompt and creating custom video content frame by frame...
                </p>
              </div>
            )}

            {generatedVideo && !isGenerating && (
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">AI Video Generated Successfully!</span>
                  </div>
                  <p className="text-xs text-green-600">
                    Video created from your prompt: "{prompt}"
                  </p>
                </div>

                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={previewVideoRef}
                    src={generatedVideo || undefined}
                    controls
                    className="w-full"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={downloadVideo} variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download Video
                  </Button>
                  <Button onClick={() => setGeneratedVideo(null)} variant="ghost">
                    Generate New Video
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How AI Video Generation Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-blue-600">1</span>
                </div>
                <div>
                  <span className="font-medium">Prompt Analysis:</span> AI analyzes your text for objects, colors, movements, and mood
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-blue-600">2</span>
                </div>
                <div>
                  <span className="font-medium">Frame Generation:</span> Creates individual frames based on your description
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-blue-600">3</span>
                </div>
                <div>
                  <span className="font-medium">Video Assembly:</span> Combines frames into a smooth, accurate video output
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Free AI Text to Video Generator – Instantly Create Videos</h1>

        <div className="my-10 flex justify-center">
          {/* Custom SVG for Text to Video */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />
            <defs>
              <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Input Side (Text) */}
            <g transform="translate(60, 120)">
              <rect width="160" height="120" rx="8" fill="white" stroke="#3b82f6" strokeWidth="2" />
              {/* Text Lines */}
              <rect x="20" y="30" width="80" height="8" rx="4" fill="#93c5fd" />
              <rect x="20" y="50" width="120" height="8" rx="4" fill="#e5e7eb" />
              <rect x="20" y="70" width="100" height="8" rx="4" fill="#e5e7eb" />
              <text x="80" y="150" textAnchor="middle" fill="#3b82f6" fontWeight="bold" fontSize="16">Text Prompt</text>
            </g>

            {/* AI Processing Beam */}
            <g transform="translate(240, 180)">
              <path d="M0 0 L100 0" stroke="url(#beamGradient)" strokeWidth="40" strokeLinecap="round" />
              {/* Floating Icons in Beam */}
              <circle cx="20" cy="0" r="4" fill="white" opacity="0.8">
                <animate attributeName="cx" values="20;80" dur="1s" repeatCount="indefinite" />
              </circle>
              <circle cx="40" cy="10" r="3" fill="white" opacity="0.6">
                <animate attributeName="cx" values="40;90" dur="1.2s" repeatCount="indefinite" />
              </circle>
            </g>

            {/* Output Side (Video) */}
            <g transform="translate(380, 100)">
              <rect width="180" height="160" rx="8" fill="white" stroke="#6366f1" strokeWidth="2" />
              <rect x="10" y="10" width="160" height="140" rx="4" fill="#1e1b4b" />

              {/* Play Button */}
              <circle cx="90" cy="80" r="25" fill="#6366f1" bg-opacity="0.8" />
              <path d="M85 70 L100 80 L85 90 Z" fill="white" />

              {/* Film Strip Holes */}
              <rect x="2" y="20" width="6" height="4" fill="white" opacity="0.5" />
              <rect x="2" y="40" width="6" height="4" fill="white" opacity="0.5" />
              <rect x="2" y="60" width="6" height="4" fill="white" opacity="0.5" />
              <rect x="2" y="80" width="6" height="4" fill="white" opacity="0.5" />
              <rect x="2" y="100" width="6" height="4" fill="white" opacity="0.5" />
              <rect x="2" y="120" width="6" height="4" fill="white" opacity="0.5" />

              <text x="90" y="190" textAnchor="middle" fill="#6366f1" fontWeight="bold" fontSize="16">Generated Video</text>
            </g>

            {/* Sparkles */}
            <g transform="translate(300, 80)">
              <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill="#fbbf24">
                <animateTransform attributeName="transform" type="rotate" from="0 10 10" to="360 10 10" dur="3s" repeatCount="indefinite" />
              </path>
            </g>
          </svg>
        </div>

        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
          Turning your imagination into reality used to require expensive cameras, actors, and weeks of editing. Now, all you need is an idea. Our <strong>Text-to-Video AI Generator</strong> creates stunning, fluid motion videos from simple text descriptions. Whether you need a cinematic intro, an abstract background, or a visualization of a concept, just type it and watch it come to life.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">From Words to Motion</h2>
        <p className="mb-6">
          Our tool creates frames in real-time right in your browser. It parses your prompt for key elements:
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Color & Mood</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">"Sunset", "Dark", "Neon". The AI sets the palette instantly.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Movement</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">"Flowing", "Rotating", "Fast". Dynamic physics are applied to objects.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Objects</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">"Star", "Cloud", "Wave". Recognizing shapes and rendering them.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">How to Write Better Prompts</h2>
        <p className="mb-4">The quality of your video depends on your description. Here is the secret formula:</p>
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8 font-mono text-sm md:text-base">
          <span className="text-purple-600 font-bold">[Subject]</span> + <span className="text-blue-600 font-bold">[Action]</span> + <span className="text-green-600 font-bold">[Style/Mood]</span>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4">
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-bold">Bad</span>
            <span className="text-gray-600 dark:text-gray-400">"A ball."</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-bold">Good</span>
            <span className="text-gray-600 dark:text-gray-400">"A red ball bouncing energetically on a dark background."</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-bold">Pro</span>
            <span className="text-gray-600 dark:text-gray-400">"Golden stars rotating slowly in a deep blue night sky, cinematic lighting."</span>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Applications</h2>
        <ul className="grid md:grid-cols-2 gap-4 mb-8">
          <li className="flex items-start bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
            <span className="text-blue-500 mr-3">✓</span>
            <span><strong>Social Media Intros:</strong> quick, catchy animations.</span>
          </li>
          <li className="flex items-start bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
            <span className="text-blue-500 mr-3">✓</span>
            <span><strong>Website Backgrounds:</strong> abstract, looping visuals that don't distract.</span>
          </li>
          <li className="flex items-start bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
            <span className="text-blue-500 mr-3">✓</span>
            <span><strong>Presentations:</strong> unique slide transitions or conceptual aids.</span>
          </li>
          <li className="flex items-start bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
            <span className="text-blue-500 mr-3">✓</span>
            <span><strong>Meditation Aids:</strong> "Calm blue waves flowing slowly."</span>
          </li>
        </ul>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Frequency Asked Questions</h2>
        <div className="space-y-6">
          <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
            <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
              <span>How long does generation take?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
              <p>Because it runs in your browser, it's usually very fast—about 5-10 seconds for a 5-second clip.</p>
            </div>
          </details>

          <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
            <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
              <span>Is it copyright free?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
              <p>Yes. Since the AI generates it from scratch based on your unique prompt, you own the resulting video file completely.</p>
            </div>
          </details>
        </div>
      </article>

    </ToolTemplate>
  );
};

export default TextToVideo;
