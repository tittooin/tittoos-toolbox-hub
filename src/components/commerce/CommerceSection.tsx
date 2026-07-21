import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tag, Copy, Check, ExternalLink, ShieldCheck, ShoppingBag, Clock, Store, Search, Sparkles, Flame } from "lucide-react";
import { toast } from "sonner";
import { CuelinksService } from "@/modules/commerce/services/CuelinksService";
import { CommerceDiscoveryItem } from "@/modules/commerce/types/commerceDiscovery";

const getMerchantImage = (merchantName: string, existingLogo?: string): string => {
  if (existingLogo && existingLogo.startsWith('http') && !existingLogo.includes('favicons')) {
    return existingLogo;
  }
  const name = merchantName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const storeLogos: Record<string, string> = {
    klook: 'https://logo.clearbit.com/klook.com',
    croma: 'https://logo.clearbit.com/croma.com',
    levis: 'https://logo.clearbit.com/levi.com',
    kapiva: 'https://logo.clearbit.com/kapiva.in',
    perfora: 'https://logo.clearbit.com/perfora.co',
    godrejinterio: 'https://logo.clearbit.com/godrejinterio.com',
    appsumo: 'https://logo.clearbit.com/appsumo.com',
    wellbeingnutrition: 'https://logo.clearbit.com/wellbeingnutrition.com',
    plumgoodness: 'https://logo.clearbit.com/plumgoodness.com',
    mivi: 'https://logo.clearbit.com/mivi.in',
    dhoodhvalefarms: 'https://logo.clearbit.com/dhoodhvale.com',
    quench: 'https://logo.clearbit.com/quenchbotanics.com',
    digihaat: 'https://logo.clearbit.com/digihaat.in',
    fuelone: 'https://logo.clearbit.com/fuelone.in',
    hkvitals: 'https://logo.clearbit.com/hkvitals.com',
  };
  return storeLogos[name] || existingLogo || `https://www.google.com/s2/favicons?domain=${name}.com&sz=128`;
};

export const CommerceSection = () => {
  const [items, setItems] = useState<CommerceDiscoveryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'deals' | 'stores'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    CuelinksService.getDeals()
      .then((res) => {
        if (isMounted && res.items) {
          setItems(res.items);
        }
      })
      .catch((err) => {
        console.warn("Failed to load deals:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopyCode = (code: string, merchant: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied! Redeem at ${merchant}`, {
      description: "Code copied to clipboard.",
      duration: 3000,
    });
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleDealClick = async (item: CommerceDiscoveryItem) => {
    if (item.trackingUrl && item.trackingUrl.startsWith('http')) {
      window.open(item.trackingUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const rawUrl = item.destinationUrl;
    if (!rawUrl) return;

    try {
      const converted = await CuelinksService.convertLink(rawUrl, 'homepage', 'deal_card');
      const target = converted.trackingUrl || rawUrl;
      window.open(target, '_blank', 'noopener,noreferrer');
    } catch (err) {
      window.open(rawUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Dynamically group items into unique store cards for Popular Stores tab
  const popularStores = useMemo(() => {
    const storeMap = new Map<string, {
      name: string;
      logo: string;
      dealCount: number;
      bestDiscount: string;
      sampleItem: CommerceDiscoveryItem;
    }>();

    items.forEach((item) => {
      const name = item.merchantName || 'Partner Store';
      if (!storeMap.has(name)) {
        storeMap.set(name, {
          name,
          logo: getMerchantImage(name, item.merchantLogo),
          dealCount: 1,
          bestDiscount: item.discountText || 'Special Deals Available',
          sampleItem: item,
        });
      } else {
        const existing = storeMap.get(name)!;
        existing.dealCount += 1;
      }
    });

    return Array.from(storeMap.values()).sort((a, b) => b.dealCount - a.dealCount);
  }, [items]);

  // Filtered Deals based on activeTab, search query, and store filter
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Store filter
      if (selectedStore && item.merchantName.toLowerCase() !== selectedStore.toLowerCase()) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesMerchant = item.merchantName.toLowerCase().includes(q);
        const matchesDesc = (item.description || '').toLowerCase().includes(q);
        const matchesCode = (item.couponCode || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesMerchant && !matchesDesc && !matchesCode) return false;
      }
      // Tab filter
      if (activeTab === 'deals') return Boolean(item.couponCode);
      return true;
    });
  }, [items, activeTab, searchQuery, selectedStore]);

  return (
    <section id="commerce-deals" className="py-24 px-4 bg-gradient-to-b from-background via-amber-950/5 to-background border-y border-amber-500/10 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <Badge variant="outline" className="mb-4 border-amber-500/40 bg-amber-500/10 text-amber-400 rounded-full px-4 py-1 flex items-center gap-2 w-fit text-xs font-semibold backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              Live Commerce & Verified Offers
            </Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-100 to-amber-400">
              Featured Deals & Partner Offers
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl text-sm md:text-base">
              Verified promo codes, flash discounts, and top partner brand deals updated in real-time.
            </p>
          </div>

          {/* Search & Filter Tabs */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search deals or store..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 h-10 rounded-full bg-secondary/40 border-amber-500/20 text-xs focus:border-amber-500/60 focus:ring-amber-500/20"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-secondary/50 backdrop-blur-md rounded-full border border-amber-500/20">
              <Button
                variant={activeTab === 'all' && !selectedStore ? 'default' : 'ghost'}
                onClick={() => {
                  setActiveTab('all');
                  setSelectedStore(null);
                }}
                className={`rounded-full text-xs h-8 px-3.5 font-semibold transition-all ${
                  activeTab === 'all' && !selectedStore
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                size="sm"
              >
                All Deals ({items.length})
              </Button>
              <Button
                variant={activeTab === 'deals' ? 'default' : 'ghost'}
                onClick={() => {
                  setActiveTab('deals');
                  setSelectedStore(null);
                }}
                className={`rounded-full text-xs h-8 px-3.5 font-semibold transition-all ${
                  activeTab === 'deals'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                size="sm"
              >
                <Flame className="w-3.5 h-3.5 mr-1 text-amber-300" />
                Featured Offers
              </Button>
              <Button
                variant={activeTab === 'stores' ? 'default' : 'ghost'}
                onClick={() => {
                  setActiveTab('stores');
                  setSelectedStore(null);
                }}
                className={`rounded-full text-xs h-8 px-3.5 font-semibold transition-all ${
                  activeTab === 'stores'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                size="sm"
              >
                <Store className="w-3.5 h-3.5 mr-1" />
                Popular Stores ({popularStores.length})
              </Button>
            </div>
          </div>
        </div>

        {/* Selected Store Active Filter Pill */}
        {selectedStore && (
          <div className="mb-6 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Filtered by Store:</span>
            <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-full flex items-center gap-2 text-xs">
              <span>{selectedStore}</span>
              <button
                onClick={() => setSelectedStore(null)}
                className="hover:text-white font-bold ml-1"
              >
                ×
              </button>
            </Badge>
          </div>
        )}

        {/* CONTENT VIEW: POPULAR STORES vs DEALS GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-72 rounded-2xl bg-card/40 border border-border/40 animate-pulse p-6"></div>
            ))}
          </div>
        ) : activeTab === 'stores' ? (
          /* POPULAR STORES TAB GRID */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {popularStores.map((store, idx) => (
              <motion.div
                key={store.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
              >
                <Card
                  onClick={() => {
                    setSelectedStore(store.name);
                    setActiveTab('all');
                  }}
                  className="h-full cursor-pointer bg-card/50 backdrop-blur-xl border border-amber-500/20 hover:border-amber-500/60 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300 group p-5 flex flex-col items-center text-center justify-between rounded-2xl"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/90 p-2.5 flex items-center justify-center shadow-md border border-amber-500/20 group-hover:scale-110 transition-transform duration-300 mb-3">
                    <img
                      src={store.logo}
                      alt={store.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).src = `https://www.google.com/s2/favicons?domain=${store.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com&sz=128`;
                      }}
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-foreground group-hover:text-amber-400 transition-colors line-clamp-1">
                      {store.name}
                    </h3>
                    <Badge className="mt-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                      {store.dealCount} Active {store.dealCount === 1 ? 'Offer' : 'Offers'}
                    </Badge>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-4 text-[11px] h-7 px-3 text-amber-400 group-hover:bg-amber-500/10 rounded-full w-full"
                  >
                    View Deals →
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          /* DEALS CARDS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className="h-full"
                >
                  <Card className="h-full flex flex-col justify-between bg-card/60 backdrop-blur-xl border border-amber-500/20 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group">
                    {/* Card Top Image Banner */}
                    <div className="relative h-40 w-full overflow-hidden bg-secondary/40">
                      <img
                        src={item.bannerImage || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80'}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLElement).src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                      {/* Brand Logo Floating Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-2 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/30 shadow-lg">
                        <img
                          src={getMerchantImage(item.merchantName, item.merchantLogo)}
                          alt={item.merchantName}
                          className="w-4 h-4 rounded-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).src = `https://www.google.com/s2/favicons?domain=${item.merchantName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com&sz=64`;
                          }}
                        />
                        <span className="text-[11px] font-bold text-foreground tracking-tight">
                          {item.merchantName}
                        </span>
                      </div>

                      {/* Discount Tag Top Right */}
                      {item.discountText && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-[11px] px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          <span>{item.discountText}</span>
                        </div>
                      )}
                    </div>

                    {/* Card Body Content */}
                    <CardContent className="p-5 flex flex-col justify-between flex-grow space-y-4">
                      <div>
                        <h3 className="text-base font-bold text-foreground line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">
                          {item.title}
                        </h3>

                        {item.description && (
                          <p className="line-clamp-2 text-xs text-muted-foreground mt-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="space-y-3 pt-2">
                        {/* Coupon Code Box */}
                        {item.couponCode ? (
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-dashed border-amber-500/40 font-mono text-xs">
                            <div className="flex items-center gap-2 text-amber-300 font-bold tracking-wide">
                              <Tag className="w-3.5 h-3.5 text-amber-400" />
                              <span>{item.couponCode}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-3 text-[11px] font-bold text-amber-400 hover:text-amber-300 hover:bg-amber-500/20 rounded-lg transition-colors"
                              onClick={() => handleCopyCode(item.couponCode!, item.merchantName)}
                            >
                              {copiedCode === item.couponCode ? (
                                <>
                                  <Check className="w-3.5 h-3.5 mr-1 text-green-400" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 mr-1" />
                                  Copy Code
                                </>
                              )}
                            </Button>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-secondary/30 border border-border/40 text-[11px] text-muted-foreground flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>No Code Required — Direct Instant Discount</span>
                          </div>
                        )}

                        {/* Expiry Date */}
                        {item.validUntil && (
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>Expires {item.validUntil}</span>
                          </div>
                        )}

                        {/* CTA Grab Deal Button */}
                        <Button
                          onClick={() => handleDealClick(item)}
                          className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs h-10 shadow-lg shadow-amber-500/15 group-hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
                        >
                          <span>Get Deal & Shop</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="text-center py-16 px-6 bg-card/30 rounded-3xl border border-dashed border-amber-500/20 max-w-2xl mx-auto backdrop-blur-md">
            <ShoppingBag className="w-12 h-12 text-amber-500/40 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No Matching Deals Found</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
              Try resetting your search query or switching store filters.
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedStore(null);
                setActiveTab('all');
              }}
              className="rounded-full bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/40 text-xs"
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Affiliate Disclosure */}
        <div className="mt-14 text-center text-xs text-muted-foreground/70 flex items-center justify-center gap-2 max-w-2xl mx-auto border-t border-border/30 pt-6">
          <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
          <p>
            <strong>Affiliate Disclosure:</strong> Axevora participates in verified affiliate marketing programs (including Cuelinks & direct merchant partnerships). We may earn a small commission on qualifying purchases at zero extra cost to you.
          </p>
        </div>
      </div>
    </section>
  );
};
