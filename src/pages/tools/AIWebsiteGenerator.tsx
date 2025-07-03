
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
        <nav class="navbar">
            <div class="nav-container">
                <div class="logo">${businessName}</div>
                <div class="nav-menu">
                    <a href="#home" class="nav-link">Home</a>
                    <a href="#about" class="nav-link">About</a>
                    <a href="#services" class="nav-link">Services</a>
                    <a href="#contact" class="nav-link">Contact</a>
                </div>
                <div class="hamburger">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </div>
            </div>
        </nav>
    </header>
    
    <main>
        <section id="hero" class="hero-section">
            <div class="hero-content">
                <h1>Welcome to ${businessName}</h1>
                <p class="hero-description">${description}</p>
                <button class="cta-button">Get Started</button>
            </div>
        </section>
        
        <section id="about" class="about-section">
            <div class="container">
                <h2>About Us</h2>
                <div class="about-grid">
                    <div class="about-text">
                        <p>We are dedicated to providing exceptional ${businessType} services that exceed your expectations. Our team of professionals is committed to delivering quality results that make a difference.</p>
                        <p>With years of experience in the industry, we understand what it takes to succeed and help our clients achieve their goals.</p>
                    </div>
                    <div class="about-stats">
                        <div class="stat-item">
                            <h3>500+</h3>
                            <p>Happy Clients</p>
                        </div>
                        <div class="stat-item">
                            <h3>10+</h3>
                            <p>Years Experience</p>
                        </div>
                        <div class="stat-item">
                            <h3>24/7</h3>
                            <p>Support</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <section id="services" class="services-section">
            <div class="container">
                <h2>Our Services</h2>
                <div class="services-grid">
                    <div class="service-card">
                        <div class="service-icon">🎯</div>
                        <h3>Premium Service</h3>
                        <p>High-quality solutions tailored to your specific needs and requirements.</p>
                    </div>
                    <div class="service-card">
                        <div class="service-icon">🛠️</div>
                        <h3>Expert Support</h3>
                        <p>24/7 customer support from our experienced and knowledgeable team.</p>
                    </div>
                    <div class="service-card">
                        <div class="service-icon">⚡</div>
                        <h3>Fast Delivery</h3>
                        <p>Quick turnaround times without compromising on quality or attention to detail.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="contact" class="contact-section">
            <div class="container">
                <h2>Get In Touch</h2>
                <div class="contact-grid">
                    <div class="contact-info">
                        <h3>Contact Information</h3>
                        <div class="contact-item">
                            <strong>Email:</strong> info@${businessName.toLowerCase().replace(/\s+/g, '')}.com
                        </div>
                        <div class="contact-item">
                            <strong>Phone:</strong> (555) 123-4567
                        </div>
                        <div class="contact-item">
                            <strong>Address:</strong> 123 Business St, City, State 12345
                        </div>
                    </div>
                    <div class="contact-form">
                        <form>
                            <input type="text" placeholder="Your Name" required>
                            <input type="email" placeholder="Your Email" required>
                            <textarea placeholder="Your Message" rows="4" required></textarea>
                            <button type="submit" class="submit-btn">Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </main>
    
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>${businessName}</h4>
                    <p>Providing exceptional ${businessType} services since 2024.</p>
                </div>
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#services">Services</a>
                    <a href="#contact">Contact</a>
                </div>
                <div class="footer-section">
                    <h4>Follow Us</h4>
                    <div class="social-links">
                        <a href="#">Facebook</a>
                        <a href="#">Twitter</a>
                        <a href="#">LinkedIn</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 ${businessName}. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    </script>
</body>
</html>`;

      const colorMap = {
        blue: { primary: '#3b82f6', secondary: '#1e40af', accent: '#dbeafe', light: '#f0f9ff' },
        green: { primary: '#10b981', secondary: '#047857', accent: '#d1fae5', light: '#f0fdf4' },
        purple: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#ede9fe', light: '#faf5ff' },
        red: { primary: '#ef4444', secondary: '#dc2626', accent: '#fee2e2', light: '#fef2f2' },
        orange: { primary: '#f97316', secondary: '#ea580c', accent: '#fed7aa', light: '#fff7ed' },
        teal: { primary: '#14b8a6', secondary: '#0f766e', accent: '#ccfbf1', light: '#f0fdfa' },
        pink: { primary: '#ec4899', secondary: '#db2777', accent: '#fce7f3', light: '#fdf2f8' },
        indigo: { primary: '#6366f1', secondary: '#4f46e5', accent: '#e0e7ff', light: '#f8fafc' }
      };

      const colors = colorMap[colorScheme as keyof typeof colorMap];

      const css = `/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    overflow-x: hidden;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header and Navigation */
header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 20px rgba(0,0,0,0.1);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
    transition: all 0.3s ease;
}

.navbar {
    padding: 1rem 0;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 1.8rem;
    font-weight: bold;
    color: ${colors.primary};
    text-decoration: none;
}

.nav-menu {
    display: flex;
    gap: 2rem;
    list-style: none;
}

.nav-link {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: all 0.3s ease;
    position: relative;
}

.nav-link:hover {
    color: ${colors.primary};
}

.nav-link::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -5px;
    left: 0;
    background-color: ${colors.primary};
    transition: width 0.3s ease;
}

.nav-link:hover::after {
    width: 100%;
}

.hamburger {
    display: none;
    flex-direction: column;
    cursor: pointer;
}

.bar {
    width: 25px;
    height: 3px;
    background-color: #333;
    margin: 3px 0;
    transition: 0.3s;
}

/* Hero Section */
.hero-section {
    background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
    color: white;
    padding: 120px 0 80px;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill="white" opacity="0.1"><polygon points="0,0 1000,100 0,100"/></svg>');
    background-size: cover;
}

.hero-content {
    position: relative;
    z-index: 2;
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
}

.hero-content h1 {
    font-size: 3.5rem;
    margin-bottom: 1.5rem;
    font-weight: 700;
    line-height: 1.2;
}

.hero-description {
    font-size: 1.3rem;
    margin-bottom: 2.5rem;
    opacity: 0.95;
    line-height: 1.6;
}

.cta-button {
    background: white;
    color: ${colors.primary};
    padding: 1.2rem 2.5rem;
    border: none;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.cta-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.3);
}

/* Sections */
section {
    padding: 80px 0;
}

.about-section {
    background: ${colors.light};
}

h2 {
    text-align: center;
    margin-bottom: 3rem;
    color: ${colors.secondary};
    font-size: 2.5rem;
    font-weight: 700;
}

.about-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 4rem;
    align-items: center;
}

.about-text p {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    color: #666;
    line-height: 1.8;
}

.about-stats {
    display: grid;
    gap: 2rem;
}

.stat-item {
    text-align: center;
    padding: 1.5rem;
    background: white;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.stat-item h3 {
    font-size: 2.5rem;
    color: ${colors.primary};
    margin-bottom: 0.5rem;
}

.stat-item p {
    color: #666;
    font-weight: 500;
}

/* Services */
.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2.5rem;
    margin-top: 3rem;
}

.service-card {
    background: white;
    padding: 2.5rem;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    text-align: center;
    transition: all 0.3s ease;
    border: 1px solid ${colors.accent};
}

.service-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.service-icon {
    font-size: 3rem;
    margin-bottom: 1.5rem;
}

.service-card h3 {
    color: ${colors.primary};
    margin-bottom: 1rem;
    font-size: 1.3rem;
}

.service-card p {
    color: #666;
    line-height: 1.6;
}

/* Contact Section */
.contact-section {
    background: ${colors.light};
}

.contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
}

.contact-info h3 {
    color: ${colors.secondary};
    margin-bottom: 2rem;
    font-size: 1.5rem;
}

.contact-item {
    margin-bottom: 1rem;
    padding: 1rem;
    background: white;
    border-radius: 10px;
    border-left: 4px solid ${colors.primary};
}

.contact-form form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.contact-form input,
.contact-form textarea {
    padding: 1rem;
    border: 2px solid #e1e5e9;
    border-radius: 10px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.contact-form input:focus,
.contact-form textarea:focus {
    outline: none;
    border-color: ${colors.primary};
}

.submit-btn {
    background: ${colors.primary};
    color: white;
    padding: 1rem 2rem;
    border: none;
    border-radius: 10px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.submit-btn:hover {
    background: ${colors.secondary};
    transform: translateY(-2px);
}

/* Footer */
.footer {
    background: #2d3748;
    color: white;
    padding: 3rem 0 1rem;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
}

.footer-section h4 {
    color: ${colors.primary};
    margin-bottom: 1rem;
    font-size: 1.2rem;
}

.footer-section p,
.footer-section a {
    color: #a0aec0;
    text-decoration: none;
    line-height: 1.8;
    transition: color 0.3s ease;
}

.footer-section a:hover {
    color: ${colors.primary};
}

.social-links {
    display: flex;
    gap: 1rem;
}

.footer-bottom {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid #4a5568;
    color: #a0aec0;
}

/* Responsive Design */
@media (max-width: 768px) {
    .hamburger {
        display: flex;
    }
    
    .nav-menu {
        position: fixed;
        top: 70px;
        left: -100%;
        flex-direction: column;
        background-color: white;
        width: 100%;
        text-align: center;
        transition: 0.3s;
        box-shadow: 0 10px 27px rgba(0,0,0,0.05);
        padding: 2rem 0;
    }
    
    .nav-menu.active {
        left: 0;
    }
    
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }
    
    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
    
    .hero-content h1 {
        font-size: 2.5rem;
    }
    
    .hero-description {
        font-size: 1.1rem;
    }
    
    .about-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .contact-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .services-grid {
        grid-template-columns: 1fr;
    }
    
    .footer-content {
        grid-template-columns: 1fr;
        text-align: center;
    }
    
    .social-links {
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .hero-content h1 {
        font-size: 2rem;
    }
    
    .service-card {
        padding: 1.5rem;
    }
    
    h2 {
        font-size: 2rem;
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
    "Generate complete website layouts with multiple sections",
    "8 customizable color schemes (Blue, Green, Purple, Red, Orange, Teal, Pink, Indigo)",
    "Fully responsive design templates for all devices",
    "12 business categories to choose from",
    "Download complete HTML and CSS files",
    "Mobile-first responsive design",
    "Interactive navigation with smooth scrolling",
    "Contact forms and call-to-action buttons",
    "Modern animations and hover effects",
    "SEO-optimized structure"
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
                    <SelectItem value="restaurant">Restaurant & Food</SelectItem>
                    <SelectItem value="consulting">Business Consulting</SelectItem>
                    <SelectItem value="tech">Technology & Software</SelectItem>
                    <SelectItem value="healthcare">Healthcare & Medical</SelectItem>
                    <SelectItem value="retail">Retail & E-commerce</SelectItem>
                    <SelectItem value="creative">Creative & Design</SelectItem>
                    <SelectItem value="fitness">Fitness & Wellness</SelectItem>
                    <SelectItem value="education">Education & Training</SelectItem>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                    <SelectItem value="legal">Legal Services</SelectItem>
                    <SelectItem value="automotive">Automotive</SelectItem>
                    <SelectItem value="travel">Travel & Tourism</SelectItem>
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
                  <SelectItem value="blue">Blue - Professional & Trustworthy</SelectItem>
                  <SelectItem value="green">Green - Nature & Growth</SelectItem>
                  <SelectItem value="purple">Purple - Creative & Luxury</SelectItem>
                  <SelectItem value="red">Red - Bold & Energetic</SelectItem>
                  <SelectItem value="orange">Orange - Warm & Friendly</SelectItem>
                  <SelectItem value="teal">Teal - Modern & Calm</SelectItem>
                  <SelectItem value="pink">Pink - Creative & Playful</SelectItem>
                  <SelectItem value="indigo">Indigo - Deep & Sophisticated</SelectItem>
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
