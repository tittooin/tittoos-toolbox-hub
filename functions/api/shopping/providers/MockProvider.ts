import { IAIProvider, AIConfig, AIMessage, RawAIResponse, AIProviderType } from '../../../../src/types/ai';
import { Logger } from '../core/Logger';

export class MockProvider implements IAIProvider {
  name: AIProviderType = 'mock';

  async generateResponse(messages: AIMessage[], config: AIConfig): Promise<RawAIResponse> {
    Logger.debug({
      requestId: 'mock-req-123',
      conversationId: 'mock-conv-123',
      provider: this.name,
      model: config.model,
      timestamp: new Date().toISOString()
    });

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // For now, return a raw JSON string that looks like what a real AI would output,
    // which our ResponseFormatter will parse.
    const rawContent = JSON.stringify({
      text: "Based on community reviews and expert analysis, here are the top recommendations.",
      products: [
        {
          id: "mock-prod-1",
          name: "Apple MacBook Air M3 (13-inch, 16GB RAM)",
          price: 114900,
          currency: "INR",
          rating: 4.9,
          reviewCount: 342,
          imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
          merchantId: "mock-merch-1",
          dealUrl: "#",
          reasons: ["M3 Chip Performance", "18-hour battery", "Lightweight design"],
          aiScore: 95,
          communityScore: 92,
          deliveryEstimate: "2 Days",
          returnPolicy: "7 Days Replacement"
        }
      ],
      merchants: [
        {
          id: "mock-merch-1",
          name: "Flipkart",
          logoUrl: "https://upload.wikimedia.org/wikipedia/en/7/7a/Flipkart_logo.svg",
          trustScore: 95,
          offers: ["₹5000 off on HDFC Cards", "Exchange Offer up to ₹15000"],
          isAffiliate: true,
          supportRating: "Good",
          deliverySpeed: "Standard"
        }
      ],
      shouldYouBuy: {
        decision: "Yes",
        reason: "The M3 chip with 16GB RAM is the sweet spot for future-proofing your purchase. The current deal makes it an excellent value."
      },
      sources: ["Community Discussions", "Expert Reviews"],
      followUps: ["Should I upgrade to 24GB RAM?", "What about Windows alternatives?", "Is the M2 still worth it?"]
    });

    return {
      text: rawContent,
      usage: {
        promptTokens: 120,
        completionTokens: 350,
        totalTokens: 470
      },
      provider: this.name,
      model: config.model
    };
  }

  async generateStream(messages: AIMessage[], config: AIConfig): Promise<ReadableStream> {
    // For Phase 2 Mock, we will just return a stream that yields the raw text in chunks
    const response = await this.generateResponse(messages, config);
    const text = response.text;
    const chunks = text.match(/.{1,50}/g) || [text]; // Chunk by 50 chars for simulation
    
    return new ReadableStream({
      async start(controller) {
        for (const chunk of chunks) {
          controller.enqueue(new TextEncoder().encode(chunk));
          await new Promise(r => setTimeout(r, 50)); // Artificial stream delay
        }
        controller.close();
      }
    });
  }

  async checkHealth(): Promise<boolean> {
    return true; // Mock is always healthy
  }
}
