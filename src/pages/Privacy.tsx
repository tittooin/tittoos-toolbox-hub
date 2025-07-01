
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Privacy Policy
          </h1>
          
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="prose prose-lg max-w-none text-gray-600">
              <p className="text-sm text-gray-500 mb-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
              <p className="mb-6">
                TittoosTools is designed with privacy in mind. Most of our tools process data locally 
                in your browser, meaning your files and data never leave your device.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Information</h2>
              <p className="mb-6">
                We may collect basic analytics data to understand how our tools are used and to 
                improve our services. This includes:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Page views and tool usage statistics</li>
                <li>Browser type and device information</li>
                <li>General location data (country/region)</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Storage</h2>
              <p className="mb-6">
                We do not store any files you upload or process through our tools. All file 
                processing happens locally in your browser for maximum privacy and security.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Third-Party Services</h2>
              <p className="mb-6">
                We may use third-party services for analytics and performance monitoring. 
                These services have their own privacy policies governing the use of your information.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
              <p className="mb-6">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:privacy@tittoostools.com" className="text-blue-600 hover:text-blue-800">
                  privacy@tittoostools.com
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

export default Privacy;
