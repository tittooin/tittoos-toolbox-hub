
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Share2 } from "lucide-react";
import { toast } from "sonner";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const trustpilotRef = useRef(null);

  useEffect(() => {
    // Manually load Trustpilot widget when component mounts
    // @ts-ignore
    if (window.Trustpilot && trustpilotRef.current) {
      // @ts-ignore
      window.Trustpilot.loadFromElement(trustpilotRef.current, true);
    }
  }, []);

  return (
    <footer className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-md shrink-0">
                <span className="font-bold text-primary-foreground text-base leading-none">A</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-primary">Axevora</span>
            </div>
            <p className="text-muted-foreground mb-4 text-xs leading-relaxed">
              Discover smarter buying options, engage with the creator community, play arcade games, and access 120+ privacy-first web utilities — all in one ecosystem.
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
                      text: 'Check out this page on Axevora',
                      url: window.location.href,
                    };
                    if (navigator.share) {
                      await navigator.share(shareData);
                    } else if (navigator.clipboard && window.isSecureContext) {
                      await navigator.clipboard.writeText(shareData.url);
                      toast.success('Link copied to clipboard');
                    } else {
                      window.location.href = `mailto:admin@axevora.com?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.url)}`;
                    }
                  } catch (e) {
                    console.warn('Share canceled or failed', e);
                  }
                }}
              >
                <Share2 className="h-4 w-4" />
                <span className="text-xs font-semibold">Share Axevora</span>
              </button>
            </div>
          </div>

          {/* Ecosystem Pillars */}
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-foreground mb-4">Ecosystem Pillars</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/shopping" className="text-muted-foreground hover:text-amber-500 font-semibold transition-colors">
                  ⚡ Product Intelligence
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-muted-foreground hover:text-violet-500 font-semibold transition-colors">
                  👥 Creator & Deals Community
                </Link>
              </li>
              <li>
                <Link to="/tools/pool-shooter" className="text-muted-foreground hover:text-emerald-500 font-semibold transition-colors">
                  🎮 Games & Arcade
                </Link>
              </li>
              <li>
                <Link to="/tools" className="text-muted-foreground hover:text-primary font-semibold transition-colors">
                  🛠️ Productivity Tools (120+)
                </Link>
              </li>
              <li>
                <Link to="/deals" className="text-muted-foreground hover:text-rose-500 font-semibold transition-colors">
                  🏷️ Store Deals & Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Tools */}
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-foreground mb-4">Popular Tools</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/tools/pdf-converter" className="text-muted-foreground hover:text-foreground transition-colors">
                  PDF Converter
                </Link>
              </li>
              <li>
                <Link to="/tools/image-converter" className="text-muted-foreground hover:text-foreground transition-colors">
                  Image Converter & Editor
                </Link>
              </li>
              <li>
                <Link to="/tools/password-generator" className="text-muted-foreground hover:text-foreground transition-colors">
                  Secure Password Generator
                </Link>
              </li>
              <li>
                <Link to="/tools/qr-generator" className="text-muted-foreground hover:text-foreground transition-colors">
                  QR Code Generator
                </Link>
              </li>
              <li>
                <Link to="/tools/json-formatter" className="text-muted-foreground hover:text-foreground transition-colors">
                  JSON Formatter & Validator
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-foreground mb-4">Company & Legal</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Axevora
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Support
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
                  Blog & Articles
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer Tools */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Developer Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/tools/windows-cmd-gen" className="text-muted-foreground hover:text-foreground transition-colors">
                  Windows CMD Gen
                </Link>
              </li>
              <li>
                <Link to="/tools/linux-cmd-gen" className="text-muted-foreground hover:text-foreground transition-colors">
                  Linux Terminal Gen
                </Link>
              </li>
              <li>
                <Link to="/tools/mac-cmd-gen" className="text-muted-foreground hover:text-foreground transition-colors">
                  MacOS Terminal Gen
                </Link>
              </li>
              <li>
                <Link to="/tools/android-adb-gen" className="text-muted-foreground hover:text-foreground transition-colors">
                  Android ADB Gen
                </Link>
              </li>
              <li>
                <Link to="/tools/json-formatter" className="text-muted-foreground hover:text-foreground transition-colors">
                  JSON Formatter
                </Link>
              </li>
              <li>
                <Link to="/blog-posts/validators-category" className="text-muted-foreground hover:text-foreground transition-colors">
                  Validators
                </Link>
              </li>
              <li>
                <Link to="/apps/neon-block-puzzle/privacy" className="text-muted-foreground hover:text-foreground transition-colors text-xs">
                  Neon Puzzle Privacy
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="text-muted-foreground hover:text-foreground transition-colors text-xs">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center space-y-2">
          <p className="text-muted-foreground">
            © {currentYear} Axevora. All rights reserved. Built for productivity.
          </p>
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            <span>Icons by lucide-react</span>
            <span>•</span>
            <span>UI via shadcn/ui</span>
            <span>•</span>
            <span>Disclosure: Pages may display ads.</span>
          </div>

          {/* Social Proof Badges */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-6">
            <a href='https://www.saashub.com/axevora?utm_source=badge&utm_campaign=badge&utm_content=axevora&badge_variant=color&badge_kind=approved' target='_blank' rel="noopener noreferrer">
              <img src="https://cdn-b.saashub.com/img/badges/approved-color.png?v=1" alt="Axevora badge" style={{ maxWidth: '150px' }} />
            </a>

            {/* TrustBox widget - Review Collector */}
            <div ref={trustpilotRef} className="trustpilot-widget" data-locale="en-US" data-template-id="56278e9abfbbba0bdcd568bc" data-businessunit-id="694f95971d2da56aaca4f247" data-style-height="52px" data-style-width="100%">
              <a href="https://www.trustpilot.com/review/axevora.com" target="_blank" rel="noopener">Trustpilot</a>
            </div>
            {/* End TrustBox widget */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
