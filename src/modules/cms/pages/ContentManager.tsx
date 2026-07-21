import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, FileText, Settings, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getContentTypeConfig } from "../constants/registry";

const ContentManager = () => {
  const { contentType } = useParams<{ contentType: string }>();
  const config = contentType ? getContentTypeConfig(contentType) : undefined;

  if (!config) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl flex flex-col items-center justify-center text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-destructive" />
          <h2 className="text-2xl font-bold text-foreground">Content Type Not Found</h2>
          <p className="text-muted-foreground text-sm max-w-md">
            The content type <code className="bg-muted px-1.5 py-0.5 rounded text-destructive">{contentType}</code> is not registered in the schema registry.
          </p>
          <Button asChild>
            <Link to="/admin/cms">Back to CMS Dashboard</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/admin/cms" className="hover:text-primary no-underline flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
          </Link>
          <span>/</span>
          <span className="capitalize">{config.pluralLabel}</span>
        </div>

        {/* Header Options */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground capitalize">
              Manage {config.pluralLabel}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Add, edit, or customize schema-based fields for {config.pluralLabel.toLowerCase()}.
            </p>
          </div>

          <Button asChild className="gap-1.5 shadow-md">
            <Link to={`/admin/cms/content/${config.type}/new`} className="no-underline">
              <Plus className="h-4.5 w-4.5" /> Add New {config.label}
            </Link>
          </Button>
        </section>

        {/* Mock/Empty Listing Grid */}
        <Card className="border-dashed border-muted-foreground/20">
          <CardContent className="flex flex-col items-center justify-center text-center py-20 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
              <FileText className="h-7 w-7" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-foreground">No {config.pluralLabel} Added Yet</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-relaxed">
                Abhi is segment me koi record database me nahi mila. Naya item add karne ke liye upar diye gaye Add Button par click karein.
              </p>
            </div>
            
            <div className="pt-2 flex items-center gap-4 text-xs text-muted-foreground bg-muted/30 px-4 py-2.5 rounded-lg border">
              <Settings className="h-4 w-4 animate-spin text-primary" />
              Dynamic validation rule schema: {config.customFields.length} target fields active
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default ContentManager;
