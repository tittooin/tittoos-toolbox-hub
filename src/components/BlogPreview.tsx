import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DEFAULT_BLOG_POSTS } from '@/data/blogs';

const BlogPreview = () => {
  const [displayedPosts, setDisplayedPosts] = useState<any[]>(DEFAULT_BLOG_POSTS.slice(0, 4));

  useEffect(() => {
    // Load generated blogs from local storage
    const generatedRaw = localStorage.getItem('generated_blogs');
    let generatedPosts: any[] = [];

    if (generatedRaw) {
      try {
        generatedPosts = JSON.parse(generatedRaw);
      } catch (e) {
        console.error("Failed to parse generated blogs in preview", e);
      }
    }

    // Combine and Sort by Date (Newest First)
    const allPosts = [...generatedPosts, ...DEFAULT_BLOG_POSTS].sort((a, b) => {
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    });

    // Show top 6
    setDisplayedPosts(allPosts.slice(0, 6));
  }, []);

  return (
    <section className="container mx-auto px-4 py-16 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          Latest Blog Posts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedPosts.map((post) => (
            <Card key={post.slug} className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group bg-card backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{post.date}</span>
                </div>
                <CardTitle className="text-xl">
                  <Link to={`/blog/${post.slug}`} className="group-hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {post.excerpt}
                </CardDescription>
                <div className="mt-3 text-sm text-muted-foreground">
                  By{' '}
                  <span className="text-primary">
                    {post.author || 'Axevora AI Team'}
                  </span>
                  {' '}• {post.readTime || '5 min read'}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/blog" className="text-primary hover:text-primary/80 font-medium">
            Explore all blog articles →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;