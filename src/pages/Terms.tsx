
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Terms of Service
          </h1>
          
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="prose prose-lg max-w-none text-gray-600">
              <p className="text-sm text-gray-500 mb-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Acceptance of Terms</h2>
              <p className="mb-6">
                By accessing and using TittoosTools, you accept and agree to be bound by the 
                terms and provision of this agreement.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Use License</h2>
              <p className="mb-6">
                Permission is granted to temporarily use TittoosTools for personal and commercial use. 
                This is the grant of a license, not a transfer of title, and under this license you may:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Use our tools for legitimate purposes</li>
                <li>Share links to our tools with others</li>
                <li>Process your own files and data</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Prohibited Uses</h2>
              <p className="mb-4">You may not:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Use our tools for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the security or integrity of our services</li>
                <li>Process copyrighted material without permission</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Disclaimer</h2>
              <p className="mb-6">
                The materials on TittoosTools are provided on an 'as is' basis. TittoosTools 
                makes no warranties, expressed or implied, and hereby disclaims and negates all 
                other warranties including, without limitation, implied warranties or conditions 
                of merchantability, fitness for a particular purpose, or non-infringement of 
                intellectual property or other violation of rights.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
              <p className="mb-6">
                If you have any questions about these Terms of Service, please contact us at{" "}
                <a href="mailto:legal@tittoostools.com" className="text-blue-600 hover:text-blue-800">
                  legal@tittoostools.com
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
