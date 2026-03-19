import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AppWindow, Clock3, FolderHeart, Layers3, Sparkles, Star, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tools } from "@/data/tools";
import { workflowRecipes } from "@/data/experienceCatalog";
import { useWorkspaceStore } from "@/hooks/useWorkspaceStore";
import { setSEO } from "@/utils/seoUtils";

const WorkspaceDashboard = () => {
  const { snapshot, favoriteIds, toggleFavorite, removeWorkspaceItem, clearRecentItems } = useWorkspaceStore();

  useEffect(() => {
    setSEO({
      title: "Workspace Dashboard | Axevora",
      description: "Manage favorites, recent jobs, installed templates, and saved workflows in your Axevora workspace.",
      keywords: ["axevora workspace", "saved tools", "favorites", "recent tools", "workflow dashboard"],
      type: "website"
    });
  }, []);

  const favoriteTools = tools.filter((tool) => favoriteIds.has(tool.id));
  const savedTemplates = snapshot.savedItems.filter((item) => item.type === "template");
  const savedWorkflows = snapshot.savedItems.filter((item) => item.type === "workflow");
  const creatorPresets = snapshot.savedItems.filter((item) => item.type === "creator");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container mx-auto px-4 py-14">
            <div className="max-w-5xl">
              <Badge variant="outline" className="mb-4 bg-background/80">Your Personal Control Room</Badge>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Workspace Dashboard</h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                Favorites, recents, saved playbooks, installed packs, and PDF sessions sab ek jagah. Yeh layer existing tools ke upar kaam karti hai, isliye tumhare current flows bilkul same rahenge.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4 mt-10">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Favorite Tools</CardDescription>
                  <CardTitle className="text-3xl">{favoriteTools.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Recent Activity</CardDescription>
                  <CardTitle className="text-3xl">{snapshot.recents.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Saved Workflows</CardDescription>
                  <CardTitle className="text-3xl">{savedWorkflows.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>PDF Sessions</CardDescription>
                  <CardTitle className="text-3xl">{snapshot.pdfSessions.length}</CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 space-y-10">
          <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2"><Clock3 className="h-5 w-5 text-primary" /> Recent Activity</CardTitle>
                  <CardDescription>Auto-captured whenever you launch new hubs or supported tool pages.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={clearRecentItems}>Clear</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {snapshot.recents.length === 0 ? (
                  <div className="rounded-2xl border border-dashed p-8 text-sm text-muted-foreground">
                    Abhi koi recent job nahi hai. Kisi tool ya workflow hub ko open karoge to woh yahan aa jayega.
                  </div>
                ) : (
                  snapshot.recents.map((item) => (
                    <Link
                      key={item.id}
                      to={item.path || "/tools"}
                      className="flex items-start justify-between rounded-2xl border p-4 hover:border-primary/40 hover:bg-muted/40 transition-colors"
                    >
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        {item.subtitle && <p className="text-sm text-muted-foreground mt-1">{item.subtitle}</p>}
                      </div>
                      <Badge variant="secondary" className="capitalize">{item.type}</Badge>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FolderHeart className="h-5 w-5 text-primary" /> Installed & Saved</CardTitle>
                <CardDescription>Reusable packs and shortcuts saved from the new feature layer.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[...savedTemplates, ...savedWorkflows, ...creatorPresets].length === 0 ? (
                  <div className="rounded-2xl border border-dashed p-8 text-sm text-muted-foreground">
                    Marketplace ya workflow hubs se koi pack save karo, woh yahan mil jayega.
                  </div>
                ) : (
                  [...savedTemplates, ...savedWorkflows, ...creatorPresets].map((item) => (
                    <div key={item.id} className="rounded-2xl border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeWorkspaceItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {item.path && (
                        <Button asChild variant="outline" size="sm" className="mt-3">
                          <Link to={item.path}>Open</Link>
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5 text-primary" /> Favorite Tools</CardTitle>
                <CardDescription>Pin your daily-use tools here from All Tools or any supported tool page.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {favoriteTools.length === 0 ? (
                  <div className="rounded-2xl border border-dashed p-8 text-sm text-muted-foreground md:col-span-2">
                    Favorites abhi empty hain. `All Tools` ya kisi tool page par star/favorite toggle use karo.
                  </div>
                ) : (
                  favoriteTools.map((tool) => (
                    <Card key={tool.id} className="border-primary/10">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-primary/10 p-2">
                              <tool.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{tool.name}</CardTitle>
                              <CardDescription>{tool.subheading}</CardDescription>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => toggleFavorite(tool.id)}>
                            <Star className="h-4 w-4 fill-current text-yellow-500" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                        <Button asChild className="mt-4">
                          <Link to={tool.path}>Open Tool</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Layers3 className="h-5 w-5 text-primary" /> PDF Sessions</CardTitle>
                <CardDescription>Saved document snapshots from the Smart PDF Hub.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {snapshot.pdfSessions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed p-8 text-sm text-muted-foreground">
                    Smart PDF Hub me file upload karoge to session yahan save ho jayega.
                  </div>
                ) : (
                  snapshot.pdfSessions.map((session) => (
                    <div key={session.id} className="rounded-2xl border p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{session.fileName}</p>
                          <p className="text-sm text-muted-foreground">{session.pageCount} pages • {session.extractedChars.toLocaleString()} chars</p>
                        </div>
                        <Badge variant="secondary">PDF</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-3">{session.preview}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Suggested Next Moves</CardTitle>
              <CardDescription>Quick wins based on the new orchestration features.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <Link to="/tools/ai-command-center" className="rounded-2xl border p-5 hover:border-primary/40 transition-colors">
                <p className="font-semibold flex items-center gap-2"><AppWindow className="h-4 w-4 text-primary" /> Open Command Center</p>
                <p className="text-sm text-muted-foreground mt-2">Intent likho, matching tools aur workflows turant milenge.</p>
              </Link>
              <Link to="/marketplace/templates" className="rounded-2xl border p-5 hover:border-primary/40 transition-colors">
                <p className="font-semibold flex items-center gap-2"><FolderHeart className="h-4 w-4 text-primary" /> Install a Pack</p>
                <p className="text-sm text-muted-foreground mt-2">Ready-made template packs workspace me add karo.</p>
              </Link>
              <Link to="/creator-studio" className="rounded-2xl border p-5 hover:border-primary/40 transition-colors">
                <p className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Launch Creator Studio</p>
                <p className="text-sm text-muted-foreground mt-2">Weekly publishing system ko campaign mode me chalao.</p>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Workflows</CardTitle>
              <CardDescription>Workspace se directly launch karne ke liye handpicked flows.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {workflowRecipes.slice(0, 3).map((recipe) => (
                <div key={recipe.id} className="rounded-2xl border p-5">
                  <p className="font-semibold">{recipe.title}</p>
                  <p className="text-sm text-muted-foreground mt-2">{recipe.description}</p>
                  <p className="text-xs text-muted-foreground mt-3">Outcome: {recipe.outcome}</p>
                  <Button asChild variant="outline" className="mt-4">
                    <Link to="/tools/ai-command-center">Launch Flow</Link>
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

export default WorkspaceDashboard;
