import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Users, ChevronDown, User, LogOut, Settings, ShieldCheck, CheckCircle2, AlertTriangle, Sparkles, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-background text-foreground shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-md shrink-0">
              <span className="font-bold text-primary-foreground text-base leading-none">A</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-primary">Axevora</span>
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

          {/* Desktop Right Side: Authentication Controls */}
          <div className="hidden lg:flex items-center space-x-3">
            {loading ? (
              <div className="h-8 w-20 bg-slate-200 animate-pulse rounded-lg"></div>
            ) : user ? (
              <div className="relative" onMouseLeave={() => setIsProfileOpen(false)}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  onMouseEnter={() => setIsProfileOpen(true)}
                  className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-accent/60 transition-colors focus:outline-none border border-transparent hover:border-border/60"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm overflow-hidden shrink-0">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                      getInitials(user.display_name || user.username)
                    )}
                  </div>
                  <div className="text-left hidden xl:block">
                    <div className="text-xs font-bold text-foreground leading-tight truncate max-w-[110px]">
                      {user.display_name || user.username}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                      {user.emailVerified ? (
                        <span className="text-emerald-600 flex items-center gap-0.5 font-semibold">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                        </span>
                      ) : (
                        <span className="text-amber-600 flex items-center gap-0.5 font-semibold">
                          <AlertTriangle className="w-2.5 h-2.5" /> Unverified
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Logged-In User Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-1 w-64 bg-card border border-border shadow-2xl rounded-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* User Summary Card */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 mb-1 space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center overflow-hidden shrink-0">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                          ) : (
                            getInitials(user.display_name || user.username)
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-extrabold text-slate-900 truncate">
                            {user.display_name || user.username}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            @{user.username}
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-600 truncate border-t border-slate-200/60 pt-1.5">
                        {user.email}
                      </div>

                      <div className="flex items-center gap-1.5 pt-0.5">
                        <Badge variant="outline" className="text-[9px] font-extrabold uppercase bg-white text-indigo-700 border-indigo-200 px-1.5 py-0">
                          {user.platformRole || 'Member'}
                        </Badge>
                        {user.emailVerified ? (
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none text-[9px] font-bold px-1.5 py-0">
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none text-[9px] font-bold px-1.5 py-0">
                            Pending Verify
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Menu Actions */}
                    <Link
                      to="/community/profile"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100/80 rounded-xl transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="w-4 h-4 text-indigo-600" />
                      My Profile & Posts
                    </Link>

                    <Link
                      to="/community#join-section"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100/80 rounded-xl transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4 text-slate-500" />
                      Account Settings
                    </Link>

                    <div className="my-1 border-t border-slate-200/80"></div>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl"
                >
                  <Link to="/community?mode=login">Sign In</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/20"
                >
                  <Link to="/community?mode=signup">Create Account</Link>
                </Button>
              </div>
            )}
          </div>

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
              {/* Mobile Auth Bar */}
              {user ? (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 mb-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                          getInitials(user.display_name || user.username)
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{user.display_name || user.username}</div>
                        <div className="text-[10px] text-slate-500">@{user.username}</div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setIsMenuOpen(false);
                        logout();
                      }}
                      className="h-8 text-xs font-bold text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-3.5 h-3.5 mr-1" /> Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pb-2 border-b border-border/50">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full text-xs font-bold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link to="/community?mode=login">Sign In</Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="w-full text-xs font-bold bg-indigo-600 text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link to="/community?mode=signup">Create Account</Link>
                  </Button>
                </div>
              )}

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
