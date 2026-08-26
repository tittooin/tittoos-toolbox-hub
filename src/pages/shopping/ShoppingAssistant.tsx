import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Search, Sparkles, SlidersHorizontal, ArrowUpDown, Filter, X,
  ShoppingBag, ShieldCheck, ChevronRight, Check, ArrowRight,
  Tablet, Laptop, Smartphone, Tv, Headphones, Camera, Layers,
  ExternalLink, MessageSquare, Plus, RefreshCw, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/shopping/ProductCard';
import { ProductCompareModal } from '@/components/shopping/ProductCompareModal';
import { Product, Message } from '@/types/shopping';
import { SHOPPING_CATEGORIES, POPULAR_SHOPPING_SEARCHES, CategoryTaxonomy } from '@/data/shoppingTaxonomy';
import { calculateAxevoraScore } from '@/utils/axevoraScore';
import { v4 as uuidv4 } from 'uuid';

export default function ShoppingAssistant() {
  const location = useLocation();
  const navigate = useNavigate();

  // Search & Navigation State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('tablets');
  const [selectedBudget, setSelectedBudget] = useState<{ min?: number; max?: number } | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'score' | 'price_asc' | 'price_desc' | 'rating'>('score');

  // Comparison State (up to 4 products)
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Daily Catalog State
  const [dailyCatalog, setDailyCatalog] = useState<Record<string, Product[]>>({});
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);

  // AI Active Search State (for natural language query results)
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiSearchResult, setAiSearchResult] = useState<{
    query: string;
    analysis?: {
      pitch?: string;
      hookHeader?: string;
      comparisonMarkdown?: string;
      pros?: string[];
      cons?: string[];
    };
    products: Product[];
  } | null>(null);

  // Fetch Daily Curated Catalog on Mount
  useEffect(() => {
    fetch('/api/commerce/daily-catalog?category=all')
      .then(res => res.json())
      .then(data => {
        if (data && data.ok && data.categories) {
          const formatted: Record<string, Product[]> = {};
          Object.entries(data.categories).forEach(([catKey, prods]: [string, any]) => {
            formatted[catKey] = prods.map((p: any) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              originalPrice: p.originalPrice,
              discountPercentage: p.discountPercentage,
              currency: p.currency || 'INR',
              rating: p.rating || 4.4,
              reviewCount: p.reviewCount || 1200,
              imageUrl: p.imageUrl,
              imageSourceDomain: p.imageSourceDomain,
              dealType: 'PRODUCT_DEAL',
              merchantId: p.merchantName?.toLowerCase() || 'merchant',
              merchantName: p.merchantName || 'Merchant',
              merchantLogoUrl: p.merchantLogoUrl,
              dealUrl: p.dealUrl,
              reasons: [p.whyWeLikeIt, p.bestFor].filter(Boolean),
              aiScore: p.axevoraScore || 8.8,
              extractedEntities: {
                brand: p.brand,
                model: p.model,
                category: p.category,
                specs: p.specs
              }
            }));
          });
          setDailyCatalog(formatted);
        }
      })
      .catch(err => {
        console.error('Failed to load daily catalog:', err);
      })
      .finally(() => {
        setIsCatalogLoading(false);
      });
  }, []);

  // Handle URL Query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || params.get('query');
    const cat = params.get('category');

    if (cat && SHOPPING_CATEGORIES.some(c => c.id === cat.toLowerCase())) {
      setActiveCategory(cat.toLowerCase());
    }

    if (q && q.trim().length > 0) {
      setSearchQuery(q.trim());
      executeAiSearch(q.trim());
    }
  }, [location.search]);

  // Execute AI Product Search & Discovery
  const executeAiSearch = async (queryText: string) => {
    const clean = queryText.trim();
    if (!clean) return;

    setIsAiSearching(true);
    setAiSearchResult(null);

    try {
      const [reviewSettled, searchSettled] = await Promise.allSettled([
        fetch(`/api/commerce/review-summary?q=${encodeURIComponent(clean)}`).then(r => r.json()).catch(() => ({ ok: false })),
        fetch(`/api/commerce/search?q=${encodeURIComponent(clean)}`).then(r => r.json()).catch(() => ({ ok: false, items: [] }))
      ]);

      const reviewData = reviewSettled.status === 'fulfilled' ? reviewSettled.value : { ok: false };
      const searchData = searchSettled.status === 'fulfilled' ? searchSettled.value : { ok: false, items: [] };

      const discoveredProducts: Product[] = (searchData.items || []).map((item: any) => ({
        ...item,
        aiScore: item.aiScore || (item.extractedEntities?.specs ? calculateAxevoraScore(clean, item.price || 0, item.extractedEntities.specs).score : 8.8)
      }));

      setAiSearchResult({
        query: clean,
        analysis: reviewData.ok && reviewData.data ? reviewData.data : undefined,
        products: discoveredProducts
      });
    } catch (err) {
      console.error('AI search failed:', err);
    } finally {
      setIsAiSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/shopping?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handlePillClick = (query: string) => {
    setSearchQuery(query);
    navigate(`/shopping?q=${encodeURIComponent(query)}`);
  };

  const handleToggleCompare = (product: Product) => {
    setComparedProducts(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      } else {
        if (prev.length >= 4) {
          alert('You can compare up to 4 products side-by-side.');
          return prev;
        }
        return [...prev, product];
      }
    });
  };

  const handleRemoveCompare = (productId: string) => {
    setComparedProducts(prev => prev.filter(p => p.id !== productId));
  };

  // Get current active taxonomy
  const currentTaxonomy = useMemo(() => {
    return SHOPPING_CATEGORIES.find(c => c.id === activeCategory) || SHOPPING_CATEGORIES[0];
  }, [activeCategory]);

  // Filtered & Sorted Catalog Products for current Category View
  const displayedCategoryProducts = useMemo(() => {
    const rawList = dailyCatalog[activeCategory] || [];
    let filtered = [...rawList];

    // Budget Filter
    if (selectedBudget) {
      if (selectedBudget.max !== undefined && selectedBudget.min !== undefined) {
        filtered = filtered.filter(p => p.price >= selectedBudget.min! && p.price <= selectedBudget.max!);
      } else if (selectedBudget.max !== undefined) {
        filtered = filtered.filter(p => p.price <= selectedBudget.max!);
      } else if (selectedBudget.min !== undefined) {
        filtered = filtered.filter(p => p.price >= selectedBudget.min!);
      }
    }

    // Brand Filter
    if (selectedBrand) {
      filtered = filtered.filter(p => (p.extractedEntities?.brand || '').toLowerCase() === selectedBrand.toLowerCase());
    }

    // Use Case Filter
    if (selectedUseCase) {
      const term = selectedUseCase.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (p.reasons || []).some(r => r.toLowerCase().includes(term))
      );
    }

    // Feature Filter
    if (selectedFeature) {
      const term = selectedFeature.toLowerCase();
      filtered = filtered.filter(p => {
        const specs = Object.values(p.extractedEntities?.specs || {}).join(' ').toLowerCase();
        return specs.includes(term) || p.name.toLowerCase().includes(term);
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'score') return (b.aiScore || 0) - (a.aiScore || 0);
      if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

    return filtered;
  }, [dailyCatalog, activeCategory, selectedBudget, selectedBrand, selectedUseCase, selectedFeature, sortBy]);

  const clearAllFilters = () => {
    setSelectedBudget(null);
    setSelectedBrand(null);
    setSelectedUseCase(null);
    setSelectedFeature(null);
  };

  const activeFiltersCount = [selectedBudget, selectedBrand, selectedUseCase, selectedFeature].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col selection:bg-primary/20">
      <Helmet>
        <title>Axevora Shopping — AI Product Intelligence & Price Discovery</title>
        <meta
          name="description"
          content="Find the best tablets, laptops, phones, TVs, and audio gear. Axevora compares verified merchant offers with zero AI price deception."
        />
        <link rel="canonical" href="https://axevora.com/shopping" />
      </Helmet>

      <Header />

      <main className="flex-grow">
        {/* ========================================================================= */}
        {/* 1. HERO SEARCH SECTION                                                    */}
        {/* ========================================================================= */}
        <section className="relative pt-8 pb-12 md:pt-14 md:pb-16 px-4 bg-gradient-to-b from-primary/5 via-background to-background border-b border-border/40">
          <div className="container mx-auto max-w-5xl text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              Axevora Shopping Pillar
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
              Find Smarter. <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-primary to-violet-500">Decide Faster.</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Tell Axevora what you need in natural language. We analyze specs, compare merchant offers, and score every product objectively.
            </p>

            {/* Search Input Box */}
            <div className="max-w-2xl mx-auto pt-2">
              <form onSubmit={handleSearchSubmit} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 via-primary/30 to-violet-500/30 rounded-2xl blur-md opacity-40 group-hover:opacity-75 transition duration-300" />
                <div className="relative bg-card border border-border/80 rounded-2xl shadow-xl p-2 flex items-center gap-2">
                  <Search className="w-5 h-5 ml-3 text-muted-foreground shrink-0" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Best tablet under ₹15,000 for study, gaming laptop under 60k..."
                    className="border-none shadow-none focus-visible:ring-0 text-sm sm:text-base h-12 bg-transparent text-foreground placeholder:text-muted-foreground/70"
                    aria-label="Shopping Search Query"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isAiSearching}
                    className="rounded-xl px-5 sm:px-7 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shrink-0 h-11"
                  >
                    {isAiSearching ? (
                      <span className="flex items-center gap-1.5">
                        <RefreshCw className="w-4 h-4 animate-spin" /> Thinking...
                      </span>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Ask Axevora</span>
                        <ArrowRight className="w-4 h-4 sm:ml-1.5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Popular Searches Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
                <span className="text-muted-foreground font-semibold">Popular:</span>
                {POPULAR_SHOPPING_SEARCHES.map((query) => (
                  <button
                    key={query}
                    type="button"
                    onClick={() => handlePillClick(query)}
                    className="px-3 py-1 rounded-full bg-secondary/50 hover:bg-secondary border border-border/60 text-muted-foreground hover:text-foreground transition-colors font-medium text-[11px] sm:text-xs"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. AI ACTIVE SEARCH VIEW (When user runs a search query)                  */}
        {/* ========================================================================= */}
        {aiSearchResult && (
          <section className="py-10 px-4 bg-muted/20 border-b border-border/50 animate-in fade-in duration-300">
            <div className="container mx-auto max-w-6xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">AI Product Intelligence</div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    Results for "{aiSearchResult.query}"
                  </h2>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAiSearchResult(null);
                    setSearchQuery('');
                  }}
                  className="rounded-xl text-xs font-semibold"
                >
                  <X className="w-3.5 h-3.5 mr-1" /> Clear Search
                </Button>
              </div>

              {/* Expert Analysis Breakdown if available */}
              {aiSearchResult.analysis && (
                <div className="p-5 sm:p-6 bg-card border border-border/80 rounded-2xl shadow-sm space-y-4">
                  {aiSearchResult.analysis.hookHeader && (
                    <h3 className="text-base font-bold text-foreground">{aiSearchResult.analysis.hookHeader}</h3>
                  )}
                  {aiSearchResult.analysis.pitch && (
                    <p className="text-sm text-muted-foreground leading-relaxed">{aiSearchResult.analysis.pitch}</p>
                  )}
                  {aiSearchResult.analysis.comparisonMarkdown && (
                    <div className="text-xs sm:text-sm text-muted-foreground prose dark:prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-xs bg-muted/40 p-4 rounded-xl border border-border/40 overflow-x-auto">
                        {aiSearchResult.analysis.comparisonMarkdown}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Discovered Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {aiSearchResult.products.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    isComparing={comparedProducts.some(p => p.id === prod.id)}
                    onToggleCompare={handleToggleCompare}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 3. CATEGORY SWITCHER & NAVIGATION                                         */}
        {/* ========================================================================= */}
        <section className="py-6 px-4 border-b border-border/40 bg-card/50 sticky top-16 z-30 backdrop-blur-md">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {SHOPPING_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      clearAllFilters();
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/50'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. REFERENCE UX LISTING EXPERIENCE: FILTERS, TOP PICKS & PRODUCT GRID    */}
        {/* ========================================================================= */}
        <section className="py-10 md:py-14 px-4 bg-background">
          <div className="container mx-auto max-w-6xl space-y-8">
            {/* Category Headline & Highlights Banner */}
            <div className="bg-gradient-to-r from-amber-500/10 via-primary/5 to-violet-500/10 border border-border/80 rounded-2xl p-6 sm:p-8">
              <div className="max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" /> Curated Daily Category Guide
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {currentTaxonomy.heroHeadline}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {currentTaxonomy.description} Ranked by our deterministic Axevora Score and source-stated live availability.
                </p>
              </div>

              {/* Quick Jump Buttons (By Budget, Use Case, Feature) */}
              <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* By Budget */}
                <div>
                  <span className="font-bold text-foreground block mb-2">By Budget:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentTaxonomy.budgetRanges.map((b, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedBudget(selectedBudget?.max === b.max ? null : b)}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                          selectedBudget?.max === b.max
                            ? 'bg-primary text-primary-foreground border-primary font-bold'
                            : 'bg-background hover:bg-muted text-muted-foreground border-border/60'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* By Use Case */}
                <div>
                  <span className="font-bold text-foreground block mb-2">By Use Case:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentTaxonomy.useCases.slice(0, 4).map((u, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedUseCase(selectedUseCase === u.label ? null : u.label)}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                          selectedUseCase === u.label
                            ? 'bg-primary text-primary-foreground border-primary font-bold'
                            : 'bg-background hover:bg-muted text-muted-foreground border-border/60'
                        }`}
                      >
                        {u.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* By Feature */}
                <div>
                  <span className="font-bold text-foreground block mb-2">By Feature:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentTaxonomy.features.slice(0, 4).map((f, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedFeature(selectedFeature === f.label ? null : f.label)}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                          selectedFeature === f.label
                            ? 'bg-primary text-primary-foreground border-primary font-bold'
                            : 'bg-background hover:bg-muted text-muted-foreground border-border/60'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Filter & Sort Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-foreground">
                  Showing {displayedCategoryProducts.length} {currentTaxonomy.name}:
                </span>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-7 text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg px-2"
                  >
                    Clear {activeFiltersCount} Filters <X className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-semibold text-muted-foreground">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-card border border-border/80 rounded-lg px-2.5 py-1 text-xs text-foreground font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="score">Axevora Score (High to Low)</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest User Rating</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid */}
            {isCatalogLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-96 rounded-2xl bg-muted/40 animate-pulse border border-border/40" />
                ))}
              </div>
            ) : displayedCategoryProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedCategoryProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isComparing={comparedProducts.some(p => p.id === product.id)}
                    onToggleCompare={handleToggleCompare}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4 bg-muted/20 border border-border/60 rounded-2xl space-y-3">
                <ShoppingBag className="w-10 h-10 mx-auto text-muted-foreground" />
                <h3 className="text-base font-bold text-foreground">No products match your exact filters</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Try clearing some filters or searching for the specific product in the search box above.
                </p>
                <Button onClick={clearAllFilters} variant="outline" size="sm" className="rounded-xl font-bold text-xs mt-2">
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. FLOATING COMPARISON TRAY (When 1+ products selected)                   */}
        {/* ========================================================================= */}
        {comparedProducts.length > 0 && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4 animate-in slide-in-from-bottom-5 duration-200">
            <div className="bg-card/95 backdrop-blur-md border border-primary/40 shadow-2xl rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-extrabold text-xs">
                  {comparedProducts.length}
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Products Selected for Comparison</div>
                  <div className="text-[11px] text-muted-foreground">Compare specs side-by-side (max 4)</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setIsCompareModalOpen(true)}
                  className="rounded-xl font-bold text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                >
                  Compare Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setComparedProducts([])}
                  className="rounded-xl text-xs text-muted-foreground hover:text-foreground h-8 px-2"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Product Comparison Modal */}
        <ProductCompareModal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          products={comparedProducts}
          onRemoveProduct={handleRemoveCompare}
          onAskAboutComparison={(query) => {
            setSearchQuery(query);
            executeAiSearch(query);
          }}
        />
      </main>

      <Footer />
    </div>
  );
}
