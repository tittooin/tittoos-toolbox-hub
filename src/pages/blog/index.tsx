import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const BlogPage = () => {
  const blogPosts = [
    {
      title: 'Complete Guide to Online Analysis Tools 2024',
      description: 'Gain valuable insights with our comprehensive suite of analysis tools for SEO, website performance, text content, and more.',
      path: '/blog-posts/analyzers-category',
      category: 'Analyzers',
      date: '2024-01-15'
    },
    {
      title: 'Essential Online Calculator Tools Guide 2024',
      description: 'Perform accurate calculations with our comprehensive suite of online calculators for basic math, percentages, BMI, loans, and more.',
      path: '/blog-posts/calculators-category',
      category: 'Calculators',
      date: '2024-01-15'
    },
    {
      title: 'Complete Guide to Online Formatting Tools 2024',
      description: 'Format and beautify your code with our comprehensive suite of online formatters for JSON, XML, SQL, and more.',
      path: '/blog-posts/formatters-category',
      category: 'Formatters',
      date: '2024-01-15'
    },
    {
      title: 'AI Tools and Automation Guide 2024',
      description: 'Enhance your productivity with our comprehensive suite of AI tools for content creation, website generation, tool development, and image generation.',
      path: '/blog-posts/ai-tools-category',
      category: 'AI Tools',
      date: '2024-01-15'
    },
    {
      title: 'Online Validation Tools Guide 2024',
      description: 'Ensure code quality and data integrity with our comprehensive suite of online validators for JSON, XML, HTML, CSS, and more.',
      path: '/blog-posts/validators-category',
      category: 'Validators',
      date: '2024-01-15'
    },
    {
      title: 'Online File Conversion Tools Guide 2024',
      description: 'Transform files efficiently with our comprehensive suite of online converters for documents, images, videos, and audio files.',
      path: '/blog-posts/converters-category',
      category: 'Converters',
      date: '2024-01-15'
    },
    {
      title: 'Online Generator Tools Guide 2024',
      description: 'Create custom content with our comprehensive suite of online generators for passwords, QR codes, UUIDs, and placeholder text.',
      path: '/blog-posts/generators-category',
      category: 'Generators',
      date: '2024-01-15'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-red-500">
      <Helmet>
        <title>Blog Posts | TittoosTools</title>
        <meta name="description" content="Explore our comprehensive guides about various online tools and their applications." />
        <meta property="og:title" content="Blog Posts | TittoosTools" />
        <meta property="og:description" content="Explore our comprehensive guides about various online tools and their applications." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Blog Posts</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <Link
              key={index}
              to={post.path}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <div className="p-6">
                <div className="text-sm text-purple-600 font-semibold mb-2">{post.category}</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <div className="text-sm text-gray-500">{post.date}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;