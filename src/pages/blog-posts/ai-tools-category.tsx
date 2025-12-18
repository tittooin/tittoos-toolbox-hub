import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles, Brain, Wand2, MessageSquare, Image as ImageIcon, Video, Fingerprint, StopCircle } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { tools } from "@/data/tools";

const AIToolsCategoryPage = () => {
  const categoryTools = tools.filter(tool => tool.category === 'ai');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Free AI Tools - Generators, Chatbots & Assistants | Axevora</title>
        <meta name="description" content="Explore the future of creativity with our free AI tools. Generate images, text, code, and more using advanced artificial intelligence models. Learn prompt engineering hacks." />
        <meta name="keywords" content="ai tools, artificial intelligence, image generator, text generator, chatbot, prompt engineering, chatgpt alternatives, free ai" />
        <meta property="og:title" content="Free AI Tools - Generators, Chatbots & Assistants | Axevora" />
        <meta property="og:description" content="Explore the future of creativity with our free AI tools. Generate images, text, code, and more." />
      </Helmet>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-16">

          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl border bg-card">
              <img
                src="/assets/blog/ai-tools-guide.png"
                alt="Artificial Intelligence Tools"
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                Augment Your Reality
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                AI isn't about replacing humans; it's about giving them superpowers.
                Write faster, design bolder, and solve harder problems with our suite of Generative AI tools.
              </p>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryTools.map((tool) => (
              <Link key={tool.id} to={tool.path} className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-purple-500/50">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40 transition-colors">
                        <tool.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors text-xl">
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
                    <div className="mt-4 flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Try AI Tool <span className="ml-1">→</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* EXTENDED CONTENT START */}
          <div className="prose dark:prose-invert max-w-none space-y-16">

            {/* Prompt Engineering Masterclass */}
            <div className="bg-card border rounded-2xl p-8 shadow-sm">
              <h2 className="flex items-center gap-3 text-3xl font-bold mb-6 mt-0">
                <Brain className="w-8 h-8 text-pink-500" />
                Master Class: Prompt Engineering
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                The quality of AI output is directly proportional to the quality of your input.
                This new skill—<strong>Prompt Engineering</strong>—is the art of talking to machines.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-4">
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-900/50">
                    <h3 className="text-lg font-bold text-red-700 dark:text-red-400 m-0 mb-2">The Amateur Approach</h3>
                    <p className="text-sm font-mono m-0">"Write a marketing email."</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Result:</strong> A generic, robotic spam email that no one reads. It lacks context, tone, and specific goals.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-900/50">
                    <h3 className="text-lg font-bold text-green-700 dark:text-green-400 m-0 mb-2">The Pro Approach</h3>
                    <p className="text-sm font-mono m-0">"Act as a direct-response copywriter. Write a 150-word email promoting a 50% off sale on high-end headphones. Tone: Urgent but sophisticated. Target Audience: Audiophiles."</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Result:</strong> A high-converting asset with a distinct voice, clear call-to-action, and psychological triggers.
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-muted/50 rounded-xl">
                <h3 className="text-lg font-bold m-0 mb-2">The Formula: C-C-O</h3>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li><strong>Context:</strong> Who is the AI? (e.g., "Act as a lawyer")</li>
                  <li><strong>Constraints:</strong> What are the limits? (e.g., "Under 280 characters", "No jargon")</li>
                  <li><strong>Output:</strong> What format do you want? (e.g., "A bulleted list", "A JSON object", "A 3-paragraph essay")</li>
                </ul>
              </div>
            </div>

            {/* Modalities Explained */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold border-b pb-4">Understanding AI Modalities</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-muted/30 p-6 rounded-2xl border hover:border-purple-500/30 transition-colors">
                  <div className="p-2 bg-background w-fit rounded-lg mb-4">
                    <ImageIcon className="w-6 h-6 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-bold m-0 mb-2">Diffusion Models</h3>
                  <p className="text-muted-foreground text-sm m-0">
                    Tools like Midjourney work by starting with "noise" (static) and slowly hallucinating patterns that match your text description. They are great for concept art but struggle with specific text rendering within images.
                  </p>
                </div>
                <div className="bg-muted/30 p-6 rounded-2xl border hover:border-blue-500/30 transition-colors">
                  <div className="p-2 bg-background w-fit rounded-lg mb-4">
                    <MessageSquare className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold m-0 mb-2">LLMs (Text)</h3>
                  <p className="text-muted-foreground text-sm m-0">
                    Large Language Models are essentially super-advanced "autocomplete" engines. They predict the statistically most likely next word. This makes them brilliant creative writers but occasional liars when it comes to hard facts.
                  </p>
                </div>
                <div className="bg-muted/30 p-6 rounded-2xl border hover:border-orange-500/30 transition-colors">
                  <div className="p-2 bg-background w-fit rounded-lg mb-4">
                    <Video className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold m-0 mb-2">Multimodal</h3>
                  <p className="text-muted-foreground text-sm m-0">
                    The future is hybrid. New models can "see" images and describe them, or take a sketch and turn it into website code. This cross-pollination is where the biggest productivity gains live.
                  </p>
                </div>
              </div>
            </div>

            {/* Ethics & Safety */}
            <div className="bg-blue-50 dark:bg-blue-900/10 p-8 rounded-2xl border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center gap-3 mb-6">
                <Fingerprint className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-300 m-0">The Ethics of AI</h2>
              </div>

              <div className="space-y-6">
                <p className="text-blue-800 dark:text-blue-400 m-0">
                  With great power comes great responsibility. Using AI requires a new kind of digital literacy emphasizing verification and ethics.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-background/80 p-4 rounded-xl">
                    <strong className="block text-foreground mb-2 flex items-center gap-2">
                      <StopCircle className="w-4 h-4 text-red-500" /> Hallucinations
                    </strong>
                    <p className="text-sm text-muted-foreground m-0">
                      AI will confidently state false facts. Always fact-check citations, dates, and names—especially for legal or medical content.
                    </p>
                  </div>
                  <div className="bg-background/80 p-4 rounded-xl">
                    <strong className="block text-foreground mb-2 flex items-center gap-2">
                      <StopCircle className="w-4 h-4 text-red-500" /> Plagiarism & Bias
                    </strong>
                    <p className="text-sm text-muted-foreground m-0">
                      Models are trained on the open internet, which includes copyrighted work and societal biases. Be critical of the output and edit it to reflect YOUR inclusive values.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
          {/* EXTENDED CONTENT END */}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AIToolsCategoryPage;
