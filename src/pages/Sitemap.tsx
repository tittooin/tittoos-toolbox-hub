
import { Link } from "react-router-dom";
import { tools, categories } from "@/data/tools";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, Wrench, BookOpen, User, Info, Lock } from "lucide-react";

// Group tools by category for better organization
const toolsByCategory = categories.reduce((acc, category) => {
    acc[category.id] = {
        name: category.name,
        tools: tools.filter(tool => tool.category === category.id)
    };
    return acc;
}, {} as Record<string, { name: string; tools: typeof tools }>);

const Sitemap = () => {
    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Sitemap - Axevora</title>
                <meta name="description" content="Complete sitemap of Axevora. Find all free online tools, converters, calculators, and detailed guides in one place." />
                <link rel="canonical" href="https://axevora.com/sitemap" />
            </Helmet>

            <Header />

            <main className="container mx-auto px-4 py-12 max-w-7xl">
                <h1 className="text-4xl font-bold mb-8 text-foreground">Sitemap</h1>
                <p className="text-xl text-muted-foreground mb-12">
                    Navigate through our entire collection of tools and resources.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">

                    {/* Main Pages */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold flex items-center gap-2 text-primary">
                            <Info className="w-5 h-5" /> Main Pages
                        </h2>
                        <ul className="space-y-2 border-l-2 border-muted pl-4">
                            <li><Link to="/" className="hover:text-primary hover:underline">Home</Link></li>
                            <li><Link to="/tools" className="hover:text-primary hover:underline">All Tools</Link></li>
                            <li><Link to="/categories" className="hover:text-primary hover:underline">Categories</Link></li>
                            <li><Link to="/blog" className="hover:text-primary hover:underline">Blog</Link></li>
                            <li><Link to="/about" className="hover:text-primary hover:underline">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-primary hover:underline">Contact</Link></li>
                        </ul>
                    </section>

                    {/* Legal Pages */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold flex items-center gap-2 text-primary">
                            <Lock className="w-5 h-5" /> Legal & Support
                        </h2>
                        <ul className="space-y-2 border-l-2 border-muted pl-4">
                            <li><Link to="/privacy" className="hover:text-primary hover:underline">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-primary hover:underline">Terms of Service</Link></li>
                            <li><Link to="/attributions" className="hover:text-primary hover:underline">Attributions</Link></li>
                            <li><Link to="/apps/neon-block-puzzle/privacy" className="hover:text-primary hover:underline">Neon Block Puzzle Privacy</Link></li>
                        </ul>
                    </section>

                    {/* Blog Categories */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold flex items-center gap-2 text-primary">
                            <BookOpen className="w-5 h-5" /> Blog Categories
                        </h2>
                        <ul className="space-y-2 border-l-2 border-muted pl-4">
                            {categories.map(cat => (
                                <li key={cat.id}>
                                    <Link to={cat.guidePath} className="hover:text-primary hover:underline">
                                        {cat.name} Guides
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <div className="my-12 border-t border-border" />

                {/* Tools by Category */}
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <Wrench className="w-8 h-8 text-primary" /> Tools Collection
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {Object.entries(toolsByCategory).map(([id, category]) => (
                        <section key={id} className="space-y-4 break-inside-avoid">
                            <h3 className="text-xl font-semibold text-foreground/80 border-b border-border pb-2">
                                {category.name}
                            </h3>
                            <ul className="space-y-2 pl-2">
                                {category.tools.map(tool => (
                                    <li key={tool.id}>
                                        <Link to={tool.path} className="text-muted-foreground hover:text-primary hover:underline flex items-start gap-2">
                                            <FileText className="w-4 h-4 mt-1 opacity-50 shrink-0" />
                                            {tool.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Sitemap;
