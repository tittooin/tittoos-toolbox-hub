import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Lock, FileOutput, Merge, Scissors, RotateCw, MonitorPlay, BookOpen, Shield, Zap, HelpCircle, AlertTriangle } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { tools } from "@/data/tools";

const PDFCategoryPage = () => {
  // Filter by 'pdf' category
  const categoryTools = tools.filter(tool => tool.category === 'pdf');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Ultimate PDF Tools Guide: Convert, Merge, Split & Secure | Axevora</title>
        <meta name="description" content="The definitive guide to PDF management. Learn how to merge, split, compress, and secure documents. Free online tools for students, professionals, and businesses." />
        <meta name="keywords" content="pdf tools, merge pdf, split pdf, compress pdf, pdf security, ocr, pdf workflows, document management" />
        <meta property="og:title" content="Ultimate PDF Tools Guide: Convert, Merge, Split & Secure | Axevora" />
        <meta property="og:description" content="Master your digital documents. Comprehensive guide to editing, securing, and optimizing PDFs." />
      </Helmet>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-16">

          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl border bg-card">
              <img
                src="/assets/blog/pdf-tools-guide.png"
                alt="Ultimate PDF Tools Guide"
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center justify-center p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <FileText className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400">
                The Complete Guide to PDF Mastery
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                PDF (Portable Document Format) is the backbone of digital business.
                Yet, most users only scratch the surface of what's possible.
                This guide will turn you from a passive reader into a document power user.
              </p>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryTools.map((tool) => (
              <Link key={tool.id} to={tool.path} className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-red-500/50">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition-colors">
                        <tool.icon className="h-6 w-6 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors text-xl">
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
                    <div className="mt-4 flex items-center text-sm font-medium text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Launch Tool <span className="ml-1">→</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* EXTENDED CONTENT START */}
          <div className="prose dark:prose-invert max-w-none space-y-16">

            {/* Chapter 1: The Why */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold border-b pb-4">1. Why PDF Rules the World</h2>
              <p className="text-lg text-muted-foreground">
                Before PDF, sharing documents was a nightmare. Fonts would vanish, layouts would break, and images would disappear when moving from Windows to Mac.
                Adobe created the PDF in the 1990s to solve one specific problem: <strong>Portability</strong>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-muted/30 p-6 rounded-xl border">
                  <h3 className="font-bold flex items-center gap-2 mt-0">
                    <Lock className="w-5 h-5 text-red-500" />
                    Immutable Layouts
                  </h3>
                  <p className="m-0 text-sm">
                    What you see is exactly what they get. Fonts, images, and vectors are encapsulated within the file itself.
                    This makes it crucial for legal contracts, print-ready designs, and official forms.
                  </p>
                </div>
                <div className="bg-muted/30 p-6 rounded-xl border">
                  <h3 className="font-bold flex items-center gap-2 mt-0">
                    <Shield className="w-5 h-5 text-blue-500" />
                    Security Features
                  </h3>
                  <p className="m-0 text-sm">
                    Unlike a Word doc, a PDF can be encrypted with AES-256 bit security. You can restrict printing, copying text,
                    or even opening the file without a password.
                  </p>
                </div>
              </div>
            </div>

            {/* Chapter 2: Essential Workflows */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold border-b pb-4">2. Essential Workflows for 2024</h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Student Workflow */}
                <div className="bg-card border rounded-2xl p-6 shadow-sm">
                  <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold mt-0">The Student Stack</h3>
                  <ul className="space-y-3 pl-0 list-none mt-4 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-indigo-500 font-bold">1.</span>
                      <span>Scan notes with phone → <strong>Image to PDF</strong></span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-indigo-500 font-bold">2.</span>
                      <span>Combine chapters → <strong>Merge PDF</strong></span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-indigo-500 font-bold">3.</span>
                      <span>Reduce size for upload → <strong>Compress PDF</strong></span>
                    </li>
                  </ul>
                </div>

                {/* Business Workflow */}
                <div className="bg-card border rounded-2xl p-6 shadow-sm">
                  <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold mt-0">The Business Pro</h3>
                  <ul className="space-y-3 pl-0 list-none mt-4 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-emerald-500 font-bold">1.</span>
                      <span>Extract invoice page → <strong>Split PDF</strong></span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-emerald-500 font-bold">2.</span>
                      <span>Secure sensitive data → <strong>Lock PDF</strong></span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-emerald-500 font-bold">3.</span>
                      <span>Convert for editing → <strong>PDF to Word</strong></span>
                    </li>
                  </ul>
                </div>

                {/* Designer Workflow */}
                <div className="bg-card border rounded-2xl p-6 shadow-sm">
                  <div className="h-12 w-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mb-4">
                    <MonitorPlay className="w-6 h-6 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-bold mt-0">The Creative</h3>
                  <ul className="space-y-3 pl-0 list-none mt-4 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-pink-500 font-bold">1.</span>
                      <span>Portfolio export → <strong>PDF to JPG</strong> (for social)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-pink-500 font-bold">2.</span>
                      <span>Fix orientation → <strong>Rotate PDF</strong></span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-pink-500 font-bold">3.</span>
                      <span>Client Proofs → <strong>Watermark</strong> (coming soon)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Chapter 3: Technical Deep Dive */}
            <div className="bg-card border rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6 mt-0">3. Under the Hood: How it Works</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Merge className="w-5 h-5 text-primary" />
                    Data Compression vs. Quality
                  </h3>
                  <p className="text-muted-foreground">
                    When you use our <strong>Compress PDF</strong> tool, we aren't just "zipping" the file. We actively analyze the internal structure.
                    High-resolution images (often 300 DPI for print) are downsampled to screen resolution (72 or 150 DPI).
                    Redundant font data is stripped. This can reduce a 20MB scan to 2MB with barely noticeable visual difference.
                  </p>
                </div>

                <div className="h-px bg-border" />

                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Scissors className="w-5 h-5 text-primary" />
                    Vector vs. Raster PDF
                  </h3>
                  <p className="text-muted-foreground">
                    Not all PDFs are the same. A "True PDF" (created from Word/Docs) contains search-able text and crisp vector fonts.
                    A "Scanned PDF" is just a wrapper around a giant image. Our <strong>PDF to Word</strong> converters use basic OCR (Optical Character Recognition) principles
                    to try and reconstruct the text layer from these images.
                  </p>
                </div>
              </div>
            </div>

            {/* Chapter 4: The Science of Compression */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold border-b pb-4">4. The Science of Compression</h2>
              <p className="text-lg text-muted-foreground">
                Ever wonder how a 50MB PDF shrinks to 2MB? It's not magic; it's math.
                PDF compression uses two main techniques: <strong>Lossless (Deflate/LZW)</strong> and <strong>Lossy (JPEG/downsampling)</strong>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-lg mb-3">1. Downsampling</h3>
                  <p className="text-sm text-muted-foreground">
                    If an image is 3000px wide but only shown in a 300px box, it's wasting space.
                    We calculate the displayed size (DPI) and physically resize the image to match the target output (e.g., 72 DPI for screens).
                  </p>
                </div>
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-lg mb-3">2. Stream Deflation</h3>
                  <p className="text-sm text-muted-foreground">
                    Text in PDFs is just code. We use algorithms like <strong>FlateDecode</strong> to replace repeated patterns (like "the", "and") with short references, reducing text size by 40-60%.
                  </p>
                </div>
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-lg mb-3">3. Font Subsetting</h3>
                  <p className="text-sm text-muted-foreground">
                    Instead of embedding the entire "Arial" font file (all 50,000 characters), we only embed the 50 characters actually used in your document.
                  </p>
                </div>
              </div>
            </div>

            {/* Chapter 5: Security Standards */}
            <div className="bg-muted/30 p-8 rounded-2xl border">
              <h2 className="text-3xl font-bold mb-6 mt-0">5. PDF Security: AES & Permissions</h2>
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="flex-1 space-y-4">
                  <p className="text-muted-foreground">
                    Protecting a PDF isn't just about a password. It's about encryption strength.
                    Axevora uses <strong>AES-256</strong> (Advanced Encryption Standard), the same standard used by banks and governments.
                  </p>
                  <div>
                    <h4 className="font-bold flex items-center gap-2">
                      <Lock className="w-4 h-4 text-red-500" />
                      User Password (Open password)
                    </h4>
                    <p className="text-sm text-muted-foreground pl-6">Required just to view the file.</p>
                  </div>
                  <div>
                    <h4 className="font-bold flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      Owner Password (Permissions)
                    </h4>
                    <p className="text-sm text-muted-foreground pl-6">
                      Allows viewing, but blocks printing, copying text, or editing. Ideal for sending drafts or copyrighted material.
                    </p>
                  </div>
                </div>
                <div className="w-full lg:w-1/3 bg-background p-6 rounded-xl border shadow-inner">
                  <div className="text-center mb-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Secure</span>
                  </div>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between border-b pb-2">
                      <span>Encryption</span>
                      <span>AES-256-GCM</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span>Key Length</span>
                      <span>256 bit</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span>Hardening</span>
                      <span>100k Iterations</span>
                    </div>
                    <div className="flex justify-between text-red-500 font-bold">
                      <span>Brute Force</span>
                      <span>~Millions of Years</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter 6: OCR Explained */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold border-b pb-4">6. How OCR Turns Pixels into Text</h2>
              <p className="text-lg text-muted-foreground">
                Optical Character Recognition (OCR) is the bridge between a "dumb" image scan and a "smart" searchable document.
                Here's how our engine sees your page:
              </p>

              <div className="relative overflow-hidden rounded-xl border bg-background grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 border-b md:border-b-0 md:border-r flex flex-col justify-center items-center text-center space-y-4 bg-muted/20">
                  <div className="text-6xl font-serif font-bold text-gray-400 blur-[2px]">T</div>
                  <p className="text-sm font-bold text-muted-foreground">Input: A grid of pixels</p>
                  <p className="text-xs text-muted-foreground">To a computer, this is just a collection of gray dots.</p>
                </div>
                <div className="p-8 space-y-4">
                  <h3 className="font-bold text-lg">The Analysis Pipeline</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li><strong>Binarization:</strong> Convert varied gray to pure Black/White.</li>
                    <li><strong>Segmentation:</strong> Detect blobs of black pixels (potential letters).</li>
                    <li><strong>Feature Extraction:</strong> "Has a vertical line and a top hat?" -> Probably 'T'.</li>
                    <li><strong>Dictionary Match:</strong> "Thx" -> Likely "The" (Context correction).</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Chapter 7: Troubleshooting */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold border-b pb-4">7. Troubleshooting Common Issues</h2>

              <div className="space-y-4">
                <details className="group border rounded-lg bg-background">
                  <summary className="flex justify-between items-center p-4 font-medium cursor-pointer list-none">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      <span>Why is my converted Word doc formatting messy?</span>
                    </div>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="p-4 pt-0 text-muted-foreground text-sm group-open:animate-fadeIn">
                    PDFs don't store "paragraphs" or "tables" like Word does. They store "draw text 'Hello' at coordinates x:10, y:20".
                    Converting back requires guessing the logical structure. Complex layouts with floating images often result in imperfect reconstruction.
                  </div>
                </details>

                <details className="group border rounded-lg bg-background">
                  <summary className="flex justify-between items-center p-4 font-medium cursor-pointer list-none">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-red-500" />
                      <span>I lost my PDF password. Can you open it?</span>
                    </div>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="p-4 pt-0 text-muted-foreground text-sm group-open:animate-fadeIn">
                    If the file uses strong encryption (AES-128/256), it is mathematically impossible to break efficiently without a supercomputer.
                    Our <strong>Unlock PDF</strong> tool works best for files where you are the owner and need to remove <em>permissions</em> (like printing restrictions), not for hacking files.
                  </div>
                </details>

                <details className="group border rounded-lg bg-background">
                  <summary className="flex justify-between items-center p-4 font-medium cursor-pointer list-none">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-500" />
                      <span>Why is my merged PDF so huge?</span>
                    </div>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="p-4 pt-0 text-muted-foreground text-sm group-open:animate-fadeIn">
                    Merging adds the size of all files together. If you merge ten 5MB files, you get a 50MB file.
                    Always run the final result through our <strong>Compress PDF</strong> tool to deduplicate embedded fonts and optimize images.
                  </div>
                </details>
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

export default PDFCategoryPage;
