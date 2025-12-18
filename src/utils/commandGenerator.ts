
import { GoogleGenerativeAI } from "@google/generative-ai";

export class CommandGenerator {
    private genAI: GoogleGenerativeAI | null = null;

    constructor(apiKey?: string) {
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
        }
    }

    // Pollinations.ai Keyless Fallback
    private async generateViaPollinations(prompt: string, retries = 3): Promise<string> {
        try {
            const encodedPrompt = encodeURIComponent(prompt);
            const seed = Math.floor(Math.random() * 1000000);
            const url = `https://text.pollinations.ai/${encodedPrompt}?model=openai&seed=${seed}`;

            const response = await fetch(url, {
                method: 'GET',
                signal: AbortSignal.timeout(30000)
            });

            if (!response.ok) {
                if ((response.status >= 500 || response.status === 429) && retries > 0) {
                    await new Promise(r => setTimeout(r, 2000));
                    return this.generateViaPollinations(prompt, retries - 1);
                }
                throw new Error(`Pollinations API Error: ${response.status}`);
            }

            return await response.text();
        } catch (error) {
            if (retries > 0) {
                await new Promise(r => setTimeout(r, 2000));
                return this.generateViaPollinations(prompt, retries - 1);
            }
            throw error;
        }
    }

    async generateCommand(userRequest: string, osContext: string): Promise<string> {
        const systemPrompt = `
      Act as an expert SysAdmin and DevOps Engineer.
      The user wants a command line solution for: "${osContext}".
      User Request: "${userRequest}"

      RETURN ONLY A JSON OBJECT with this exact structure:
      {
        "command": "the exact command string",
        "explanation": "A short, 1-2 sentence explanation of what the flags do.",
        "dangerLevel": "safe" | "moderate" | "high"
      }

      Do not wrap in markdown code blocks. Just the raw JSON string.
    `;

        // Try Gemini if Key exists, else Pollinations
        if (this.genAI) {
            try {
                const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const result = await model.generateContent(systemPrompt);
                return result.response.text();
            } catch (e) {
                console.warn("Gemini failed, falling back to Pollinations");
            }
        }

        return this.generateViaPollinations(systemPrompt);
    }
}
