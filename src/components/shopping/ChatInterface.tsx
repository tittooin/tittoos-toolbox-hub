import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInterface({ onSendMessage, isLoading }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-background">
      <form 
        onSubmit={handleSubmit}
        className={cn(
          "relative flex items-end w-full rounded-2xl border border-input bg-card shadow-sm focus-within:ring-1 focus-within:ring-primary transition-all overflow-hidden p-2",
          isLoading && "opacity-50 pointer-events-none"
        )}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about products, deals, or recommendations..."
          className="flex-1 max-h-[200px] min-h-[44px] w-full resize-none bg-transparent px-3 py-3 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          rows={1}
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={!input.trim() || isLoading}
          className="shrink-0 rounded-xl h-10 w-10 mb-0.5 mr-0.5 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <ArrowUp className="w-5 h-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
      <div className="mt-2 text-center">
        <p className="text-[11px] text-muted-foreground">
          Axevora Assistant can make mistakes. Verify important information and always check community reviews.
        </p>
      </div>
    </div>
  );
}
