
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

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    // Set SEO meta tags
    document.title = "TittoosTools - 40+ Essential Online Utilities | Free Web Tools";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Free online tools for productivity: video converters, password generators, QR codes, calculators, formatters, AI tools, social media downloaders and more. No registration required.');
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'TittoosTools - 40+ Essential Online Utilities | Free Web Tools');
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Free online tools for productivity: video converters, password generators, QR codes, calculators, formatters, AI tools, social media downloaders and more.');
    }
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-red-100 animate-fade-in">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-red-500">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-20 text-center text-white">
          <h1 className="text-5xl font-bold mb-6 animate-slide-up">
            TittoosTools
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90 animate-slide-up delay-100">
            Your complete toolkit for online productivity. 40+ essential utilities including converters, 
            generators, analyzers, editors, and social media downloaders - all in one place.
          </p>
          <div className="flex justify-center animate-slide-up delay-200">
            <Button size="lg" className="bg-white text-primary hover:text-accent hover:scale-105 transition-all" onClick={scrollToTools}>
              Explore Tools <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section id="tools-section" className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search tools..."
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
                  <h2 className="text-2xl font-bold text-purple-800 mb-6 flex items-center">
                    <span className="w-1 h-8 bg-gradient-to-b from-purple-600 to-red-500 rounded-full mr-4"></span>
                    {categoryData.name}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryData.tools.map((tool) => (
                      <Link key={tool.id} to={tool.path}>
                        <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between mb-3">
                              <div className="p-2 bg-gradient-to-br from-purple-600 to-red-500 rounded-lg">
                                <tool.icon className="h-6 w-6 text-white" />
                              </div>
                              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                                {categories.find(c => c.id === tool.category)?.name}
                              </span>
                            </div>
                            <CardTitle className="text-lg group-hover:text-red-600 transition-colors">
                              {tool.name}
                            </CardTitle>
                            <p className="text-sm text-purple-600 font-medium">
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
              <h2 className="text-3xl font-bold text-center mb-12 text-purple-800">
                {categories.find(c => c.id === selectedCategory)?.name || "Filtered Tools"}
              </h2>
              
              {filteredTools.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No tools found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredTools.map((tool) => (
                    <Link key={tool.id} to={tool.path}>
                      <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-gradient-to-br from-purple-600 to-red-500 rounded-lg">
                              <tool.icon className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                              {categories.find(c => c.id === tool.category)?.name}
                            </span>
                          </div>
                          <CardTitle className="text-lg group-hover:text-red-600 transition-colors">
                            {tool.name}
                          </CardTitle>
                          <p className="text-sm text-purple-600 font-medium">
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

      <BlogPreview />
      <Footer />
    </div>
  );
};

export default Index;
