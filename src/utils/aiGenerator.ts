
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
  // 0. Pollinations.ai Integration (Keyless Fallback) - ROBUST GET MODE
  // 0. Hercai Integration (New "Expert" Primary)
  private async generateViaHercai(prompt: string): Promise<string> {
    try {
      console.log(`[BlogGenerator] Trying Hercai AI...`);
      const response = await fetch(`https://hercai.zaidone.com/v2/hercai?question=${encodeURIComponent(prompt)}`);
      if (!response.ok) throw new Error("Hercai API Failed");
      const data = await response.json();
      if (data && data.reply) return data.reply;
      throw new Error("Empty Hercai response");
    } catch (err) {
      console.warn(`[BlogGenerator] Hercai failed, switching to Pollinations...`);
      return this.generateViaPollinations(prompt);
    }
  }

  // 0. Pollinations.ai Integration (Keyless Fallback) - ROBUST GET MODE
  private async generateViaPollinations(prompt: string, retries = 3, systemContext = "You are an expert SEO Blog Writer. Output valid HTML."): Promise<string> {
    try {
      console.log(`[BlogGenerator] Using Pollinations.ai (Keyless Mode/GET) - Attempt ${4 - retries}...`);

      // 1. Strict Length Limit for stability
      const safeSystem = systemContext.slice(0, 500);
      const safePrompt = prompt.slice(0, 1500);

      const combined = `${safeSystem}. User: ${safePrompt}`;
      const encoded = encodeURIComponent(combined);
      const seed = Math.floor(Math.random() * 1000000);

      // Use 'searchgpt' model - specialized for quick web results
      const url = `https://text.pollinations.ai/${encoded}?model=searchgpt&seed=${seed}`;

      const response = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(10000) // 10s is reasonable
      });

      if (!response.ok) {
        if ((response.status >= 500 || response.status === 429) && retries > 0) {
          await new Promise(r => setTimeout(r, 2000));
          return this.generateViaPollinations(prompt, retries - 1, systemContext);
        }
        throw new Error(`Pollinations API Error: ${response.status}`);
      }

      const text = await response.text();

      // Cleanup Pollinations System Notice
      const cleanText = text.replace(/⚠️ \*\*IMPORTANT NOTICE\*\* ⚠️[\s\S]*?work normally\./gi, '').trim();

      // Basic calculation
      if (!cleanText || (cleanText.includes("Error") && cleanText.length < 100)) {
        if (retries > 0) {
          // DO NOT RECURSE if we are already seeing timeouts elsewhere. 
          // Only retry if quick failure.
          // For now, let's just abort retry to be safe and use backup.
          throw new Error("Invalid text from Pollinations");
        }
      }
      return cleanText;

    } catch (error: any) {
      console.error("Pollinations.ai failed:", error);
      if (retries > 0) {
        await new Promise(r => setTimeout(r, 3000));
        return this.generateViaPollinations(prompt, retries - 1, systemContext);
      }
      // Final Fallback (Offline Mode)
      return generateOfflineBackup(prompt); // Uses the same standalone helper
    }
  }

  // Helper to try models until one works
  private async generateWithFallback(prompt: string, systemContext: string = "You are an expert SEO Blog Writer. Output valid HTML."): Promise<string> {
    // 1. If No Gemini Instance (No Key), go straight to Pollinations
    if (!this.genAI) {
      return this.generateViaPollinations(prompt, 3, systemContext);
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
          return this.generateViaPollinations(prompt, 3, systemContext);
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
    return this.generateViaPollinations(prompt, 3, systemContext);
  }

  private async generateImage(prompt: string): Promise<string> {
    // Pollinations with Fallback to abstract pattern if needed (though url is usually valid)
    const encodedPrompt = encodeURIComponent(prompt + " realistic, high quality, 4k");
    const seed = Math.floor(Math.random() * 1000);
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&seed=${seed}`;
  }

  // Helper for UI: Generate Abstract Background if AI fails
  static getBackupImage(topic: string): string {
    const seed = topic.length;
    return `https://picsum.photos/seed/${seed}/800/800?blur=2`;
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
      const text = await this.generateWithFallback(prompt, "You are an expert SEO Strategist. Output valid JSON array.");
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
  private readonly AVAILABLE_TOOLS_LIST = [
    "PDF Converter: /tools/pdf-converter",
    "PDF to JPG: /tools/pdf-to-jpg",
    "Image Compressor: /tools/image-compressor",
    "SEO Analyzer: /tools/seo-analyzer",
    "Website Speed Checker: /tools/website-speed-checker",
    "Password Generator: /tools/password-generator",
    "Text Analyzer: /tools/text-analyzer",
    "AI Text to Image: /tools/text-to-image",
    "QR Generator: /tools/qr-generator",
    "Video Converter: /tools/video-converter"
  ];

  // 2. Write a single section with depth, human touch, and SMART LINKS
  async writeSection(topic: string, sectionTitle: string): Promise<string> {
    // Optimization: Pick 3 random tools to avoid huge prompts that break GET requests
    const shuffled = [...this.AVAILABLE_TOOLS_LIST].sort(() => 0.5 - Math.random());
    const selectedTools = shuffled.slice(0, 3).map(t => "         - " + t).join("\n");

    const prompt = `
      Act as a professional human copywriter with 10 years of experience.
      Write the content for ONE specific section of a blog post about: "${topic}".
      
      Section Title: "${sectionTitle}"
      
      **Writing Style Guidelines (CRITICAL - DO NOT IGNORE):**
      - **TONE:** Write in a 100% human, conversational, and empathetic tone. Pretend you are an expert redditor sharing personal advice.
      - **BANNED AI PHRASES:** "In the ever-evolving landscape", "Delve into", "In conclusion", "It is important to note", "Game-changer", "Unleash", "Elevate", "Unlock", "Realm".
      - **SENTENCE STRUCTURE:** Mix short, punchy sentences with longer, detailed ones. Use fragments occasionally for impact.
      - **HUMAN TOUCH:** Use idioms, rhetorical questions, and (simulated) personal anecdotes like "I remember when I first tried..." or "Trust me, I learned this the hard way...".
      - **PLAGIARISM CHECK:** Ensure every sentence is unique. Do not copy generic descriptions. Rephrase standard definitions in your own unique voice.
      
      **CRITICAL LINKING REQUIREMENTS:**
      1. **INTERNAL LINKS (Priority):** Naturally mention and link to at least 1 relevant tool from the list below if it fits contextually.
         - Use relative paths (e.g., <a href="/tools/seo-analyzer" class="text-primary hover:underline">SEO Analyzer</a>).
         - Available Tools:
${selectedTools}
         
      2. **EXTERNAL LINKS:** Include 1 high-authority external link (Wikipedia, MDN, reputable news) if necessary to back up a claim.
         - Open in new tab: <a href="https://..." target="_blank" rel="noopener noreferrer">Source</a>.

      **Content & SEO Requirements:**
      - **NO KEYWORD STUFFING:** Density under 1.5%. Use LSI keywords.
      - **VALUE FIRST:** Educate the reader. Do not sound like a salesman. Your goal is to solve their problem, not just push a product.
      - **RICH FORMATTING (MANDATORY):** 
        - If you are comparing items, listing pros/cons, or showing specs, you **MUST** include a responsive HTML Table ('<table class="w-full border-collapse border border-gray-300 my-4">...</table>').
        - Use '<ul>' and '<ol>' for lists.
        - Use '<h3>' and '<h4>' for sub-sections.
      - **IMAGES:** I will inject images separately, but you must write the text to support visual breaks.

      **AFFILIATE LINKING Guidelines:**
      - **Scope:** include Tech gadgets, Beauty (skincare, makeup), Fashion (clothes, shoes), Home & Kitchen, Grocery, and Books.
      - **Placement:** Only link when a specific product is naturally discussed as a solution.
      - **Format:** 'https://www.amazon.in/s?k=[Product+Name]&tag=axevora-21'
      - **Style:** <a href="..." target="_blank" rel="noopener noreferrer" class="text-orange-600 font-bold hover:underline">Check Price on Amazon</a>
      - **Anti-Spam:** Max 2 affiliate links per section. Don't force it. If it doesn't fit, don't add it.
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
      // Pollinations free tier: ~1 req/15s. We use 15s to be safe.
      if (i > 0) await new Promise(resolve => setTimeout(resolve, 15000));

      const sectionHeader = outline[i];
      if (onProgress) onProgress(`Writing Section ${i + 1}/${outline.length}: ${sectionHeader}...`);

      const sectionContent = await this.writeSection(topic, sectionHeader);

      // Inject an image every 3 sections
      let imageHtml = "";
      if (i > 0 && i % 3 === 0) {
        const imgUrl = await this.generateImage(`${topic} ${sectionHeader} minimal illustration`);
        imageHtml = `<figure class="my-8">
            <img src="${imgUrl}" alt="Illustration showing ${sectionHeader} regarding ${topic}" class="w-full rounded-lg shadow-md" loading="lazy" />
            <figcaption class="text-center text-sm text-muted-foreground mt-2">Visual Explanation: ${sectionHeader}</figcaption>
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
    const excerptPrompt = `Write a compelling 150-character meta description for a guide about "${topic}". Output ONLY plain text. No HTML.`;
    const excerpt = (await this.generateWithFallback(excerptPrompt, "You are an expert copywriter. Output plain text only.")).trim();

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
// Helper: Fetch website context (Title + Meta Description)
export async function extractUrlContext(input: string): Promise<{ title?: string; description?: string; keywords?: string } | null> {
  const domainRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
  const match = input.match(domainRegex);

  if (!match) return null;

  let url = input;
  if (!url.startsWith('http')) url = 'https://' + url;



  try {
    console.log(`[AI] Browsing: ${url}`);

    // 1. Try CodeTabs Proxy (Very robust)
    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;

    // Note: CodeTabs might require no-cache headers or just simple fetch
    const response = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });

    if (!response.ok) throw new Error("Proxy response not ok");

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const title = doc.querySelector('title')?.innerText.replace(/[^\x00-\x7F]/g, "") || "";
    const rawDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content') || "";
    const metaDesc = rawDesc.replace(/[^\x00-\x7F]/g, "").substring(0, 150);
    const bodyText = doc.body.innerText.replace(/[^\x00-\x7F]/g, "").replace(/\s+/g, ' ').slice(0, 200);

    return { title, description: metaDesc, keywords: bodyText };
  } catch (err) {
    console.warn("[AI] Scraping failed, falling back to inference:", err);

    // 2. FALLBACK: Infer context from domain name!
    const domain = match[2] + '.' + match[3];
    return {
      title: domain,
      description: `Official website of ${domain}.`,
      keywords: domain.replace('.', ' ') + " website brand"
    };
  }
}

// 5. Standalone Generic Generator for Client-Side Tools
// 1. Generic Text Generation (Social Media / Ads) - now supports API KEY
export async function generateGenericText(prompt: string, apiKey?: string): Promise<string | null> {
  // If API Key is provided, use Google Gemini (RELIABLE)

  // If API Key is provided, use Google Gemini (RELIABLE)
  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini API Error:", error);
      // Fallback to Pollinations if Gemini fails (e.g. quota, bad key)
    }
  }

  // Fallback: Pollinations -> Offline (With 4s Race Timeout)
  // This guarantees a result even if the API hangs
  try {
    const generator = new BlogGenerator("");

    const apiPromise = generator['generateViaPollinations'](prompt, 1);

    // Strict 4s Timeout for entire operation
    const timeoutPromise = new Promise<string>((resolve) => {
      setTimeout(() => resolve("TIMEOUT"), 4000);
    });

    const result = await Promise.race([apiPromise, timeoutPromise]);

    if (result === "TIMEOUT" || !result || result.trim().length === 0) {
      console.warn("AI Generation Timed Out (4s) or Failed. Switching to Smart Backup.");
      return generateOfflineBackup(prompt);
    }

    return result;
  } catch (err) {
    console.error("AI Gen Failed completely:", err);
    return generateOfflineBackup(prompt);
  }
}
/* 
 NOTE: In this architecture, it is better if the UI calls extractUrlContext 
 and passes the enriched prompt. But I will leave this function pure 
 and let simple string prompts pass through, assuming the UI did the work 
 or the prompt is simple.
*/

// Fallback: Offline Templates (When APIs fail)
// Fallback: Offline Templates (When APIs fail)
function generateOfflineBackup(prompt: string): string {
  // Extract topic & tone logic
  let topic = "this topic";
  let isDomain = false;
  let tone = "professional";

  // 1. Try to extract topic
  // Supported formats: 'about: "topic"', 'about topic', 'User: topic'
  const topicMatch = prompt.match(/about:? "?(.*?)"?(?=(\.|$| Tone))/i) || prompt.match(/User: (.*)/);
  if (topicMatch && topicMatch[1]) {
    topic = topicMatch[1].replace('site:', '').replace('about:', '').replace('site about', '').trim();
  }

  // 2. Detect Domain
  if (topic.includes('.') || topic.toLowerCase().endsWith('com') || topic.toLowerCase().endsWith('io')) {
    isDomain = true;
    // Clean up domain for display (axevora.com -> Axevora)
    const domainParts = topic.split('.');
    topic = domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
    if (topic.includes(' ')) topic = topic.split(' ')[0];
  }

  // 3. Extract Tone
  const toneMatch = prompt.match(/Tone: (.*?)\./i);
  if (toneMatch) {
    tone = toneMatch[1].toLowerCase();
  }

  // RICH TEMPLATE LIBRARY (Simulates AI)
  // RICH TEMPLATE LIBRARY (Simulates AI)
  // UPDATED: High-Conversion / Promotional / CTA Focus
  // RICH TEMPLATE LIBRARY (Simulates AI)
  // UPDATED: Long-Form / High-Value / Storytelling Copy
  if (isDomain) {
    return [
      `🚀 STOP SCROLLING! If you have been looking for a sign to upgrade your workflow, this is it. ${topic} is the secret weapon that top industry professionals are using to crush their goals in 2025. Don't let your competitors get ahead while you stay stuck. Click the link to see what the hype is about! 👉 ${topic}`,

      `⚠️ URGENT WARNING: The old way of doing things is dead. ${topic} has just rewritten the rules, and early adopters are seeing massive results. If you care about efficiency and growth, you cannot afford to ignore this tool. Join the revolution before it becomes mainstream. 📉 Check it out here: ${topic}`,

      `🔥 DISCOVERY OF THE MONTH: I test a lot of tools, but ${topic} is offering something completely different. It's rare to find a platform that delivers this much value instantly. My productivity has doubled since I started using it. 🤯 You owe it to yourself to experience this. #Recommended #Tech`,

      `💰 MAXIMIZE YOUR ROI: Why work harder when you can work smarter? ${topic} is designed to automate the heavy lifting so you can focus on what matters—scaling your business. It literally pays for itself on day one. 💯 Stop wasting time on hard mode. Try it risk-free today!`,

      `The BEST investment I made this year? It wasn't crypto, it was ${topic}. Seriously. 👇 It solved problems I didn't even know I had. Join thousands of happy users who have already switched and never looked back. Trust me, your future self will thank you. #${topic}`
    ].join(' ||| ');
  } else if (tone.includes("funny")) {
    return [
      `My bank account looking at ${topic} like "Where have you been all my life?!" 💸😂 I used to stress about this stuff, but now it's just too easy. If ${topic} was a person, I'd probably marry them. Don't judge me, just try it.`,

      `If ${topic} was a date, I'd propose on the first night. 💍 It's THAT good. I'm not saying it solves all your life problems, but it definitely solves the big ones. Tag a friend who needs this (we all have that one friend).`,

      `Me trying to explain why ${topic} is amazing to my friends... (They are tired of me talking about it) 🗣️🤣 But seriously, once you see what it does, you can't unsee it. It's like magic, but legal.`,

      `Cancel your other subscriptions. ${topic} is the main character now. 💅✨ I officially broke up with my old tools. It's not you, it's me... actually, no, it IS you. ${topic} is just better.`,

      `Are you living under a rock? 🪨 Go check out ${topic} before it becomes mainstream and I have to say "I told you so." Don't be that person who discovers it last! 🐢`
    ].join("|||");
  } else {
    // Professional / Generic (But still promotional)
    return [
      `Unlock your full potential with ${topic}. 🔑 The #1 Rated solution for professionals who demand excellence. We combine cutting-edge technology with user-centric design to deliver results that matter. Elevate your standard today.`,

      `Why choose the rest when you can have the best? 🌟 Experience the difference with ${topic}. Our platform is engineered for performance, reliability, and scale. Join a community of leaders who refuse to compromise on quality.`,

      `Efficiency. Speed. Results. That is what ${topic} delivers. 💼 In today's fast-paced world, speed is currency. Our tool ensures you stay ahead of the curve with workflows optimized for success. Start your journey with us now.`,

      `Don't settle for average. Upgrade your workflow with ${topic} and watch your results soar. 📈 Whether you are a solo creator or a large enterprise, our solutions scale with your needs. It's time to take your output to the next level.`,

      `Your competitors are arguably already using ${topic}. Are you? 🧐 Stay ahead of the curve by leveraging the most advanced tools on the market. Secure your advantage and future-proof your strategy today.`
    ].join("|||");
  }
}
