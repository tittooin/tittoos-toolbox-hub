import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarRange, Clapperboard, Sparkles, WandSparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { creatorPlaybooks } from "@/data/experienceCatalog";
import { tools } from "@/data/tools";
import { useWorkspaceStore } from "@/hooks/useWorkspaceStore";
import { setSEO } from "@/utils/seoUtils";
import { toast } from "sonner";

const creatorToolIds = [
  "ai-caption-generator",
  "ai-hashtag-generator",
  "ai-reel-script-generator",
  "ai-thumbnail-text-generator",
  "ai-bio-generator",
  "thumbnail-generator",
  "social-scheduler"
];

const CreatorStudio = () => {
  const { saveWorkspaceItem, addRecentItem, snapshot } = useWorkspaceStore();
  const [brand, setBrand] = useState("");
  const [platform, setPlatform] = useState("Instagram Reels");
  const [goal, setGoal] = useState("");
  const [tone, setTone] = useState("High-energy and clear");
  const [generatedPlan, setGeneratedPlan] = useState<string[]>([]);

  useEffect(() => {
    setSEO({
      title: "Creator Studio | Axevora",
      description: "Run creator campaigns with captions, scripts, hashtags, thumbnails, and reusable playbooks from one unified studio.",
      keywords: ["creator studio", "caption generator", "thumbnail workflow", "content playbook", "campaign planning"],
      type: "website"
    });
  }, []);

  const creatorTools = tools.filter((tool) => creatorToolIds.includes(tool.id));
  const savedCreatorPlans = snapshot.savedItems.filter((item) => item.type === "creator");

  const buildPlan = () => {
    const safeBrand = brand.trim() || "Your brand";
    const safeGoal = goal.trim() || "increase publish consistency";

    const steps = [
      `Define the angle for ${safeBrand} on ${platform} with a ${tone.toLowerCase()} voice.`,
      `Generate a hook-first script that supports the goal: ${safeGoal}.`,
      "Create a caption with one clear CTA and supporting hashtags.",
      "Draft thumbnail text and visual direction that matches the campaign angle.",
      "Schedule one hero post plus one follow-up teaser using the same idea."
    ];

    setGeneratedPlan(steps);
    const id = `creator-plan-${Date.now()}`;
    saveWorkspaceItem({
      id,
      title: `${safeBrand} Creator Plan`,
      description: `${platform} campaign focused on ${safeGoal}.`,
      path: "/creator-studio",
      type: "creator",
      savedAt: Date.now(),
      relatedIds: creatorToolIds
    });
    addRecentItem({
      id,
      title: `${safeBrand} campaign plan`,
      subtitle: `${platform} • ${safeGoal}`,
      type: "creator",
      path: "/creator-studio",
      timestamp: Date.now()
    });
    toast.success("Creator plan saved to workspace");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b bg-gradient-to-br from-amber-500/10 via-background to-rose-500/10">
          <div className="container mx-auto px-4 py-14">
            <Badge variant="outline" className="mb-4 bg-background/80">New Campaign Layer</Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Creator Studio</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Existing creator tools ko ek publish-ready system me convert kiya gaya hai. Yahan se tum idea brief likh kar scripts, captions, hashtags, thumbnails, aur scheduling playbooks tak jump kar sakte ho.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 space-y-10">
          <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><WandSparkles className="h-5 w-5 text-primary" /> Campaign Brief Builder</CardTitle>
                <CardDescription>Build a reusable content plan and save it into the workspace.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input value={brand} onChange={(event) => setBrand(event.target.value)} placeholder="Brand, channel, or campaign name" />
                <Input value={platform} onChange={(event) => setPlatform(event.target.value)} placeholder="Target platform" />
                <Input value={tone} onChange={(event) => setTone(event.target.value)} placeholder="Desired tone" />
                <Textarea value={goal} onChange={(event) => setGoal(event.target.value)} placeholder="Goal or campaign objective" rows={4} />
                <Button onClick={buildPlan}>Generate Studio Plan</Button>

                {generatedPlan.length > 0 && (
                  <div className="rounded-3xl border bg-muted/30 p-5">
                    <p className="font-semibold mb-3">Generated Plan</p>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      {generatedPlan.map((step, index) => (
                        <div key={step} className="flex gap-3">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clapperboard className="h-5 w-5 text-primary" /> Creator Command Deck</CardTitle>
                <CardDescription>Jump straight into the existing tools without changing their logic.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {creatorTools.map((tool) => (
                  <Link key={tool.id} to={tool.path} className="rounded-2xl border p-4 hover:border-primary/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-primary/10 p-2">
                        <tool.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{tool.name}</p>
                        <p className="text-sm text-muted-foreground">{tool.subheading}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Creator Playbooks</CardTitle>
              <CardDescription>Multi-step launch packs built on top of the tools you already have.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-3">
              {creatorPlaybooks.map((playbook) => {
                const firstTool = tools.find((tool) => tool.id === playbook.toolIds[0]);
                return (
                  <div key={playbook.id} className="rounded-3xl border p-5">
                    <p className="font-semibold text-lg">{playbook.title}</p>
                    <p className="text-sm text-muted-foreground mt-2">{playbook.description}</p>
                    <p className="text-sm mt-4"><span className="font-medium">Goal:</span> {playbook.goal}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {playbook.deliverables.map((deliverable) => (
                        <Badge key={deliverable} variant="secondary">{deliverable}</Badge>
                      ))}
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                      {playbook.steps.map((step) => (
                        <p key={step}>• {step}</p>
                      ))}
                    </div>
                    <div className="mt-5 flex gap-3">
                      {firstTool && (
                        <Button asChild>
                          <Link to={firstTool.path}>Start Pack</Link>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => {
                          saveWorkspaceItem({
                            id: playbook.id,
                            title: playbook.title,
                            description: playbook.description,
                            path: "/creator-studio",
                            type: "creator",
                            savedAt: Date.now(),
                            relatedIds: playbook.toolIds
                          });
                          toast.success("Playbook saved to workspace");
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2"><CalendarRange className="h-5 w-5 text-primary" /> Saved Creator Presets</CardTitle>
                <CardDescription>Whatever you save from this studio lands here and in the workspace dashboard.</CardDescription>
              </div>
              <Button asChild variant="outline">
                <Link to="/workspace">Open Workspace</Link>
              </Button>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {savedCreatorPlans.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-8 text-sm text-muted-foreground md:col-span-2">
                  Koi creator preset save nahi hua hai abhi. Upar brief builder ya playbooks use karke save kar sakte ho.
                </div>
              ) : (
                savedCreatorPlans.map((item) => (
                  <div key={item.id} className="rounded-2xl border p-4">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                    <Button asChild variant="outline" size="sm" className="mt-4">
                      <Link to={item.path || "/workspace"}>Open</Link>
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CreatorStudio;
