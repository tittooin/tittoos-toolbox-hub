import { Bot, User } from 'lucide-react';
import { Message } from '@/types/shopping';
import { cn } from '@/lib/utils';
import ProductCard from './ProductCard';
import MerchantCard from './MerchantCard';
import ShouldYouBuy from './ShouldYouBuy';
import RecommendationSources from './RecommendationSources';
import SuggestedFollowups from './SuggestedFollowups';

interface ChatMessageProps {
  message: Message;
  onFollowUpClick?: (prompt: string) => void;
}

export default function ChatMessage({ message, onFollowUpClick }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={cn(
      "w-full py-6",
      isAssistant ? "bg-muted/30" : "bg-transparent"
    )}>
      <div className="max-w-3xl mx-auto flex gap-4 px-4">
        <div className="flex-shrink-0 mt-1">
          {isAssistant ? (
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Bot className="w-5 h-5 text-primary" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border border-border">
              <User className="w-5 h-5 text-secondary-foreground" />
            </div>
          )}
        </div>
        
        <div className="flex-1 space-y-4 overflow-hidden">
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none break-words">
            <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
          
          {message.shouldYouBuy && (
            <ShouldYouBuy data={message.shouldYouBuy} />
          )}

          {message.products && message.products.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Top Recommendations
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {message.products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {message.merchants && message.merchants.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Where to Buy
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {message.merchants.map(merchant => (
                  <MerchantCard key={merchant.id} merchant={merchant} />
                ))}
              </div>
            </div>
          )}

          {message.sources && <RecommendationSources sources={message.sources} />}
          
          {message.followUps && onFollowUpClick && (
            <SuggestedFollowups followUps={message.followUps} onClick={onFollowUpClick} />
          )}
        </div>
      </div>
    </div>
  );
}
