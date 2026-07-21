import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tag, Copy, Check, ExternalLink, ShieldCheck, ShoppingBag, Clock } from "lucide-react";
import { toast } from "sonner";
import { CuelinksService } from "@/modules/commerce/services/CuelinksService";
import { CommerceDiscoveryItem } from "@/modules/commerce/types/commerceDiscovery";

export const CommerceSection = () => {
  const [items, setItems] = useState<CommerceDiscoveryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'deals' | 'stores'>('all');
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
    // Avoid double conversion if trackingUrl is already provided by Cuelinks API
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

  const filteredItems = items.filter((item) => {
    if (activeTab === 'deals') return item.type === 'offer';
    if (activeTab === 'stores') return item.type === 'campaign';
    return true;
  });

  return (
    <section id="commerce-deals" className="py-20 px-4 bg-gradient-to-b from-background via-secondary/10 to-background border-y border-border/50">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <Badge variant="outline" className="mb-4 border-amber-500/30 bg-amber-500/10 text-amber-500 rounded-full px-4 py-1">
              <Tag className="w-3.5 h-3.5 mr-2" />
              Live Commerce & Verified Deals
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70">
              Featured Deals & Partner Offers
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl text-base">
              Verified coupon codes, instant discounts, and top merchant offers updated in real-time.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeTab === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveTab('all')}
              className="rounded-full text-sm"
              size="sm"
            >
              All Deals ({items.length})
            </Button>
            <Button
              variant={activeTab === 'deals' ? 'default' : 'outline'}
              onClick={() => setActiveTab('deals')}
              className="rounded-full text-sm"
              size="sm"
            >
              Featured Offers
            </Button>
            <Button
              variant={activeTab === 'stores' ? 'default' : 'outline'}
              onClick={() => setActiveTab('stores')}
              className="rounded-full text-sm"
              size="sm"
            >
              Popular Stores
            </Button>
          </div>
        </div>

        {/* Deals Cards Grid or Clean Empty State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-card/40 border border-border/40 animate-pulse p-6"></div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Card className="h-full flex flex-col justify-between bg-card/60 backdrop-blur border-border/60 hover:border-amber-500/40 hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        {item.merchantLogo ? (
                          <img
                            src={item.merchantLogo}
                            alt={item.merchantName}
                            className="w-8 h-8 rounded-lg object-contain bg-white p-1 border border-border/40 shadow-sm"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs">
                            {item.merchantName ? item.merchantName.substring(0, 2).toUpperCase() : 'DEAL'}
                          </div>
                        )}
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {item.merchantName}
                        </span>
                      </div>

                      {item.discountText && (
                        <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/30 font-bold text-xs">
                          {item.discountText}
                        </Badge>
                      )}
                    </div>

                    <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-amber-500 transition-colors">
                      {item.title}
                    </CardTitle>

                    {item.description && (
                      <CardDescription className="line-clamp-2 text-xs mt-1 text-muted-foreground">
                        {item.description}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="pt-0 space-y-4">
                    {/* Coupon Code Section if available */}
                    {item.couponCode && (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/30 border border-dashed border-amber-500/30 font-mono text-xs">
                        <div className="flex items-center gap-2 text-foreground font-bold">
                          <Tag className="w-3.5 h-3.5 text-amber-500" />
                          <span>{item.couponCode}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2.5 text-xs text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg"
                          onClick={() => handleCopyCode(item.couponCode!, item.merchantName)}
                        >
                          {copiedCode === item.couponCode ? (
                            <>
                              <Check className="w-3.5 h-3.5 mr-1 text-green-500" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 mr-1" />
                              Copy Code
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    {/* Expiry badge if provided */}
                    {item.validUntil && (
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span>Valid till {item.validUntil}</span>
                      </div>
                    )}

                    {/* CTA Button */}
                    <Button
                      onClick={() => handleDealClick(item)}
                      className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-md group-hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <span>Grab Deal</span>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-card/30 rounded-3xl border border-dashed border-border/60 max-w-2xl mx-auto">
            <ShoppingBag className="w-12 h-12 text-amber-500/40 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Deals Temporarily Unavailable</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              We are connecting live verified partner offers. Please check back soon or explore our free online tools and games below.
            </p>
          </div>
        )}

        {/* Transparent Affiliate Disclosure Notice */}
        <div className="mt-12 text-center text-xs text-muted-foreground/70 flex items-center justify-center gap-2 max-w-2xl mx-auto border-t border-border/30 pt-6">
          <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
          <p>
            <strong>Affiliate Disclosure:</strong> Axevora participates in affiliate marketing programs (including Cuelinks and direct merchant partnerships). We may earn a small commission when you purchase through links on our site at zero extra cost to you.
          </p>
        </div>
      </div>
    </section>
  );
};
