
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Search, Grid, Star, Settings, User,
    ChevronRight, Sparkles, Radio, ArrowRight
} from "lucide-react";
import { tools, categories } from "@/data/tools";
import { motion } from "framer-motion";

const MobileIndex = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("home"); // home, categories, favorites
    const [activeCategory, setActiveCategory] = useState("all");

    const filteredTools = useMemo(() => {
        let filteredList = tools;
        if (activeCategory !== "all") {
            filteredList = filteredList.filter((tool) => tool.category === activeCategory);
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredList = filteredList.filter(
                (tool) =>
                    tool.name.toLowerCase().includes(query) ||
                    tool.description.toLowerCase().includes(query)
            );
        }
        return filteredList;
    }, [searchQuery, activeCategory]);

    return (
        <div className="min-h-screen bg-black text-white pb-24 font-sans">
            {/* Mobile Header */}
            <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 py-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
                            <span className="font-bold text-white">A</span>
                        </div>
                        <span className="font-bold text-lg tracking-tight">Axevora</span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                        <User className="w-4 h-4" />
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                    <Input
                        className="bg-white/5 border-white/10 rounded-xl pl-10 text-white placeholder:text-white/50 focus-visible:ring-cyan-500/50"
                        placeholder="Search tools..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-6 space-y-8">

                {/* Featured / Hero for Mobile */}
                {!searchQuery && activeCategory === 'all' && (
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-white/10 relative overflow-hidden"
                        >
                            <div className="relative z-10">
                                <Badge className="bg-cyan-500/20 text-cyan-300 border-0 mb-2">Welcome</Badge>
                                <h2 className="text-xl font-bold mb-2">Premium AI Tools</h2>
                                <p className="text-white/70 text-sm mb-4">Access {tools.length}+ professional utilities securely for free.</p>
                                <Button size="sm" className="bg-white text-black hover:bg-white/90 rounded-lg text-xs">
                                    Browse All
                                </Button>
                            </div>
                            <Sparkles className="absolute -bottom-4 -right-4 w-32 h-32 text-purple-500/20 rotate-12" />
                        </motion.div>

                        <Link to="/tools/axevora-live-rooms">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="p-5 rounded-2xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-cyan-500/30 relative overflow-hidden"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
                                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Live Rooms</span>
                                    </div>
                                    <Badge className="bg-red-500 text-white text-[10px] uppercase font-black px-1.5 py-0">New</Badge>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">Axevora Live Rooms</h3>
                                <p className="text-white/60 text-xs mb-3">Host private hangouts with mood themes and real-time fun.</p>
                                <div className="flex items-center text-cyan-400 text-xs font-bold gap-1">
                                    Join Now <ArrowRight className="w-3 h-3" />
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                )}

                {/* Categories Scroll */}
                <div>
                    <h3 className="text-sm font-semibold text-white/70 mb-3 px-1">Categories</h3>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-all ${activeCategory === 'all'
                                    ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'
                                    : 'bg-white/5 text-white/60 border border-white/5'
                                }`}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-all ${activeCategory === cat.id
                                        ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'
                                        : 'bg-white/5 text-white/60 border border-white/5'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tools List */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-white/70 mb-2 px-1">
                        {searchQuery ? "Search Results" : activeCategory === 'all' ? "Popular Tools" : "Tools"}
                    </h3>

                    {filteredTools.length === 0 ? (
                        <div className="text-center py-10 text-white/40">No tools found</div>
                    ) : (
                        filteredTools.map((tool, i) => {
                            const Icon = tool.icon;
                            return (
                                <Link to={tool.path} key={tool.id}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center p-3 rounded-2xl bg-white/5 border border-white/5 mb-3 active:scale-95 transition-transform"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mr-4 flex-shrink-0">
                                            <Icon className="w-5 h-5 text-cyan-400" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className="font-medium text-sm text-white truncate">{tool.name}</h4>
                                            <p className="text-xs text-white/50 truncate">{tool.description}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-white/30" />
                                    </motion.div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Bottom Nav */}
            <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex justify-between items-center z-50">
                <button className="flex flex-col items-center gap-1 text-cyan-400">
                    <Grid className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Home</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-white/40 hover:text-white transition-colors">
                    <Star className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Saved</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-white/40 hover:text-white transition-colors">
                    <Settings className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Settings</span>
                </button>
            </div>
        </div>
    );
};

export default MobileIndex;
