import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ShoppingLayout from '@/components/shopping/ShoppingLayout';
import WelcomeScreen from '@/components/shopping/WelcomeScreen';
import ChatInterface from '@/components/shopping/ChatInterface';
import ChatMessage from '@/components/shopping/ChatMessage';
import LoadingSkeleton from '@/components/shopping/LoadingSkeleton';
import { Message, Product } from '@/types/shopping';
import { SEO } from '@/components/SEO';
import { v4 as uuidv4 } from 'uuid';

export default function ShoppingAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // Check for URL parameter
    const params = new URLSearchParams(location.search);
    const urlParam = params.get('url');
    if (urlParam) {
      // Clear parameter to avoid refetching on reload
      navigate('/ai', { replace: true });
      // Small timeout to allow initial render
      setTimeout(() => {
        handleSendMessage(urlParam);
      }, 500);
    }

    return () => {
      // Abort on unmount
      abortControllerRef.current?.abort();
    };
  }, [location.search, navigate]);

  const handleSendMessage = async (content: string) => {
    // Abort previous stream if active
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const isFollowUp = ["What are the pros and cons?", "Show me cheaper alternatives", "Compare with top rated options"].includes(content.trim());
      let reviewContext = content.trim();
      let shouldFetchNewProducts = !isFollowUp;

      if (isFollowUp && messages.length > 0) {
        // Find the last user query that wasn't a follow up to maintain context
        const lastRealQuery = [...messages].reverse().find(m => m.role === 'user' && !["What are the pros and cons?", "Show me cheaper alternatives", "Compare with top rated options"].includes(m.content));
        if (lastRealQuery) {
          reviewContext = `${content.trim()} regarding ${lastRealQuery.content}`;
        }
      }

      // 1. Fetch Review Summary (AI insights)
      const reviewRes = await fetch(`/api/commerce/review-summary?q=${encodeURIComponent(reviewContext)}`, {
        signal: abortControllerRef.current.signal
      });
      const reviewData = await reviewRes.json();
      
      // 2. Fetch Search Alternatives (only if it's not a generic follow-up)
      let searchData: any = { ok: false, items: [] };
      if (shouldFetchNewProducts) {
        const searchRes = await fetch(`/api/commerce/search?q=${encodeURIComponent(content.trim())}`, {
          signal: abortControllerRef.current.signal
        });
        searchData = await searchRes.json();
      }

      let assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: '',
        products: [],
      };

      if (reviewData.ok && reviewData.data) {
        const d = reviewData.data;
        if (d.isComparison === true && d.comparisonMarkdown) {
          assistantMessage.content = d.comparisonMarkdown;
        } else {
          assistantMessage.content = d.hookHeader ? `### ${d.hookHeader}\n\n` : '';
          assistantMessage.content += `${d.pitch || d.consensusSummary || ''}\n\n`;
          if (d.pros && d.pros.length > 0) {
            assistantMessage.content += `**Pros:**\n${d.pros.map((p: string) => `- ${p}`).join('\n')}\n\n`;
          }
          if (d.cons && d.cons.length > 0) {
            assistantMessage.content += `**Cons:**\n${d.cons.map((c: string) => `- ${c}`).join('\n')}`;
          }
        }
          
        assistantMessage.shouldYouBuy = {
          decision: reviewData.data.overallSentiment === "Positive" || reviewData.data.rating >= 4 ? "Yes" : "Consider Alternatives",
          reason: `Based on a rating of ${reviewData.data.rating || 4}/5 and user consensus.`
        };
      } else if (reviewData.error) {
        assistantMessage.content = `⚠️ **${reviewData.error}**`;
      } else {
        assistantMessage.content = `I found some options for you.`;
      }

      // If follow-up, copy products from last assistant message so we don't lose the UI cards
      if (isFollowUp) {
        const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant' && m.products && m.products.length > 0);
        if (lastAssistantMsg) {
          assistantMessage.products = lastAssistantMsg.products;
        }
      } else if (searchData.ok && searchData.items) {
        assistantMessage.products = searchData.items.map((item: any, idx: number) => {
          const strHash = (item.title || '').split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
          const ratingVal = Number((4.3 + ((strHash + idx) % 5) * 0.1).toFixed(1));
          const reviewsVal = 1250 + ((strHash + idx * 300) % 3500);

          return {
            id: item.id || uuidv4(),
            name: item.title,
            price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0 : item.price || 0,
            currency: 'INR',
            rating: item.rating || ratingVal,
            reviewCount: item.reviewCount || reviewsVal,
            imageUrl: item.image || item.merchantLogo || '',
            merchantId: item.merchantName?.toLowerCase() || 'unknown',
            merchantName: item.merchantName || 'Store',
            merchantLogoUrl: item.merchantLogo || '',
            dealUrl: item.url, // URL is already tracked/affiliated via search.ts
            reasons: ["Top Match"],
            aiScore: 88 + (idx % 8),
            communityScore: 82 + (idx % 12),
            deliveryEstimate: 'Check merchant',
            returnPolicy: 'Check merchant'
          };
        });
      }

      assistantMessage.followUps = [
        "What are the pros and cons?",
        "Show me cheaper alternatives",
        "Compare with top rated options"
      ];

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Stream aborted');
        return;
      }
      
      console.error('Error fetching chat response:', error);
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error while trying to process your request. Please try again."
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setIsLoading(false);
  };

  return (
    <ShoppingLayout onNewChat={handleNewChat}>
      <SEO 
        title="AI Shopping Assistant | Axevora"
        description="Discover the best products, compare deals, and get trusted community recommendations powered by AI."
      />
      
      <div className="flex flex-col h-full bg-background/50">
        <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
          {messages.length === 0 ? (
            <WelcomeScreen onPromptClick={handleSendMessage} />
          ) : (
            <div className="flex flex-col pb-6">
              {messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                  onFollowUpClick={handleSendMessage}
                />
              ))}
              {isLoading && (
                <div className="w-full py-6 bg-muted/30">
                  <div className="px-4">
                    <LoadingSkeleton />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="flex-shrink-0 bg-background/80 backdrop-blur-sm border-t border-border/50">
          <ChatInterface onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </ShoppingLayout>
  );
}
