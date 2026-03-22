
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Sparkles, MessageCircle, FileText, Layout, ArrowRight, Zap, Target, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const DigitalIncomeKit = () => {
  const whatsappNumber = "918459124430"; // Assuming the number from previous context
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi,%20I%20want%20to%20buy%20the%20Axevora%20Digital%20Income%20Kit!`;

  const features = [
    {
      title: "AI Prompt Pack",
      icon: <Sparkles className="w-6 h-6 text-yellow-500" />,
      items: [
        "20 Instagram Growth Prompts",
        "10 YouTube Script Prompts",
        "10 Client Closing Prompts"
      ],
      color: "from-yellow-500/10 to-transparent"
    },
    {
      title: "Canva Templates Pack",
      icon: <Layout className="w-6 h-6 text-blue-500" />,
      items: [
        "10 Instagram Post Templates",
        "5 Reel Cover Templates",
        "5 Professional Thumbnail Templates"
      ],
      color: "from-blue-500/10 to-transparent"
    },
    {
      title: "WhatsApp Automation Pack",
      icon: <MessageCircle className="w-6 h-6 text-green-500" />,
      items: [
        "10 High-Converting Auto Reply Templates",
        "5 Sales Closing Scripts",
        "5 Broadcast Message Templates"
      ],
      color: "from-green-500/10 to-transparent"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30">
      <Helmet>
        <title>Axevora Digital Income Kit | Build Your Digital Empire</title>
        <meta name="description" content="Unlock the ultimate kit for digital creators. AI prompts, Canva templates, and WhatsApp scripts to skyrocket your online income." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full opacity-20 pointer-events-none" />
        
        <div className="container px-4 mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="mb-4 border-primary/50 text-primary px-4 py-1.5 text-sm uppercase tracking-wider bg-primary/5">
                Limited Time Offer: 90% OFF
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 tracking-tight leading-[1.1]">
                Turn Your Laptop Into A <br />
                <span className="text-primary italic">Money Making Machine</span>
              </h1>
              <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Stop guessing. Get the exact assets, scripts, and prompts used by top digital entrepreneurs to generate recurring income from scratch.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-black px-8 h-14 text-lg font-bold rounded-full group"
                  onClick={() => window.open(whatsappUrl, '_blank')}
                >
                  Get Access Now ₹499
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img 
                      key={i} 
                      className="w-10 h-10 rounded-full border-2 border-black bg-zinc-800"
                      src={`https://i.pravatar.cc/150?u=${i}`} 
                      alt="User avatar" 
                    />
                  ))}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-black bg-zinc-900 text-[10px] text-zinc-400">
                    +1.2k
                  </div>
                </div>
                <p className="text-sm text-zinc-500 font-medium">Joined the community</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-zinc-900/30 border-y border-zinc-800/50 py-4 overflow-hidden whitespace-nowrap">
        <div className="flex items-center space-x-12 px-4 animate-marquee">
          {[
            "1,200+ Happy Creators", "Instant Access", "90% Discount", "Trusted by 50+ Brands",
            "1,200+ Happy Creators", "Instant Access", "90% Discount", "Trusted by 50+ Brands"
          ].map((text, idx) => (
            <div key={idx} className="flex items-center space-x-2 text-zinc-500 font-medium text-sm">
              <Zap className="w-4 h-4 text-primary" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">What's Inside The Kit?</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">Everything you need to launch, scale, and automate your digital business in one comprehensive package.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className={`relative p-8 rounded-3xl border border-zinc-800 bg-zinc-900/50 hover:border-primary/50 transition-colors overflow-hidden group`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <div className="bg-zinc-800/80 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border border-zinc-700">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <ul className="space-y-4">
                  {feature.items.map((item, i) => (
                    <li key={i} className="flex items-start text-zinc-400 group-hover:text-zinc-300 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-primary mr-3 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Problem & Solution */}
      <section className="py-20 bg-zinc-900/30">
        <div className="container px-4 mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
                Why Creators Fail to Monetize <br /> (And How We Solve It)
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4 p-4 rounded-2xl hover:bg-zinc-800/50 transition-colors">
                  <div className="bg-red-500/10 p-3 rounded-xl">
                    <Target className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Information Overload</h4>
                    <p className="text-zinc-400 text-sm">Most people spend hours on YouTube but never take action. Our kit provides the direct templates you need to start TODAY.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-2xl hover:bg-zinc-800/50 transition-colors">
                  <div className="bg-blue-500/10 p-3 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Low Engagement</h4>
                    <p className="text-zinc-400 text-sm">Our AI hooks and Canva layouts are tested for virality. No more shouting into the void.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-2xl hover:bg-zinc-800/50 transition-colors">
                  <div className="bg-green-500/10 p-3 rounded-xl">
                    <ArrowRight className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Manual Labor</h4>
                    <p className="text-zinc-400 text-sm">Automate your client conversations with our pre-built WhatsApp scripts. Work smarter, not harder.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-zinc-800 p-8 flex flex-col justify-center items-center text-center">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <Sparkles className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-3xl font-black mb-2 italic uppercase">Axevora</h3>
                <p className="text-xl font-bold text-primary mb-6">Digital Income Kit v2.0</p>
                <Badge variant="outline" className="border-primary/30 text-primary">Everything Included</Badge>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/30 blur-[80px] rounded-full" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/30 blur-[80px] rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="container px-4 mx-auto">
          <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-black mb-8 leading-tight">
                Ready To Start Your <br /> 
                Next Stream Of Income?
              </h2>
              <p className="text-black/70 text-lg mb-12 max-w-xl mx-auto font-medium">
                Join 1,200+ creators who have already automated their growth with our Digital Income Kit.
              </p>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-black text-white hover:bg-zinc-900 border-none px-12 h-16 text-xl font-bold rounded-full transition-transform active:scale-95"
                onClick={() => window.open(whatsappUrl, '_blank')}
              >
                Claim Discount Price Now
              </Button>
              <p className="mt-8 text-black/40 text-sm font-bold tracking-widest uppercase">
                Secure 1:1 WhatsApp Delivery
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Minimal */}
      <footer className="py-12 border-t border-zinc-900 text-center">
        <p className="text-zinc-600 text-sm">© 2025 Axevora. All rights reserved. <br /> Digital mastery for the modern era.</p>
      </footer>
    </div>
  );
};

export default DigitalIncomeKit;
