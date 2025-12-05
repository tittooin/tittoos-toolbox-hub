
import { Link } from 'react-router-dom';
import { Share2 } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-red-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">TT</span>
              </div>
              <span className="text-xl font-bold">TittoosTools</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Your complete toolkit for online productivity. Access 35+ essential utilities
              including converters, generators, analyzers, and editors - all in one place.
            </p>
            <div className="flex space-x-4">
              <button
                type="button"
                aria-label="Share this page"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                onClick={async () => {
                  try {
                    const shareData = {
                      title: document.title,
                      text: 'Check out this page on TittoosTools',
                      url: window.location.href,
                    };
                    if (navigator.share) {
                      await navigator.share(shareData);
                    } else if (navigator.clipboard && window.isSecureContext) {
                      await navigator.clipboard.writeText(shareData.url);
                      alert('Link copied to clipboard');
                    } else {
                      // Fallback: open mailto with default recipient
                      window.location.href = `mailto:admin@tittoos.online?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.url)}`;
                    }
                  } catch (e) {
                    console.warn('Share canceled or failed', e);
                  }
                }}
              >
                <Share2 className="h-5 w-5" />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>

          {/* Tools Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/tools/pdf-converter" className="text-muted-foreground hover:text-foreground transition-colors">
                  PDF Converter
                </Link>
              </li>
              <li>
                <Link to="/tools/password-generator" className="text-muted-foreground hover:text-foreground transition-colors">
                  Password Generator
                </Link>
              </li>
              <li>
                <Link to="/tools/qr-generator" className="text-muted-foreground hover:text-foreground transition-colors">
                  QR Code Generator
                </Link>
              </li>
              <li>
                <Link to="/tools/color-picker" className="text-muted-foreground hover:text-foreground transition-colors">
                  Color Picker
                </Link>
              </li>
              <li>
                <Link to="/tools/text-analyzer" className="text-muted-foreground hover:text-foreground transition-colors">
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
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/attributions" className="text-muted-foreground hover:text-foreground transition-colors">
                  Attributions & Licensing
                </Link>
              </li>
            </ul>
          </div>

          {/* Attributions & Licensing */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Attributions & Licensing</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="text-sm">Icons by lucide-react (ISC License).</li>
              <li className="text-sm">UI components via shadcn/ui (MIT License).</li>
              <li className="text-sm">Built with React, Vite, Tailwind CSS.</li>
              <li className="text-sm">Brand names/logos belong to their respective owners.</li>

            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © {currentYear} TittoosTools. All rights reserved. Built with ❤️ for productivity.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Disclosure: Some pages may display ads to keep tools free.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
