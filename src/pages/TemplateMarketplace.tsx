import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Archive, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { marketplaceTemplates } from "@/data/experienceCatalog";
import { tools } from "@/data/tools";
import { useWorkspaceStore } from "@/hooks/useWorkspaceStore";
import { setSEO } from "@/utils/seoUtils";
import { toast } from "sonner";

const categories = ["all", "workflow", "creator", "pdf", "battle", "dev"] as const;

const TemplateMarketplace = () => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("all");
  const { snapshot, saveWorkspaceItem, addRecentItem } = useWorkspaceStore();

  useEffect(() => {
    setSEO({
      title: "Template Marketplace | Axevora",
      description: "Install workflow packs, creator kits, PDF routines, and battle playbooks into your Axevora workspace.",
      keywords: ["template marketplace", "workflow packs", "creator templates", "pdf playbooks", "axevora templates"],
      type: "website"
    });
  }, []);

  const installedIds = new Set(snapshot.savedItems.map((item) => item.id));
  const filteredTemplates = marketplaceTemplates.filter((template) => {
    const matchesCategory = activeCategory === "all" || template.category === activeCategory;
    const haystack = `${template.title} ${template.description} ${template.recommendedFor}`.toLowerCase();
    return matchesCategory && haystack.includes(query.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b bg-gradient-to-br from-indigo-500/10 via-background to-sky-500/10">
          <div className="container mx-auto px-4 py-14">
            <Badge variant="outline" className="mb-4 bg-background/80">Install-Ready Packs</Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Template Marketplace</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Ready-made packs jinko workspace me install karke tum repeatable execution create kar sakte ho. Yeh templates existing tools ko organize karte hain; unke original functions same rahte hain.
            </p>

            <div className="mt-8 max-w-3xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search packs, goals, or use-cases" className="pl-12 h-12" />
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  onClick={() => setActiveCategory(category)}
                  className="capitalize rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          <div className="grid gap-6 lg:grid-cols-2">
            {filteredTemplates.map((template) => {
              const relatedTools = tools.filter((tool) => template.relatedToolIds.includes(tool.id));
              const isInstalled = installedIds.has(template.id);

              return (
                <Card key={template.id} className="border-primary/10">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <Badge>{template.badge}</Badge>
                          <Badge variant="outline" className="capitalize">{template.category}</Badge>
                        </div>
                        <CardTitle className="mt-4 text-2xl">{template.title}</CardTitle>
                        <CardDescription className="mt-2">{template.description}</CardDescription>
                      </div>
                      <div className="rounded-2xl bg-primary/10 p-3">
                        <Archive className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Best for:</span> {template.recommendedFor}</p>

                    <div className="mt-5">
                      <p className="font-semibold mb-2">Included</p>
                      <div className="flex flex-wrap gap-2">
                        {template.included.map((item) => (
                          <Badge key={item} variant="secondary">{item}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="font-semibold mb-3">Tool Stack</p>
                      <div className="grid gap-3 md:grid-cols-2">
                        {relatedTools.map((tool) => (
                          <Link key={tool.id} to={tool.path} className="rounded-2xl border p-3 hover:border-primary/40 transition-colors">
                            <p className="font-medium">{tool.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{tool.subheading}</p>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button
                        disabled={isInstalled}
                        onClick={() => {
                          saveWorkspaceItem({
                            id: template.id,
                            title: template.title,
                            description: template.description,
                            path: "/marketplace/templates",
                            type: "template",
                            savedAt: Date.now(),
                            relatedIds: template.relatedToolIds
                          });
                          addRecentItem({
                            id: `${template.id}-recent`,
                            title: `${template.title} installed`,
                            subtitle: template.badge,
                            type: "template",
                            path: "/marketplace/templates",
                            timestamp: Date.now()
                          });
                          toast.success("Template installed in workspace");
                        }}
                      >
                        {isInstalled ? "Installed" : "Install Pack"}
                      </Button>
                      <Button asChild variant="outline">
                        <Link to="/workspace">Open Workspace</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TemplateMarketplace;
