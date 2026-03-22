
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, X, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseOut = (e: MouseEvent) => {
      // If mouse leaves the top of the viewport
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
        // Store in session storage so it doesn't show again in the same session
        sessionStorage.setItem('exit_popup_shown', 'true');
      }
    };

    // Check if shown in this session
    if (sessionStorage.getItem('exit_popup_shown')) {
      setHasShown(true);
    } else {
      document.addEventListener('mouseleave', handleMouseOut);
    }

    return () => {
      document.removeEventListener('mouseleave', handleMouseOut);
    };
  }, [hasShown]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-black border-zinc-800 rounded-[2rem]">
        <div className="relative">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 blur-[60px] rounded-full" />
          
          <div className="p-8 relative z-10 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/30 animate-bounce">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            
            <DialogHeader>
              <DialogTitle className="text-3xl font-black text-white mb-2 italic uppercase">
                Wait! Don't Leave Empty Handed
              </DialogTitle>
              <DialogDescription className="text-zinc-400 text-lg leading-relaxed">
                Grab the <span className="text-primary font-bold">Axevora Digital Income Kit</span> today for just <span className="text-white font-bold line-through ml-1 italic opacity-50">₹4,999</span> <span className="text-primary font-black ml-1">₹499</span>.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-8 space-y-4">
              <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl text-left">
                <p className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  What you'll get instantly:
                </p>
                <ul className="text-xs text-zinc-500 space-y-1 ml-3 list-disc">
                  <li>50+ High-Conversion AI Prompts</li>
                  <li>Viral Canva Templates (Posts & Reels)</li>
                  <li>WhatsApp Automation & Sales Scripts</li>
                  <li>Lifetime Free Updates</li>
                </ul>
              </div>

              <Button asChild className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-black text-xl font-black group shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                <Link to="/earn">
                  Claim 90% Discount Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest">
                * Offer expires when you close this window
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopup;
