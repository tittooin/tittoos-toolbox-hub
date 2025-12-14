
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
// Note: We need to point to the worker file. 
// In a Vite environment, we often need to copy the worker or use a CDN.
// For simplicity in this setup, we'll try using the CDN for the worker if local resolution fails,
// or rely on the bundler to handle 'pdfjs-dist/build/pdf.worker.mjs'.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export interface AIResponse {
    text: string;
    error?: string;
}

export class PDFHelper {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    /**
     * Extracts text from a PDF file
     */
    async extractText(file: File): Promise<string> {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const doc = await loadingTask.promise;

            let fullText = '';

            // Limit to first 20 pages to avoid context window explosion for now
            // or we can implement chunking later.
            const maxPages = Math.min(doc.numPages, 20);

            for (let i = 1; i <= maxPages; i++) {
                const page = await doc.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                fullText += `Page ${i}:\n${pageText}\n\n`;
            }

            return fullText;
        } catch (error) {
            console.error("PDF Extraction Failed:", error);
            throw new Error("Failed to read PDF content. Please ensure it is a valid text-based PDF.");
        }
    }

    /**
     * General Chat with PDF
     */
    async chatWithPDF(pdfText: string, question: string, history: string[] = []): Promise<AIResponse> {
        try {
            // Construct a memory/history context
            // We will perform a simple context injection method.
            // For very large PDFs, RAG (Retrieval Augmented Generation) would be needed,
            // but for this MVP, we inject the text directly (Gemini 1.5 has large context).

            const prompt = `
        You are an intelligent PDF Assistant.
        
        CONTEXT (PDF CONTENT):
        """
        ${pdfText}
        """

        INSTRUCTIONS:
        Answer the user's question based ONLY on the context above.
        If the answer is not in the context, say "I couldn't find that information in the document."
        Keep answers concise and professional.
        
        USER QUESTION: "${question}"
      `;

            const result = await this.model.generateContent(prompt);
            return { text: result.response.text() };
        } catch (error: any) {
            return { text: "", error: error.message };
        }
    }

    /**
     * Summarize PDF
     */
    async summarizePDF(pdfText: string, length: 'short' | 'medium' | 'detailed' = 'medium'): Promise<AIResponse> {
        try {
            const prompt = `
        Act as a professional summarizer.
        Analyze the following document text and provide a ${length} summary.
        
        - Short: A few bullet points highlighting key takeaways.
        - Medium: A structured summary with main points and conclusion (approx 300 words).
        - Detailed: A comprehensive breakdown of every section (approx 600-800 words).

        DOCUMENT TEXT:
        """
        ${pdfText}
        """
      `;

            const result = await this.model.generateContent(prompt);
            return { text: result.response.text() };
        } catch (error: any) {
            return { text: "", error: error.message };
        }
    }

    /**
     * Generate Quiz
     */
    async generateQuiz(pdfText: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<AIResponse> {
        try {
            const prompt = `
        Create a ${difficulty} difficulty quiz based on the following text.
        Generate 5 Multiple Choice Questions.
        
        Output Format (JSON):
        [
          {
            "question": "Question text?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0 // Index of correct option
          }
        ]

        Do NOT output markdown. Just the raw JSON.

        DOCUMENT TEXT:
        """
        ${pdfText}
        """
      `;

            const result = await this.model.generateContent(prompt);
            let text = result.response.text();
            // Cleanup markdown if present
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();

            return { text: text };
        } catch (error: any) {
            return { text: "", error: error.message };
        }
    }

    /**
     * Generate Study Notes
     */
    async generateStudyNotes(pdfText: string): Promise<AIResponse> {
        try {
            const prompt = `
        Create high-quality study notes from this document.
        Structure:
        1. Key Concepts (Definitions)
        2. Important Dates/Figures (if any)
        3. Core Arguments/Theories
        4. Summary Checklist
        
        Use Markdown formatting with bolding and bullet points.

        DOCUMENT TEXT:
        """
        ${pdfText}
        """
      `;

            const result = await this.model.generateContent(prompt);
            return { text: result.response.text() };
        } catch (error: any) {
            return { text: "", error: error.message };
        }
    }
}
