
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-foreground">
            Privacy Policy
          </h1>
          
          <div className="bg-card rounded-lg p-8 shadow-sm">
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-sm text-muted-foreground mb-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
              <p className="mb-6">
                TittoosTools is designed with privacy in mind. Most of our tools process data locally 
                in your browser, meaning your files and data never leave your device.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Information</h2>
              <p className="mb-6">
                We may collect basic analytics data to understand how our tools are used and to 
                improve our services. This includes:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Page views and tool usage statistics</li>
                <li>Browser type and device information</li>
                <li>General location data (country/region)</li>
              </ul>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Data Storage</h2>
              <p className="mb-6">
                We do not store any files you upload or process through our tools. All file 
                processing happens locally in your browser for maximum privacy and security.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Advertising and Cookies</h2>
              <p className="mb-6">
                We display advertisements via Google AdSense. Google may use cookies to serve ads 
                based on your prior visits to this and other websites. These cookies enable Google and its partners 
                to serve ads to you based on your browsing activity.
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Google’s use of advertising cookies enables it and its partners to serve ads to you.</li>
                <li>You may opt out of personalized advertising by visiting Google’s <a href="https://adssettings.google.com/" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">Ads Settings</a>.</li>
                <li>Alternatively, opt out of third-party vendors’ use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Consent for EEA/UK Users</h2>
              <p className="mb-6">
                For users in the European Economic Area (EEA) and the United Kingdom, we display a consent banner 
                to obtain your preferences for the use of cookies and personalized ads. You can update your preferences 
                at any time from the footer link.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Children’s Privacy</h2>
              <p className="mb-6">
                Our services are not directed to children under 13. We do not knowingly collect personal information from children. 
                If you believe a child has provided us with personal information, please contact us and we will promptly delete it.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
              <p className="mb-6">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:admin@tittoos.online" className="text-primary hover:text-primary/80">
                  admin@tittoos.online
                </a>
              </p>

              <p className="text-sm text-muted-foreground">
                For more information, please review the <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">Google Ad Policies</a> and 
                <a href="https://support.google.com/adsense/answer/1348695" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">How Google uses data</a>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;
