import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AUTHORS } from "@/data/authors";
import { setSEO, injectJsonLd } from "@/utils/seoUtils";

const Author = () => {
  const { slug } = useParams<{ slug: string }>();
  const author = AUTHORS.find(a => a.slug === slug);

  useEffect(() => {
    const origin = window.location.origin;
    const canonical = `${origin}/author/${slug ?? ''}`;
    if (author) {
      setSEO({
        title: `${author.name} – Author at Axevora`,
        description: author.bio,
        type: 'website',
        url: canonical,
      });
      injectJsonLd({
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': author.name,
        'url': canonical,
        'description': author.bio,
        ...(author.avatarUrl ? { 'image': author.avatarUrl } : {}),
        ...(author.website ? { 'sameAs': [author.website] } : {}),
      }, 'jsonld-author');
    } else {
      setSEO({
        title: 'Author Not Found – Axevora',
        description: 'The requested author profile could not be found.',
        type: 'website',
        url: canonical,
        noindex: true,
      });
    }
  }, [author, slug]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {!author ? (
            <Card>
              <CardHeader>
                <CardTitle>Author Not Found</CardTitle>
                <CardDescription>
                  We couldn’t locate this author profile.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/blog" className="text-primary hover:text-accent">Back to Blog</Link>
              </CardContent>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 h-32"></div>
              <CardHeader className="relative pt-0">
                <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-4 gap-4">
                  <div className="rounded-full p-1 bg-background shadow-lg">
                    {author.avatarUrl ? (
                      <img src={author.avatarUrl} alt={author.name} className="w-24 h-24 rounded-full object-cover" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold">
                        {author.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-3xl font-bold">{author.name}</CardTitle>
                    <p className="text-muted-foreground font-medium">Senior Tech Writer & Developer</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">About Me</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {author.bio}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Expertise</h3>
                      <div className="flex flex-wrap gap-2">
                        {['Web Development', 'React.js', 'SEO Optimization', 'Tool Building', 'Cloud Architecture'].map((skill) => (
                          <span key={skill} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-semibold mb-3">Connect</h3>
                      <div className="space-y-3">
                        {author.website && (
                          <a href={author.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                            <span className="w-20 font-medium">Website:</span>
                            <span className="truncate">{new URL(author.website).hostname}</span>
                          </a>
                        )}
                        {author.twitter && (
                          <a href={author.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                            <span className="w-20 font-medium">Twitter:</span>
                            <span>@tittooin</span>
                          </a>
                        )}
                        {author.linkedin && (
                          <a href={author.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                            <span className="w-20 font-medium">LinkedIn:</span>
                            <span>View Profile</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t">
                  <Link to="/blog" className="inline-flex items-center text-primary hover:text-accent font-medium">
                    ← Back to Blog
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Author;