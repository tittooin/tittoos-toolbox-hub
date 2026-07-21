import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Star, AlertTriangle, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getContentTypeConfig } from "../constants/registry";

const ContentEditor = () => {
  const { contentType, id } = useParams<{ contentType: string; id?: string }>();
  const config = contentType ? getContentTypeConfig(contentType) : undefined;
  const isEditMode = !!id;

  if (!config) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl flex flex-col items-center justify-center text-center space-y-4">
          <AlertTriangle className="h-16 w-16 text-destructive" />
          <h2 className="text-2xl font-bold text-foreground">Content Type Not Found</h2>
          <p className="text-muted-foreground text-sm max-w-md">
            The content type <code className="bg-muted px-1.5 py-0.5 rounded text-destructive">{contentType}</code> is not registered.
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
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/admin/cms" className="hover:text-primary no-underline flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
          </Link>
          <span>/</span>
          <Link to={`/admin/cms/content/${config.type}`} className="hover:text-primary no-underline capitalize">
            {config.pluralLabel}
          </Link>
          <span>/</span>
          <span>{isEditMode ? `Edit ${config.label}` : `New ${config.label}`}</span>
        </div>

        {/* Header Layout */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground capitalize">
              {isEditMode ? `Edit ${config.label}` : `Create New ${config.label}`}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Fill metadata fields and schema specifications.
            </p>
          </div>

          <Button disabled className="gap-1.5 shadow-md">
            <Save className="h-4.5 w-4.5" /> Save {config.label}
          </Button>
        </section>

        {/* Editor Form Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main settings form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Core Metadata Settings</CardTitle>
                <CardDescription>
                  Standard data attributes required across all categories.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Content Title
                  </label>
                  <Input type="text" placeholder="Enter title" className="h-11" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    URL Slug
                  </label>
                  <Input type="text" placeholder="auto-generated-slug-path" className="h-11" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Category
                    </label>
                    <Input type="text" placeholder="General" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Visibility
                    </label>
                    <Input type="text" placeholder="Public" className="h-11" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dynamic Custom Fields Schema Form */}
            <Card className="border-purple-500/10">
              <CardHeader className="border-b bg-muted/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-500" />
                  Dynamic Schema: {config.pluralLabel} Fields
                </CardTitle>
                <CardDescription>
                  Inputs are parsed dynamically from the target content type config settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {config.customFields.map((field) => (
                  <div key={field.name} className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      {field.label}
                      {field.required && <span className="text-destructive">*</span>}
                    </label>
                    
                    {field.type === "rich-text" ? (
                      <Textarea placeholder={`Enter ${field.label.toLowerCase()}`} className="min-h-[120px]" />
                    ) : field.type === "select" ? (
                      <div className="relative">
                        <select className="w-full h-11 px-3.5 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm">
                          {field.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <Input
                        type={field.type === "number" ? "number" : "text"}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        className="h-11"
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar form columns for SEO */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-green-500/10 bg-green-500/[0.01]">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-green-700 dark:text-green-400">
                  SEO Meta Configuration
                </CardTitle>
                <CardDescription>
                  Google crawler index optimization values.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Meta Title
                  </label>
                  <Input type="text" placeholder="Custom SEO Title" className="h-10 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Meta Description
                  </label>
                  <Textarea placeholder="Meta Description (max 160 chars)" className="min-h-[80px] text-xs" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Canonical URL
                  </label>
                  <Input type="text" placeholder="https://axevora.com/..." className="h-10 text-xs" />
                </div>
              </CardContent>
            </Card>

            <div className="bg-muted/40 p-4 rounded-xl border space-y-2.5">
              <h5 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Validation Schema Status
              </h5>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Core validator checks will automatically analyze title, slug, and customized dynamic fields when saving.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContentEditor;
