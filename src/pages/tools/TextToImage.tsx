
import { useState } from "react";
import { Image, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const TextToImage = () => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [size, setSize] = useState("1024x1024");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate an image");
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate AI image generation with a placeholder
      await new Promise(resolve => setTimeout(resolve, 3000));

      // For demo purposes, we'll use a placeholder image service
      const width = size.split('x')[0];
      const height = size.split('x')[1];
      const placeholderUrl = `https://picsum.photos/${width}/${height}?random=${Date.now()}`;

      setGeneratedImage(placeholderUrl);
      toast.success("Image generated successfully!");
    } catch (error) {
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'ai-generated-image.jpg';
      link.click();
      toast.success("Image downloaded!");
    }
  };

  const features = [
    "Generate images from text descriptions",
    "Multiple art styles and formats",
    "Customizable image dimensions",
    "High-quality AI generation",
    "Instant download capability"
  ];

  return (
    <ToolTemplate
      title="AI Text to Image"
      description="Generate stunning images from text descriptions using AI"
      icon={Image}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate AI Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Image Prompt</Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate... e.g., 'A majestic mountain landscape at sunset with purple clouds'"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Art Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realistic">Realistic</SelectItem>
                    <SelectItem value="artistic">Artistic</SelectItem>
                    <SelectItem value="cartoon">Cartoon</SelectItem>
                    <SelectItem value="abstract">Abstract</SelectItem>
                    <SelectItem value="digital-art">Digital Art</SelectItem>
                    <SelectItem value="oil-painting">Oil Painting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Image Size</Label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="512x512">512x512 (Square)</SelectItem>
                    <SelectItem value="1024x1024">1024x1024 (Large Square)</SelectItem>
                    <SelectItem value="1024x576">1024x576 (Landscape)</SelectItem>
                    <SelectItem value="576x1024">576x1024 (Portrait)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={generateImage}
              className="w-full"
              disabled={isGenerating}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isGenerating ? "Generating..." : "Generate Image"}
            </Button>

            {generatedImage && (
              <div className="mt-6 space-y-4">
                <div className="relative">
                  <img
                    src={generatedImage}
                    alt="Generated AI image"
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
                <Button onClick={downloadImage} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Image
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600">Free AI Text to Image Generator – Turn Words into Art</h1>

        <div className="my-10 flex justify-center">
          {/* Custom SVG for Text to Image */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-pink-50 to-rose-50 dark:from-gray-800 dark:to-gray-900 border border-pink-100 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />
            <defs>
              <linearGradient id="artGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fce7f3" />
                <stop offset="100%" stopColor="#fbcfe8" />
              </linearGradient>
            </defs>

            {/* Input Text Input */}
            <g transform="translate(100, 150)">
              <rect width="160" height="100" rx="4" fill="white" stroke="#db2777" strokeWidth="2" />
              <rect x="20" y="30" width="120" height="6" rx="2" fill="#fbcfe8" />
              <rect x="20" y="50" width="100" height="6" rx="2" fill="#fbcfe8" />
              <rect x="20" y="70" width="80" height="6" rx="2" fill="#fbcfe8" />
              <text x="100" y="115" textAnchor="middle" fill="#be185d" fontWeight="bold" fontSize="14">PROMPT</text>
            </g>

            {/* Processing/Magic */}
            <g transform="translate(260, 180)">
              <path d="M10 20 C20 0, 60 40, 70 20" stroke="#db2777" strokeWidth="3" fill="none" strokeDasharray="4,4">
                <animate attributeName="stroke-dashoffset" values="8;0" dur="1s" repeatCount="indefinite" />
              </path>
              <circle cx="40" cy="20" r="5" fill="#f472b6">
                <animate attributeName="r" values="5;8;5" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <path d="M30 40 L40 50 L50 40" stroke="#db2777" strokeWidth="2" fill="none" />
            </g>

            {/* Output Image (Landscape) */}
            <g transform="translate(340, 100)">
              <rect width="180" height="180" rx="4" fill="white" stroke="#db2777" strokeWidth="2" />
              <rect x="10" y="10" width="160" height="160" fill="url(#artGradient)" />
              {/* Mountains */}
              <path d="M10 170 L50 100 L90 170" fill="#f472b6" />
              <path d="M60 170 L110 80 L160 170" fill="#ec4899" />
              {/* Sun */}
              <circle cx="130" cy="50" r="20" fill="#fcd34d" />
              <text x="100" y="200" textAnchor="middle" fill="#be185d" fontWeight="bold" fontSize="16">AI ART</text>

              {/* Magic Stars */}
              <path d="M160 20 L165 10 L170 20 M165 10 V30" stroke="#fbbf24" strokeWidth="2">
                <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
              </path>
            </g>
          </svg>
        </div>

        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
          Have you ever imagined a picture but couldn't find it on stock photo sites? Maybe "a cyberpunk cat eating ramen in Tokyo" or "an oil painting of a futuristic mars colony"? With our <strong>Free AI Text to Image Generator</strong>, you don't need to search for it—you can create it. Just type a description, and our advanced AI brings your imagination to life in seconds.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
          <span className="bg-pink-100 text-pink-800 p-2 rounded-md mr-4 text-2xl">🎨</span>
          How AI Generation Works
        </h2>
        <p className="mb-6">
          This tool relies on <strong>Diffusion Models</strong>. Think of it like a reverse process of dissolving an image into noise.
        </p>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm mb-8">
          <h3 className="font-bold text-lg mb-2 text-pink-600">The "Latent Space" Concept</h3>
          <p className="text-gray-600 dark:text-gray-400">The AI has studied billions of images and their captions. It understands concepts like "cat," "sunset," "impressionist style," and how they relate visually. When you give it a prompt, it starts with a canvas of random static (noise) and gradually refines it, step by step, until it matches your description.</p>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Step-by-Step Guide: Writing the Perfect Prompt</h2>
        <p className="mb-6">The quality of your image depends on your prompt. Here is the formula for a masterpiece:</p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-rose-50 dark:bg-rose-900/20 p-6 rounded-xl border border-rose-100 dark:border-rose-800">
            <h3 className="font-bold text-lg mb-2 text-rose-800 dark:text-rose-300">1. Subject</h3>
            <p className="text-sm text-rose-700 dark:text-rose-400">What is the main focus? <br /><em>Example: "A majestic lion..."</em></p>
          </div>
          <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-xl border border-pink-100 dark:border-pink-800">
            <h3 className="font-bold text-lg mb-2 text-pink-800 dark:text-pink-300">2. Action/Context</h3>
            <p className="text-sm text-pink-700 dark:text-pink-400">What is happening? Where is it? <br /><em>Example: "...standing on a cliff at sunset..."</em></p>
          </div>
          <div className="bg-fuchsia-50 dark:bg-fuchsia-900/20 p-6 rounded-xl border border-fuchsia-100 dark:border-fuchsia-800">
            <h3 className="font-bold text-lg mb-2 text-fuchsia-800 dark:text-fuchsia-300">3. Art Style</h3>
            <p className="text-sm text-fuchsia-700 dark:text-fuchsia-400">How should it look? <br /><em>Example: "...in the style of Van Gogh, oil painting, thick brushstrokes."</em></p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-100 dark:border-purple-800">
            <h3 className="font-bold text-lg mb-2 text-purple-800 dark:text-purple-300">4. Lighting/Mood</h3>
            <p className="text-sm text-purple-700 dark:text-purple-400">Set the atmosphere. <br /><em>Example: "...cinematic lighting, dramatic shadows, 4k resolution."</em></p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Unlock Your Creativity</h2>
        <ul className="space-y-4 text-gray-700 dark:text-gray-300 mb-8">
          <li className="flex items-start">
            <span className="bg-green-100 text-green-600 rounded-full p-1 mr-3 mt-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </span>
            <span><strong>Marketing Visuals:</strong> Create unique banners for your blog posts or ads without worrying about copyright.</span>
          </li>
          <li className="flex items-start">
            <span className="bg-green-100 text-green-600 rounded-full p-1 mr-3 mt-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </span>
            <span><strong>Concept Art:</strong> Visualize characters for your book, game, or D&D campaign in seconds.</span>
          </li>
          <li className="flex items-start">
            <span className="bg-green-100 text-green-600 rounded-full p-1 mr-3 mt-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </span>
            <span><strong>Social Media Content:</strong> Stand out on Instagram with AI-generated abstract art or surreal landscapes.</span>
          </li>
        </ul>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Common Questions</h2>
        <div className="space-y-6">
          <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
            <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
              <span>Do I own the images I generate?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
              <p>Yes, images generated by our public AI tools are typically free to use for personal and commercial projects. However, AI copyright laws are evolving, so always stay updated on the latest regulations.</p>
            </div>
          </details>

          <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
            <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
              <span>Why do faces sometimes look weird?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
              <p>Generating realistic human faces (especially eyes and hands) is the hardest challenge for AI. If the result isn't perfect, try adding "detailed face" or "symmetrical eyes" to your prompt, or regenerate the image.</p>
            </div>
          </details>

          <details className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group">
            <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-lg">
              <span>Can I refine the image later?</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div className="text-gray-600 dark:text-gray-400 mt-4 group-open:animate-fadeIn leading-relaxed">
              <p>Absolutely. Once you download your image, you can use our <a href="/tools/image-converter" className="text-pink-600 font-medium hover:underline">Image Converter</a> to change formats or use <a href="/tools/image-background-remover" className="text-pink-600 font-medium hover:underline">Background Remover</a> to isolate the subject.</p>
            </div>
          </details>
        </div>

        <div className="mt-16 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-8 rounded-2xl text-center border border-pink-100 dark:border-pink-800/30">
          <h3 className="text-2xl font-bold mb-4 text-pink-900 dark:text-pink-100">Ready to Create?</h3>
          <p className="mb-6 text-pink-800 dark:text-pink-200">The only limit is your imagination.</p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            Start Generating
          </button>
        </div>
      </article>
    </ToolTemplate>
  );
};

export default TextToImage;
