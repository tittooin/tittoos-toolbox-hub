import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { DEFAULT_BLOG_POSTS } from '@/data/blogs';
import GENERATED_BLOGS from "@/data/generated_blogs.json";

const BlogPreview = () => {
  const [displayedPosts, setDisplayedPosts] = useState<any[]>(DEFAULT_BLOG_POSTS.slice(0, 4));

  useEffect(() => {
    // 1. Load generated blogs from local storage (Drafts/Local)
    const generatedRaw = localStorage.getItem('generated_blogs');
    let localBlogs: any[] = [];
    if (generatedRaw) {
      try {
        localBlogs = JSON.parse(generatedRaw);
      } catch (e) {
        console.error("Failed to parse generated blogs in preview", e);
      }
    }

    // 2. Merge Static (Repo) and Local
    // Priority: Local > JSON > Default (But we usually want Repo to be the source of truth if duplicates)
    // Actually, deduplicate by Slug.
    const allStatic = [...DEFAULT_BLOG_POSTS, ...GENERATED_BLOGS];
    const staticSlugs = new Set(allStatic.map(p => p.slug));

    // Only add local blogs if they aren't already in static (repo)
    const uniqueLocal = localBlogs.filter(p => !staticSlugs.has(p.slug));

    // Combine all
    let allPosts = [...uniqueLocal, ...allStatic];

    // 3. Filter: Hide Future Posts (Homepage should usually only show Published)
    // User said: "Mean future post na bhi dikhe to chalega"
    allPosts = allPosts.filter(post => {
      if (!post.date) return true;
      return new Date(post.date) <= new Date();
    });

    // 4. Sort by Date (Newest First)
    allPosts.sort((a, b) => {
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    });

    // Smart Failover Image Logic (Copied from Blog.tsx for consistency)
    const getFallbackImage = (title: string) => {
      const lowerTitle = title.toLowerCase();
      let collection = [
        "https://images.unsplash.com/photo-1499750310159-5b5f38e31638?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800"
      ];

      if (lowerTitle.includes('code') || lowerTitle.includes('dev') || lowerTitle.includes('tech')) {
        collection = [
          "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800"
        ];
      } else if (lowerTitle.includes('ai') || lowerTitle.includes('smart')) {
        collection = [
          "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800"
        ];
      }

      let hash = 0;
      for (let i = 0; i < title.length; i++) {
        hash = title.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash) % collection.length;
      return collection[index];
    };

    // Show top 9
    setDisplayedPosts(allPosts.slice(0, 9).map(p => ({
      ...p,
      image: p.image || getFallbackImage(p.title)
    })));
  }, []);

  return (
    <section className="py-20 bg-muted/30 border-t border-border/50">
      <div className="container mx-auto px-4 text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Latest Insights & Tutorials</h2>
            <p className="text-lg text-muted-foreground">Expert guides on using AI tools, optimizing PDFs, and boosting your productivity.</p>
          </div>
          <Link to="/blog">
            <Button size="lg" className="hidden md:flex rounded-full px-8">
              Read the Blog <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {displayedPosts.map((post) => (
            <Card key={post.slug} className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group bg-background border-border/50 flex flex-col">
              <div className="h-56 overflow-hidden relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  {post.readTime || '5 min read'}
                </div>
              </div>
              <CardHeader className="pb-3 flex-grow">
                <div className="flex items-center gap-2 mb-3 text-xs font-medium text-primary uppercase tracking-wider">
                  {post.category || 'Guide'}
                </div>
                <CardTitle className="text-xl leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  <Link to={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed line-clamp-2 mb-4">
                  {post.excerpt}
                </CardDescription>
                <div className="flex items-center text-sm font-semibold text-primary group-hover:underline decoration-2 underline-offset-4">
                  Read Article
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-12 md:hidden">
          <Link to="/blog">
            <Button size="lg" className="w-full rounded-full">
              Read the Blog
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;