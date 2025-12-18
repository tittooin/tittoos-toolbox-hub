import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw, FileInput, ImageLike, Music, FileType2, Database, Layers, ArrowLeftRight, Check, AlertOctagon } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { tools } from "@/data/tools";

const ConvertersCategoryPage = () => {
  // Filter tools that are primarily converters
  const converterTools = tools.filter(tool =>
    tool.category === 'converter' ||
    tool.name.includes('Converter') ||
    tool.description.toLowerCase().includes('convert')
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Free Online File Converters - Image, Audio, Data & Base64 | Axevora</title>
        <meta name="description" content="Convert any file format instantly. Free online tools for images (JPG/PNG/WebP), data (JSON/CSV), and encoding (Base64). Fast, secure, and client-side processing." />
        <meta name="keywords" content="file converter, image converter, json to csv, base64 encoder, data conversion, webp converter, free online tools" />
        <meta property="og:title" content="Free Online File Converters - Image, Audio, Data & Base64 | Axevora" />
        <meta property="og:description" content="Convert any file format instantly. Free online tools for images, data, and encoding." />
      </Helmet>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-16">

          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl border bg-card">
              <img
                src="/assets/blog/converters-tools-guide.png"
                alt="File Transformation Tools"
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center justify-center p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <RefreshCcw className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400">
                Fluid Data
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Technology evolves, but file formats stick around. Bridge the gap between legacy systems and modern web standards
                with our universal conversion suite.
              </p>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {converterTools.map((tool) => (
              <Link key={tool.id} to={tool.path} className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-orange-500/50">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl group-hover:bg-orange-100 dark:group-hover:bg-orange-900/40 transition-colors">
                        <tool.icon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors text-xl">
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
                    <div className="mt-4 flex items-center text-sm font-medium text-orange-600 dark:text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Convert Now <span className="ml-1">→</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* EXTENDED CONTENT START */}
          <div className="prose dark:prose-invert max-w-none space-y-16">

            {/* Lossy vs Lossless */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold border-b pb-4">Lossy vs. Lossless: The Great Debate</h2>
              <p className="text-lg text-muted-foreground">
                All conversions involve a trade-off. Do you prioritize <strong>Quality</strong> (keeping every pixel perfect) or <strong>Size</strong> (fast loading speed)?
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-red-600 dark:text-red-400 flex items-center gap-2 m-0 mb-4">
                    <Layers className="w-5 h-5" />
                    Lossy Compression
                  </h3>
                  <ul className="space-y-3 pl-0 list-none m-0">
                    <li className="text-sm border-b pb-2">
                      <strong>Formats:</strong> JPG, MP3, WebP (standard)
                    </li>
                    <li className="text-sm border-b pb-2">
                      <strong>How it works:</strong> It throws away data that the human eye/ear is unlikely to notice.
                    </li>
                    <li className="text-sm pt-2">
                      <strong>Best For:</strong> Website photos, streaming audio, social media.
                    </li>
                  </ul>
                </div>
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-green-600 dark:text-green-400 flex items-center gap-2 m-0 mb-4">
                    <Database className="w-5 h-5" />
                    Lossless Compression
                  </h3>
                  <ul className="space-y-3 pl-0 list-none m-0">
                    <li className="text-sm border-b pb-2">
                      <strong>Formats:</strong> PNG, FLAC, WAV, ZIP
                    </li>
                    <li className="text-sm border-b pb-2">
                      <strong>How it works:</strong> Like a ZIP file, it compresses data patterns but restores them 100% perfectly upon opening.
                    </li>
                    <li className="text-sm pt-2">
                      <strong>Best For:</strong> Logos, transparent images, archival storage, medical data.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Encoding Explained */}
            <div className="bg-muted/30 p-8 rounded-2xl border">
              <h2 className="text-2xl font-bold mb-6 mt-0">Why do we need Base64?</h2>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <p className="text-muted-foreground m-0">
                    Computers speak binary (0s and 1s). The Internet protocols (HTTP, SMTP email) were originally built to only transmit text (ASCII).
                    If you try to send a raw image file through an old email system, it corrupts the data.
                    <br /><br />
                    <strong>Base64</strong> is a translation layer. It takes binary data (like an image) and turns it into safe printable text characters (A-Z, 0-9).
                    This makes the file 33% larger but ensures it can travel safely across any network without getting mangled.
                  </p>
                </div>
                <div className="w-full md:w-1/3 bg-background p-4 rounded-lg border font-mono text-xs overflow-hidden">
                  <div className="text-orange-500 mb-2">// Raw Image (Binary)</div>
                  <div className="mb-4 text-muted-foreground">PNG...IHDR...</div>
                  <ArrowLeftRight className="w-4 h-4 mx-auto my-2 text-muted-foreground" />
                  <div className="text-green-500 mb-2">// Base64 (Safe Text)</div>
                  <div className="break-all text-muted-foreground">iVBORw0KGgoAAAANSUhEUgAA...</div>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold border-b pb-4">Common Conversion Scenarios</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <ImageLike className="w-5 h-5 text-primary" />
                    Web Optimization
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Converting massive PNG screenshots to <strong>WebP</strong> format can reduce page load size by 80%, directly improving your Google SEO score (Core Web Vitals).
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    Data Migration
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Moving from Excel to a Web App? You need to convert <strong>CSV to JSON</strong>. Developers use JSON because it nests data hierarchically, unlike the flat rows of a CSV.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <FileType2 className="w-5 h-5 text-primary" />
                    Legacy Support
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Some old government websites or printers only accept <strong>TIFF</strong> or <strong>JPG</strong>. Modern iPhones shoot in HEIC. Converters are the translator between these eras.
                  </p>
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

export default ConvertersCategoryPage;