
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-foreground">
            Terms of Service
          </h1>

          <div className="bg-card rounded-lg p-8 shadow-sm">
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-sm text-muted-foreground mb-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Acceptance of Terms</h2>
              <p className="mb-6">
                By accessing and using Axevora, you accept and agree to be bound by the
                terms and provision of this agreement.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Use License</h2>
              <p className="mb-6">
                Permission is granted to temporarily use Axevora for personal and commercial use.
                This is the grant of a license, not a transfer of title, and under this license you may:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Use our tools for legitimate purposes</li>
                <li>Share links to our tools with others</li>
                <li>Process your own files and data</li>
              </ul>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Prohibited Uses</h2>
              <p className="mb-4">You may not:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Use our tools for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the security or integrity of our services</li>
                <li>Process copyrighted material without permission</li>
              </ul>

              <h2 className="text-2xl font-semibold text-foreground mb-4">User‑Generated Content</h2>
              <p className="mb-6">
                If you upload or process content, you represent that you own the rights to it or have permission.
                You are solely responsible for ensuring your use complies with all applicable laws and platform terms.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Copyright Complaints</h2>
              <p className="mb-6">
                If you believe material processed via our tools infringes your copyright, please email
                <a href="mailto:admin@axevora.com" className="text-primary hover:text-primary/80"> admin@axevora.com</a>
                with details and supporting documentation. We will investigate and take appropriate action.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Disclaimer</h2>
              <p className="mb-6">
                The materials on Axevora are provided on an 'as is' basis. Axevora
                makes no warranties, expressed or implied, and hereby disclaims and negates all
                other warranties including, without limitation, implied warranties or conditions
                of merchantability, fitness for a particular purpose, or non-infringement of
                intellectual property or other violation of rights.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
              <p className="mb-6">
                If you have any questions about these Terms of Service, please contact us at{" "}
                <a href="mailto:admin@axevora.com" className="text-primary hover:text-primary/80">
                  admin@axevora.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;
