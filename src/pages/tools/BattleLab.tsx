import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Swords, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { workflowRecipes } from "@/data/experienceCatalog";
import { trendingBattles } from "@/data/battles";
import { tools } from "@/data/tools";
import { useWorkspaceStore } from "@/hooks/useWorkspaceStore";
import { setSEO } from "@/utils/seoUtils";
import { toast } from "sonner";

const BattleLab = () => {
  const [itemA, setItemA] = useState("");
  const [itemB, setItemB] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [shareDraft, setShareDraft] = useState("");
  const { saveWorkspaceItem, addRecentItem } = useWorkspaceStore();

  useEffect(() => {
    setSEO({
      title: "Battle Lab | Axevora",
      description: "Explore trending comparisons, build shareable battle copy, and route into Axevora versus tools.",
      keywords: ["battle lab", "versus tool", "comparison generator", "shareable battle"],
      type: "website"
    });
  }, []);

  const categories = ["all", ...Array.from(new Set(trendingBattles.map((battle) => battle.category.toLowerCase())))];
  const filteredBattles = selectedCategory === "all"
    ? trendingBattles
    : trendingBattles.filter((battle) => battle.category.toLowerCase() === selectedCategory);

  const battleWorkflow = workflowRecipes.find((recipe) => recipe.id === "battle-content-pack");
  const versusTools = tools.filter((tool) => ["tech-versus", "software-versus", "nutrition-versus"].includes(tool.id));

  const generatedVerdict = useMemo(() => {
    if (!itemA.trim() || !itemB.trim()) return "";
    return `${itemA} vs ${itemB}: fast verdict draft. Pick the one that wins on your audience's top decision factor, then back it with 3 proof points and a sharp CTA.`;
  }, [itemA, itemB]);

  const buildShareDraft = () => {
    if (!itemA.trim() || !itemB.trim()) {
      toast.error("Dono comparison items enter karo");
      return;
    }

    const text = `${itemA} vs ${itemB}\n\nWinner angle: ${generatedVerdict}\n\nUse Battle Lab + Axevora Versus tools to create the full showdown and share card.`;
    setShareDraft(text);
    saveWorkspaceItem({
      id: `battle-${Date.now()}`,
      title: `${itemA} vs ${itemB}`,
      description: "Share-ready battle draft generated in Battle Lab.",
      path: "/tools/battle-lab",
      type: "battle",
      savedAt: Date.now(),
      relatedIds: ["battle-lab", "tech-versus"]
    });
    addRecentItem({
      id: `battle-recent-${Date.now()}`,
      title: `${itemA} vs ${itemB}`,
      subtitle: "Battle Lab draft generated",
      type: "battle",
      path: "/tools/battle-lab",
      timestamp: Date.now()
    });
    toast.success("Battle draft saved to workspace");
  };

  const copyDraft = async () => {
    if (!shareDraft) return;
    await navigator.clipboard.writeText(shareDraft);
    toast.success("Share draft copied");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b bg-gradient-to-br from-emerald-500/10 via-background to-cyan-500/10">
          <div className="container mx-auto px-4 py-14">
            <Badge variant="outline" className="mb-4 bg-background/80">Comparison Engine 2.0</Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Battle Lab</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Trending battles explore karo, apne comparison drafts banao, aur unhe shareable content format me convert karo. Existing versus tools intact hain; yeh unke upar planning layer hai.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 space-y-10">
          <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Swords className="h-5 w-5 text-primary" /> Draft a Battle</CardTitle>
                <CardDescription>Create a quick winner angle and save it for later publishing.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input value={itemA} onChange={(event) => setItemA(event.target.value)} placeholder="Item A" />
                <Input value={itemB} onChange={(event) => setItemB(event.target.value)} placeholder="Item B" />
                <Button onClick={buildShareDraft}>Generate Share Draft</Button>

                {generatedVerdict && (
                  <div className="rounded-2xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground mb-2">Quick Verdict Angle</p>
                    <p>{generatedVerdict}</p>
                  </div>
                )}

                {shareDraft && (
                  <div className="rounded-2xl border p-4">
                    <p className="font-semibold mb-2">Share Draft</p>
                    <pre className="whitespace-pre-wrap text-sm text-muted-foreground">{shareDraft}</pre>
                    <Button variant="outline" className="mt-4" onClick={copyDraft}>
                      <Copy className="h-4 w-4 mr-2" /> Copy Draft
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Trending Battles</CardTitle>
                <CardDescription>Static trending stack from the current battle dataset, filterable by category.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-5">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      className="capitalize rounded-full"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredBattles.map((battle) => (
                    <div key={battle.id} className="rounded-3xl border p-5">
                      <div className="flex items-center justify-between gap-3">
                        <Badge variant="outline">{battle.category}</Badge>
                        <Badge variant="secondary">Winner: {battle.winner}</Badge>
                      </div>
                      <p className="font-semibold text-lg mt-4">{battle.itemA} vs {battle.itemB}</p>
                      <p className="text-sm text-muted-foreground mt-2">{battle.verdict}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {battle.specs.slice(0, 3).map((spec) => (
                          <Badge key={spec.label} variant="secondary">{spec.label}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Versus Routes</CardTitle>
              <CardDescription>Route into specialized battle engines already available on the platform.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {versusTools.map((tool) => (
                <Link key={tool.id} to={tool.path} className="rounded-2xl border p-5 hover:border-primary/40 transition-colors">
                  <p className="font-semibold">{tool.name}</p>
                  <p className="text-sm text-muted-foreground mt-2">{tool.description}</p>
                </Link>
              ))}
            </CardContent>
          </Card>

          {battleWorkflow && (
            <Card>
              <CardHeader>
                <CardTitle>Battle Publishing Workflow</CardTitle>
                <CardDescription>{battleWorkflow.description}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                {battleWorkflow.steps.map((step) => (
                  <div key={step} className="rounded-2xl border p-4 text-sm text-muted-foreground">{step}</div>
                ))}
              </CardContent>
            </Card>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BattleLab;
