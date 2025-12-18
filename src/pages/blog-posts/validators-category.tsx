import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, FileCheck, Search, FileJson, AlertTriangle, BadgeCheck, Bug, Code2, Lock } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { tools } from "@/data/tools";

const ValidatorsCategoryPage = () => {
  // Filter tools that are useful for validation
  const validatorTools = tools.filter(tool =>
    tool.category === 'formatter' ||
    tool.name.includes('Validator') ||
    tool.description.toLowerCase().includes('validate')
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Online Validator Tools - HTML, JSON, XML & CSS Checker | Axevora</title>
        <meta name="description" content="Validate your code and data instantly. Free online validators for JSON, XML, HTML, CSS and more to ensure standards compliance and error-free development." />
        <meta name="keywords" content="json validator, xml validator, html validator, css validator, code checker, syntax validation, W3C compliance" />
        <meta property="og:title" content="Online Validator Tools - HTML, JSON, XML & CSS Checker | Axevora" />
        <meta property="og:description" content="Validate your code and data instantly. Free online validators for JSON, XML, HTML, CSS and more." />
      </Helmet>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-16">

          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl border bg-card">
              <img
                src="/assets/blog/validators-tools-guide.png"
                alt="Code & Data Validators"
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <ShieldCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
                Trust, but Verify
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                In the world of software, one wrong character can crash a system.
                Our validators analyze your code against strict industry standards to catch errors before deployment.
              </p>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {validatorTools.map((tool) => (
              <Link key={tool.id} to={tool.path} className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-green-500/50">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl group-hover:bg-green-100 dark:group-hover:bg-green-900/40 transition-colors">
                        <tool.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-xl">
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
                    <div className="mt-4 flex items-center text-sm font-medium text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Start Validating <span className="ml-1">→</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* EXTENDED CONTENT START */}
          <div className="prose dark:prose-invert max-w-none space-y-16">

            {/* Why Validation Matters */}
            <div className="bg-card border rounded-2xl p-8 shadow-sm">
              <h2 className="flex items-center gap-3 text-3xl font-bold mb-6 mt-0">
                <BadgeCheck className="w-8 h-8 text-emerald-500" />
                Why Validation is Non-Negotiable
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                "It works on my machine" is the famous last words of a developer. Validation ensures that your code works on
                <em>everyone's</em> machine by adhering to agreed-upon standards (Schemas, RFCs, W3C specs).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="p-6 bg-background rounded-xl border space-y-3">
                  <Bug className="w-8 h-8 text-red-500" />
                  <h3 className="text-lg font-bold m-0">Syntax Errors</h3>
                  <p className="text-sm text-muted-foreground m-0">
                    A single missing comma in a JSON config file can take down a server. Validators parse the structure to find these "invisible" breaking changes.
                  </p>
                </div>
                <div className="p-6 bg-background rounded-xl border space-y-3">
                  <Lock className="w-8 h-8 text-blue-500" />
                  <h3 className="text-lg font-bold m-0">Security</h3>
                  <p className="text-sm text-muted-foreground m-0">
                    "Input Validation" is web security 101. verifying data types (e.g., ensuring "age" is a number, not a script) prevents injection attacks.
                  </p>
                </div>
                <div className="p-6 bg-background rounded-xl border space-y-3">
                  <Search className="w-8 h-8 text-purple-500" />
                  <h3 className="text-lg font-bold m-0">Interoperability</h3>
                  <p className="text-sm text-muted-foreground m-0">
                    APIs talk to each other using strict schemas. If your XML or JSON output deviates even slightly, third-party integrations will fail.
                  </p>
                </div>
              </div>
            </div>

            {/* Technical Deep Dive */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold border-b pb-4">Understanding Schemas</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">What is a Schema?</h3>
                  <p className="text-muted-foreground">
                    Think of a <strong>Schema</strong> as a blueprint or contract.
                    A JSON file contains the data (the house), but the JSON Schema describes the rules (the blueprints: "Must have 2 doors", "Roof must be red").
                  </p>
                  <p className="text-muted-foreground">
                    Our validators check for <strong>Well-Formedness</strong> (is the syntax correct?) first.
                    Advanced validation checks <strong>Logic</strong> (does key "email" actually contain a valid email address?).
                  </p>
                </div>
                <div className="bg-muted/30 p-8 rounded-2xl border font-mono text-sm overflow-x-auto">
                  <div className="mb-2 text-green-600 text-xs uppercase tracking-wider font-bold">JSON Example</div>
                  <div className="text-muted-foreground">
                    {"{"}<br />
                    &nbsp;&nbsp;"id": 123, <span className="text-green-500">// Valid Number</span><br />
                    &nbsp;&nbsp;"isActive": "true" <span className="text-red-500">// Error: Expected Boolean, got String</span><br />
                    {"}"}
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground border-t pt-4">
                    A validator catches type mismatches that manual review often misses.
                  </p>
                </div>
              </div>
            </div>

            {/* Common Pitfalls Section */}
            <div className="bg-muted/30 p-8 rounded-2xl border">
              <h3 className="text-2xl font-bold mb-6 mt-0 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                Common Validation Pitfalls
              </h3>
              <div className="space-y-4">
                <details className="group pb-4 border-b last:border-0 last:pb-0">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none hover:text-primary transition-colors">
                    <span>Trailing Commas (JSON)</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-3 group-open:animate-fadeIn text-sm">
                    In JavaScript objects, trailing commas `{"{"} a: 1, {"}"}` are fine. In standard JSON, they are <strong>invalid</strong> and will cause parsing errors in many languages (Python, Java). Always validate before saving config files.
                  </p>
                </details>
                <details className="group pb-4 border-b last:border-0 last:pb-0">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none hover:text-primary transition-colors">
                    <span>Unclosed Tags (HTML)</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-3 group-open:animate-fadeIn text-sm">
                    Browsers are forgiving—they try to guess where a `&lt;/div&gt;` should go if you forget it. But this "Quirks Mode" can cause massive layout shifts and CSS bugs that are impossible to debug without a validator.
                  </p>
                </details>
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none hover:text-primary transition-colors">
                    <span>Hidden Characters</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-3 group-open:animate-fadeIn text-sm">
                    Copy-pasting from websites often brings invisible "Zero Width Spaces" or "Smart Quotes" (curled quotes) instead of standard quotes. These break code compilers instantly. Our tools strip these out.
                  </p>
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

export default ValidatorsCategoryPage;
