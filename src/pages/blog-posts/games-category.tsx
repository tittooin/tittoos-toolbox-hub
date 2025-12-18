import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Brain, Zap, Trophy, Target, Timer, MousePointer2, Keyboard, Skull } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { tools } from "@/data/tools";

const GamesCategoryPage = () => {
    const gamesTools = tools.filter(tool => tool.category === 'games');

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Helmet>
                <title>Brain Games & Educational Tools - Train Your Mind | Axevora</title>
                <meta name="description" content="Free online brain games and educational tools. Improve your memory, reaction time, typing speed, and math skills with our interactive challenges." />
                <meta name="keywords" content="brain games, educational tools, memory game, reaction time test, math games, typing test, 2048 game, mind training, cognitive exercises" />
                <meta property="og:title" content="Brain Games & Educational Tools - Train Your Mind | Axevora" />
                <meta property="og:description" content="Free online brain games and educational tools. Improve your memory, reaction time, and typing speed." />
            </Helmet>

            <Header />

            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="max-w-5xl mx-auto space-y-16">

                    {/* Hero Section */}
                    <div className="text-center space-y-8">
                        <div className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl border bg-card">
                            <img
                                src="/assets/blog/games-tools-guide.png"
                                alt="Brain Games & Educational Tools"
                                className="w-full h-auto object-cover"
                            />
                        </div>

                        <div className="max-w-3xl mx-auto space-y-6">
                            <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                                <Brain className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                                Level Up Your Mind
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Challenge your reflexes, expand your working memory, and sharpen your math skills.
                                These aren't just games; they are a gym for your brain.
                            </p>
                        </div>
                    </div>

                    {/* Tools Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gamesTools.map((tool) => (
                            <Link key={tool.id} to={tool.path} className="group">
                                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-indigo-500/50">
                                    <CardHeader>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors">
                                                <tool.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                        </div>
                                        <CardTitle className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-xl">
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
                                        <div className="mt-4 flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Play Now <span className="ml-1">→</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {/* EXTENDED CONTENT START */}
                    <div className="prose dark:prose-invert max-w-none space-y-16">

                        {/* Why Play? */}
                        <div className="bg-card border rounded-2xl p-8 shadow-sm">
                            <h2 className="flex items-center gap-3 text-3xl font-bold mb-6 mt-0">
                                <Trophy className="w-8 h-8 text-yellow-500" />
                                The Science of Brain Training
                            </h2>
                            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                                Just like your physical muscles, your brain needs regular exercise to stay strong and healthy.
                                Digital brain training targets specific cognitive functions, using <strong>Neuroplasticity</strong>—the brain's
                                ability to reorganize itself—to improve performance in daily life.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                <div className="p-6 bg-background rounded-xl border space-y-3">
                                    <Zap className="w-8 h-8 text-yellow-500" />
                                    <h3 className="text-lg font-bold m-0">Speed</h3>
                                    <p className="text-sm text-muted-foreground m-0">
                                        <strong>Reaction Time</strong> isn't fixed. By repeatedly challenging your visual-motor loop, you can shave milliseconds off your response, crucial for driving and gaming.
                                    </p>
                                </div>
                                <div className="p-6 bg-background rounded-xl border space-y-3">
                                    <Target className="w-8 h-8 text-red-500" />
                                    <h3 className="text-lg font-bold m-0">Focus</h3>
                                    <p className="text-sm text-muted-foreground m-0">
                                        In a world of distractions, <strong>Sustained Attention</strong> is a super power. Games like "Aim Trainer" force you to maintain high alert states for extended periods.
                                    </p>
                                </div>
                                <div className="p-6 bg-background rounded-xl border space-y-3">
                                    <Brain className="w-8 h-8 text-blue-500" />
                                    <h3 className="text-lg font-bold m-0">Memory</h3>
                                    <p className="text-sm text-muted-foreground m-0">
                                        <strong>Working Memory</strong> is your mental scratchpad. Games that require holding patterns (like Simon Says or 2048) expand this capacity.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Esports Training */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold border-b pb-4">Tools for Gamers</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <MousePointer2 className="w-6 h-6 text-primary" />
                                        CPS (Clicks Per Second)
                                    </h3>
                                    <p className="text-muted-foreground">
                                        In Minecraft PvP or fast-paced shooters, clicking speed matters. The "Jitter Click" or "Butterfly Click" techniques require practice to master without causing strain. Use our <strong>Click Speed Test</strong> to warm up before a match.
                                        <br /><br />
                                        <em>Pro Benchmark:</em> Casual players hit 6 CPS. Pros hit 12+ CPS.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Keyboard className="w-6 h-6 text-primary" />
                                        APM (Actions Per Minute)
                                    </h3>
                                    <p className="text-muted-foreground">
                                        For RTS (Real Time Strategy) games like StarCraft, raw typing speed isn't enough; you need command efficiency. Our <strong>Typing Test</strong> helps build muscle memory so your fingers find the keys without your eyes leaving the screen.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* The "Flow State" */}
                        <div className="bg-muted/30 p-8 rounded-2xl border">
                            <div className="flex items-center gap-3 mb-6">
                                <Activity className="w-8 h-8 text-green-500" />
                                <h2 className="text-2xl font-bold m-0">Achieving "Flow"</h2>
                            </div>

                            <p className="text-muted-foreground m-0">
                                The psychology concept of <strong>Flow</strong> occurs when a challenge perfectly matches your skill level.
                                It's that feeling of being "in the zone". Our games are designed with adaptive difficulty curves to push you into this state,
                                where learning happens fastest and time seems to vanish.
                            </p>
                        </div>

                    </div>
                    {/* EXTENDED CONTENT END */}

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default GamesCategoryPage;
