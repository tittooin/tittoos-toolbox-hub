import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Search, ArrowRight, ShieldCheck, Cpu } from "lucide-react";

export const ProductAnalyzerBanner = () => {
  const navigate = useNavigate();
  const [productUrl, setProductUrl] = useState("");

  const handleAnalyze = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!productUrl.trim()) {
      navigate("/tools/product-analysis");
      return;
    }
    navigate(`/tools/product-analysis?url=${encodeURIComponent(productUrl.trim())}`);
  };

  return (
    <section className="py-12 px-4 relative overflow-hidden bg-gradient-to-r from-blue-950/40 via-purple-950/40 to-slate-900/60 border-y border-white/10">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Content */}
          <div className="flex-1 text-left">
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30 px-3.5 py-1 text-xs">
              <Sparkles className="w-3.5 h-3.5 mr-2 text-purple-400" />
              One-Link Product Intelligence Engine
            </Badge>

            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
              Analyze E-Commerce <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Product Links</span>
            </h2>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl mb-6">
              Paste a supported product link to inspect available technical specifications, merchant identity, and deal information.
            </p>

            {/* Input Form */}
            <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  type="url"
                  placeholder="Paste product link (e.g. https://www.amazon.in/dp/B08L5WHFT9)..."
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  className="pl-11 h-12 bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-purple-500 text-sm rounded-xl"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 shrink-0"
              >
                <span>Analyze Link</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Right Visual Features */}
          <div className="w-full lg:w-auto flex flex-wrap lg:flex-col gap-3 shrink-0">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-200">
              <ShieldCheck className="w-5 h-5 text-green-400 shrink-0" />
              <span>Merchant Identity Verification</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-200">
              <Cpu className="w-5 h-5 text-blue-400 shrink-0" />
              <span>Deterministic Specs Engine</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
