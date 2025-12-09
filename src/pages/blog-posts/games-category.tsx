import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Brain, Zap, Trophy, Target, Timer } from 'lucide-react';
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
            </Helmet>

            <Header />

            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto space-y-12">

                    {/* Hero Section */}
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                            <Brain className="w-12 h-12 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Brain Games & Educational Tools
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Challenge your mind, improve your reflexes, and boost your cognitive skills with our collection of free interactive tools.
                        </p>
                    </div>

                    {/* Tools Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gamesTools.map((tool) => (
                            <Link key={tool.id} to={tool.path}>
                                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group border-2 hover:border-primary/50">
                                    <CardHeader>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                                <tool.icon className="h-6 w-6 text-primary" />
                                            </div>
                                        </div>
                                        <CardTitle className="group-hover:text-primary transition-colors">
                                            {tool.name}
                                        </CardTitle>
                                        <CardDescription>
                                            {tool.subheading}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            {tool.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {/* Educational Content */}
                    <div className="prose dark:prose-invert max-w-none space-y-8">
                        <div className="bg-card border rounded-xl p-8">
                            <h2 className="flex items-center gap-3 text-2xl font-bold mb-4">
                                <Trophy className="w-6 h-6 text-yellow-500" />
                                Why Play Brain Games?
                            </h2>
                            <p>
                                Brain games are more than just a way to pass time. They are designed to stimulate your cognitive functions and keep your mind sharp. Regular mental exercise can:
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0">
                                <li className="flex items-start gap-2">
                                    <Target className="w-5 h-5 text-primary mt-1" />
                                    <span><strong>Improve Focus:</strong> Train your ability to concentrate on specific tasks.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Zap className="w-5 h-5 text-primary mt-1" />
                                    <span><strong>Boost Speed:</strong> Enhance your processing speed and reaction times.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Brain className="w-5 h-5 text-primary mt-1" />
                                    <span><strong>Enhance Memory:</strong> Strengthen both short-term and long-term memory.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Timer className="w-5 h-5 text-primary mt-1" />
                                    <span><strong>Quick Thinking:</strong> Develop faster decision-making skills.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3>For Students</h3>
                                <p>
                                    Our educational tools like the <strong>Math Speed Challenge</strong> and <strong>Typing Speed Test</strong> are perfect for students looking to improve their academic skills. Fast calculation and typing are essential skills in the digital age.
                                </p>
                            </div>
                            <div>
                                <h3>For Gamers</h3>
                                <p>
                                    Competitive gaming requires split-second reactions. Use our <strong>Reaction Time Test</strong> and <strong>Click Speed Test (CPS)</strong> to warm up before matches and track your improvement over time.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default GamesCategoryPage;
