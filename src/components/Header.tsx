
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Users, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <header className="bg-background text-foreground shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <img src="/logo.png" alt="Axevora Logo" className="w-8 h-8 rounded-lg hover:scale-110 transition-transform" />
            <span className="text-xl font-bold text-primary">Axevora</span>
          </Link>

          {/* Desktop Navigation */}
          <nav id="primary-navigation" className="hidden lg:flex items-center space-x-6 text-sm font-medium">
            <Link to="/" className="no-underline text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/community" className="no-underline text-foreground hover:text-primary transition-colors flex items-center gap-1.5 font-semibold group">
              <Users className="w-4 h-4 text-violet-500 group-hover:scale-110 transition-transform" />
              Community
              <Badge className="bg-violet-600/10 text-violet-600 hover:bg-violet-600/20 border-none text-[10px] px-1.5 py-0 font-bold ml-0.5">NEW</Badge>
            </Link>
            <Link to="/tools" className="no-underline text-muted-foreground hover:text-primary transition-colors">
              All Tools
            </Link>
            <Link to="/deals" className="no-underline text-muted-foreground hover:text-primary transition-colors">
              Deals
            </Link>
            <Link to="/workspace" className="no-underline text-muted-foreground hover:text-primary transition-colors">
              Workspace
            </Link>
            <Link to="/creator-studio" className="no-underline text-muted-foreground hover:text-primary transition-colors">
              Creator Studio
            </Link>
            <Link to="/categories" className="no-underline text-muted-foreground hover:text-primary transition-colors">
              Categories
            </Link>
            <Link to="/blog" className="no-underline text-muted-foreground hover:text-primary transition-colors">
              Blog
            </Link>

            {/* Dropdown for Secondary Links */}
            <div className="relative" onMouseLeave={() => setIsMoreOpen(false)}>
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                onMouseEnter={() => setIsMoreOpen(true)}
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors py-2 focus:outline-none"
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMoreOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-card border border-border shadow-xl rounded-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link to="/submit-blog" className="block px-4 py-2 text-xs text-muted-foreground hover:text-primary hover:bg-accent/50 transition-colors" onClick={() => setIsMoreOpen(false)}>
                    Submit Your Blog
                  </Link>
                  <Link to="/about" className="block px-4 py-2 text-xs text-muted-foreground hover:text-primary hover:bg-accent/50 transition-colors" onClick={() => setIsMoreOpen(false)}>
                    About Us
                  </Link>
                  <Link to="/contact" className="block px-4 py-2 text-xs text-muted-foreground hover:text-primary hover:bg-accent/50 transition-colors" onClick={() => setIsMoreOpen(false)}>
                    Contact Support
                  </Link>
                  <div className="my-1 border-t border-border/50"></div>
                  <Link to="/privacy" className="block px-4 py-2 text-xs text-muted-foreground hover:text-primary hover:bg-accent/50 transition-colors" onClick={() => setIsMoreOpen(false)}>
                    Privacy Policy
                  </Link>
                  <Link to="/terms" className="block px-4 py-2 text-xs text-muted-foreground hover:text-primary hover:bg-accent/50 transition-colors" onClick={() => setIsMoreOpen(false)}>
                    Terms of Service
                  </Link>
                  <Link to="/attributions" className="block px-4 py-2 text-xs text-muted-foreground hover:text-primary hover:bg-accent/50 transition-colors" onClick={() => setIsMoreOpen(false)}>
                    Attributions
                  </Link>
                </div>
              )}
            </div>
          </nav>


          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-muted-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div id="mobile-menu" className="lg:hidden py-4 border-t">
            <nav className="flex flex-col space-y-3 font-medium text-sm">
              <Link
                to="/"
                className="text-foreground hover:text-primary transition-colors py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/community"
                className="text-violet-600 font-bold hover:text-violet-700 transition-colors flex items-center justify-between py-1.5 px-3 bg-violet-500/10 rounded-lg border border-violet-500/20"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-violet-600" />
                  Community Hub
                </div>
                <Badge className="bg-violet-600 text-white border-none text-[10px]">JOIN NOW</Badge>
              </Link>
              <Link
                to="/tools"
                className="text-muted-foreground hover:text-primary transition-colors py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                All Tools
              </Link>
              <Link
                to="/deals"
                className="text-muted-foreground hover:text-primary transition-colors py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Deals & Offers
              </Link>
              <Link
                to="/workspace"
                className="text-muted-foreground hover:text-primary transition-colors py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Workspace
              </Link>
              <Link
                to="/creator-studio"
                className="text-muted-foreground hover:text-primary transition-colors py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Creator Studio
              </Link>
              <Link
                to="/categories"
                className="text-muted-foreground hover:text-primary transition-colors py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                to="/blog"
                className="text-muted-foreground hover:text-primary transition-colors py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <div className="pt-2 border-t border-border/50 grid grid-cols-2 gap-2 text-xs">
                <Link
                  to="/submit-blog"
                  className="text-muted-foreground hover:text-primary py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Submit Blog
                </Link>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-primary py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="text-muted-foreground hover:text-primary py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Terms
                </Link>
                <Link
                  to="/attributions"
                  className="text-muted-foreground hover:text-primary py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Attributions
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
