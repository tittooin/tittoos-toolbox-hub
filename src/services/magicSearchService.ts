
import { tools } from "@/data/tools";
import { generateGenericText } from "@/utils/aiGenerator";

export interface MagicResult {
    toolId: string;
    name: string;
    path: string;
    confidence: number;
    reason?: string;
}

// Pre-compute searchable terms for fast fuzzy matching
const searchIndex = tools.map(tool => ({
    id: tool.id,
    name: tool.name.toLowerCase(),
    description: tool.description.toLowerCase(),
    keywords: (tool as any).keywords?.map((k: string) => k.toLowerCase()) || [],
    category: tool.category.toLowerCase(),
    path: tool.path
}));

export async function magicSearch(query: string): Promise<MagicResult[]> {
    const normalizedQuery = query.toLowerCase().trim();
    const queryWords = normalizedQuery.split(/\s+/);

    // 1. Exact/Keyword Match (Improved)
    const matches: MagicResult[] = [];

    for (const item of searchIndex) {
        let score = 0;

        // Exact name match
        if (item.name === normalizedQuery) score += 1.0;
        else if (item.name.includes(normalizedQuery)) score += 0.8;

        // Word-based match for name, description, and keywords
        const nameWords = item.name.split(/\s+/);
        const keywordMatches = queryWords.filter(qw =>
            item.keywords.some((k: string) => k === qw || (qw.length > 2 && k.includes(qw)))
        );

        const generalMatches = queryWords.filter(qw =>
            nameWords.some(nw => nw.includes(qw)) ||
            item.description.includes(qw)
        );

        if (keywordMatches.length > 0) {
            // Highly specific boost for local keywords
            score += 0.7 + (keywordMatches.length / queryWords.length) * 0.3;
        } else if (generalMatches.length > 0) {
            score += (generalMatches.length / queryWords.length) * 0.5;
        }

        // Boost for specific common shorthand/aliases (e.g. "bg" for "background")
        const isBBSearch = (normalizedQuery === "bg" || normalizedQuery.includes(" bg ") || normalizedQuery.startsWith("bg ") || normalizedQuery.endsWith(" bg"));
        if (isBBSearch && item.id.includes("background")) score += 0.9;
        if (normalizedQuery.includes("pdf") && item.path.includes("pdf")) score += 0.5;
        if (normalizedQuery.includes("image") && item.path.includes("image")) score += 0.5;
        if (normalizedQuery.includes("game") && item.category === "games") score += 0.3; // Slightly lowered to avoid generic hijacking
        if (normalizedQuery.includes("youtube") && item.keywords.includes("youtube")) score += 0.8;
        if (normalizedQuery.includes("pool") && item.keywords.includes("pool")) score += 0.9; // Direct noun boost
        if ((normalizedQuery.includes("bubble") || normalizedQuery.includes("shooter")) && item.id === "pool-shooter") score += 0.8;

        // Semantic boosts for new tools
        if ((normalizedQuery.includes("remix") || normalizedQuery.includes("summarize") || normalizedQuery.includes("rewrite")) && item.id === "ai-remix-suite") score += 0.9;
        if ((normalizedQuery.includes("read pdf") || normalizedQuery.includes("explain pdf") || normalizedQuery.includes("chat pdf")) && item.id === "smart-pdf") score += 0.9;

        if (score > 0.35) {
            const tool = tools.find(t => t.id === item.id);
            if (tool) {
                matches.push({
                    toolId: item.id,
                    name: tool.name,
                    path: item.path,
                    confidence: Math.min(score, 1)
                });
            }
        }
    }

    // Sort by confidence
    matches.sort((a, b) => b.confidence - a.confidence);

    // 2. AI Fallback (If no high confidence match found)
    if (matches.length === 0 || matches[0].confidence < 0.85) {
        try {
            // Filter tools to those that might be relevant to keep the prompt small
            const filteredTools = tools.filter(t =>
                queryWords.some(qw =>
                    t.name.toLowerCase().includes(qw) ||
                    t.id.toLowerCase().includes(qw) ||
                    (t as any).keywords?.some((k: string) => k.toLowerCase().includes(qw)) ||
                    t.category.toLowerCase().includes(qw)
                )
            ).slice(0, 100);

            // If still empty, use a curated list of top tools
            const finalCandidateList = filteredTools.length > 5 ? filteredTools : tools.slice(0, 80);

            const toolList = finalCandidateList.map(t => `${t.id}: ${t.name}`).join(", ");
            const prompt = `
        User Request: "${query}"
        Relevant Candidates: ${toolList}
        
        Task: Which tool ID best fits the request? 
        If it's for background removal, use 'image-background-remover'.
        If it's for remixing/summarizing, use 'ai-remix-suite'.
        Return ONLY the toolId. If no match, return "not_found".
      `;

            const aiResponse = await generateGenericText(prompt, "You are a professional tool router for Axevora.");
            const suggestedId = aiResponse.trim().split(/[\s,]+/)[0].toLowerCase();

            const suggestedTool = tools.find(t => t.id === suggestedId);
            if (suggestedTool) {
                matches.unshift({
                    toolId: suggestedTool.id,
                    name: suggestedTool.name,
                    path: suggestedTool.path,
                    confidence: 0.95,
                    reason: "AI Insight"
                });
            }
        } catch (e) {
            console.warn("Magic AI Search failed:", e);
        }
    }

    // Deduplicate and return top 3
    const unique = Array.from(new Set(matches.map(m => m.toolId)))
        .map(id => matches.find(m => m.toolId === id)!)
        .slice(0, 3);

    return unique;
}
