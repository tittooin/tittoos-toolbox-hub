
import { useState } from "react";
import { Wand2, Download, Eye, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const AIWebsiteGenerator = () => {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("restaurant");
  const [description, setDescription] = useState("");
  const [colorScheme, setColorScheme] = useState("blue");
  const [generatedHTML, setGeneratedHTML] = useState("");
  const [generatedCSS, setGeneratedCSS] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWebsite = async () => {
    if (!businessName.trim() || !description.trim()) {
      toast.error("Please fill in business name and description");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI website generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessName}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav>
            <div class="logo">${businessName}</div>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="hero">
            <div class="hero-content">
                <h1>Welcome to ${businessName}</h1>
                <p>${description}</p>
                <button class="cta-button">Get Started</button>
            </div>
        </section>
        
        <section id="about">
            <div class="container">
                <h2>About Us</h2>
                <p>We are dedicated to providing exceptional ${businessType} services that exceed your expectations.</p>
            </div>
        </section>
        
        <section id="services">
            <div class="container">
                <h2>Our Services</h2>
                <div class="services-grid">
                    <div class="service-card">
                        <h3>Premium Service</h3>
                        <p>High-quality solutions tailored to your needs.</p>
                    </div>
                    <div class="service-card">
                        <h3>Expert Support</h3>
                        <p>24/7 customer support from our experienced team.</p>
                    </div>
                    <div class="service-card">
                        <h3>Fast Delivery</h3>
                        <p>Quick turnaround times without compromising quality.</p>
                    </div>
                </div>
            </div>
        </section>
    </main>
    
    <footer>
        <div class="container">
            <p>&copy; 2024 ${businessName}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;

      const colorMap = {
        blue: { primary: '#3b82f6', secondary: '#1e40af', accent: '#dbeafe' },
        green: { primary: '#10b981', secondary: '#047857', accent: '#d1fae5' },
        purple: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#ede9fe' },
        red: { primary: '#ef4444', secondary: '#dc2626', accent: '#fee2e2' }
      };

      const colors = colorMap[colorScheme as keyof typeof colorMap];

      const css = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

header {
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: ${colors.primary};
}

nav ul {
    display: flex;
    list-style: none;
    gap: 2rem;
}

nav a {
    text-decoration: none;
    color: #333;
    transition: color 0.3s;
}

nav a:hover {
    color: ${colors.primary};
}

#hero {
    background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
    color: white;
    padding: 8rem 2rem 4rem;
    text-align: center;
    margin-top: 60px;
}

.hero-content h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.hero-content p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.cta-button {
    background: white;
    color: ${colors.primary};
    padding: 1rem 2rem;
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: transform 0.3s;
}

.cta-button:hover {
    transform: translateY(-2px);
}

section {
    padding: 4rem 0;
}

#about {
    background: ${colors.accent};
}

h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: ${colors.secondary};
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.service-card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    text-align: center;
}

.service-card h3 {
    color: ${colors.primary};
    margin-bottom: 1rem;
}

footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 2rem 0;
}

@media (max-width: 768px) {
    nav {
        flex-direction: column;
        gap: 1rem;
    }
    
    nav ul {
        gap: 1rem;
    }
    
    .hero-content h1 {
        font-size: 2rem;
    }
    
    .services-grid {
        grid-template-columns: 1fr;
    }
}`;

      setGeneratedHTML(html);
      setGeneratedCSS(css);
      toast.success("Website generated successfully!");
    } catch (error) {
      toast.error("Failed to generate website. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadWebsite = () => {
    if (generatedHTML && generatedCSS) {
      // Create HTML file
      const htmlBlob = new Blob([generatedHTML], { type: 'text/html' });
      const htmlUrl = URL.createObjectURL(htmlBlob);
      const htmlLink = document.createElement('a');
      htmlLink.href = htmlUrl;
      htmlLink.download = 'index.html';
      htmlLink.click();

      // Create CSS file
      const cssBlob = new Blob([generatedCSS], { type: 'text/css' });
      const cssUrl = URL.createObjectURL(cssBlob);
      const cssLink = document.createElement('a');
      cssLink.href = cssUrl;
      cssLink.download = 'styles.css';
      cssLink.click();

      toast.success("Website files downloaded!");
    }
  };

  const features = [
    "Generate complete website layouts",
    "Customizable color schemes",
    "Responsive design templates",
    "Multiple business categories",
    "Download HTML and CSS files"
  ];

  return (
    <ToolTemplate
      title="AI Website Generator"
      description="Generate complete website layouts and content using AI"
      icon={Wand2}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Your Website</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Business Name</Label>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter your business name"
                />
              </div>

              <div className="space-y-2">
                <Label>Business Type</Label>
                <Select value={businessType} onValueChange={setBusinessType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="creative">Creative Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Business Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your business, services, and what makes you unique..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Color Scheme</Label>
              <Select value={colorScheme} onValueChange={setColorScheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={generateWebsite} 
              className="w-full" 
              disabled={isGenerating}
            >
              <Wand2 className="h-4 w-4 mr-2" />
              {isGenerating ? "Generating Website..." : "Generate Website"}
            </Button>

            {generatedHTML && (
              <div className="mt-6 space-y-4">
                <Tabs defaultValue="preview">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="html">HTML</TabsTrigger>
                    <TabsTrigger value="css">CSS</TabsTrigger>
                  </TabsList>

                  <TabsContent value="preview" className="space-y-4">
                    <div className="border rounded-lg overflow-hidden">
                      <iframe
                        srcDoc={`${generatedHTML}<style>${generatedCSS}</style>`}
                        className="w-full h-96"
                        title="Website Preview"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="html">
                    <Textarea
                      value={generatedHTML}
                      readOnly
                      className="min-h-[300px] font-mono text-sm"
                    />
                  </TabsContent>

                  <TabsContent value="css">
                    <Textarea
                      value={generatedCSS}
                      readOnly
                      className="min-h-[300px] font-mono text-sm"
                    />
                  </TabsContent>
                </Tabs>

                <Button onClick={downloadWebsite} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Website Files
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolTemplate>
  );
};

export default AIWebsiteGenerator;
