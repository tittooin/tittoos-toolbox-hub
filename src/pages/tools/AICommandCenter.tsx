import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bot, Sparkles, Workflow } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MagicBar } from "@/components/MagicBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { workflowRecipes } from "@/data/experienceCatalog";
import { tools } from "@/data/tools";
import { useWorkspaceStore } from "@/hooks/useWorkspaceStore";
import { MagicResult, magicSearch } from "@/services/magicSearchService";
import { setSEO } from "@/utils/seoUtils";
import { toast } from "sonner";

const rankRecipe = (query: string) => {
  const loweredQuery = query.toLowerCase();
  return workflowRecipes
    .map((recipe) => {
      const score = recipe.keywords.reduce((total, keyword) => (
        loweredQuery.includes(keyword) ? total + 2 : total
      ), 0) + (loweredQuery.includes(recipe.title.toLowerCase()) ? 3 : 0);

      return { recipe, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.recipe);
};

const AICommandCenter = () => {
  const [brief, setBrief] = useState("");
  const [toolMatches, setToolMatches] = useState<MagicResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { saveWorkspaceItem, addRecentItem, snapshot } = useWorkspaceStore();

  useEffect(() => {
    setSEO({
      title: "AI Command Center | Axevora",
      description: "Describe the outcome you want and get matched tools, playbooks, and launch-ready Axevora workflows.",
      keywords: ["ai command center", "workflow router", "tool suggestions", "axevora ai command"],
      type: "website"
    });
  }, []);

  const suggestedRecipes = useMemo(
    () => brief.trim() ? rankRecipe(brief).slice(0, 3) : workflowRecipes.slice(0, 3),
    [brief]
  );

  const runMatching = async () => {
    if (!brief.trim()) {
      toast.error("Pehle apna intent ya task likho");
      return;
    }

    setLoading(true);
    try {
      const matches = await magicSearch(brief);
      setToolMatches(matches);
      addRecentItem({
        id: `command-center-${Date.now()}`,
        title: "Intent analyzed in Command Center",
        subtitle: brief,
        type: "workflow",
        path: "/tools/ai-command-center",
        timestamp: Date.now()
      });
      toast.success("Matching tools and flows ready");
    } catch (error) {
      console.error(error);
      toast.error("Tool matching abhi fail hua, dubara try karo");
    } finally {
      setLoading(false);
    }
  };

  const savedWorkflowIds = new Set(snapshot.savedItems.map((item) => item.id));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b bg-gradient-to-br from-violet-500/10 via-background to-cyan-500/10">
          <div className="container mx-auto px-4 py-14">
            <Badge variant="outline" className="mb-4 bg-background/80">Intent-to-Execution Layer</Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">AI Command Center</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mb-8">
              Simple language me batao kya outcome chahiye, aur yeh hub tumhe सही tools, multi-step workflows, aur saveable playbooks de dega.
            </p>
            <MagicBar />
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 space-y-10">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5 text-primary" /> Describe Your Outcome</CardTitle>
              <CardDescription>Examples: `pdf ko study pack me convert karo`, `full creator reel pack chahiye`, `linux command bana do`</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input value={brief} onChange={(event) => setBrief(event.target.value)} placeholder="What do you want to achieve?" className="h-12" />
              <div className="flex flex-wrap gap-3">
                <Button onClick={runMatching} disabled={loading}>{loading ? "Analyzing..." : "Analyze Intent"}</Button>
                <Button variant="outline" onClick={() => setBrief("Mujhe ek reel ke liye script, caption, hashtags aur thumbnail text chahiye")}>Try Creator Example</Button>
                <Button variant="outline" onClick={() => setBrief("PDF ko summary, notes aur quiz me convert karna hai")}>Try PDF Example</Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Suggested Tool Matches</CardTitle>
                <CardDescription>Current search engine aur tool catalog se matched outputs.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {toolMatches.length === 0 ? (
                  <div className="rounded-2xl border border-dashed p-8 text-sm text-muted-foreground">
                    Intent analyze karte hi best-fit tools yahan dikhne lagenge.
                  </div>
                ) : (
                  toolMatches.map((match) => (
                    <Link key={match.toolId} to={match.path} className="flex items-center justify-between rounded-2xl border p-4 hover:border-primary/40 transition-colors">
                      <div>
                        <p className="font-semibold">{match.name}</p>
                        <p className="text-sm text-muted-foreground">{match.reason || "Matched by tool intent routing"}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Workflow className="h-5 w-5 text-primary" /> Workflow Recipes</CardTitle>
                <CardDescription>Recommended multi-step playbooks that layer on top of existing tools.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestedRecipes.map((recipe) => {
                  const firstTool = tools.find((tool) => tool.id === recipe.toolIds[0]);
                  const isSaved = savedWorkflowIds.has(recipe.id);
                  return (
                    <div key={recipe.id} className="rounded-3xl border p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-lg">{recipe.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{recipe.description}</p>
                        </div>
                        <Badge variant="secondary">{recipe.estimatedMinutes} min</Badge>
                      </div>
                      <p className="text-sm mt-3"><span className="font-medium">Outcome:</span> {recipe.outcome}</p>
                      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                        {recipe.steps.map((step) => (
                          <p key={step}>• {step}</p>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {recipe.toolIds.map((toolId) => {
                          const tool = tools.find((item) => item.id === toolId);
                          if (!tool) return null;
                          return <Badge key={toolId} variant="outline">{tool.name}</Badge>;
                        })}
                      </div>
                      <div className="mt-5 flex flex-wrap gap-3">
                        {firstTool && (
                          <Button asChild>
                            <Link to={firstTool.path}>Launch Flow</Link>
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          disabled={isSaved}
                          onClick={() => {
                            saveWorkspaceItem({
                              id: recipe.id,
                              title: recipe.title,
                              description: recipe.description,
                              path: "/tools/ai-command-center",
                              type: "workflow",
                              savedAt: Date.now(),
                              relatedIds: recipe.toolIds
                            });
                            toast.success("Workflow saved to workspace");
                          }}
                        >
                          {isSaved ? "Saved" : "Save Workflow"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AICommandCenter;
