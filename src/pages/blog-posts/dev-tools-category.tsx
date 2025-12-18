import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Terminal, Code, Command, Cpu, Laptop, Shield, Keyboard, Zap, Hash } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { tools } from "@/data/tools";

const DevToolsCategoryPage = () => {
    const categoryTools = tools.filter(tool => tool.category === 'dev');

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Helmet>
                <title>Developer Tools & CLI Generators - Windows, Linux, Mac | Axevora</title>
                <meta name="description" content="Master the command line with our free developer tools. Generate terminal commands for Windows, Linux, and Mac. Translate natural language to shell scripts instantly." />
                <meta name="keywords" content="dev tools, terminal commands, cli generator, powershell commands, bash script generator, linux commands, mac terminal, adb commands" />
                <meta property="og:title" content="Developer Tools & CLI Generators - Windows, Linux, Mac | Axevora" />
                <meta property="og:description" content="Master the command line with our free developer tools. Generate terminal commands instantly." />
            </Helmet>

            <Header />

            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="max-w-5xl mx-auto space-y-16">

                    {/* Hero Section */}
                    <div className="text-center space-y-8">
                        <div className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl border bg-card">
                            {/* distinct-colored placeholder until image is generated */}
                            <img
                                src="/assets/blog/dev-tools-guide.png"
                                alt="Developer Tools & CLI"
                                className="w-full h-auto object-cover"
                            />
                        </div>

                        <div className="max-w-3xl mx-auto space-y-6">
                            <div className="inline-flex items-center justify-center p-3 bg-slate-100 dark:bg-slate-800 rounded-full">
                                <Terminal className="w-8 h-8 text-slate-700 dark:text-green-400" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-black dark:from-green-400 dark:to-emerald-400">
                                Command The Machine
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Stop memorizing obscure flags and syntax.
                                Translate your plain English instructions into executable commands for Windows, Linux, and MacOS.
                            </p>
                        </div>
                    </div>

                    {/* Tools Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryTools.map((tool) => (
                            <Link key={tool.id} to={tool.path} className="group">
                                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-green-500/50">
                                    <CardHeader>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:bg-green-100 dark:group-hover:bg-green-900/40 transition-colors">
                                                <tool.icon className="h-6 w-6 text-slate-700 dark:text-green-400" />
                                            </div>
                                        </div>
                                        <CardTitle className="group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-xl">
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
                                        <div className="mt-4 flex items-center text-sm font-medium text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Open Console <span className="ml-1">→</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}

                        {/* If no tools yet, show coming soon */}
                        {categoryTools.length === 0 && (
                            <div className="col-span-full text-center py-12 text-muted-foreground">
                                <p>New tools are initializing... Check back momentarily.</p>
                            </div>
                        )}
                    </div>

                    {/* EXTENDED CONTENT START */}
                    <div className="prose dark:prose-invert max-w-none space-y-16">

                        {/* CLI vs GUI */}
                        <div className="bg-card border rounded-2xl p-8 shadow-sm">
                            <h2 className="flex items-center gap-3 text-3xl font-bold mb-6 mt-0">
                                <Command className="w-8 h-8 text-indigo-500" />
                                GUI is for Users, CLI is for Masters
                            </h2>
                            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                                Graphical User Interfaces (GUIs) are friendly but slow. You drag, you drop, you wait.
                                The <strong>Command Line Interface (CLI)</strong> is the direct line to the operating system's kernel.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold flex items-center gap-2 m-0">
                                        <Laptop className="w-5 h-5 text-blue-500" />
                                        The GUI Limitations
                                    </h3>
                                    <div className="bg-muted p-4 rounded-lg text-sm">
                                        <p className="m-0 mb-2"><strong>Task:</strong> Rename 1000 files.</p>
                                        <p className="m-0 text-muted-foreground">
                                            Warning: You have to click reliable "Rename" on every single file, or download a paid bulk-renamer tool.
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold flex items-center gap-2 m-0">
                                        <Terminal className="w-5 h-5 text-green-500" />
                                        The CLI Superpower
                                    </h3>
                                    <div className="bg-slate-950 text-green-400 p-4 rounded-lg font-mono text-sm border border-slate-800">
                                        <p className="m-0">mv *.jpg *.png</p>
                                        <p className="m-0 text-slate-500 mt-2">// Done in 0.04 seconds.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* OS Ecosystems */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold border-b pb-4">Know Your Environment</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="bg-muted/30 p-6 rounded-xl border hover:border-blue-500/30 transition-colors">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Zap className="w-6 h-6 text-blue-500" />
                                        <h3 className="text-xl font-bold m-0">Powershell (Windows)</h3>
                                    </div>
                                    <p className="text-muted-foreground text-sm">
                                        More than just a shell, it's an object-oriented scripting engine. It integrates deeply with the .NET framework, allowing you to control every aspect of Windows.
                                    </p>
                                </div>
                                <div className="bg-muted/30 p-6 rounded-xl border hover:border-amber-500/30 transition-colors">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Hash className="w-6 h-6 text-amber-500" />
                                        <h3 className="text-xl font-bold m-0">Bash (Linux)</h3>
                                    </div>
                                    <p className="text-muted-foreground text-sm">
                                        The universal language of servers. If you want to deploy a website, manage a cloud server (AWS/DigitalOcean), or hack a router, you speak Bash.
                                    </p>
                                </div>
                                <div className="bg-muted/30 p-6 rounded-xl border hover:border-gray-500/30 transition-colors">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Command className="w-6 h-6 text-gray-500" />
                                        <h3 className="text-xl font-bold m-0">Zsh (First-Class Mac)</h3>
                                    </div>
                                    <p className="text-muted-foreground text-sm">
                                        The default on macOS. It's essentially Bash with superpowers: better auto-completion, themes, and plugin support (Oh My Zsh).
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Security Corner */}
                        <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-2xl border border-red-100 dark:border-red-900/30">
                            <div className="flex items-center gap-3 mb-4">
                                <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
                                <h2 className="text-2xl font-bold text-red-900 dark:text-red-300 m-0">Dangerous Commands</h2>
                            </div>
                            <p className="text-red-800 dark:text-red-400 mb-4">
                                <strong>Copy-pasting commands from the internet is dangerous.</strong> Malicious code can be hidden in CSS or invisible characters.
                            </p>
                            <div className="bg-background/80 p-4 rounded-xl border border-red-200 dark:border-red-900/50">
                                <code className="text-sm font-mono text-red-600">rm -rf /</code>
                                <p className="mt-2 text-sm text-muted-foreground m-0">
                                    "Remove, Recursive, Force, Root". This command will delete <strong>everything</strong> on a Linux system. No Recycle Bin. No Undo.
                                    Always understand exactly what a flag (like <code>-f</code>) does before pressing Enter.
                                </p>
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

export default DevToolsCategoryPage;
