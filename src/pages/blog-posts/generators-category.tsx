import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Binary, Key, RefreshCw, FilePlus, Fingerprint, Lock, QrCode, ShieldAlert, Dice5, Database } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { tools } from "@/data/tools";

const GeneratorsCategoryPage = () => {
  const location = useLocation();
  const canonicalUrl = `https://axevora.com${location.pathname.replace(/\/$/, "")}`;
  const categoryTools = tools.filter(tool => tool.category === 'generator');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Free Online Generator Tools - Passwords, Hashes & QR Codes | Axevora</title>
        <meta name="description" content="Generate secure passwords, hashes, QR codes, and random data instantly. Free online generator tools for developers and security conscious users. Uses CSPRNG for max security." />
        <meta name="keywords" content="password generator, hash generator, qr code generator, random number generator, uuid generator, csprng, secure password, developer tools" />
        <meta property="og:title" content="Free Online Generator Tools - Passwords, Hashes & QR Codes | Axevora" />
        <meta property="og:description" content="Generate secure passwords, hashes, QR codes, and random data instantly." />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-16">

          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl border bg-card">
              <img
                src="/assets/blog/generators-tools-guide.png"
                alt="Online Data Generators"
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                <RefreshCw className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                Instant Digital Assets
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Don't rely on "123456" or guessable patterns. Generate cryptographically strong secrets,
                unique identifiers, and structured data instantly in your browser.
              </p>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryTools.map((tool) => (
              <Link key={tool.id} to={tool.path} className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-indigo-500/50">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors">
                        <tool.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-xl">
                      {tool.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {tool.subheading}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {tool.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Generate Now <span className="ml-1">→</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* EXTENDED CONTENT START */}
          <div className="prose dark:prose-invert max-w-none space-y-16">

            {/* The Science of Randomness */}
            <div className="bg-card border rounded-2xl p-8 shadow-sm">
              <h2 className="flex items-center gap-3 text-3xl font-bold mb-6 mt-0">
                <Binary className="w-8 h-8 text-violet-500" />
                True Randomness is Hard
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                Humans are terrible at being random. Ask a person to pick a number between 1 and 10, and they will almost never pick 1 or 10.
                Computers, surprisingly, also struggle. Standard "random" functions rely on predictable mathematical formulas based on the system clock.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2 m-0 text-red-600 dark:text-red-400">
                    <Dice5 className="w-5 h-5" />
                    Math.random() (Unsafe)
                  </h3>
                  <p className="text-muted-foreground m-0 text-sm">
                    Fast but deterministic. If a hacker knows the "seed" (timestamp when you generated the number), they can predict the entire sequence.
                    <strong>Never use this for passwords.</strong>
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2 m-0 text-green-600 dark:text-green-400">
                    <ShieldAlert className="w-5 h-5" />
                    CSPRNG (Secure)
                  </h3>
                  <p className="text-muted-foreground m-0 text-sm">
                    "Cryptographically Secure Pseudo-Random Number Generator". This is what Axevora uses (via <code>window.crypto</code>).
                    It pulls entropy from unpredictable sources like your mouse movements, network noise, and thermal cpu fluctuations.
                  </p>
                </div>
              </div>
            </div>

            {/* RFC Standards Deep Dive */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold border-b pb-4">Standardizing Uniqueness</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg h-fit">
                      <Fingerprint className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <strong className="block text-foreground text-lg mb-1">UUID (Universally Unique Identifier)</strong>
                      <p className="text-muted-foreground text-sm m-0">
                        A UUID v4 looks like this: <code>f47ac10b-58cc-4372-a567-0e02b2c3d479</code>.
                        It has 122 random bits. The probability of generating a duplicate is so low that you would need to generate 1 billion UUIDs per second for 85 years to have a 50% chance of a single collision.
                        It allows databases to create IDs without checking with a central server.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg h-fit">
                      <QrCode className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <strong className="block text-foreground text-lg mb-1">QR Codes</strong>
                      <p className="text-muted-foreground text-sm m-0">
                        Not random, but highly structured. A QR code contains built-in "Error Correction".
                        You can damage up to 30% of a "High" level QR code (tear it, smudge it), and it will still scan perfectly.
                        This redundancy makes them perfect for physical marketing.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 p-8 rounded-2xl border">
                  <h3 className="text-2xl font-bold mb-6 mt-0">Security Best Practices</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-500 w-2 h-2 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground block">Length &gt; Complexity</strong>
                        <p className="m-0 text-sm text-muted-foreground">A 25-character lowercase password is harder to crack than an 8-character "complex" one.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-green-500 w-2 h-2 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground block">Salting Hashes</strong>
                        <p className="m-0 text-sm text-muted-foreground">When hashing passwords (MD5/SHA), always add a random string ("Salt") to prevent lookup table attacks.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-green-500 w-2 h-2 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground block">Client-Side Generation</strong>
                        <p className="m-0 text-sm text-muted-foreground">Never us a generator that sends your password to a server. Our tools run locally in your browser memory.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          {/* EXTENDED CONTENT END */}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GeneratorsCategoryPage;