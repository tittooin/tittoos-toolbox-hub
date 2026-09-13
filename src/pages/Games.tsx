import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import {
  Gamepad2,
  Sparkles,
  Search,
  ArrowRight,
  Play,
  Zap,
  Brain,
  Timer,
  Target,
  Keyboard,
  MousePointer2,
  Calculator,
  ShieldCheck,
  Flame
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { tools } from "@/data/tools";
import { AdMobService } from "@/services/AdMobService";
import { useWorkspaceStore } from "@/hooks/useWorkspaceStore";

// Metadata map for category organization and visual aesthetics
interface GameMeta {
  category: string;
  badge: string;
  colorScheme: {
    bg: string;
    text: string;
    border: string;
    badgeBg: string;
    hoverBorder: string;
  };
}

const GAME_METADATA: Record<string, GameMeta> = {
  "pool-shooter": {
    category: "Arcade & Casual",
    badge: "ARCADE CLASSIC",
    colorScheme: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/20",
      badgeBg: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
      hoverBorder: "hover:border-emerald-500/50"
    }
  },
  "2048-game": {
    category: "Puzzle & Logic",
    badge: "PUZZLE CLASSIC",
    colorScheme: {
      bg: "bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/20",
      badgeBg: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
      hoverBorder: "hover:border-amber-500/50"
    }
  },
  "number-flow": {
    category: "Puzzle & Logic",
    badge: "LOGIC STRATEGY",
    colorScheme: {
      bg: "bg-violet-500/10",
      text: "text-violet-600 dark:text-violet-400",
      border: "border-violet-500/20",
      badgeBg: "bg-violet-500/20 text-violet-600 dark:text-violet-400",
      hoverBorder: "hover:border-violet-500/50"
    }
  },
  "typing-speed-test": {
    category: "Speed & Reflex",
    badge: "WPM CHALLENGE",
    colorScheme: {
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/20",
      badgeBg: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
      hoverBorder: "hover:border-blue-500/50"
    }
  },
  "click-speed-test": {
    category: "Speed & Reflex",
    badge: "CPS SPEED TEST",
    colorScheme: {
      bg: "bg-cyan-500/10",
      text: "text-cyan-600 dark:text-cyan-400",
      border: "border-cyan-500/20",
      badgeBg: "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400",
      hoverBorder: "hover:border-cyan-500/50"
    }
  },
  "reaction-time-test": {
    category: "Speed & Reflex",
    badge: "REFLEX BENCHMARK",
    colorScheme: {
      bg: "bg-rose-500/10",
      text: "text-rose-600 dark:text-rose-400",
      border: "border-rose-500/20",
      badgeBg: "bg-rose-500/20 text-rose-600 dark:text-rose-400",
      hoverBorder: "hover:border-rose-500/50"
    }
  },
  "memory-match-game": {
    category: "Brain & Memory",
    badge: "MEMORY GYM",
    colorScheme: {
      bg: "bg-purple-500/10",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-500/20",
      badgeBg: "bg-purple-500/20 text-purple-600 dark:text-purple-400",
      hoverBorder: "hover:border-purple-500/50"
    }
  },
  "math-speed-challenge": {
    category: "Brain & Memory",
    badge: "MENTAL MATH",
    colorScheme: {
      bg: "bg-indigo-500/10",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-500/20",
      badgeBg: "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400",
      hoverBorder: "hover:border-indigo-500/50"
    }
  },
  "snake-game": {
    category: "Arcade & Casual",
    badge: "ARCADE RETRO",
    colorScheme: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/20",
      badgeBg: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
      hoverBorder: "hover:border-emerald-500/50"
    }
  },
  "sky-hopper": {
    category: "Arcade & Casual",
    badge: "ARCADE TAPPER",
    colorScheme: {
      bg: "bg-sky-500/10",
      text: "text-sky-600 dark:text-sky-400",
      border: "border-sky-500/20",
      badgeBg: "bg-sky-500/20 text-sky-600 dark:text-sky-400",
      hoverBorder: "hover:border-sky-500/50"
    }
  },
  "minesweeper": {
    category: "Puzzle & Logic",
    badge: "LOGIC DEDUCTION",
    colorScheme: {
      bg: "bg-red-500/10",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-500/20",
      badgeBg: "bg-red-500/20 text-red-600 dark:text-red-400",
      hoverBorder: "hover:border-red-500/50"
    }
  },
  "sudoku": {
    category: "Puzzle & Logic",
    badge: "NUMBER PUZZLE",
    colorScheme: {
      bg: "bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/20",
      badgeBg: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
      hoverBorder: "hover:border-amber-500/50"
    }
  },
  "whack-a-mole": {
    category: "Speed & Reflex",
    badge: "REFLEX ACTION",
    colorScheme: {
      bg: "bg-orange-500/10",
      text: "text-orange-600 dark:text-orange-400",
      border: "border-orange-500/20",
      badgeBg: "bg-orange-500/20 text-orange-600 dark:text-orange-400",
      hoverBorder: "hover:border-orange-500/50"
    }
  },
  "color-reaction": {
    category: "Speed & Reflex",
    badge: "COLOR REFLEX",
    colorScheme: {
      bg: "bg-pink-500/10",
      text: "text-pink-600 dark:text-pink-400",
      border: "border-pink-500/20",
      badgeBg: "bg-pink-500/20 text-pink-600 dark:text-pink-400",
      hoverBorder: "hover:border-pink-500/50"
    }
  },
  "simon-memory": {
    category: "Brain & Memory",
    badge: "COLOR SEQUENCE",
    colorScheme: {
      bg: "bg-teal-500/10",
      text: "text-teal-600 dark:text-teal-400",
      border: "border-teal-500/20",
      badgeBg: "bg-teal-500/20 text-teal-600 dark:text-teal-400",
      hoverBorder: "hover:border-teal-500/50"
    }
  },
  "sequence-memory": {
    category: "Brain & Memory",
    badge: "GRID MEMORY",
    colorScheme: {
      bg: "bg-violet-500/10",
      text: "text-violet-600 dark:text-violet-400",
      border: "border-violet-500/20",
      badgeBg: "bg-violet-500/20 text-violet-600 dark:text-violet-400",
      hoverBorder: "hover:border-violet-500/50"
    }
  }
};

const CATEGORIES = [
  "All Games",
  "Arcade & Casual",
  "Puzzle & Logic",
  "Speed & Reflex",
  "Brain & Memory"
] as const;

export default function Games() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("All Games");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { addRecentItem } = useWorkspaceStore();

  // Filter actual games from tools registry
  const allGameTools = tools.filter((t) => t.category === "games");

  // Filter based on selected category & search input
  const filteredGames = allGameTools.filter((game) => {
    const meta = GAME_METADATA[game.id] || {
      category: "Arcade & Casual",
      badge: "GAME",
      colorScheme: {
        bg: "bg-primary/10",
        text: "text-primary",
        border: "border-border",
        badgeBg: "bg-primary/20 text-primary",
        hoverBorder: "hover:border-primary/50"
      }
    };

    const matchesCategory =
      selectedCategory === "All Games" || meta.category === selectedCategory;

    const matchesSearch =
      searchQuery.trim() === "" ||
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (game.keywords &&
        game.keywords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCategory && matchesSearch;
  });

  // Group games by category for structured display when "All Games" is active and no search query
  const groupedCategories = CATEGORIES.filter((c) => c !== "All Games");

  const handleCardClick = async (gamePath: string, gameId: string, gameName: string) => {
    try {
      await AdMobService.checkAndShowAd();
    } catch {
      // Ignore ad check failure
    }

    addRecentItem({
      id: `game-${gameId}-${Date.now()}`,
      title: gameName,
      subtitle: "Played from Games Hub",
      type: "tool",
      path: gamePath,
      timestamp: Date.now()
    });

    navigate(gamePath);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-emerald-500/20">
      <Helmet>
        <title>Free Online Games Hub - Play Instant Browser Games | Axevora</title>
        <meta
          name="description"
          content="Explore Axevora Games Hub: play free browser games online with zero installation. Enjoy arcade pool shooter, 2048 puzzle, memory match, typing test, and brain challenges."
        />
        <meta
          name="keywords"
          content="free online games, browser games, pool bubble shooter, 2048 game, memory match game, typing speed test, click speed test, reaction time test, number flow, brain games"
        />
        <link rel="canonical" href="https://axevora.com/games" />
        <meta property="og:title" content="Axevora Games Hub - Free Browser Games & Brain Arcade" />
        <meta
          property="og:description"
          content="Play lightweight, installation-free online games. Arcade, puzzle, reflex, and memory challenges."
        />
        <meta property="og:url" content="https://axevora.com/games" />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />

      <main className="flex-grow">
        {/* ========================================================================= */}
        {/* HERO SECTION                                                              */}
        {/* ========================================================================= */}
        <section className="relative py-12 md:py-20 px-4 bg-gradient-to-b from-emerald-500/5 via-background to-background border-b border-border/40 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] pointer-events-none" />
          <div className="container mx-auto max-w-6xl relative z-10 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Gamepad2 className="w-4 h-4" />
              Axevora Play • Games Directory
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight">
              Play Something. <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">Take a Break.</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore our curated library of lightweight browser games and cognitive reflex challenges.
              100% free, runs instantly in your browser with zero installation.
            </p>

            {/* Quick feature pill highlights */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <Badge variant="outline" className="px-3 py-1 text-xs font-medium border-border/80 bg-card/50">
                <Flame className="w-3 h-3 text-amber-500 mr-1.5" /> 8 Instant Games
              </Badge>
              <Badge variant="outline" className="px-3 py-1 text-xs font-medium border-border/80 bg-card/50">
                <Zap className="w-3 h-3 text-emerald-500 mr-1.5" /> Zero Installation
              </Badge>
              <Badge variant="outline" className="px-3 py-1 text-xs font-medium border-border/80 bg-card/50">
                <ShieldCheck className="w-3 h-3 text-blue-500 mr-1.5" /> 100% Client-Side
              </Badge>
              <Badge variant="outline" className="px-3 py-1 text-xs font-medium border-border/80 bg-card/50">
                <Brain className="w-3 h-3 text-purple-500 mr-1.5" /> Brain & Reflex Training
              </Badge>
            </div>

            {/* Search Input */}
            <div className="max-w-md mx-auto pt-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search games by name or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 rounded-xl border-border bg-card/80 backdrop-blur-sm text-sm focus-visible:ring-emerald-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CATEGORY TABS                                                             */}
        {/* ========================================================================= */}
        <section className="sticky top-16 z-20 bg-background/90 backdrop-blur-md border-b border-border/40 py-3 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 dark:bg-emerald-500 dark:text-slate-950"
                        : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* GAMES DIRECTORY GRID                                                      */}
        {/* ========================================================================= */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl space-y-12">
            {/* Show Category-Wise Sections if "All Games" is active and no search query */}
            {selectedCategory === "All Games" && searchQuery.trim() === "" ? (
              groupedCategories.map((categoryName) => {
                const categoryGames = allGameTools.filter((g) => {
                  const meta = GAME_METADATA[g.id];
                  return meta && meta.category === categoryName;
                });

                if (categoryGames.length === 0) return null;

                return (
                  <div key={categoryName} className="space-y-6">
                    <div className="flex items-center justify-between border-b border-border/40 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                          {categoryName}
                        </h2>
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {categoryGames.length} {categoryGames.length === 1 ? "Game" : "Games"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryGames.map((game) => {
                        const meta = GAME_METADATA[game.id] || {
                          category: categoryName,
                          badge: "GAME",
                          colorScheme: {
                            bg: "bg-emerald-500/10",
                            text: "text-emerald-500",
                            border: "border-border",
                            badgeBg: "bg-emerald-500/20 text-emerald-500",
                            hoverBorder: "hover:border-emerald-500/50"
                          }
                        };
                        const IconComponent = game.icon || Gamepad2;

                        return (
                          <Card
                            key={game.id}
                            onClick={() => handleCardClick(game.path, game.id, game.name)}
                            className={`group cursor-pointer h-full bg-card/60 hover:bg-card border-border/60 ${meta.colorScheme.hoverBorder} transition-all duration-300 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between`}
                          >
                            <CardContent className="p-6 space-y-4 flex-grow">
                              <div className="flex items-center justify-between">
                                <div
                                  className={`w-12 h-12 rounded-xl ${meta.colorScheme.bg} ${meta.colorScheme.text} flex items-center justify-center group-hover:scale-105 transition-transform`}
                                >
                                  <IconComponent className="w-6 h-6" />
                                </div>
                                <Badge className={`${meta.colorScheme.badgeBg} border-none font-bold text-[10px] tracking-wider`}>
                                  {meta.badge}
                                </Badge>
                              </div>

                              <div className="space-y-1">
                                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                                  {game.name}
                                </h3>
                                <p className="text-xs font-medium text-muted-foreground/80">
                                  {game.subheading}
                                </p>
                              </div>

                              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                                {game.description}
                              </p>
                            </CardContent>

                            <div className="px-6 pb-6 pt-0 border-t border-border/20">
                              <div className={`mt-4 text-xs font-bold ${meta.colorScheme.text} flex items-center justify-between group-hover:translate-x-0.5 transition-transform`}>
                                <span className="flex items-center gap-1.5">
                                  <Play className="w-3.5 h-3.5 fill-current" /> Play Now
                                </span>
                                <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              // Filtered or Searched view
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    {selectedCategory === "All Games"
                      ? `Search Results for "${searchQuery}"`
                      : selectedCategory}
                  </h2>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {filteredGames.length} {filteredGames.length === 1 ? "Game" : "Games"} Found
                  </span>
                </div>

                {filteredGames.length === 0 ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground">
                      <Gamepad2 className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">No games found</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      Try searching with different keywords or switch categories to explore all games.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedCategory("All Games");
                        setSearchQuery("");
                      }}
                      className="mt-2"
                    >
                      Reset Filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGames.map((game) => {
                      const meta = GAME_METADATA[game.id] || {
                        category: "Games",
                        badge: "GAME",
                        colorScheme: {
                          bg: "bg-emerald-500/10",
                          text: "text-emerald-500",
                          border: "border-border",
                          badgeBg: "bg-emerald-500/20 text-emerald-500",
                          hoverBorder: "hover:border-emerald-500/50"
                        }
                      };
                      const IconComponent = game.icon || Gamepad2;

                      return (
                        <Card
                          key={game.id}
                          onClick={() => handleCardClick(game.path, game.id, game.name)}
                          className={`group cursor-pointer h-full bg-card/60 hover:bg-card border-border/60 ${meta.colorScheme.hoverBorder} transition-all duration-300 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between`}
                        >
                          <CardContent className="p-6 space-y-4 flex-grow">
                            <div className="flex items-center justify-between">
                              <div
                                className={`w-12 h-12 rounded-xl ${meta.colorScheme.bg} ${meta.colorScheme.text} flex items-center justify-center group-hover:scale-105 transition-transform`}
                              >
                                <IconComponent className="w-6 h-6" />
                              </div>
                              <Badge className={`${meta.colorScheme.badgeBg} border-none font-bold text-[10px] tracking-wider`}>
                                {meta.badge}
                              </Badge>
                            </div>

                            <div className="space-y-1">
                              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                                {game.name}
                              </h3>
                              <p className="text-xs font-medium text-muted-foreground/80">
                                {game.subheading}
                              </p>
                            </div>

                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                              {game.description}
                            </p>
                          </CardContent>

                          <div className="px-6 pb-6 pt-0 border-t border-border/20">
                            <div className={`mt-4 text-xs font-bold ${meta.colorScheme.text} flex items-center justify-between group-hover:translate-x-0.5 transition-transform`}>
                              <span className="flex items-center gap-1.5">
                                <Play className="w-3.5 h-3.5 fill-current" /> Play Now
                              </span>
                              <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Pool Shooter Dedicated Spotlight Banner */}
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-950/40 via-card/80 to-teal-950/40 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Target className="w-7 h-7" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                    <Sparkles className="w-3 h-3" /> Featured Arcade
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Pool Bubble Shooter</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Aim, bank your shots off the cushions, and clear the pool table!
                  </p>
                </div>
              </div>

              <Button
                asChild
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-6 self-stretch md:self-auto"
              >
                <Link to="/tools/pool-shooter">
                  Play Pool Shooter <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
