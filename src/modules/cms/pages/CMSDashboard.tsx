import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LayoutGrid, FileText, Tag, Scissors, Star, Columns, Globe, ArrowRight, ShieldCheck, Database } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CONTENT_TYPES_REGISTRY } from "../constants/registry";

// Icon Map helper to resolve Lucide string names
const iconMap: Record<string, any> = {
  Tag,
  FileText,
  Scissors,
  Star,
  Columns,
  Globe
};

const CMSDashboard = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl space-y-8">
        {/* Header Widget */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full w-fit mb-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              Universal CMS Engine Active
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              Axevora Admin CMS Panel
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Unified schema-based content engine dashboard.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/blog" className="no-underline">Legacy Blog Manager</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/battles" className="no-underline">Legacy Battle Manager</Link>
            </Button>
          </div>
        </section>

        {/* Database notice info */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">Schema-Driven Extensible Model</h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Naye Content Type ko add karne ke liye ab separate router logic or managers likhne ki zaroorat nahi hai. Simply `registry.ts` configuration array me schema entry register karein aur core admin dashboards instantly forms aur listings parameters render kar lenge.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Grid listing of Content Types */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-primary" />
            Registered Content Types
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONTENT_TYPES_REGISTRY.map((c) => {
              const Icon = iconMap[c.iconName || "FileText"] || FileText;
              return (
                <Card key={c.type} className="hover:border-primary/20 hover:shadow-md transition-all group">
                  <CardHeader className="pb-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors mb-2">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl font-bold flex items-center justify-between">
                      {c.pluralLabel}
                      <span className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded">
                        type: {c.type}
                      </span>
                    </CardTitle>
                    <CardDescription>
                      Custom fields: {c.customFields.length} configured fields
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 flex justify-end">
                    <Button asChild variant="ghost" size="sm" className="gap-1 group-hover:translate-x-1 transition-transform">
                      <Link to={`/admin/cms/content/${c.type}`} className="no-underline text-xs flex items-center gap-1 font-semibold">
                        Manage Content <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
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

export default CMSDashboard;
