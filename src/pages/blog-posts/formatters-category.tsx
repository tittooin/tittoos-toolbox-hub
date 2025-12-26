import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlignLeft, FileCode, Braces, Indent, Code2, CheckCircle, Smartphone, Terminal, Feather } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { tools } from "@/data/tools";

const FormattersCategoryPage = () => {
  const location = useLocation();
  const canonicalUrl = `https://axevora.com${location.pathname.replace(/\/$/, "")}`;
  const categoryTools = tools.filter(tool => tool.category === 'formatter');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Online Code Formatters & Beautifiers - JSON, SQL, XML | Axevora</title>
        <meta name="description" content="Clean and beautify your code instantly. Free online formatters for JSON, SQL, XML, HTML, CSS and more to improve readability and maintain standards." />
        <meta name="keywords" content="code formatter, json beautifier, sql formatter, xml prettifier, html cleaner, indent code, developer tools, prettier online" />
        <meta property="og:title" content="Online Code Formatters & Beautifiers - JSON, SQL, XML | Axevora" />
        <meta property="og:description" content="Clean and beautify your code instantly. Free online formatters for JSON, SQL, XML, HTML, CSS and more." />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-16">

          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl border bg-card">
              <img
                src="/assets/blog/formatters-tools-guide.png"
                alt="Code Formatters & Beautifiers"
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center justify-center p-3 bg-teal-100 dark:bg-teal-900/30 rounded-full">
                <AlignLeft className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400">
                From Chaos to Order
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Spaghetti code isn't just ugly—it's dangerous.
                Standardize your indentation, align your loops, and make your data readable instantly.
              </p>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryTools.map((tool) => (
              <Link key={tool.id} to={tool.path} className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-teal-500/50">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl group-hover:bg-teal-100 dark:group-hover:bg-teal-900/40 transition-colors">
                        <tool.icon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors text-xl">
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
                    <div className="mt-4 flex items-center text-sm font-medium text-teal-600 dark:text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Format Code <span className="ml-1">→</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* EXTENDED CONTENT START */}
          <div className="prose dark:prose-invert max-w-none space-y-16">

            {/* Why Formatting Matters */}
            <div className="bg-card border rounded-2xl p-8 shadow-sm">
              <h2 className="flex items-center gap-3 text-3xl font-bold mb-6 mt-0">
                <Braces className="w-8 h-8 text-cyan-500" />
                The Cognitive Cost of Messy Code
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                Developers spend 10x more time reading code than writing it. Formatting isn't just aesthetic; it's about
                reducing <strong>Cognitive Load</strong>. When code follows a predictable shape (Standard Indentation, Line Breaks), part of your brain can switch to autopilot, allowing you to focus on the logic instead of parsing the syntax.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2 m-0">
                    <Code2 className="w-5 h-5 text-indigo-500" />
                    For Tech Teams
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li><strong>Code Reviews:</strong> Diffs are cleaner when files are formatted properly.</li>
                    <li><strong>Onboarding:</strong> Juniors can read senior code without getting lost in nested brackets.</li>
                    <li><strong>Debugging:</strong> Finding that missing closing tag is impossible in a single-line HTML file.</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2 m-0">
                    <FileCode className="w-5 h-5 text-pink-500" />
                    For Data Analysts
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li><strong>JSON Analysis:</strong> APIs return minified data. Beautifying it reveals the structure.</li>
                    <li><strong>SQL Queries:</strong> Complex JOINs and sub-queries become readable blocks.</li>
                    <li><strong>Error Spotting:</strong> Visual indentation usually highlights logic errors immediately.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Deep Dive: Minification vs Beautification */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold border-b pb-4">The Lifecycle of Code</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-muted/30 p-6 rounded-xl border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-background border rounded-lg">
                      <Feather className="w-5 h-5 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold m-0">Beautification (Dev Time)</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    This is for humans. We add "Whitespace"—spaces, tabs, and newlines.
                    Computers ignore whitespace, but humans rely on it to delineate scope (loops, functions, objects).
                    <br /><br />
                    <strong>Goal:</strong> Readability & Maintenace.
                  </p>
                </div>
                <div className="bg-muted/30 p-6 rounded-xl border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-background border rounded-lg">
                      <Terminal className="w-5 h-5 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold m-0">Minification (Build Time)</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    This is for machines. We remove all whitespace, comments, and shorten variable names (`var userCount` becomes `var a`).
                    This reduces file size by 30-70%.
                    <br /><br />
                    <strong>Goal:</strong> Performance & Download Speed.
                  </p>
                </div>
              </div>
            </div>

            {/* Standards */}
            <div className="flex gap-6 items-start p-6 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="pt-1">
                <CheckCircle className="w-8 h-8 text-teal-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold m-0 mb-2">Tabs vs. Spaces?</h3>
                <p className="text-muted-foreground m-0">
                  The eternal debate! Our tools default to <strong>2 Spaces</strong> (common in JS/HTML) or <strong>4 Spaces</strong> (common in Python/SQL).
                  However, accessibility experts argue for <strong>Tabs</strong>, as they allow users to set their own indentation width preference in their editor.
                  Ultimately, consistency is key—pick one and stick to it using a `.editorconfig` file.
                </p>
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

export default FormattersCategoryPage;