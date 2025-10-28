
import { useState, useEffect } from "react";
import { Search, Filter, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tools, categories } from "@/data/tools";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogPreview from "@/components/BlogPreview";
import AdSense from "@/components/AdSense";
import { setSEO, injectJsonLd } from "@/utils/seoUtils";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const adsEnabled = import.meta.env.VITE_ENABLE_ADS === 'true';

  useEffect(() => {
    // Apply global SEO meta and structured data
    setSEO({
      title: "TittoosTools - 40+ Essential Online Utilities | Free Web Tools",
      description: "Free online tools for productivity: video converters, password generators, QR codes, calculators, formatters, AI tools, social media downloaders and more. No registration required.",
      keywords: [
        'free online tools','web utilities','video converter','audio converter','image converter','password generator','QR code','JSON formatter','URL encoder','AI tools','SEO analyzer','website speed checker','bmi calculator','loan calculator'
      ],
      image: `${window.location.origin}/placeholder.svg`,
      type: 'website',
    });

    // WebSite + SearchAction + Organization JSON-LD
    injectJsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          'name': 'TittoosTools',
          'url': window.location.origin,
          'logo': `${window.location.origin}/favicon.ico`,
        },
        {
          '@type': 'WebSite',
          'name': 'TittoosTools',
          'url': window.location.origin,
          'potentialAction': {
            '@type': 'SearchAction',
            'target': `${window.location.origin}/?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        },
        {
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'What free online tools does TittoosTools offer?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'We offer 40+ tools including converters (video, audio, image), generators (password, QR, UUID), formatters (JSON, XML, SQL), analyzers (SEO, website speed), calculators (BMI, loan, percentage), and AI tools.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Are the tools really free to use?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Yes. All tools are free with no signup required. Some pages may display ads to keep the platform free.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Do you support mobile devices?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Yes, TittoosTools is mobile-friendly and works across modern browsers on phones, tablets, and desktops.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Where can I analyze my website\'s SEO?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': `Use the SEO Analyzer at ${window.location.origin}/tools/seo-analyzer to audit pages.`
              }
            },
            {
              '@type': 'Question',
              'name': 'How do I convert videos or images online?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': `Try the Video Converter (${window.location.origin}/tools/video-converter) and Image Converter (${window.location.origin}/tools/image-converter).`
              }
            },
            {
              '@type': 'Question',
              'name': 'How can I quickly generate a secure password or QR code?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': `Use the Password Generator (${window.location.origin}/tools/password-generator) and QR Generator (${window.location.origin}/tools/qr-generator).`
              }
            }
          ]
        }
      ]
    });
  }, []);

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const scrollToTools = () => {
    const toolsSection = document.getElementById('tools-section');
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Group tools by category for organized display
  const toolsByCategory = categories.reduce((acc, category) => {
    const categoryTools = filteredTools.filter(tool => tool.category === category.id);
    if (categoryTools.length > 0) {
      acc[category.id] = {
        name: category.name,
        tools: categoryTools
      };
    }
    return acc;
  }, {} as Record<string, { name: string; tools: typeof tools }>);

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />
      <main id="main-content" role="main">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background">
        <div className="relative container mx-auto px-4 py-20 text-center text-foreground">
          <h1 className="text-5xl font-bold mb-6 animate-slide-up">
            TittoosTools
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90 animate-slide-up delay-100 text-muted-foreground">
            Your complete toolkit for online productivity. 40+ essential utilities including converters, 
            generators, analyzers, editors, and social media downloaders - all in one place.
          </p>
          <div className="flex justify-center animate-slide-up delay-200">
            <Button size="lg" variant="default" className="hover:scale-105 transition-all" onClick={scrollToTools}>
              Explore Tools <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* AdSense Block */}
      {adsEnabled && (
        <section className="container mx-auto px-4 py-6">
          <AdSense adSlot="1234567890" adFormat="auto" />
        </section>
      )}

      {/* Search and Filter Section */}
      <section id="tools-section" className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search tools..."
                aria-label="Search tools"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 h-12">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Tools by Category */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {selectedCategory === "all" ? (
            // Show tools grouped by category
            <div className="space-y-12">
              {Object.entries(toolsByCategory).map(([categoryId, categoryData]) => (
                <div key={categoryId}>
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                    <span className="w-1 h-8 bg-muted rounded-full mr-4"></span>
                    {categoryData.name}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryData.tools.map((tool) => (
                      <Link key={tool.id} to={tool.path}>
                        <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between mb-3">
                              <div className="p-2 bg-muted rounded-lg">
                                <tool.icon className="h-6 w-6 text-foreground" />
                              </div>
                              <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                                {categories.find(c => c.id === tool.category)?.name}
                              </span>
                            </div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {tool.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground font-medium">
                              {tool.subheading}
                            </p>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-sm leading-relaxed">
                              {tool.description}
                            </CardDescription>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Show filtered tools in a single grid when category is selected
            <>
              <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
                {categories.find(c => c.id === selectedCategory)?.name || "Filtered Tools"}
              </h2>
              
              {filteredTools.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No tools found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredTools.map((tool) => (
                    <Link key={tool.id} to={tool.path}>
                      <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-muted rounded-lg">
                              <tool.icon className="h-6 w-6 text-foreground" />
                            </div>
                  <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                    {categories.find(c => c.id === tool.category)?.name}
                  </span>
                          </div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {tool.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground font-medium">
                            {tool.subheading}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-sm leading-relaxed">
                            {tool.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* FAQ Section for human-written SEO and trust */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 text-muted-foreground">
            <div>
              <h3 className="text-xl font-semibold mb-2">What tools can I find here?</h3>
              <p>
                We offer 40+ free online utilities including converters (video, audio, image),
                generators (password, QR, UUID), editors (JSON, HTML, CSS, Markdown), analyzers
                (SEO, website speed, image/color), and practical calculators (BMI, loan, percentage).
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Is everything really free to use?</h3>
              <p>
                Yes. There is no login or registration required. We keep the platform free by
                displaying non-intrusive ads on some pages.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Is TittoosTools mobile-friendly?</h3>
              <p>
                Absolutely. The site is responsive and optimized for modern browsers on phones,
                tablets, and desktops.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Are downloads and generated files safe?</h3>
              <p>
                Tools run in your browser where possible. Generated files such as formatted JSON,
                converted images, or code snippets are created locally and are safe to download.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">How can I request a new tool?</h3>
              <p>
                If you need a specific tool, reach out via our contact or feedback section. We
                prioritize useful, frequently requested utilities.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Do you respect user privacy?</h3>
              <p>
                Yes. We do not collect sensitive personal data through tools. Please review our
                Privacy Policy for details.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Where can I analyze my website\'s SEO?</h3>
              <p>
                Use our <Link to="/tools/seo-analyzer" className="text-primary hover:text-primary/80">SEO Analyzer</Link> to audit pages, meta tags, and on-page signals.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">How do I convert videos or images online?</h3>
              <p>
                Try the <Link to="/tools/video-converter" className="text-primary hover:text-primary/80">Video Converter</Link> and <Link to="/tools/image-converter" className="text-primary hover:text-primary/80">Image Converter</Link> for quick format changes and compression.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">How can I generate a secure password or QR code?</h3>
              <p>
                Use the <Link to="/tools/password-generator" className="text-primary hover:text-primary/80">Password Generator</Link> and <Link to="/tools/qr-generator" className="text-primary hover:text-primary/80">QR Generator</Link> for fast, reliable results.
              </p>
            </div>
          </div>
        </div>
      </section>

      <BlogPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
