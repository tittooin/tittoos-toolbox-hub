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

    const isUrl = content.trim().startsWith('http://') || content.trim().startsWith('https://');

    try {
      if (isUrl) {
        // Direct One-Link Product Intelligence Flow
        const response = await fetch('/api/product-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: content.trim(), comparisonLimit: 3, intent: 'BEST_OVERALL' }),
          signal: abortControllerRef.current.signal
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch product analysis');
        
        let assistantMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: '',
          products: [],
        };
        
        if (data.status === 'FAILED') {
           assistantMessage.content = data.warnings?.join(', ') || 'Failed to analyze this product URL.';
        } else {
           const targetData = data.productIntelligence?.productFacts;
           let summaryContent = data.productIntelligence?.aiSummary || 
             `Here is the analysis for **${targetData?.title || 'this product'}**.`;
           
           const targetProduct: Product = {
             id: 'target',
             name: targetData?.title || 'Unknown Product',
             price: targetData?.price || 0,
             originalPrice: targetData?.originalPrice,
             discountPercentage: targetData?.discountPercentage,
             currency: 'INR',
             rating: 4.5,
             reviewCount: 0,
             imageUrl: targetData?.images?.[0] || '',
             merchantId: data.productIntelligence?.merchant || 'unknown',
             merchantName: data.productIntelligence?.merchant,
             merchantLogoUrl: '',
             dealUrl: data.productIntelligence?.resolvedUrl || content.trim(),
             reasons: ["Target Product"],
             aiScore: 90,
             communityScore: 85,
             deliveryEstimate: 'Check merchant',
             returnPolicy: 'Check merchant'
           };
           
           const comparableProducts = data.comparableDiscovery?.products?.map((p: any) => ({
             id: p.id || uuidv4(),
             name: p.title,
             price: p.price,
             originalPrice: p.originalPrice,
             discountPercentage: p.discountPercentage,
             currency: 'INR',
             rating: p.rating || 4.0,
             reviewCount: p.reviewCount || 0,
             imageUrl: p.imageUrl || '',
             merchantId: p.merchant,
             merchantName: p.merchantName || p.merchant,
             merchantLogoUrl: p.merchantLogoUrl || '',
             dealUrl: p.affiliateUrl || p.merchantUrl || p.url,
             reasons: p.matchReasons || ["Comparable Option"],
             aiScore: 85,
             communityScore: 80,
             deliveryEstimate: p.deliveryInfo || 'Check merchant',
             returnPolicy: p.returnPolicy || 'Check merchant'
           })) || [];

           assistantMessage.content = summaryContent;
           assistantMessage.products = targetData ? [targetProduct, ...comparableProducts] : comparableProducts;
           
           if (data.recommendation?.decision) {
             assistantMessage.shouldYouBuy = {
               decision: data.recommendation.decision,
               reason: data.recommendation.justification || 'Analyzed based on available market data.'
             };
           }
           
           assistantMessage.followUps = [
             "What are the pros and cons?",
             "Show me cheaper alternatives",
             "Compare with top rated options"
           ];
        }
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      } else {
        // Original streaming chat flow
        const response = await fetch('/api/shopping/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [...messages, userMessage] }),
          signal: abortControllerRef.current.signal
        });


      if (!response.ok) throw new Error('Network response was not ok');
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No readable stream available');
      
      const decoder = new TextDecoder();
      
      let assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: '',
        products: [],
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false); // Stop loading indicator since we start streaming

      let done = false;
      let buffer = '';

      while (!done) {
        const { value, done: isDone } = await reader.read();
        done = isDone;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? ''; // Keep incomplete line in buffer

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              if (dataStr === '[DONE]') continue;
              
              try {
                const eventPayload = JSON.parse(dataStr);
                const { event, data } = eventPayload;

                setMessages(prev => {
                  const updatedMessages = [...prev];
                  const lastMsgIndex = updatedMessages.length - 1;
                  const currentMsg = { ...updatedMessages[lastMsgIndex] };

                  if (event === 'INIT') {
                    currentMsg.id = data.messageId || currentMsg.id;
                  } else if (event === 'AI_TEXT') {
                    currentMsg.content += data;
                  } else if (event === 'PRODUCTS') {
                    currentMsg.products = data.map((p: any) => ({
                      id: p.id,
                      name: p.title,
                      price: p.price,
                      originalPrice: p.originalPrice,
                      discountPercentage: p.discountPercentage,
                      currency: p.currency ?? 'INR',
                      rating: p.rating ?? 0,
                      reviewCount: p.reviewCount ?? 0,
                      imageUrl: p.imageUrl ?? '',
                      merchantId: p.merchant,
                      merchantName: p.merchantName || p.merchant,
                      merchantLogoUrl: p.merchantLogoUrl || '',
                      dealUrl: p.affiliateUrl ?? p.merchantUrl ?? '#',
                      reasons: [],
                      aiScore: 0,
                      communityScore: 0,
                      deliveryEstimate: p.deliveryInfo ?? 'Check merchant',
                      returnPolicy: p.returnPolicy ?? 'Check merchant'
                    }));
                    if (data.length > 0) {
                      currentMsg.merchants = [{
                        id: data[0]?.merchant ?? 'merchant',
                        name: data[0]?.merchant ?? 'View on Store',
                        logoUrl: '',
                        trustScore: 85,
                        offers: [],
                        isAffiliate: !!(data[0]?.affiliateUrl),
                        supportRating: 'Standard',
                        deliverySpeed: data[0]?.deliveryInfo ?? 'Standard'
                      }];
                    }
                  } else if (event === 'COMPARISON') {
                    if (data.bestDeal) {
                      currentMsg.shouldYouBuy = {
                        decision: 'Yes',
                        reason: `Best deal found: ${data.bestDeal.title} at ₹${data.bestDeal.price?.toLocaleString('en-IN')} from ${data.bestDeal.merchant}`
                      };
                    }
                  } else if (event === 'DONE') {
                    // stream is finished
                  }

                  updatedMessages[lastMsgIndex] = currentMsg;
                  return updatedMessages;
                });

              } catch (e) {
                console.error("Error parsing SSE JSON", e);
              }
            }
          }
        }
      }
      }

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
