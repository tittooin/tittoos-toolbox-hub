import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import ToolTemplate from "@/components/ToolTemplate";
import { Globe, Wand2, Download, Eye, Settings, Palette, Layout, Code, Rocket } from "lucide-react";
import { generateWebsiteFromPrompt } from "@/utils/websiteGenerator";
import { toast } from "sonner";
import JSZip from "jszip";

const AIWebsiteGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [websiteType, setWebsiteType] = useState("landing");
  const [theme, setTheme] = useState("modern");
  const [colorScheme, setColorScheme] = useState("blue");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWebsite, setGeneratedWebsite] = useState<any>(null);
  const [customizations, setCustomizations] = useState({
    includeContact: true,
    includeGallery: false,
    includeBlog: false,
    includeEcommerce: false,
    animations: true,
    darkMode: false,
    fontSize: [16],
    spacing: [2]
  });

  const websiteTypes = [
    { value: "landing", label: "Landing Page", description: "Perfect for products and services" },
    { value: "portfolio", label: "Portfolio", description: "Showcase your work and skills" },
    { value: "business", label: "Business", description: "Corporate and professional sites" },
    { value: "blog", label: "Blog", description: "Content-focused publications" },
    { value: "ecommerce", label: "E-commerce", description: "Online store and marketplace" },
    { value: "personal", label: "Personal", description: "Personal websites and resumes" },
  ];

  const themes = [
    { value: "modern", label: "Modern", description: "Clean and contemporary" },
    { value: "minimal", label: "Minimal", description: "Simple and elegant" },
    { value: "creative", label: "Creative", description: "Bold and artistic" },
    { value: "professional", label: "Professional", description: "Corporate and formal" },
    { value: "playful", label: "Playful", description: "Fun and energetic" },
  ];

  const colorSchemes = [
    { value: "blue", label: "Ocean Blue", color: "#3B82F6" },
    { value: "purple", label: "Royal Purple", color: "#8B5CF6" },
    { value: "green", label: "Nature Green", color: "#10B981" },
    { value: "orange", label: "Sunset Orange", color: "#F59E0B" },
    { value: "pink", label: "Rose Pink", color: "#EC4899" },
    { value: "gray", label: "Modern Gray", color: "#6B7280" },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description for your website");
      return;
    }

    setIsGenerating(true);
    try {
      const website = await generateWebsiteFromPrompt({
        prompt,
        websiteType,
        theme,
        colorScheme,
        customizations
      });
      
      setGeneratedWebsite(website);
      toast.success("Website generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate website. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedWebsite) return;

    const zip = new JSZip();
    
    // Add HTML file
    zip.file("index.html", generatedWebsite.html);
    
    // Add CSS file
    zip.file("styles.css", generatedWebsite.css);
    
    // Add JavaScript file if exists
    if (generatedWebsite.js) {
      zip.file("script.js", generatedWebsite.js);
    }
    
    // Add README
    zip.file("README.md", generatedWebsite.readme);
    
    // Generate and download zip
    zip.generateAsync({ type: "blob" }).then((content) => {
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${generatedWebsite.title.toLowerCase().replace(/\s+/g, "-")}-website.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    toast.success("Website downloaded successfully!");
  };

  const handleDeploy = () => {
    if (!generatedWebsite) return;
    
    // Simulate deployment process
    toast.success("Deployment initiated! Your website will be live in a few minutes.");
    
    // In a real implementation, this would integrate with Netlify, Vercel, etc.
    setTimeout(() => {
      toast.success("Website deployed successfully! Check your email for the live URL.");
    }, 3000);
  };

  return (
    <ToolTemplate
      title="AI Website Generator"
      description="Generate fully functional, responsive websites in seconds using AI"
      icon={Globe}
      features={[
        "AI-powered website generation from text prompts",
        "Multiple website types and templates",
        "Customizable themes and color schemes",
        "Responsive design with modern layouts",
        "SEO-optimized content generation",
        "One-click download and deployment",
        "No coding knowledge required",
        "Professional quality results"
      ]}
    >
      <div className="space-y-6">
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="customize" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Customize
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2" disabled={!generatedWebsite}>
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  Describe Your Website
                </CardTitle>
                <CardDescription>
                  Tell us what kind of website you want to create
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="prompt">Website Description</Label>
                  <Textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Example: Create a minimalist portfolio website for a graphic designer. Use a dark theme, add a project gallery, and include a contact form."
                    className="min-h-[100px] mt-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Website Type</Label>
                    <Select value={websiteType} onValueChange={setWebsiteType}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {websiteTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-sm text-muted-foreground">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Design Theme</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {themes.map((themeOption) => (
                          <SelectItem key={themeOption.value} value={themeOption.value}>
                            <div>
                              <div className="font-medium">{themeOption.label}</div>
                              <div className="text-sm text-muted-foreground">{themeOption.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Color Scheme</Label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
                    {colorSchemes.map((scheme) => (
                      <button
                        key={scheme.value}
                        onClick={() => setColorScheme(scheme.value)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          colorScheme === scheme.value ? "border-primary ring-2 ring-primary/20" : "border-gray-200"
                        }`}
                      >
                        <div 
                          className="w-full h-8 rounded mb-2" 
                          style={{ backgroundColor: scheme.color }}
                        />
                        <div className="text-xs font-medium">{scheme.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating Website...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate Website
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customize" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Advanced Customization
                </CardTitle>
                <CardDescription>
                  Fine-tune your website features and appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Website Features</Label>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="contact"
                        checked={customizations.includeContact}
                        onCheckedChange={(checked) =>
                          setCustomizations(prev => ({ ...prev, includeContact: !!checked }))
                        }
                      />
                      <Label htmlFor="contact">Contact Form</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="gallery"
                        checked={customizations.includeGallery}
                        onCheckedChange={(checked) =>
                          setCustomizations(prev => ({ ...prev, includeGallery: !!checked }))
                        }
                      />
                      <Label htmlFor="gallery">Image Gallery</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="blog"
                        checked={customizations.includeBlog}
                        onCheckedChange={(checked) =>
                          setCustomizations(prev => ({ ...prev, includeBlog: !!checked }))
                        }
                      />
                      <Label htmlFor="blog">Blog Section</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ecommerce"
                        checked={customizations.includeEcommerce}
                        onCheckedChange={(checked) =>
                          setCustomizations(prev => ({ ...prev, includeEcommerce: !!checked }))
                        }
                      />
                      <Label htmlFor="ecommerce">E-commerce</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Design Options</Label>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="animations"
                        checked={customizations.animations}
                        onCheckedChange={(checked) =>
                          setCustomizations(prev => ({ ...prev, animations: !!checked }))
                        }
                      />
                      <Label htmlFor="animations">Animations</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="darkMode"
                        checked={customizations.darkMode}
                        onCheckedChange={(checked) =>
                          setCustomizations(prev => ({ ...prev, darkMode: !!checked }))
                        }
                      />
                      <Label htmlFor="darkMode">Dark Mode</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Typography & Spacing</Label>
                  <div className="space-y-4 mt-3">
                    <div>
                      <Label className="text-sm">Font Size: {customizations.fontSize[0]}px</Label>
                      <Slider
                        value={customizations.fontSize}
                        onValueChange={(value) =>
                          setCustomizations(prev => ({ ...prev, fontSize: value }))
                        }
                        max={24}
                        min={12}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Spacing: {customizations.spacing[0]}x</Label>
                      <Slider
                        value={customizations.spacing}
                        onValueChange={(value) =>
                          setCustomizations(prev => ({ ...prev, spacing: value }))
                        }
                        max={4}
                        min={1}
                        step={0.5}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            {generatedWebsite ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{generatedWebsite.title}</h3>
                    <p className="text-muted-foreground">{generatedWebsite.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleDownload} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button onClick={handleDeploy}>
                      <Rocket className="h-4 w-4 mr-2" />
                      Deploy
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="text-sm text-gray-600 ml-2">
                          {generatedWebsite.title.toLowerCase().replace(/\s+/g, "-")}.com
                        </div>
                      </div>
                      <div 
                        className="bg-card min-h-[400px] p-6"
                        dangerouslySetInnerHTML={{ __html: generatedWebsite.preview }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        Tech Stack
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {generatedWebsite.technologies.map((tech: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Layout className="h-4 w-4" />
                        Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {generatedWebsite.features.map((feature: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Design
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div>Theme: <span className="font-medium capitalize">{theme}</span></div>
                        <div>Colors: <span className="font-medium capitalize">{colorScheme}</span></div>
                        <div>Type: <span className="font-medium capitalize">{websiteType}</span></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Website Generated Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Go to the Generate tab to create your website first
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ToolTemplate>
  );
};

export default AIWebsiteGenerator;
