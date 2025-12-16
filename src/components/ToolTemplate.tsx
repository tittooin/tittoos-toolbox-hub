import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getToolContent } from "@/data/toolContent";
import { tools } from "@/data/tools";
import { ArrowLeft, Star, Code, Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { setSEO, injectJsonLd } from "@/utils/seoUtils";

import SocialShare from "@/components/SocialShare";


interface ToolTemplateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: ReactNode;
  content?: string;
  features?: string[];
  showContentAds?: boolean;
}

const ToolTemplate = ({ title, description, icon: Icon, children, content, features, showContentAds = false }: ToolTemplateProps) => {
  const location = useLocation();
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate an "attractive" description for social media
    // If the description is technical, we try to make it more engaging for the OG tag
    const socialDescription = description.length > 50
      ? description
      : `Use this free ${title} to handle your tasks instantly. No download required, secure, and easy to use.`;

    setSEO({
      title,
      description,
      keywords: [
        'free online tools', 'web tools', 'utilities', 'converter', 'formatter', 'validator', 'generator', 'editor', 'SEO tools', 'AI tools',
        title.toLowerCase(),
        `${title.toLowerCase()} online`,
        `free ${title.toLowerCase()}`
      ],
      image: `${window.location.origin}/placeholder.svg`,
      type: 'website',
      url: window.location.href
    });

    // Manually set Twitter Card tags since setSEO might not cover all specific custom tags
    // Note: react-helmet-async in setSEO should ideally handle this, but we ensure it here if needed or rely on setSEO.
    // Assuming setSEO handles standard meta. If we want to force specific OG tags that differ from description:
    const metaOgDesc = document.querySelector('meta[property="og:description"]');
    if (metaOgDesc) {
      metaOgDesc.setAttribute('content', socialDescription);
    }

    // Inject WebApplication JSON-LD for each tool page
    const url = `${window.location.origin}${window.location.pathname}`;
    injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': title,
      'description': description,
      'url': url,
      'applicationCategory': 'Utility',
      'operatingSystem': 'Web',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    }, 'jsonld-webapp');
  }, [title, description]);

  // Find related tools based on category
  const currentToolPath = location.pathname;
  const currentTool = tools.find(t => t.path === currentToolPath);

  // Get 5 related tools from the same category, excluding current one
  const relatedTools = currentTool
    ? tools
      .filter(t => t.category === currentTool.category && t.path !== currentToolPath)
      .sort(() => 0.5 - Math.random()) // Shuffle
      .slice(0, 5)
    : tools.slice(0, 5); // Fallback if tool not found

  const embedCode = `<iframe src="${currentUrl}" width="100%" height="600" frameborder="0" style="border:0; overflow:hidden;" allowtransparency="true"></iframe>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main id="main-content" role="main">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-primary hover:text-accent transition-colors hover:scale-105 transform">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tools
            </Link>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Tool Area */}
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      {Icon && (
                        <div className="p-3 bg-gradient-to-br from-purple-600 to-red-500 rounded-lg">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-2xl">{title}</CardTitle>
                        <CardDescription className="text-base mt-1">
                          {description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>

                    {(() => {
                      const location = typeof window !== 'undefined' ? { pathname: window.location.pathname } : { pathname: '' };
                      const pathContent = getToolContent(location.pathname || '');

                      // Fallback content if no specific content is found
                      const generalContent = !content && !pathContent ? `
                      <h2>About ${title}</h2>
                      <p>${description}</p>
                      <h3>How to Use</h3>
                      <ol>
                        <li>Provide inputs or upload files as needed.</li>
                        <li>Adjust settings or options relevant to your task.</li>
                        <li>Run the action and copy or download results.</li>
                      </ol>
                    ` : '';

                      const resolved = content ?? pathContent ?? generalContent;

                      return (
                        <>
                          <div className="prose prose-lg max-w-none mb-8" dangerouslySetInnerHTML={{ __html: resolved }} />
                          {children}

                          {/* Dynamic Rich Content from currentTool (tools.ts) */}
                          {currentTool && (currentTool as any).longDescription && (
                            <div className="mt-12 prose prose-lg max-w-none text-foreground">
                              <h2>Overview</h2>
                              <div dangerouslySetInnerHTML={{ __html: (currentTool as any).longDescription }} />
                            </div>
                          )}

                          {currentTool && (currentTool as any).howToUse && (
                            <div className="mt-8 prose prose-lg max-w-none text-foreground">
                              <h2>How to Use {(currentTool as any).name}</h2>
                              <ul className="list-decimal pl-6">
                                {(currentTool as any).howToUse.map((step: string, idx: number) => (
                                  <li key={idx} className="mb-2">{step}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {currentTool && (currentTool as any).benefits && (
                            <div className="mt-8 prose prose-lg max-w-none text-foreground">
                              <h2>Benefits of Using This Tool</h2>
                              <ul className="list-disc pl-6">
                                {(currentTool as any).benefits.map((benefit: string, idx: number) => (
                                  <li key={idx} className="mb-2">{benefit}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {currentTool && (currentTool as any).faqs && (currentTool as any).faqs.length > 0 && (
                            <div className="mt-12">
                              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                              <div className="space-y-6">
                                {(currentTool as any).faqs.map((faq: { question: string; answer: string }, idx: number) => (
                                  <div key={idx} className="bg-muted/30 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                                    <p className="text-muted-foreground">{faq.answer}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-6 text-center">
                            <p className="text-sm font-medium text-muted-foreground">
                              Free Online {title} Tool – No Download Required
                            </p>
                          </div>
                        </>
                      );
                    })()}



                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Social Share */}
                <SocialShare
                  url={currentUrl}
                  title={`Check out this free ${title} tool!`}
                  description={description}
                />

                {/* Embed Tool Feature - NEW */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Code className="h-4 w-4 mr-2 text-primary" />
                      Embed This Tool
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add this tool to your website or blog for free.
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Code className="h-4 w-4 mr-2" />
                          Get Embed Code
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Embed {title}</DialogTitle>
                          <DialogDescription>
                            Copy and paste this code into your website's HTML.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center space-x-2">
                          <div className="grid flex-1 gap-2">
                            <Label htmlFor="link" className="sr-only">
                              Link
                            </Label>
                            <Input
                              id="link"
                              defaultValue={embedCode}
                              readOnly
                              className="h-24 font-mono text-xs"
                            />
                          </div>
                          <Button type="submit" size="sm" className="px-3" onClick={copyEmbedCode}>
                            <span className="sr-only">Copy</span>
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>

                {/* Tool Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">About This Tool</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Free to use</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">No registration required</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Secure and private</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Features */}
                {features && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {features.map((feature, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Dynamic Related Tools - NEW */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Related Tools</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {relatedTools.map(tool => (
                        <Link
                          key={tool.id}
                          to={tool.path}
                          className="block text-sm text-primary hover:text-accent transition-colors hover:scale-105 transform py-1"
                        >
                          {tool.name}
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ToolTemplate;
