
import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getToolContent } from "@/data/toolContent";
import { ArrowLeft, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
                      const generalContent = `
                      <h2>About ${title}</h2>
                      <p>${description}</p>
                      <h3>How to Use</h3>
                      <ol>
                        <li>Provide inputs or upload files as needed.</li>
                        <li>Adjust settings or options relevant to your task.</li>
                        <li>Run the action and copy or download results.</li>
                      </ol>
                    `;
                      const resolved = content ?? pathContent ?? generalContent;
                      return (
                        <>
                          <div className="prose prose-lg max-w-none mb-8" dangerouslySetInnerHTML={{ __html: resolved }} />
                          {children}
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

                {/* Related Tools */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Related Tools</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Link to="/tools/password-generator" className="block text-sm text-primary hover:text-accent transition-colors hover:scale-105 transform">
                        Password Generator
                      </Link>
                      <Link to="/tools/qr-generator" className="block text-sm text-primary hover:text-accent transition-colors hover:scale-105 transform">
                        QR Code Generator
                      </Link>
                      <Link to="/tools/color-picker" className="block text-sm text-primary hover:text-accent transition-colors hover:scale-105 transform">
                        Color Picker
                      </Link>
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
