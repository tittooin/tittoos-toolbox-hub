import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw, FileInput, Image as ImageIcon, Music, FileType2, Database, Layers, ArrowLeftRight, Check, AlertOctagon } from 'lucide-react';
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

            {/* Chapter 1: Visual Media Formats */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold border-b pb-4">1. Image Formats: The Visual Showdown</h2>
              <p className="text-lg text-muted-foreground">
                Not all pixels are created equal. Choosing the wrong format can double your website's load time or ruin a print job.
                Here is the definitive comparison:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-xs uppercase font-bold">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Format</th>
                      <th className="px-4 py-3">Best Use Case</th>
                      <th className="px-4 py-3">Transparency?</th>
                      <th className="px-4 py-3 rounded-tr-lg">Compression</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="bg-card">
                      <td className="px-4 py-3 font-medium">JPG / JPEG</td>
                      <td className="px-4 py-3">Photographs, Social Media</td>
                      <td className="px-4 py-3 text-red-500 font-bold">No</td>
                      <td className="px-4 py-3">Lossy (High)</td>
                    </tr>
                    <tr className="bg-card">
                      <td className="px-4 py-3 font-medium">PNG</td>
                      <td className="px-4 py-3">Logos, Screenshots, UI</td>
                      <td className="px-4 py-3 text-green-500 font-bold">Yes</td>
                      <td className="px-4 py-3">Lossless (Heavy)</td>
                    </tr>
                    <tr className="bg-card">
                      <td className="px-4 py-3 font-medium">WebP</td>
                      <td className="px-4 py-3">Modern Websites (Fast)</td>
                      <td className="px-4 py-3 text-green-500 font-bold">Yes</td>
                      <td className="px-4 py-3">Both (Superior)</td>
                    </tr>
                    <tr className="bg-card">
                      <td className="px-4 py-3 font-medium">SVG</td>
                      <td className="px-4 py-3">Icons, Illustrations</td>
                      <td className="px-4 py-3 text-green-500 font-bold">Yes</td>
                      <td className="px-4 py-3">Vector (Infinite Scaling)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Chapter 2: Audio Quality Explained */}
            <div className="bg-muted/30 p-8 rounded-2xl border">
              <h2 className="text-3xl font-bold mb-6 mt-0">2. Audio Bitrates: 128kbps vs 320kbps</h2>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Music className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">What is Bitrate?</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Think of bitrate as "water pressure" in a pipe. The higher the kbps (kilobits per second), the more data flows to your ears every second.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-background rounded-lg border">
                      <span className="text-xs font-bold text-red-500 uppercase">Streaming (Spotify Low)</span>
                      <div className="text-2xl font-bold">128 kbps</div>
                      <p className="text-xs text-muted-foreground mt-1">Removes high-pitch details. Good for speech.</p>
                    </div>
                    <div className="p-4 bg-background rounded-lg border">
                      <span className="text-xs font-bold text-green-500 uppercase">High Quality (MP3 Max)</span>
                      <div className="text-2xl font-bold">320 kbps</div>
                      <p className="text-xs text-muted-foreground mt-1">Near CD quality. Indistinguishable for most.</p>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-1/3 text-center">
                  <div className="text-sm font-mono text-muted-foreground mb-2">Waveform Sampling</div>
                  {/* Simplified Visualization */}
                  <div className="flex items-end justify-center gap-1 h-32 border-b border-foreground/20 pb-1">
                    <div className="w-2 bg-red-400 h-12 rounded-t opacity-50"></div>
                    <div className="w-2 bg-red-500 h-16 rounded-t"></div>
                    <div className="w-2 bg-red-400 h-10 rounded-t opacity-50"></div>
                    <div className="w-2 bg-red-600 h-24 rounded-t"></div>
                    <div className="w-2 bg-red-500 h-20 rounded-t"></div>
                    <div className="w-2 bg-red-600 h-28 rounded-t shadow-[0_0_10px_rgba(255,0,0,0.5)]"></div>
                    <div className="w-2 bg-red-500 h-20 rounded-t"></div>
                    <div className="w-2 bg-red-600 h-24 rounded-t"></div>
                    <div className="w-2 bg-red-400 h-16 rounded-t opacity-50"></div>
                  </div>
                  <p className="text-xs mt-2 text-muted-foreground">Higher Bitrate = More detailed peaks</p>
                </div>
              </div>
            </div>

            {/* Chapter 3: Encoding & Data Serialization */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold border-b pb-4">3. Data & Encoding: Speaking Computer</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Base64 Section */}
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2 mb-3">
                    <ArrowLeftRight className="w-5 h-5 text-orange-500" />
                    Why Base64?
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    The internet was built for text. Binary files (images) break when sent as raw text.
                    <strong>Base64</strong> converts binary data into safe text characters (A-Z, 0-9) so it can travel anywhere safely.
                  </p>
                  <div className="bg-muted p-4 rounded-lg font-mono text-xs overflow-x-auto">
                    <span className="text-green-600">iVBORw0KGgoAAAANSUhEUgAA...</span>
                    <span className="block mt-1 text-muted-foreground opacity-50">// This string IS an image</span>
                  </div>
                </div>

                {/* CSV vs JSON */}
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2 mb-3">
                    <Database className="w-5 h-5 text-blue-500" />
                    CSV vs. JSON
                  </h3>
                  <ul className="space-y-3">
                    <li className="text-sm">
                      <strong>CSV (Comma Separated):</strong> Flat tables. Great for Excel and humans. Bad for complex data.
                    </li>
                    <li className="text-sm">
                      <strong>JSON (JavaScript Object):</strong> Nested trees. Great for APIs and Web Apps. Can store lists inside lists.
                    </li>
                  </ul>
                  <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[10px]">
                    <div className="border p-2 rounded bg-background">
                      id,name<br />1,John
                    </div>
                    <div className="border p-2 rounded bg-background">
                      &#123; "id": 1, "name": "John" &#125;
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter 4: Troubleshooting */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold border-b pb-4">4. Troubleshooting & FAQ</h2>
              <div className="space-y-4">
                <details className="group border rounded-lg bg-background">
                  <summary className="flex justify-between items-center p-4 font-medium cursor-pointer list-none">
                    <span>Why did my image lose quality after conversion?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <div className="p-4 pt-0 text-muted-foreground text-sm group-open:animate-fadeIn">
                    You likely converted to a <strong>Lossy</strong> format like JPG. Once compressed, that data is gone forever. Always keep a PNG master copy.
                  </div>
                </details>
                <details className="group border rounded-lg bg-background">
                  <summary className="flex justify-between items-center p-4 font-medium cursor-pointer list-none">
                    <span>Can I convert a low-quality MP3 to high-quality WAV?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <div className="p-4 pt-0 text-muted-foreground text-sm group-open:animate-fadeIn">
                    No. You cannot add quality that isn't there. Converting 128kbps MP3 to WAV just creates a huge file with the same poor audio quality.
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

export default ConvertersCategoryPage;