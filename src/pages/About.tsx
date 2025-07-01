
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            About TittoosTools
          </h1>
          
          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="text-xl leading-relaxed mb-8">
              TittoosTools is your comprehensive online toolkit designed to boost productivity 
              and simplify digital tasks. We provide 35+ essential utilities that cover everything 
              from file conversion to password generation.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="mb-6">
              We believe that powerful tools should be accessible to everyone. That's why we've 
              created a collection of free, easy-to-use utilities that help you accomplish tasks 
              quickly and efficiently, without the need for complex software installations.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Offer</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>File converters for documents, images, and media</li>
              <li>Secure password and UUID generators</li>
              <li>Text analyzers and formatting tools</li>
              <li>QR code and barcode generators</li>
              <li>Color pickers and design utilities</li>
              <li>Calculators for various needs</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Us?</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Completely free to use</li>
              <li>No registration required</li>
              <li>Fast and reliable performance</li>
              <li>Mobile-friendly design</li>
              <li>Privacy-focused approach</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
