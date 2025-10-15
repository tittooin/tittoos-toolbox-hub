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
        title: `${author.name} – Author at TittoosTools`,
        description: author.bio,
        type: 'website',
        canonical,
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
        title: 'Author Not Found – TittoosTools',
        description: 'The requested author profile could not be found.',
        type: 'website',
        canonical,
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
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{author.name}</CardTitle>
                <CardDescription>{author.bio}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {author.website && (
                    <div>
                      <span className="font-medium">Website: </span>
                      <a href={author.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent">{author.website}</a>
                    </div>
                  )}
                  {author.twitter && (
                    <div>
                      <span className="font-medium">Twitter: </span>
                      <a href={author.twitter} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent">{author.twitter}</a>
                    </div>
                  )}
                  {author.linkedin && (
                    <div>
                      <span className="font-medium">LinkedIn: </span>
                      <a href={author.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent">{author.linkedin}</a>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <Link to="/blog" className="text-primary hover:text-accent">Back to Blog</Link>
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