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
    // Check for query or URL parameter
    const params = new URLSearchParams(location.search);
    const initialQuery = params.get('q') || params.get('query') || params.get('url');
    if (initialQuery && initialQuery.trim().length > 0) {
      const trimmed = initialQuery.trim();
      // Replace location path without losing history
      navigate(location.pathname, { replace: true });
      setTimeout(() => {
        handleSendMessage(trimmed);
      }, 300);
    }

    return () => {
      // Abort on unmount
      abortControllerRef.current?.abort();
    };
  }, [location.search, location.pathname, navigate]);

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
      const trimmedContent = content.trim();
      const isCheaperChip = trimmedContent === "Show me cheaper alternatives";
      const isTopRatedChip = trimmedContent === "Compare with top rated options";
      const isProsConsChip = trimmedContent === "What are the pros and cons?";
      const isFollowUp = isCheaperChip || isTopRatedChip || isProsConsChip;

      let reviewContext = trimmedContent;
      let searchQuery = trimmedContent;

      if (isFollowUp && messages.length > 0) {
        const lastRealMsg = [...messages].reverse().find(m => m.role === 'user' && !["What are the pros and cons?", "Show me cheaper alternatives", "Compare with top rated options"].includes(m.content));
        const baseContext = lastRealMsg ? lastRealMsg.content : "smartphones";

        if (isCheaperChip) {
          reviewContext = `Show me cheaper budget alternatives for ${baseContext}`;
          searchQuery = `cheaper budget alternatives for ${baseContext}`;
        } else if (isTopRatedChip) {
          reviewContext = `Compare top rated premium options for ${baseContext}`;
          searchQuery = `top rated premium alternatives for ${baseContext}`;
        } else if (isProsConsChip) {
          reviewContext = `Detailed pros and cons review for ${baseContext}`;
          searchQuery = baseContext;
        }
      }

      // 1. Fetch Review Summary and Search Alternatives in Parallel
      const [reviewSettled, searchSettled] = await Promise.allSettled([
        fetch(`/api/commerce/review-summary?q=${encodeURIComponent(reviewContext)}`, {
          signal: abortControllerRef.current.signal
        }).then(r => r.json()).catch(() => ({ ok: false })),
        !isProsConsChip ? fetch(`/api/commerce/search?q=${encodeURIComponent(searchQuery)}`, {
          signal: abortControllerRef.current.signal
        }).then(r => r.json()).catch(() => ({ ok: false, items: [] })) : Promise.resolve({ ok: false, items: [] })
      ]);

      const reviewData = (reviewSettled.status === 'fulfilled' ? reviewSettled.value : { ok: false }) as any;
      const searchData = (searchSettled.status === 'fulfilled' ? searchSettled.value : { ok: false, items: [] }) as any;

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
          
        if (reviewData.data.rating) {
          assistantMessage.shouldYouBuy = {
            decision: reviewData.data.overallSentiment === "Positive" || reviewData.data.rating >= 4 ? "Yes" : "Consider Alternatives",
            reason: `Based on a rating of ${reviewData.data.rating}/5 and user consensus.`
          };
        }

        if (reviewData.metadata?.search_sources_used) {
          assistantMessage.sources = reviewData.metadata.search_sources_used.map((s: string, idx: number) => ({
            id: `src-${idx}`,
            name: s,
            url: 'https://www.google.com/search?q=' + encodeURIComponent(s + ' ' + trimmedContent),
            snippet: `Real-time live web search insight from ${s}`
          }));
        }
      } else if (reviewData.error) {
        assistantMessage.content = `⚠️ **${reviewData.error}**`;
      } else {
        assistantMessage.content = `I found some options for you.`;
      }

      if (isProsConsChip) {
        // Keep previous products for pros and cons chip
        const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant' && m.products && m.products.length > 0);
        if (lastAssistantMsg) {
          assistantMessage.products = lastAssistantMsg.products;
        }
      } else if (searchData.ok && searchData.items) {
        assistantMessage.products = searchData.items.map((item: any) => {
          const resolvedImageUrl = item.imageUrl !== undefined ? item.imageUrl : (item.image || null);
          return {
            id: item.id || uuidv4(),
            name: item.title,
            price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0 : item.price || 0,
            originalPrice: item.originalPrice,
            discountPercentage: item.discountPercentage,
            discountText: item.discountText,
            currency: item.currency || 'INR',
            rating: item.rating !== undefined && item.rating !== null ? Number(item.rating) : null,
            reviewCount: item.reviewCount !== undefined && item.reviewCount !== null ? Number(item.reviewCount) : null,
            imageUrl: resolvedImageUrl,
            imageThumbnailUrl: item.imageThumbnailUrl || null,
            imageSourceDomain: item.imageSourceDomain || null,
            imageMatchScore: item.imageMatchScore || null,
            imageMatchReason: item.imageMatchReason || null,
            imageUsageBasis: item.imageUsageBasis || null,
            imageType: item.imageType || (resolvedImageUrl ? 'PRODUCT' : 'NONE'),
            imageSource: item.imageSource || (resolvedImageUrl ? 'OPENSERP' : 'NONE'),
            imageVerification: item.imageVerification || 'NONE',
            dealType: item.dealType || (resolvedImageUrl ? 'PRODUCT_DEAL' : (item.urlType === 'product' ? 'PRODUCT_DEAL' : 'STORE_DEAL')),
            priceType: item.priceType || (item.price > 0 ? 'ADVERTISED_PRODUCT_PRICE' : 'UNKNOWN'),
            priceConfidence: item.priceConfidence || 0,
            verificationStatus: item.verificationStatus || 'SOURCE_STATED',
            couponCode: item.couponCode,
            validUntil: item.validUntil,
            merchantId: item.merchantName?.toLowerCase() || item.merchant?.toLowerCase() || 'store',
            merchantName: item.merchantName || item.merchant || 'Store',
            merchantLogoUrl: item.merchantLogo || item.merchantLogoUrl || '',
            dealUrl: item.url || item.dealUrl || '#',
            destinationUrl: item.destinationUrl,
            trackingUrl: item.trackingUrl,
            urlType: item.urlType || (resolvedImageUrl ? 'product' : 'search'),
            reasons: item.reasons || ["Verified Offer"],
            aiScore: item.aiScore || undefined,
            communityScore: item.communityScore || undefined,
            deliveryEstimate: item.deliveryEstimate || 'Check merchant',
            returnPolicy: item.returnPolicy || 'Check merchant',
            source: item.source,
            retrievedAt: item.retrievedAt,
            extractedEntities: item.extractedEntities
          };
        });

        // Dynamic Progressive Image Enrichment if backend hadn't returned imageUrl
        const needsImage = assistantMessage.products.some((p: Product) => !p.imageUrl);
        if (needsImage) {
          const msgId = assistantMessage.id;
          fetch(`/api/commerce/image-search?q=${encodeURIComponent(trimmedContent)}`)
            .then(res => res.json())
            .then((imgData: any) => {
              if (imgData.ok && imgData.verifiedCandidate && imgData.verifiedCandidate.imageUrl) {
                const candidate = imgData.verifiedCandidate;
                setMessages(prev => prev.map(m => {
                  if (m.id !== msgId || !m.products) return m;
                  return {
                    ...m,
                    products: m.products.map(prod => ({
                      ...prod,
                      imageUrl: prod.imageUrl || candidate.imageUrl,
                      imageThumbnailUrl: prod.imageThumbnailUrl || candidate.thumbnailUrl,
                      imageSourceDomain: prod.imageSourceDomain || candidate.sourceDomain,
                      imageMatchScore: prod.imageMatchScore || candidate.productMatchScore,
                      imageMatchReason: prod.imageMatchReason || candidate.productMatchReason,
                      imageUsageBasis: prod.imageUsageBasis || candidate.usageBasis,
                      imageType: 'PRODUCT' as const,
                      imageSource: 'OPENSERP' as const,
                      imageVerification: candidate.productMatchScore,
                      dealType: 'PRODUCT_DEAL' as const,
                    }))
                  };
                }));
              }
            })
            .catch(e => console.warn('[ShoppingAssistant] Progressive image search notice:', e));
        }
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
