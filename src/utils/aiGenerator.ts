
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface BlogPostGenerated {
  title: string;
  content: string; // HTML
  excerpt: string;
  slug: string;
  readTime: string;
  metaDescription: string;
  tags: string[];
  date?: string;
  id?: number | string;
  image?: string;
}

export class BlogGenerator {
  private genAI: GoogleGenerativeAI;
  private preferredModelName: string | null = null;
  private readonly MODEL_CANDIDATES = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro"
  ];

  constructor(apiKey: string) {
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  // 0. Pollinations.ai Integration (Keyless Fallback)
  private async generateViaPollinations(prompt: string): Promise<string> {
    try {
      console.log("[BlogGenerator] Using Pollinations.ai (Keyless Mode/GET)...");
      // Use GET request to avoid CORS preflight issues with POST JSON
      // Construct URL: https://text.pollinations.ai/URL_ARGUMENT?model=openai&seed=...
      // We prepend the system instruction to the prompt since we can't send messages array in GET easily.
      const systemContext = "You are an expert SEO Blog Writer. Output valid HTML.";
      const finalPrompt = `${systemContext}\n\nUser: ${prompt}`;

      const encodedPrompt = encodeURIComponent(finalPrompt);
      const seed = Math.floor(Math.random() * 1000);
      const url = `https://text.pollinations.ai/${encodedPrompt}?model=openai&seed=${seed}`;

      const response = await fetch(url, {
        method: 'GET', // Explicitly GET
        // No custom headers to keep it a "Simple Request" (avoids preflight if possible)
      });

      if (!response.ok) {
        throw new Error(`Pollinations API Error: ${response.statusText}`);
      }

      const text = await response.text();
      return text;
    } catch (error) {
      console.error("Pollinations.ai failed:", error);
      throw error;
    }
  }

  // Helper to try models until one works
  private async generateWithFallback(prompt: string): Promise<string> {
    // 1. If No Gemini Instance (No Key), go straight to Pollinations
    if (!this.genAI) {
      return this.generateViaPollinations(prompt);
    }

    const candidates = this.preferredModelName
      ? [this.preferredModelName, ...this.MODEL_CANDIDATES.filter(m => m !== this.preferredModelName)]
      : this.MODEL_CANDIDATES;

    let lastError = null;

    for (const modelName of candidates) {
      try {
        const model = this.genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // If successful, remember this model
        if (!this.preferredModelName) {
          console.log(`[BlogGenerator] Successfully connected to model: ${modelName}`);
          this.preferredModelName = modelName;
        }
        return text;
      } catch (error: any) {
        // CRITICAL: If Auth fails, Drop to Pollinations immediately
        if (error.message.includes("403") || error.message.includes("API key")) {
          console.warn(`[BlogGenerator] Gemini Auth Failed (${error.message}). Falling back to Pollinations.ai...`);
          return this.generateViaPollinations(prompt);
        }

        // Handle Rate Limiting (429) -> Try next Gemini Model
        if (error.message.includes("429") || error.message.includes("Quota exceeded")) {
          console.warn(`[BlogGenerator] Rate limit hit for ${modelName}. Switching to next model...`);
          // Don't retry same model 3 times on free tier, just move to next candidate immediately
          // This allows "Rapid Failover" to other free models
        } else {
          console.warn(`[BlogGenerator] Model ${modelName} failed: ${error.message}`);
        }
        lastError = error;
      }
    }

    // If All Gemini Models Failed (Rate Limits etc), Final Fallback to Pollinations
    console.warn("[BlogGenerator] All Gemini models failed. Falling back to Pollinations.ai...");
    return this.generateViaPollinations(prompt);
  }

  private async generateImage(prompt: string): Promise<string> {
    // Using Pollinations.ai for free, unlimited image generation
    const encodedPrompt = encodeURIComponent(prompt + " realistic, high quality, 4k");
    const seed = Math.floor(Math.random() * 1000);
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&seed=${seed}`;
  }

  // 1. Generate an outline for a 1500-2000 word post
  async generateOutline(topic: string): Promise<string[]> {
    const prompt = `
      Act as an expert SEO Strategist and Content Architect.
      Create a comprehensive, detailed outline for a high-quality blog post about: "${topic}".
      The goal is to write a focused 1500-2000 word guide.
      
      Requirements:
      - 6-8 main section headers (H2 level).
      - Include "Introduction", "What is [Topic]?", "Benefits", "Step-by-Step Guide", "Common Mistakes", and "Conclusion".
      - Return ONLY the list of section titles as a JSON string array. Python list format.
      - Do not include any other text.
    `;

    try {
      const text = await this.generateWithFallback(prompt);
      // rigorous cleanup to get just the array
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("Error generating outline:", error);
      // Fallback outline if AI fails completely (keeps system robust)
      return [
        `Introduction to ${topic}`,
        `Understanding the Basics of ${topic}`,
        `Key Benefits of ${topic}`,
        `How to Get Started with ${topic}`,
        `Common Mistakes to Avoid in ${topic}`,
        `Top Tools and Resources for ${topic}`,
        `Frequently Asked Questions about ${topic}`,
        `Conclusion`
      ];
    }
  }

  // ... (keeping tools list same) ...
  private readonly AVAILABLE_TOOLS = `
    - PDF Converter: /tools/pdf-converter
    - PDF to JPG: /tools/pdf-to-jpg
    - Image Compressor: /tools/image-compressor
    - SEO Analyzer: /tools/seo-analyzer
    - Website Speed Checker: /tools/website-speed-checker
    - Password Generator: /tools/password-generator
    - Text Analyzer: /tools/text-analyzer
    - AI Text to Image: /tools/text-to-image
    - QR Generator: /tools/qr-generator
    - Video Converter: /tools/video-converter
  `;

  // 2. Write a single section with depth, human touch, and SMART LINKS
  async writeSection(topic: string, sectionTitle: string): Promise<string> {
    const prompt = `
      Act as a professional human copywriter with 10 years of experience.
      Write the content for ONE specific section of a blog post about: "${topic}".
      
      Section Title: "${sectionTitle}"
      
      Start with a strong, engaging opening.
      
      **CRITICAL LINKING REQUIREMENTS:**
      1. **INTERNAL LINKS (Priority):** Naturally mention and link to at least 1 relevant tool from the list below if it fits contextually.
         - Use relative paths (e.g., <a href="/tools/seo-analyzer" class="text-primary hover:underline">SEO Analyzer</a>).
         - Available Tools:
         ${this.AVAILABLE_TOOLS}
         
      2. **EXTERNAL LINKS:** Include 1 high-authority external link (Wikipedia, MDN, reputable news) if necessary to back up a claim.
         - Open in new tab: <a href="https://..." target="_blank" rel="noopener noreferrer">Source</a>.

      **Content Requirements:**
      - Write approximately 250-300 words for this section.
      - Use a conversational, engaging, and professional tone (Human touch).
      - Use "You" and "We" to build connection.
      - Include bullet points or bold text for readability.
      - Target low-competition long-tail keywords naturally.
      - Output valid HTML (p, ul, li, h3, h4, strong, a). Do NOT output the H2 title.
      - Do NOT use markdown code blocks. Just raw HTML content.
    `;

    const text = await this.generateWithFallback(prompt);
    return text.replace(/```html/g, '').replace(/```/g, '');
  }

  // 3. Generate FAQ Section
  async generateFAQ(topic: string): Promise<string> {
    const prompt = `
      Generate a FAQ section for a blog post about "${topic}".
      - Create 5-7 unique, high-value questions that users actually ask.
      - Provide detailed answers (50-100 words each).
      - Output as HTML: <div class="faq-item"><h3>Question?</h3><p>Answer</p></div>
    `;
    const text = await this.generateWithFallback(prompt);
    return text.replace(/```html/g, '').replace(/```/g, '');
  }

  // 4. Main Orchestrator
  async generateFullPost(topic: string, onProgress?: (status: string) => void): Promise<BlogPostGenerated> {
    if (onProgress) onProgress("Drafting comprehensive outline...");
    const outline = await this.generateOutline(topic);

    let fullContentHtml = "";

    // Intro
    if (onProgress) onProgress("Writing Introduction...");
    const intro = await this.writeSection(topic, "Introduction: Hook the reader and explain why this guide is the only one they need.");
    const introImg = await this.generateImage(`${topic} header cinematic`);
    fullContentHtml += `<img src="${introImg}" alt="${topic} Guide" class="w-full h-96 object-cover rounded-xl mb-8 shadow-lg" />`;
    fullContentHtml += `<div class="introduction text-lg leading-relaxed mb-8">${intro}</div>`;

    // Table of Contents
    fullContentHtml += `<div class="bg-muted/30 p-6 rounded-lg mb-12">
      <h3 class="text-xl font-bold mb-4">Table of Contents</h3>
      <ul class="space-y-2">
        ${outline.map((h, i) => `<li><a href="#section-${i}" class="text-primary hover:underline">${h}</a></li>`).join('')}
      </ul>
    </div>`;

    // Sections
    for (let i = 0; i < outline.length; i++) {
      // Small delay to prevent rate limiting bursting
      if (i > 0) await new Promise(resolve => setTimeout(resolve, 5000));

      const sectionHeader = outline[i];
      if (onProgress) onProgress(`Writing Section ${i + 1}/${outline.length}: ${sectionHeader}...`);

      const sectionContent = await this.writeSection(topic, sectionHeader);

      // Inject an image every 3 sections
      let imageHtml = "";
      if (i > 0 && i % 3 === 0) {
        const imgUrl = await this.generateImage(`${topic} ${sectionHeader} minimal illustration`);
        imageHtml = `<figure class="my-8">
            <img src="${imgUrl}" alt="${sectionHeader} - ${topic}" class="w-full rounded-lg shadow-md" />
            <figcaption class="text-center text-sm text-muted-foreground mt-2">${sectionHeader} Visualization</figcaption>
         </figure>`;
      }

      fullContentHtml += `
        <div id="section-${i}" class="blog-section mb-12">
          <h2 class="text-3xl font-bold mb-6 text-foreground">${sectionHeader}</h2>
          ${imageHtml}
          <div class="prose-content text-lg text-muted-foreground">
            ${sectionContent}
          </div>
        </div>
      `;
    }

    // FAQ
    if (onProgress) onProgress("Generating FAQs...");
    const faqContent = await this.generateFAQ(topic);
    fullContentHtml += `
      <div class="faq-section mt-16 pt-8 border-t">
        <h2 class="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
        <div class="space-y-6">${faqContent}</div>
      </div>
    `;

    // Metadata Generation
    const excerptPrompt = `Write a compelling 150-character meta description for a guide about "${topic}".`;
    const excerpt = (await this.generateWithFallback(excerptPrompt)).trim();

    return {
      title: topic, // Or ask AI for a clickbait title
      content: fullContentHtml,
      excerpt: excerpt,
      slug: topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      readTime: "8 min read", // Estimate based on 1500-2000 words
      metaDescription: excerpt,
      tags: [topic.split(' ')[0], "Guide", "2025", "Tutorial"],
      image: introImg
    };
  }
}
