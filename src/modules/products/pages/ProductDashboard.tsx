import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Database, LayoutGrid, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PRODUCT_TYPES_REGISTRY } from "../registry";
import { PRODUCT_ICONS_MAP } from "../constants";

const ProductDashboard = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl space-y-8">
        {/* Header Widget */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full w-fit mb-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              Canonical Product Engine Active
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              Axevora Admin Product Panel
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Unified database-agnostic canonical products management console.
            </p>
          </div>
        </section>

        {/* Informative description banner */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">Canonical Product Separation Schema</h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                The Product Engine owns core canonical references (identity, brand references, taxonomy links, media references). Prices, deals, discounts, and store affiliate URLs are decoupled and owned by auxiliary engines.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Registered Product Types */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-primary" />
            Registered Product Classifications
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCT_TYPES_REGISTRY.map((t) => {
              const IconComponent = PRODUCT_ICONS_MAP[t.iconName || "ShoppingBag"] || PRODUCT_ICONS_MAP.ShoppingBag;
              return (
                <Card key={t.type} className="hover:border-primary/20 hover:shadow-md transition-all group">
                  <CardHeader className="pb-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors mb-2">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl font-bold flex items-center justify-between">
                      {t.pluralLabel}
                      <span className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded">
                        type: {t.type}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4 text-xs text-muted-foreground space-y-2">
                    <div className="flex items-center gap-1 text-green-600 font-semibold bg-green-50 dark:bg-green-950/20 px-2 py-1 rounded w-fit">
                      <CheckCircle className="h-3 w-3" />
                      Foundation Active
                    </div>
                    {t.supportCustomFields && t.customAttributes && (
                      <div className="mt-1 border-t pt-2 space-y-1">
                        <span className="font-semibold block text-[10px] text-foreground">Custom attributes:</span>
                        <div className="flex flex-wrap gap-1">
                          {t.customAttributes.map((attr) => (
                            <span key={attr.name} className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                              {attr.label} ({attr.type})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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

export default ProductDashboard;
