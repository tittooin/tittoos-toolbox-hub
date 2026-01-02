import React, { useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { setSEO, injectJsonLd } from "@/utils/seoUtils";
import { CheckCircle, Shield, Zap, Globe, Users, Heart } from "lucide-react";

const About = () => {
  useEffect(() => {
    setSEO({
      title: "About Axevora - Our Mission & Story",
      description: "Learn about Axevora's mission to provide free, secure, and fast online utilities. Discover our story, technology, and commitment to privacy.",
      keywords: ['about axevora', 'free online tools', 'privacy focused tools', 'web utilities mission'],
      url: window.location.href,
      type: 'website'
    });

    injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      'mainEntity': {
        '@type': 'Organization',
        'name': 'Axevora',
        'description': 'Provider of free, secure, and client-side online utilities.',
        'url': window.location.origin,
        'logo': `${window.location.origin}/favicon.png`,
        'foundingDate': '2024',
        'mission': 'To make powerful web utilities accessible to everyone, for free, without compromising privacy.'
      }
    }, 'jsonld-about');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Empowering Your Digital Workflow
          </h1>
          <p className="text-xl text-muted-foreground">
            Axevora is a suite of powerful, free, and privacy-focused online tools designed to simplify your daily tasks.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Globe className="mr-3 h-6 w-6 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                We believe that essential digital tools should be accessible to everyone, everywhere. Whether you need to convert a file, generate a secure password, or analyze your website's SEO, you shouldn't have to pay for expensive software or sign up for yet another account. Our mission is to democratize access to these utilities.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Shield className="mr-3 h-6 w-6 text-blue-600" />
                Privacy First
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                In an age of data breaches, your privacy is our top priority. Unlike other platforms, <strong>Axevora processes your files locally in your browser</strong> whenever possible. This means your sensitive documents, images, and data never leave your device. We don't store your files, and we don't sell your data.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why Choose Us */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">Why Choose Axevora?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-lg dark:bg-green-900/20">
                <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">Built with modern web technologies for instant load times and rapid processing.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg dark:bg-purple-900/20">
                <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">100% Free</h3>
                <p className="text-muted-foreground">No hidden fees, no premium subscriptions, and no credit card required.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-orange-100 p-3 rounded-lg dark:bg-orange-900/20">
                <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">User Friendly</h3>
                <p className="text-muted-foreground">Clean, intuitive interfaces designed for everyone, from students to professionals.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-red-100 p-3 rounded-lg dark:bg-red-900/20">
                <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Made with Love</h3>
                <p className="text-muted-foreground">Continuously updated and improved based on user feedback and needs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* The Team / EEAT Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-foreground">Meet the Creator</h2>
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto p-8 bg-card rounded-xl border border-border shadow-sm">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-blue-600 mb-6 flex items-center justify-center text-white font-bold text-4xl shadow-lg">
              PM
            </div>
            <h3 className="font-bold text-2xl mb-2">Pankaj More</h3>
            <p className="text-primary font-medium mb-4 text-lg">Lead Developer & Founder</p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Pankaj is a passionate full-stack developer dedicated to building open, accessible, and privacy-first web utilities. He created Axevora to solve the frustration of "paywalled" simple tools, ensuring everyone has access to powerful technology for free.
            </p>

            {/* Amazon AppStore Verification Badge */}
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-dashed border-muted-foreground/30">
              <p className="text-sm font-semibold text-muted-foreground">
                <Shield className="w-4 h-4 inline-block mr-1 mb-0.5" />
                Verification Statement
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Official Android App for Amazon AppStore is managed by <strong>Rajweda</strong> (Pankaj More).
                <br />
                Owner of <strong>axevora.com</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* The Story */}
        <div className="max-w-3xl mx-auto text-center bg-muted/30 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Axevora started as a small side project to solve a simple problem: finding a reliable, free PDF converter that didn't require an email signup. What began as a single tool has grown into a comprehensive suite of over 40 utilities, serving thousands of users daily. We are a small, passionate team of developers dedicated to building the best free tools on the web.
          </p>
          <div className="mt-8 pt-8 border-t border-border">
            <p className="font-semibold mb-2">Technical Reliability</p>
            <p className="text-sm text-muted-foreground">
              Hosted on enterprise-grade infrastructure with 99.9% uptime. Certified secure by leading cybersecurity auditors.
            </p>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default About;
