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
  if (existingLogo && existingLogo.startsWith('http') && !existingLogo.includes('clearbit') && !existingLogo.includes('favicons')) {
    return existingLogo;
  }
  const name = merchantName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const storeLogos: Record<string, string> = {
    klook: 'https://www.google.com/s2/favicons?domain=klook.com&sz=128',
    croma: 'https://www.google.com/s2/favicons?domain=croma.com&sz=128',
    levis: 'https://www.google.com/s2/favicons?domain=levi.in&sz=128',
    kapiva: 'https://www.google.com/s2/favicons?domain=kapiva.in&sz=128',
    perfora: 'https://www.google.com/s2/favicons?domain=perfora.co&sz=128',
    godrejinterio: 'https://www.google.com/s2/favicons?domain=godrejinterio.com&sz=128',
    appsumo: 'https://www.google.com/s2/favicons?domain=appsumo.com&sz=128',
    wellbeingnutrition: 'https://www.google.com/s2/favicons?domain=wellbeingnutrition.com&sz=128',
    plumgoodness: 'https://www.google.com/s2/favicons?domain=plumgoodness.com&sz=128',
    mivi: 'https://www.google.com/s2/favicons?domain=mivi.in&sz=128',
    dhoodhvalefarms: 'https://www.google.com/s2/favicons?domain=dhoodhvale.com&sz=128',
    quench: 'https://www.google.com/s2/favicons?domain=quenchbotanics.com&sz=128',
    digihaat: 'https://www.google.com/s2/favicons?domain=digihaat.in&sz=128',
    fuelone: 'https://www.google.com/s2/favicons?domain=fuelone.in&sz=128',
    hkvitals: 'https://www.google.com/s2/favicons?domain=hkvitals.com&sz=128',
  };
  return storeLogos[name] || `https://www.google.com/s2/favicons?domain=${name}.com&sz=128`;
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

    const rawUrl = item.destinationUrl || `https://www.google.com/search?q=${encodeURIComponent(item.merchantName + ' official store')}`;

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
    <section id="commerce-deals" className="py-24 px-4 bg-slate-50/70 border-y border-slate-200 relative overflow-hidden">
      {/* Subtle Light Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <Badge variant="outline" className="mb-4 border-indigo-200 bg-indigo-50 text-indigo-700 rounded-full px-4 py-1 flex items-center gap-2 w-fit text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Live Commerce & Verified Offers
            </Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              Featured Deals & Partner Offers
            </h2>
            <p className="text-slate-600 mt-2 max-w-xl text-sm md:text-base font-normal">
              Verified promo codes, flash discounts, and top partner brand deals updated in real-time.
            </p>
          </div>

          {/* Search & Filter Tabs */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search deals or store..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 h-10 rounded-full bg-white border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20 shadow-sm"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-white shadow-sm rounded-full border border-slate-200">
              <Button
                variant={activeTab === 'all' && !selectedStore ? 'default' : 'ghost'}
                onClick={() => {
                  setActiveTab('all');
                  setSelectedStore(null);
                }}
                className={`rounded-full text-xs h-8 px-4 font-bold transition-all ${
                  activeTab === 'all' && !selectedStore
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
                className={`rounded-full text-xs h-8 px-4 font-bold transition-all ${
                  activeTab === 'deals'
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                size="sm"
              >
                <Flame className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
                Featured Offers
              </Button>
              <Button
                variant={activeTab === 'stores' ? 'default' : 'ghost'}
                onClick={() => {
                  setActiveTab('stores');
                  setSelectedStore(null);
                }}
                className={`rounded-full text-xs h-8 px-4 font-bold transition-all ${
                  activeTab === 'stores'
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                size="sm"
              >
                <Store className="w-3.5 h-3.5 mr-1.5" />
                Popular Stores ({popularStores.length})
              </Button>
            </div>
          </div>
        </div>

        {/* Selected Store Active Filter Pill */}
        {selectedStore && (
          <div className="mb-6 flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Filtered by Store:</span>
            <Badge className="bg-indigo-100 text-indigo-800 border border-indigo-300 px-3 py-1 rounded-full flex items-center gap-2 text-xs font-bold">
              <span>{selectedStore}</span>
              <button
                onClick={() => setSelectedStore(null)}
                className="hover:text-indigo-950 font-bold ml-1"
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
              <div key={n} className="h-72 rounded-2xl bg-white border border-slate-200 animate-pulse p-6"></div>
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
                  className="h-full cursor-pointer bg-white border border-slate-200/90 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 group p-5 flex flex-col items-center text-center justify-between rounded-2xl shadow-sm"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 p-2.5 flex items-center justify-center shadow-inner border border-slate-100 group-hover:scale-105 transition-transform duration-300 mb-3">
                    <img
                      src={store.logo}
                      alt={store.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {store.name}
                    </h3>
                    <Badge className="mt-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                      {store.dealCount} Active {store.dealCount === 1 ? 'Offer' : 'Offers'}
                    </Badge>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-4 text-[11px] h-7 px-3 text-indigo-600 group-hover:bg-indigo-50 rounded-full w-full font-bold"
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
                  <Card
                    onClick={() => handleDealClick(item)}
                    className="h-full flex flex-col justify-between bg-white border border-slate-200/90 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden shadow-sm group cursor-pointer"
                  >
                    {/* Card Top Image Banner */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      <img
                        src={item.bannerImage || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80'}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLElement).src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />

                      {/* Brand Logo Floating Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-md">
                        <img
                          src={getMerchantImage(item.merchantName, item.merchantLogo)}
                          alt={item.merchantName}
                          className="w-4 h-4 rounded-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <span className="text-[11px] font-bold text-slate-900 tracking-tight">
                          {item.merchantName}
                        </span>
                      </div>

                      {/* Discount Tag Top Right */}
                      {item.discountText && (
                        <div className="absolute top-3 right-3 bg-indigo-600 text-white font-extrabold text-[11px] px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          <span>{item.discountText}</span>
                        </div>
                      )}
                    </div>

                    {/* Card Body Content */}
                    <CardContent className="p-5 flex flex-col justify-between flex-grow space-y-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                          {item.title}
                        </h3>

                        {item.description && (
                          <p className="line-clamp-2 text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="space-y-3 pt-2">
                        {/* Coupon Code Box */}
                        {item.couponCode ? (
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-50/80 border border-dashed border-indigo-300 font-mono text-xs">
                            <div className="flex items-center gap-2 text-indigo-900 font-bold tracking-wide">
                              <Tag className="w-3.5 h-3.5 text-indigo-600" />
                              <span>{item.couponCode}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-3 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100/80 rounded-lg transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyCode(item.couponCode!, item.merchantName);
                              }}
                            >
                              {copiedCode === item.couponCode ? (
                                <>
                                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
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
                          <div className="p-2.5 rounded-xl bg-slate-100/80 border border-slate-200 text-[11px] text-slate-600 font-medium flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span>No Code Required — Direct Instant Discount</span>
                          </div>
                        )}

                        {/* Expiry Date */}
                        {item.validUntil && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                            <Clock className="w-3 h-3 text-indigo-600" />
                            <span>Expires {item.validUntil}</span>
                          </div>
                        )}

                        {/* CTA Grab Deal Button */}
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDealClick(item);
                          }}
                          className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-10 shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group-hover:bg-indigo-700"
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
          <div className="text-center py-16 px-6 bg-white rounded-3xl border border-dashed border-slate-300 max-w-2xl mx-auto shadow-sm">
            <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Matching Deals Found</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-4 font-normal">
              Try resetting your search query or switching store filters.
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedStore(null);
                setActiveTab('all');
              }}
              className="rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-bold"
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Affiliate Disclosure */}
        <div className="mt-14 text-center text-xs text-slate-500 flex items-center justify-center gap-2 max-w-2xl mx-auto border-t border-slate-200 pt-6 font-normal">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <p>
            <strong>Affiliate Disclosure:</strong> Axevora participates in verified affiliate marketing programs (including Cuelinks & direct merchant partnerships). We may earn a small commission on qualifying purchases at zero extra cost to you.
          </p>
        </div>
      </div>
    </section>
  );
};
