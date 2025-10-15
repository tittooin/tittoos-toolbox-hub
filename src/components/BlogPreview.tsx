import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DEFAULT_BLOG_POSTS } from '@/data/blogs';

const BlogPreview = () => {
  return (
    <section className="container mx-auto px-4 py-16 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          Latest Blog Posts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {DEFAULT_BLOG_POSTS.slice(0, 4).map((post) => (
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
                  <Link to={`/author/${post.authorSlug}`} className="text-primary hover:text-primary/80">
                    {post.author}
                  </Link>
                  {' '}• {post.readTime}
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