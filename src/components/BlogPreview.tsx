import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BlogPost {
  title: string;
  description: string;
  path: string;
  date: string;
}

const blogPosts: BlogPost[] = [
  {
    title: 'Complete Guide to Online Analysis Tools 2024',
    description: 'Gain valuable insights with our comprehensive suite of analysis tools for SEO, website performance, text content, and more.',
    path: '/blog-posts/analyzers-category',
    date: '2024-01-15'
  },
  {
    title: 'Essential Online Calculator Tools Guide 2024',
    description: 'Perform accurate calculations with our comprehensive suite of online calculators for basic math, percentages, BMI, loans, and more.',
    path: '/blog-posts/calculators-category',
    date: '2024-01-15'
  },
  {
    title: 'Complete Guide to Online Formatting Tools 2024',
    description: 'Format and beautify your code with our comprehensive suite of online formatters for JSON, XML, SQL, and more.',
    path: '/blog-posts/formatters-category',
    date: '2024-01-15'
  },
  {
    title: 'AI Tools and Automation Guide 2024',
    description: 'Enhance your productivity with our comprehensive suite of AI tools for content creation, website generation, tool development, and image generation.',
    path: '/blog-posts/ai-tools-category',
    date: '2024-01-15'
  },
  {
    title: 'Online Validation Tools Guide 2024',
    description: 'Ensure code quality and data integrity with our comprehensive suite of online validators for JSON, XML, HTML, CSS, and more.',
    path: '/blog-posts/validators-category',
    date: '2024-01-15'
  },
  {
    title: 'Online File Conversion Tools Guide 2024',
    description: 'Transform files efficiently with our comprehensive suite of online converters for documents, images, videos, and audio files.',
    path: '/blog-posts/converters-category',
    date: '2024-01-15'
  },
  {
    title: 'Online Generator Tools Guide 2024',
    description: 'Create custom content with our comprehensive suite of online generators for passwords, QR codes, UUIDs, and placeholder text.',
    path: '/blog-posts/generators-category',
    date: '2024-01-15'
  }
];

const BlogPreview = () => {
  return (
    <section className="container mx-auto px-4 py-16 bg-gradient-to-br from-purple-100 to-red-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-purple-800">
          Latest Blog Posts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {blogPosts.map((post, index) => (
            <Link key={index} to={post.path}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-purple-600">{post.date}</span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-red-600 transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {post.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;