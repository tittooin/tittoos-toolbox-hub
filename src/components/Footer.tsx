
import { Link } from "react-router-dom";
import { Mail, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TT</span>
              </div>
              <span className="text-xl font-bold">TittoosTools</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your complete toolkit for online productivity. Access 35+ essential utilities 
              including converters, generators, analyzers, and editors - all in one place.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Tools Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/tools/pdf-converter" className="text-gray-300 hover:text-white transition-colors">
                  PDF Converter
                </Link>
              </li>
              <li>
                <Link to="/tools/password-generator" className="text-gray-300 hover:text-white transition-colors">
                  Password Generator
                </Link>
              </li>
              <li>
                <Link to="/tools/qr-generator" className="text-gray-300 hover:text-white transition-colors">
                  QR Code Generator
                </Link>
              </li>
              <li>
                <Link to="/tools/color-picker" className="text-gray-300 hover:text-white transition-colors">
                  Color Picker
                </Link>
              </li>
              <li>
                <Link to="/tools/text-analyzer" className="text-gray-300 hover:text-white transition-colors">
                  Text Analyzer
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear} TittoosTools. All rights reserved. Built with ❤️ for productivity.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
