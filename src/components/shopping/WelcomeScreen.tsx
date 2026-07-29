import { Sparkles, ArrowRight, ShoppingBag, Laptop, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onPromptClick: (prompt: string) => void;
}

const starterPrompts = [
  { icon: Headphones, text: "Best TWS earbuds under ₹2000" },
  { icon: Laptop, text: "MacBook Air M3 deals and offers" },
  { icon: ShoppingBag, text: "Compare iPhone 15 and S24" },
];

export default function WelcomeScreen({ onPromptClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8 text-primary" />
      </div>
      
      <h1 className="text-3xl font-bold mb-3 tracking-tight">
        Axevora Shopping Assistant
      </h1>
      
      <p className="text-muted-foreground max-w-md mb-10 text-sm md:text-base">
        Discover the best products, compare deals, and get trusted community recommendations powered by AI.
      </p>

      <div className="w-full max-w-2xl grid gap-3 md:grid-cols-3">
        {starterPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => onPromptClick(prompt.text)}
            className="group flex flex-col text-left p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            <prompt.icon className="w-5 h-5 mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium text-foreground mb-1 line-clamp-2">
              {prompt.text}
            </span>
            <div className="mt-auto pt-2">
              <ArrowRight className="w-4 h-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
