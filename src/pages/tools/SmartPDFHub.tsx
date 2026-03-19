import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookText, FileText, Lightbulb, Loader2, Upload } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { workflowRecipes } from "@/data/experienceCatalog";
import { tools } from "@/data/tools";
import { useWorkspaceStore } from "@/hooks/useWorkspaceStore";
import { setSEO } from "@/utils/seoUtils";
import { toast } from "sonner";

// @ts-expect-error - resolved by bundler at runtime
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();

const stopWords = new Set([
  "the", "and", "for", "that", "with", "this", "from", "have", "your", "into", "you",
  "are", "was", "were", "has", "had", "will", "about", "their", "than", "they", "them",
  "our", "his", "her", "she", "him", "its", "but", "not", "can", "all", "any", "there"
]);

const pdfActionIds = [
  "smart-pdf",
  "chat-with-pdf",
  "pdf-summarizer",
  "pdf-study-notes",
  "pdf-quiz-generator",
  "pdf-translator"
];

const SmartPDFHub = () => {
  const navigate = useNavigate();
  const { savePdfSession, addRecentItem } = useWorkspaceStore();
  const [fileName, setFileName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSEO({
      title: "Smart PDF Hub | Axevora",
      description: "Upload a PDF once, inspect key content, and jump into summary, notes, quiz, translation, or chat workflows.",
      keywords: ["smart pdf hub", "pdf workspace", "pdf study tools", "chat with pdf", "pdf notes"],
      type: "website"
    });
  }, []);

  const pdfActions = tools.filter((tool) => pdfActionIds.includes(tool.id));
  const pdfRecipes = workflowRecipes.filter((recipe) => recipe.category === "pdf");

  const summary = useMemo(() => {
    if (!extractedText) return null;

    const words = extractedText.split(/\s+/).filter(Boolean);
    const topTerms = Array.from(
      words.reduce((acc, word) => {
        const normalized = word.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (normalized.length < 4 || stopWords.has(normalized)) return acc;
        acc.set(normalized, (acc.get(normalized) || 0) + 1);
        return acc;
      }, new Map<string, number>())
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([word]) => word);

    return {
      wordCount: words.length,
      readingMinutes: Math.max(1, Math.round(words.length / 220)),
      preview: extractedText.slice(0, 320),
      topTerms
    };
  }, [extractedText]);

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please select a valid PDF");
      return;
    }

    setLoading(true);
    setFileName(file.name);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      setPageCount(pdf.numPages);

      let text = "";
      const scanPages = Math.min(pdf.numPages, 12);
      for (let pageNumber = 1; pageNumber <= scanPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(" ");
        text += `${pageText}\n`;
      }

      const trimmed = text.trim();
      setExtractedText(trimmed);
      savePdfSession({
        id: `${file.name}-${Date.now()}`,
        fileName: file.name,
        pageCount: pdf.numPages,
        extractedChars: trimmed.length,
        preview: trimmed.slice(0, 220),
        savedAt: Date.now()
      });
      addRecentItem({
        id: `pdf-hub-${Date.now()}`,
        title: `PDF scanned: ${file.name}`,
        subtitle: `${pdf.numPages} pages loaded`,
        type: "pdf",
        path: "/tools/pdf-hub",
        timestamp: Date.now()
      });
      toast.success("PDF scanned and workspace session saved");
    } catch (error) {
      console.error(error);
      toast.error("PDF scan failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b bg-gradient-to-br from-blue-500/10 via-background to-emerald-500/10">
          <div className="container mx-auto px-4 py-14">
            <Badge variant="outline" className="mb-4 bg-background/80">Unified PDF Workspace</Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Smart PDF Hub</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Ek baar PDF upload karo, quick document signal dekho, aur phir summary, notes, quiz, translation, ya chat tools me move karo. Existing PDF AI tools same rehte hain; yeh hub बस orchestration karta hai.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 space-y-10">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5 text-primary" /> Upload Once</CardTitle>
              <CardDescription>Scan up to the first 12 pages locally for preview, terms, and routing.</CardDescription>
            </CardHeader>
            <CardContent>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-primary/20 bg-primary/5 px-6 py-12 text-center transition-colors hover:border-primary/40">
                <Upload className="h-10 w-10 text-primary mb-4" />
                <p className="font-semibold">Choose PDF File</p>
                <p className="text-sm text-muted-foreground mt-2">Secure local scan. No existing tool logic is replaced.</p>
                <input type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
              </label>
              {loading && (
                <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Scanning document...
                </div>
              )}
            </CardContent>
          </Card>

          {summary && (
            <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Document Snapshot</CardTitle>
                  <CardDescription>{fileName} • {pageCount} pages</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border p-4">
                      <p className="text-sm text-muted-foreground">Words</p>
                      <p className="text-2xl font-semibold">{summary.wordCount.toLocaleString()}</p>
                    </div>
                    <div className="rounded-2xl border p-4">
                      <p className="text-sm text-muted-foreground">Read Time</p>
                      <p className="text-2xl font-semibold">{summary.readingMinutes} min</p>
                    </div>
                    <div className="rounded-2xl border p-4">
                      <p className="text-sm text-muted-foreground">Top Terms</p>
                      <p className="text-base font-semibold">{summary.topTerms.slice(0, 2).join(", ") || "n/a"}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border bg-muted/30 p-4">
                    <p className="font-semibold mb-2">Quick Preview</p>
                    <p className="text-sm text-muted-foreground">{summary.preview}...</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {summary.topTerms.map((term) => (
                      <Badge key={term} variant="secondary">{term}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><BookText className="h-5 w-5 text-primary" /> Launch PDF Actions</CardTitle>
                  <CardDescription>Jump into the best-fit PDF AI tools.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  {pdfActions.map((tool) => (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => navigate(tool.path)}
                      className="rounded-2xl border p-4 text-left hover:border-primary/40 hover:bg-muted/30 transition-colors"
                    >
                      <p className="font-semibold">{tool.name}</p>
                      <p className="text-sm text-muted-foreground mt-2">{tool.description}</p>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-primary" /> Ready-Made PDF Recipes</CardTitle>
              <CardDescription>Prebuilt flows you can use after a document scan.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-2">
              {pdfRecipes.map((recipe) => (
                <div key={recipe.id} className="rounded-3xl border p-5">
                  <p className="font-semibold text-lg">{recipe.title}</p>
                  <p className="text-sm text-muted-foreground mt-2">{recipe.description}</p>
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {recipe.steps.map((step) => (
                      <p key={step}>• {step}</p>
                    ))}
                  </div>
                  <Button asChild variant="outline" className="mt-5">
                    <Link to="/tools/ai-command-center">Open in Command Center</Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SmartPDFHub;
