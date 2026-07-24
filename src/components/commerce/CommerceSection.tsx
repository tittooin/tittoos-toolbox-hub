import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tag, Copy, Check, ExternalLink, ShieldCheck, ShoppingBag, Clock, Store, Search, Sparkles, Flame, Share2, Send, MessageCircle, Twitter, Facebook, Linkedin, Link as LinkIcon, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { CuelinksService } from "@/modules/commerce/services/CuelinksService";
import { CommerceDiscoveryItem } from "@/modules/commerce/types/commerceDiscovery";
import { RichCommerceCard } from "@/components/community/RichCommerceCard";

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
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Social Share Modal State
  const [shareItem, setShareItem] = useState<CommerceDiscoveryItem | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);

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
    // 1. Double conversion check: if trackingUrl is already an affiliate link
    if (item.trackingUrl && (item.trackingUrl.includes('clnk.in') || item.trackingUrl.includes('cuelinks.com') || item.trackingUrl.includes('linksredirect.com'))) {
      window.open(item.trackingUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const rawUrl = item.destinationUrl || item.trackingUrl;
    if (!rawUrl || !rawUrl.startsWith('http')) return;

    try {
      const converted = await CuelinksService.convertLink(rawUrl, 'axevora_homepage', 'commerce_card');
      const target = converted.trackingUrl || rawUrl;
      window.open(target, '_blank', 'noopener,noreferrer');
    } catch (err) {
      window.open(rawUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Helper to resolve verified Cuelinks tracking URL for share actions
  const getMonetizedShareUrl = async (item: CommerceDiscoveryItem): Promise<string> => {
    if (item.trackingUrl && (item.trackingUrl.includes('clnk.in') || item.trackingUrl.includes('cuelinks.com') || item.trackingUrl.includes('linksredirect.com'))) {
      return item.trackingUrl;
    }

    const rawUrl = item.destinationUrl || item.trackingUrl;
    if (!rawUrl || !rawUrl.startsWith('http')) return window.location.href;

    try {
      const converted = await CuelinksService.convertLink(rawUrl, 'axevora_share', 'commerce_card');
      return converted.trackingUrl || rawUrl;
    } catch (err) {
      return rawUrl;
    }
  };

  // Open Share Dialog or Native Web Share API for a deal item
  const handleOpenShare = async (item: CommerceDiscoveryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const monetizedUrl = await getMonetizedShareUrl(item);
    const text = `🔥 ${item.merchantName} Deal on Axevora: ${item.title}`;

    // Web Share API if supported on mobile
    if (navigator.share && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: item.title,
          text: text,
          url: monetizedUrl,
        });
        toast.success("Deal shared successfully!");
        return;
      } catch (err) {
        // User cancelled or fallback to modal
      }
    }

    setShareItem({ ...item, trackingUrl: monetizedUrl });
    setShareModalOpen(true);
    setCopiedLink(false);
  };

  // Social Platform Share Actions
  const getShareText = (item: CommerceDiscoveryItem) => {
    let text = `🔥 ${item.merchantName} Deal on Axevora!\n`;
    text += `👉 ${item.title}\n`;
    if (item.discountText) text += `🏷️ Discount: ${item.discountText}\n`;
    if (item.couponCode) text += `✂️ Coupon Code: ${item.couponCode}\n`;
    text += `\nClaim this offer before it expires!`;
    return text;
  };

  const getShareUrl = (item: CommerceDiscoveryItem) => {
    return item.trackingUrl || item.destinationUrl || window.location.href;
  };

  const handleSharePlatform = (platform: 'whatsapp' | 'telegram' | 'twitter' | 'facebook' | 'linkedin') => {
    if (!shareItem) return;
    const text = getShareText(shareItem);
    const url = getShareUrl(shareItem);

    let shareEndpoint = '';
    switch (platform) {
      case 'whatsapp':
        shareEndpoint = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
      case 'telegram':
        shareEndpoint = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'twitter':
        shareEndpoint = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=Deals,Discounts,Axevora`;
        break;
      case 'facebook':
        shareEndpoint = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareEndpoint = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }

    window.open(shareEndpoint, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const handleCopyShareLink = () => {
    if (!shareItem) return;
    const shareableUrl = getShareUrl(shareItem);
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    toast.success("Deal Cuelinks affiliate link copied to clipboard!", {
      description: "You can now paste and share it anywhere.",
      duration: 3000,
    });
    setTimeout(() => setCopiedLink(false), 2500);
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

  const offersCount = useMemo(() => {
    return items.filter((item) => item.type === 'offer' || item.type === 'deal').length;
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
      if (activeTab === 'deals') return item.type === 'offer' || item.type === 'deal';
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
                Featured Offers ({offersCount})
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
                  <RichCommerceCard offer={item} />
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

        {/* Multi-Platform Social Share Dialog */}
        <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
          <DialogContent className="sm:max-w-md bg-white border border-slate-200 shadow-2xl rounded-3xl p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-extrabold text-slate-900">
                <Share2 className="w-5 h-5 text-indigo-600" />
                <span>Share Deal with Friends</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Share this deal on WhatsApp, Telegram, Social Media, or copy the direct link!
              </DialogDescription>
            </DialogHeader>

            {shareItem && (
              <div className="space-y-5 py-2">
                {/* Share Item Preview Card */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1.5 shrink-0 flex items-center justify-center shadow-sm">
                    <img
                      src={getMerchantImage(shareItem.merchantName, shareItem.merchantLogo)}
                      alt={shareItem.merchantName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-slate-900">{shareItem.merchantName}</span>
                      {shareItem.discountText && (
                        <Badge className="bg-indigo-100 text-indigo-800 text-[10px] px-2 py-0 font-bold border-none">
                          {shareItem.discountText}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-700 truncate">{shareItem.title}</p>
                    {shareItem.couponCode && (
                      <p className="text-[11px] font-mono text-indigo-600 font-bold">Code: {shareItem.couponCode}</p>
                    )}
                  </div>
                </div>

                {/* 1-Click Social Media Platforms Grid */}
                <div className="grid grid-cols-5 gap-2.5 text-center">
                  {/* WhatsApp */}
                  <button
                    onClick={() => handleSharePlatform('whatsapp')}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-700 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-5 h-5 fill-current" />
                    </div>
                    <span className="text-[10px] font-bold">WhatsApp</span>
                  </button>

                  {/* Telegram */}
                  <button
                    onClick={() => handleSharePlatform('telegram')}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-sky-50 hover:bg-sky-100/80 border border-sky-200 text-sky-700 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Send className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                    <span className="text-[10px] font-bold">Telegram</span>
                  </button>

                  {/* Twitter / X */}
                  <button
                    onClick={() => handleSharePlatform('twitter')}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-100 hover:bg-slate-200/80 border border-slate-300 text-slate-900 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Twitter className="w-5 h-5 fill-current" />
                    </div>
                    <span className="text-[10px] font-bold">Twitter</span>
                  </button>

                  {/* Facebook */}
                  <button
                    onClick={() => handleSharePlatform('facebook')}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-blue-700 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Facebook className="w-5 h-5 fill-current" />
                    </div>
                    <span className="text-[10px] font-bold">Facebook</span>
                  </button>

                  {/* LinkedIn */}
                  <button
                    onClick={() => handleSharePlatform('linkedin')}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 text-indigo-700 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Linkedin className="w-5 h-5 fill-current" />
                    </div>
                    <span className="text-[10px] font-bold">LinkedIn</span>
                  </button>
                </div>

                {/* Direct Link Copy Input Box */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-[11px] font-bold text-slate-600">Direct Shareable Link</label>
                  <div className="flex items-center gap-2 p-1.5 pl-3 rounded-xl bg-slate-100 border border-slate-200">
                    <LinkIcon className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      readOnly
                      value={getShareUrl(shareItem)}
                      className="bg-transparent text-xs text-slate-700 font-mono flex-grow outline-none truncate"
                    />
                    <Button
                      size="sm"
                      onClick={handleCopyShareLink}
                      className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0"
                    >
                      {copiedLink ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 mr-1" />
                          Copy Link
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

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
