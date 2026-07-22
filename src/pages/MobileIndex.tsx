import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search, Grid, Star, Settings, User, Users,
  ChevronRight, Sparkles, Radio, ArrowRight, ShoppingBag, Flame
} from "lucide-react";
import { tools, categories } from "@/data/tools";
import { motion } from "framer-motion";
import { CommerceSection } from "@/components/commerce/CommerceSection";

const MobileIndex = () => {
  const [searchQuery, setSearchQuery] = useState("");
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

  const scrollToCommerce = () => {
    const el = document.getElementById("commerce-deals");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans selection:bg-indigo-500/20">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-4 py-3.5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md">
              <span className="font-bold text-white text-base">A</span>
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">Axevora</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/community">
              <Button
                size="sm"
                className="h-8 px-3 rounded-full bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200 text-xs font-bold flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5 text-violet-600" />
                Community
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={scrollToCommerce}
              className="h-8 px-3 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-bold flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-indigo-600" />
              Deals
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            className="bg-slate-100 border-slate-200 rounded-full pl-10 text-xs text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500/30"
            placeholder="Search 120+ free tools & deals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-8">
        {/* Featured Banner for Mobile */}
        {!searchQuery && activeCategory === 'all' && (
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white border border-indigo-500 shadow-xl relative overflow-hidden"
            >
              <div className="relative z-10">
                <Badge className="bg-white/20 text-white border-none mb-2 backdrop-blur-md text-[10px] font-bold">
                  Universal AI Hub
                </Badge>
                <h2 className="text-xl font-extrabold mb-1.5">Free Web Tools & Deals</h2>
                <p className="text-indigo-100 text-xs mb-4">
                  Access {tools.length}+ online utilities and verified partner offers.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={scrollToCommerce}
                    className="bg-white text-indigo-900 hover:bg-slate-100 rounded-full text-xs font-bold px-4 shadow-md"
                  >
                    View Live Deals 🔥
                  </Button>
                </div>
              </div>
              <Sparkles className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 rotate-12" />
            </motion.div>

            <Link to="/tools/axevora-live-rooms">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-indigo-600 animate-pulse" />
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Live Rooms</span>
                  </div>
                  <Badge className="bg-red-500 text-white text-[10px] uppercase font-black px-1.5 py-0">New</Badge>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Axevora Live Hangout Rooms</h3>
                <p className="text-slate-500 text-xs">Host private hangouts with mood themes & real-time chat.</p>
              </motion.div>
            </Link>
          </div>
        )}

        {/* --- LIVE COMMERCE & DEALS SECTION (MOBILE OPTIMIZED) --- */}
        <div className="-mx-4">
          <CommerceSection />
        </div>

        {/* Categories Scroll */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3 px-1">Categories</h3>
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white text-slate-600 border border-slate-200 shadow-sm'
              }`}
            >
              All Tools
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-white text-slate-600 border border-slate-200 shadow-sm'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tools List */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 mb-2 px-1">
            {searchQuery ? "Search Results" : activeCategory === 'all' ? "Popular Tools" : "Tools"}
          </h3>

          {filteredTools.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">No tools found</div>
          ) : (
            filteredTools.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <Link to={tool.path} key={tool.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center p-3.5 rounded-2xl bg-white border border-slate-200 mb-3 shadow-sm active:scale-98 transition-transform"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mr-3.5 flex-shrink-0">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{tool.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{tool.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 ml-2 shrink-0" />
                  </motion.div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Fixed Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-6 py-3 flex justify-around items-center z-50 shadow-lg">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center gap-1 text-indigo-600"
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        <button
          onClick={scrollToCommerce}
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <Flame className="w-5 h-5 text-amber-500" />
          <span className="text-[10px] font-bold">Live Deals</span>
        </button>

        <Link to="/all-tools" className="flex flex-col items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors">
          <Star className="w-5 h-5" />
          <span className="text-[10px] font-bold">All Tools</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileIndex;
