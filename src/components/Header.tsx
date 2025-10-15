
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background text-foreground shadow-sm border-b sticky top-0 z-50 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 animate-pulse-scale">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-red-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
              <span className="text-white font-bold text-sm">TT</span>
            </div>
            <span className="text-xl font-bold text-primary">TittoosTools</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-primary hover:text-accent transition-colors hover:scale-105 transform">
              Home
            </Link>
            <Link to="/tools" className="text-muted-foreground hover:text-primary transition-colors hover:scale-105 transform">
              All Tools
            </Link>
            <Link to="/categories" className="text-muted-foreground hover:text-primary transition-colors hover:scale-105 transform">
              Categories
            </Link>
            <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors hover:scale-105 transform">
              Blog
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors hover:scale-105 transform">
              About
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors hover:scale-105 transform">
              Contact
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors hover:scale-105 transform">
              Privacy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors hover:scale-105 transform">
              Terms
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tools..."
                className="pl-10 w-64"
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-muted-foreground hover:text-primary transition-colors hover:scale-105 transform"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/tools" 
                className="text-muted-foreground hover:text-primary transition-colors hover:scale-105 transform"
                onClick={() => setIsMenuOpen(false)}
              >
                All Tools
              </Link>
              <Link 
                to="/categories" 
                className="text-muted-foreground hover:text-primary transition-colors hover:scale-105 transform"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                to="/blog" 
                className="text-muted-foreground hover:text-primary transition-colors hover:scale-105 transform"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                to="/about" 
                className="text-muted-foreground hover:text-primary transition-colors hover:scale-105 transform"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-muted-foreground hover:text-primary transition-colors hover:scale-105 transform"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                to="/privacy" 
                className="text-muted-foreground hover:text-primary transition-colors hover:scale-105 transform"
                onClick={() => setIsMenuOpen(false)}
              >
                Privacy
              </Link>
              <Link 
                to="/terms" 
                className="text-muted-foreground hover:text-primary transition-colors hover:scale-105 transform"
                onClick={() => setIsMenuOpen(false)}
              >
                Terms
              </Link>
              <div className="pt-4 border-t">
                <Input placeholder="Search tools..." className="mb-3" />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
