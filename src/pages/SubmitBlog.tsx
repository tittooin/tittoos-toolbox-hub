import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogSubmissionForm from "@/components/BlogSubmissionForm";
import { useNavigate } from "react-router-dom";
import { setSEO } from "@/utils/seoUtils";

const SubmitBlog = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setSEO({
      title: "Submit Your Blog | TittoosTools",
      description: "Share your article with the community. Submit your blog post for review and publishing on TittoosTools.",
      type: "website",
      image: `${window.location.origin}/placeholder.svg`,
    });
  }, []);

  const handleClose = () => {
    setOpen(false);
    navigate("/blog");
  };

  const handleSave = (blog: any) => {
    try {
      const existing = JSON.parse(localStorage.getItem("submittedBlogs") || "[]");
      existing.push(blog);
      localStorage.setItem("submittedBlogs", JSON.stringify(existing));
    } catch { }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Submit Your Blog | TittoosTools</title>
        <meta name="description" content="Submit your blog post for review and publishing on TittoosTools." />
        <meta name="robots" content="noindex" />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Submit Your Blog</h1>
          <p className="text-muted-foreground mb-8">
            Share your knowledge with our community. Fill out the form to submit your article for review.
          </p>
        </div>

        {open && (
          <BlogSubmissionForm onClose={handleClose} onSave={handleSave} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SubmitBlog;
