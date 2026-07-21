import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Database, LayoutGrid, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { COMMERCE_PROVIDERS_REGISTRY } from "../registry";
import { COMMERCE_ICONS_MAP } from "../constants";

const CommerceDashboard = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl space-y-8">
        {/* Header Widget */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full w-fit mb-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              Commerce Engine Active
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              Axevora Admin Commerce Panel
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Decoupled, modular commercial integrations and parameters management console.
            </p>
          </div>
          <Button asChild className="shrink-0">
            <Link to="/admin/commerce/publish">Publish Product</Link>
          </Button>
        </section>

        {/* Informative description banner */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">Commerce Engine Abstraction Boundaries</h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                The Commerce Engine isolates pricing, listings, offers, and affiliate network configurations. It depends on Product identifiers, maintaining a strict decoupled relation without exposing Product Core to pricing properties or credentials leakages.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Registered Integration Providers */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-primary" />
            Registered Integration Providers
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMERCE_PROVIDERS_REGISTRY.map((p) => {
              const IconComponent = COMMERCE_ICONS_MAP.Store;
              return (
                <Card key={p.providerType} className="hover:border-primary/20 hover:shadow-md transition-all group">
                  <CardHeader className="pb-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors mb-2">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl font-bold flex items-center justify-between">
                      {p.label}
                      <span className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded">
                        type: {p.providerType}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4 text-xs text-muted-foreground space-y-2">
                    <div className="flex items-center gap-1 text-green-600 font-semibold bg-green-50 dark:bg-green-950/20 px-2 py-1 rounded w-fit">
                      <CheckCircle className="h-3 w-3" />
                      Foundation Active
                    </div>
                    <div className="mt-1 border-t pt-2 space-y-1">
                      <span className="font-semibold block text-[10px] text-foreground">Auto Sync Support:</span>
                      <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] block w-fit">
                        {p.supportAutoSync ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <div className="mt-1 border-t pt-2 space-y-1">
                      <span className="font-semibold block text-[10px] text-foreground">Supported Capabilities:</span>
                      <div className="flex flex-wrap gap-1">
                        {p.capabilities.map((cap) => (
                          <span key={cap} className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                            {cap}
                          </span>
                        ))}
                      </div>
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

export default CommerceDashboard;
