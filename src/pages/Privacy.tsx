import { Helmet } from 'react-helmet-async';
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Privacy Policy - Axevora</title>
        <meta
          name="description"
          content="Privacy Policy and Terms of Use for Axevora. Learn how we handle your data, cookies, and protect your privacy."
        />
        <link rel="canonical" href="https://axevora.com/privacy" />
      </Helmet>
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>

        <h2 className="text-2xl font-semibold text-foreground mb-4">DMCA / Removal Requests</h2>
        <p className="mb-6">
          To submit a removal request, email <a href="mailto:admin@axevora.com" className="text-primary hover:text-primary/80">admin@axevora.com</a>
          with links, a description of the content, and proof of ownership. We aim to respond promptly.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mb-4">AI Services & Third-Party APIs</h2>
        <p className="mb-6">
          The Axevora app and website utilize third-party Generative AI services (including but not limited to
          <strong> Google Gemini</strong> and <strong>Pollinations.ai</strong>) to provide content generation,
          image creation, and productivity features. These services are integrated as third-party APIs.
          No personal user data is shared with these providers except for the prompts explicitly provided by the user.
        </p>

        <h3 className="text-2xl font-semibold text-foreground mb-4">Games & Apps Privacy</h3>
        <p className="mb-6">
          To view privacy policies for our specific mobile games and applications, please visit:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><Link to="/apps/neon-block-puzzle/privacy" className="text-primary hover:underline">Neon Block Puzzle Privacy Policy</Link></li>
        </ul>

        <h2 className="text-2xl font-semibold text-foreground mb-4">Children’s Privacy</h2>
        <p className="mb-6">
          Our services are not directed to children under 13. We do not knowingly collect personal information from children.
          If you believe a child has provided us with personal information, please contact us and we will promptly delete it.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mb-4">Google AdSense and DoubleClick DART cookie</h2>
        <p className="mb-6">
          Google, as a third-party vendor, uses cookies to serve ads on Axevora. Google's use of the DART cookie enables it to serve ads to our users based on their visit to Axevora and other sites on the Internet. Users may opt out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mb-4">California Online Privacy Protection Act (CalOPPA)</h2>
        <p className="mb-6">
          Following CalOPPA, we agree to the following: Users can visit our site anonymously. Once this privacy policy is created, we will add a link to it on our home page or as a minimum, on the first significant page after entering our website. Our Privacy Policy link includes the word 'Privacy' and can easily be found on the page specified above.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mb-4">GDPR Compliance</h2>
        <p className="mb-6">
          For users in the European Economic Area (EEA), we comply with the General Data Protection Regulation (GDPR). You have the right to access, rectify, or erase your personal data, and to object to or restrict its processing.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
        <p className="mb-6">
          If you have any questions about this Privacy Policy, please contact us at{" "}
          <a href="mailto:admin@axevora.com" className="text-primary hover:text-primary/80">
            admin@axevora.com
          </a>
        </p>

        <p className="text-sm text-muted-foreground">
          For more information, please review the <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">Google Ad Policies</a> and
          <a href="https://support.google.com/adsense/answer/1348695" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">How Google uses data</a>.
        </p>
      </main>

      <Footer />
    </div >
  );
};

export default Privacy;
