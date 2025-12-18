import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit3, Type, Code, FileCode, Coffee, Eye, Rocket, HelpCircle, Palette } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { tools } from "@/data/tools";

const EditorsCategoryPage = () => {
  // Filter by 'editor' category
  const categoryTools = tools.filter(tool => tool.category === 'editor');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Online Code & Text Editors - Markdown, HTML, JSON | Axevora</title>
        <meta name="description" content="Write, edit, and preview code and text instantly. Free online editors for Markdown, HTML, JSON, and more. No installation required." />
        <meta name="keywords" content="online editor, markdown editor, code editor, html editor, json editor, text editor, distraction free writing" />
        <meta property="og:title" content="Online Code & Text Editors - Markdown, HTML, JSON | Axevora" />
        <meta property="og:description" content="Write, edit, and preview code and text instantly. Free online editors for Markdown, HTML, JSON, and more." />
      </Helmet>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-16">

          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl border bg-card">
              <img
                src="/assets/blog/editors-tools-guide.png"
                alt="Online Editors Guide"
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Edit3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                The Modern Digital Canvas
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                From distraction-free prose to complex code structures, the right editor amplifies your thought process.
                Experience the power of our browser-based tools—zero setup, 100% focus.
              </p>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryTools.map((tool) => (
              <Link key={tool.id} to={tool.path} className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-500/50">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                        <tool.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-xl">
                      {tool.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {tool.subheading}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {tool.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Start Editing <span className="ml-1">→</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Rich Educational Content */}
          <div className="prose dark:prose-invert max-w-none space-y-16">

            {/* Evolution */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold border-b pb-4">1. The Evolution of Editing</h2>
              <p className="text-lg text-muted-foreground">
                Editing has moved from the desktop to the cloud. You no longer need to install a 500MB IDE just to tweak a JSON file or specific software to write a blog post.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-muted/30 p-6 rounded-xl border">
                  <Type className="w-8 h-8 text-indigo-500 mb-4" />
                  <h3 className="font-bold text-lg mt-0">WYSIWYG</h3>
                  <p className="text-sm m-0 text-muted-foreground">
                    "What You See Is What You Get". Perfect for visualized content like documents and emails where layout matters more than the underlying code.
                  </p>
                </div>
                <div className="bg-muted/30 p-6 rounded-xl border">
                  <Code className="w-8 h-8 text-pink-500 mb-4" />
                  <h3 className="font-bold text-lg mt-0">Markdown</h3>
                  <p className="text-sm m-0 text-muted-foreground">
                    The developer's favorite. Plain text formatting that converts to HTML. It separates content from presentation, allowing for pure writing focus.
                  </p>
                </div>
                <div className="bg-muted/30 p-6 rounded-xl border">
                  <FileCode className="w-8 h-8 text-emerald-500 mb-4" />
                  <h3 className="font-bold text-lg mt-0">Code Editors</h3>
                  <p className="text-sm m-0 text-muted-foreground">
                    Features like syntax highlighting, bracket matching, and auto-indentation turn a wall of text into a structured, readable program.
                  </p>
                </div>
              </div>
            </div>

            {/* Power User Workflows */}
            <div className="bg-card border rounded-2xl p-8 shadow-sm">
              <h2 className="text-3xl font-bold mb-6 mt-0 flex items-center gap-3">
                <Rocket className="w-8 h-8 text-orange-500" />
                Power User Workflows
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-foreground">For Content Creators</h3>
                  <p className="text-muted-foreground">
                    Use our <strong>Markdown Editor</strong> to draft articles. Why? Because Markdown works everywhere.
                    You can write here, copy the plain text to GitHub, WordPress, or Discord, and the formatting (bold, lists, headers) stays perfect.
                    No more "paste from Word" formatting nightmares.
                  </p>
                </div>
                <div className="h-px bg-border" />
                <div>
                  <h3 className="text-xl font-bold text-foreground">For Developers</h3>
                  <p className="text-muted-foreground">
                    Receiving a payload from an API? Paste it into our <strong>JSON Editor</strong>.
                    We don't just show text; we validate strict syntax, highlight keys vs values, and allow you to collapse nested objects.
                    It's the quickest way to debug a "Bad Request" error without opening Postman.
                  </p>
                </div>
              </div>
            </div>

            {/* Chapter 3: Digital Design Essentials */}
            <div className="bg-muted/30 p-8 rounded-2xl border">
              <h2 className="text-3xl font-bold mb-6 mt-0">3. Digital Design Essentials</h2>
              <p className="text-muted-foreground mb-8">
                Whether you use our <strong>AI Image Editor</strong> or <strong>Background Remover</strong>, understanding these three concepts will instantly make your work look more professional.
              </p>

              {/* Grid for Concepts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Resolution / DPI */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-lg font-bold m-0">Resolution & DPI</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>DPI (Dots Per Inch)</strong> matters for print, not screens.
                  </p>
                  <ul className="text-xs space-y-2 list-disc pl-4 text-muted-foreground">
                    <li><strong>Screens (Web):</strong> 72 PPI is standard. All that matters is pixel dimensions (e.g., 1920x1080).</li>
                    <li><strong>Print (Paper):</strong> You need 300 DPI. A 1000px image will only print cleanly at 3 inches wide.</li>
                  </ul>
                </div>

                {/* Color Theory */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-pink-500" />
                    <h3 className="text-lg font-bold m-0">RGB vs. CMYK</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Why do colors look dull when printed?
                  </p>
                  <ul className="text-xs space-y-2 list-disc pl-4 text-muted-foreground">
                    <li><strong>RGB (Red Green Blue):</strong> Used by screens. Light is additive. Can create neon/bright colors.</li>
                    <li><strong>CMYK (Cyan Magenta Yellow Key):</strong> Used by printers. Ink is subtractive. Cannot reproduce neon colors.</li>
                  </ul>
                </div>

                {/* Aspect Ratios */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-orange-500" />
                    <h3 className="text-lg font-bold m-0">Aspect Ratios</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The shape of your canvas dictates compatibility.
                  </p>
                  <ul className="text-xs space-y-2 list-disc pl-4 text-muted-foreground">
                    <li><strong>16:9 :</strong> YouTube, TV, Presentations.</li>
                    <li><strong>9:16 :</strong> TikTok, Reels, Shorts.</li>
                    <li><strong>1:1 :</strong> Instagram Posts, Profile Pics.</li>
                    <li><strong>4:5 :</strong> IG Portrait (Takes up more screen).</li>
                  </ul>
                </div>

              </div>
            </div>

            {/* Feature Deep Dive */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold m-0">Why Use Online Editors?</h2>
                <ul className="space-y-4 list-none pl-0">
                  <li className="flex gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg h-fit">
                      <Coffee className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <strong className="block text-foreground">Zero Friction</strong>
                      <span className="text-muted-foreground">No npm install, no updates, no config files. Just open the URL and start typing.</span>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg h-fit">
                      <Eye className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <strong className="block text-foreground">Instant Preview</strong>
                      <span className="text-muted-foreground">See your HTML or Markdown render in real-time side-by-side. Catch typos before you publish.</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-muted/30 p-8 rounded-2xl border">
                <h3 className="text-2xl font-bold mb-6 mt-0">Safety First</h3>
                <p className="text-muted-foreground mb-4">
                  "Is it safe to paste my API keys?"
                </p>
                <div className="p-4 bg-background border rounded-lg">
                  <p className="m-0 text-sm font-medium">
                    <strong className="text-green-600 dark:text-green-400">Answer:</strong> While our tools are client-side (your code doesn't leave your browser),
                    best practice dictates you should <strong className="text-red-500">NEVER</strong> paste live production secrets (API Keys, Passwords, Private Keys) into any online tool.
                    Use dummy data for testing structure, then swap in secrets locally.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold border-b pb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <details className="group border rounded-lg bg-background">
                  <summary className="flex justify-between items-center p-4 font-medium cursor-pointer list-none">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-500" />
                      <span>Does the Markdown Editor support GitHub Flavored Markdown (GFM)?</span>
                    </div>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="p-4 pt-0 text-muted-foreground text-sm group-open:animate-fadeIn">
                    Yes! We support standard tables, task lists `[ ]`, strikethrough `~~text~~`, and code blocks with language syntax highlighting.
                  </div>
                </details>

                <details className="group border rounded-lg bg-background">
                  <summary className="flex justify-between items-center p-4 font-medium cursor-pointer list-none">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-500" />
                      <span>Can I save my work?</span>
                    </div>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="p-4 pt-0 text-muted-foreground text-sm group-open:animate-fadeIn">
                    Currently, our editors are session-based. If you refresh, you may lose data. We recommend copying your work to a local file regularly.
                    Future updates may include local storage caching.
                  </div>
                </details>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditorsCategoryPage;