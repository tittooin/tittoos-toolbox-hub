
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Online Tools for Digital Productivity",
      excerpt: "Discover the most useful online tools that can boost your productivity and streamline your digital workflow.",
      date: "2024-01-15",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Password Security Best Practices in 2024",
      excerpt: "Learn how to create and manage strong passwords to keep your accounts secure in the digital age.",
      date: "2024-01-10",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "File Conversion Made Easy: A Complete Guide",
      excerpt: "Everything you need to know about converting files between different formats for various use cases.",
      date: "2024-01-05",
      readTime: "6 min read"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            TittoosTools Blog
          </h1>
          <p className="text-xl text-gray-600 text-center mb-12">
            Tips, tutorials, and insights to help you make the most of our tools.
          </p>

          <div className="space-y-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2 hover:text-blue-600 transition-colors cursor-pointer">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {post.excerpt}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <span>{post.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">
              More articles coming soon! Stay tuned for helpful tips and tutorials.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
