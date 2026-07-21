import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Tag, TrendingUp, Grid, Search, Percent, Bookmark } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { DEAL_PROVIDERS } from "../registry";

interface DealsLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

const DealsLayout = ({ children, title = "Deals Engine", subtitle = "Discover handpicked premium deals from top networks" }: DealsLayoutProps) => {
  const location = useLocation();

  const navItems = [
    { path: "/deals", label: "All Deals", icon: Tag },
    { path: "/deals/trending", label: "Trending", icon: TrendingUp },
    { path: "/deals/categories", label: "Categories", icon: Grid },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Header Area */}
      <section className="relative overflow-hidden border-b bg-gradient-to-r from-purple-900/10 via-background to-blue-900/10 py-12">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              {title}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground max-w-xl">
              {subtitle}
            </p>
          </div>
          
          {/* Quick Search Bar Placeholder */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products, stores, brands..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-primary/10 bg-background/50 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              disabled
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded">
              Engine
            </span>
          </div>
        </div>
      </section>

      {/* Sub Navigation */}
      <div className="border-b bg-muted/20 backdrop-blur-md sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between overflow-x-auto py-3 scrollbar-none">
            <nav className="flex space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 no-underline ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center space-x-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Percent className="h-3.5 w-3.5 text-green-500 animate-pulse" />
                Verified Discounts
              </span>
              <span className="flex items-center gap-1.5">
                <Bookmark className="h-3.5 w-3.5 text-blue-500" />
                Affiliate Ready
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Slot */}
          <div className="lg:col-span-3 space-y-6">
            {children}
          </div>

          {/* Right Sidebar Widget Column (For Future Analytics / Top Stores / Ads) */}
          <aside className="lg:col-span-1 space-y-6">
            
            {/* Store Quick Filters Widget */}
            <div className="rounded-2xl border border-primary/5 bg-gradient-to-b from-card to-background p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Grid className="h-4 w-4 text-primary" />
                Future Top Networks
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {DEAL_PROVIDERS.map((store) => (
                  <div
                    key={store.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-muted bg-muted/10 opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <span>{store.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Deals Notice Widget */}
            <div className="rounded-2xl border border-green-500/10 bg-green-500/5 p-6 space-y-3">
              <h4 className="text-sm font-semibold text-green-600 dark:text-green-400">
                AI Engine Connection
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Deals engine module foundation is active. In the upcoming releases, real-time Amazon APIs and AI summary generators will populate this layout automatically.
              </p>
            </div>
            
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DealsLayout;
