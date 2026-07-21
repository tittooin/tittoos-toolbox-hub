import React from "react";
import { ResolvedCommerceData } from "../services/commerceResolver";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, AlertCircle, Sparkles, Tag, ExternalLink } from "lucide-react";

interface CommerceProductCardProps {
  data: ResolvedCommerceData;
}

const CommerceProductCard: React.FC<CommerceProductCardProps> = ({ data }) => {
  const { product, listing, merchant, price, affiliate, offer, deal } = data;

  // 1. Resolve Image and Fallback
  const productImageUrl = product.mediaUrls?.[0] || "";
  const getFallbackImage = (title: string) => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const images = [
      "https://images.unsplash.com/photo-1499750310159-5b5f38e31638?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800"
    ];
    return images[Math.abs(hash) % images.length];
  };

  const [imageSrc, setImageSrc] = React.useState(productImageUrl || getFallbackImage(product.name));

  React.useEffect(() => {
    setImageSrc(productImageUrl || getFallbackImage(product.name));
  }, [productImageUrl, product.name]);

  // 2. Resolve CTA URL and Priority
  // Destination Priority: 1. manualAffiliateUrl, 2. merchantProductUrl
  const rawDestinationUrl = affiliate?.manualAffiliateUrl || listing?.merchantProductUrl || "";
  
  // URL Scheme Security Checks
  const isValidUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  const isUrlSecure = rawDestinationUrl && isValidUrl(rawDestinationUrl);
  const destinationUrl = isUrlSecure ? rawDestinationUrl : "";

  // 3. Resolve Merchant-Aware CTA Label
  const getCtaLabel = (): string => {
    if (!merchant) return "Check Latest Price";
    const name = merchant.name.toLowerCase();
    if (name.includes("amazon")) return "Buy on Amazon";
    if (name.includes("flipkart")) return "View on Flipkart";
    if (name.includes("myntra")) return "View on Myntra";
    return `View on ${merchant.name}`;
  };

  // 4. Resolve Price Presentation
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className="border border-muted hover:border-primary/20 transition-all duration-300 bg-card overflow-hidden my-8 max-w-2xl mx-auto shadow-sm">
      <div className="flex flex-col sm:flex-row">
        
        {/* Product Media Column */}
        <div className="w-full sm:w-2/5 h-48 sm:h-auto min-h-[180px] relative bg-muted/20 overflow-hidden flex items-center justify-center">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover p-2 rounded-xl transition-transform duration-500 hover:scale-102"
            onError={() => {
              setImageSrc(getFallbackImage(product.name));
            }}
          />
          {deal?.isTrending && (
            <div className="absolute top-3 left-3 bg-purple-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Sparkles className="h-3 w-3" /> Trending
            </div>
          )}
        </div>

        {/* Content Details Column */}
        <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 items-center">
              {merchant && (
                <span className="bg-primary/5 text-primary border border-primary/10 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  {merchant.name}
                </span>
              )}
              {deal?.status === "active" && (
                <span className="bg-orange-500/10 text-orange-600 border border-orange-500/20 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  Featured Deal
                </span>
              )}
            </div>

            <h3 className="text-xl font-extrabold tracking-tight text-foreground line-clamp-2">
              {product.name}
            </h3>

            {product.shortDescription && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {product.shortDescription}
              </p>
            )}
          </div>

          {/* Pricing & Offer Section */}
          <div className="space-y-3 bg-muted/10 p-3.5 rounded-xl border border-muted/50">
            <div className="flex items-baseline gap-2">
              {price ? (
                <>
                  <span className="text-2xl font-black text-foreground">
                    {formatPrice(price.amount, price.currencyCode)}
                  </span>
                  {price.amount && listing?.metadata?.originalPrice && Number(listing.metadata.originalPrice) > price.amount && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(Number(listing.metadata.originalPrice), price.currencyCode)}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-sm font-semibold text-muted-foreground italic flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" /> Price not available
                </span>
              )}
            </div>

            {/* Offer Callout */}
            {offer && (
              <div className="flex items-start gap-1.5 text-xs text-green-700 dark:text-green-400">
                <Tag className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold">{offer.title}</span>
                  {offer.description && <span className="opacity-90 block text-[10px]">{offer.description}</span>}
                </div>
              </div>
            )}
          </div>

          {/* Call to Action and Disclosures */}
          <div className="space-y-3">
            {destinationUrl ? (
              <Button asChild className="w-full justify-center font-bold tracking-tight gap-2" size="sm">
                <a href={destinationUrl} target="_blank" rel="noopener noreferrer">
                  <ShoppingBag className="h-4 w-4" /> {getCtaLabel()} <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              </Button>
            ) : (
              <Button disabled className="w-full justify-center font-bold tracking-tight gap-2" size="sm">
                <ShoppingBag className="h-4 w-4" /> {getCtaLabel()} (Unavailable)
              </Button>
            )}

            {/* Clear, Non-Deceptive Affiliate Disclosure */}
            <p className="text-[10px] text-muted-foreground leading-relaxed text-center">
              This widget contains affiliate links. Axevora may earn a referral commission if you make a purchase through these links, at no additional cost to you.
            </p>
          </div>

        </div>

      </div>
    </Card>
  );
};

export default CommerceProductCard;
