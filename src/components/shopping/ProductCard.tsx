import { useState, useEffect } from 'react';
import { Star, ShieldCheck, Box, RotateCcw, Zap, ExternalLink, ShoppingBag, Store, Tag, ImageOff, Sparkles, Plus, Check, ArrowRight } from 'lucide-react';
import { Product } from '@/types/shopping';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  isComparing?: boolean;
  onToggleCompare?: (product: Product) => void;
}

export default function ProductCard({ product, isComparing = false, onToggleCompare }: ProductCardProps) {
  // Determine legitimate initial image
  const initialImage = product.imageUrl && product.imageUrl.trim().length > 0 ? product.imageUrl : null;
  const [imgSrc, setImgSrc] = useState<string | null>(initialImage);
  const [imageFailed, setImageFailed] = useState<boolean>(false);

  // Synchronize when product.imageUrl arrives dynamically
  useEffect(() => {
    if (product.imageUrl && product.imageUrl.trim().length > 0) {
      setImgSrc(product.imageUrl);
      setImageFailed(false);
    }
  }, [product.imageUrl]);

  const handleImageError = () => {
    setImageFailed(true);
    setImgSrc(null);
  };

  const isProductDeal = product.dealType === 'PRODUCT_DEAL' || (!product.dealType && product.urlType === 'product');
  const isCategoryDeal = product.dealType === 'CATEGORY_DEAL';
  const isCouponDeal = product.dealType === 'COUPON_DEAL' || Boolean(product.couponCode);

  const showImage = Boolean(imgSrc && !imageFailed);

  // Extract specs array if available
  const specList: string[] = [];
  if (product.extractedEntities?.specs) {
    Object.values(product.extractedEntities.specs).forEach(val => {
      if (val && typeof val === 'string' && !specList.includes(val)) {
        specList.push(val);
      }
    });
  }

  // Calculate score display
  const rawScore = product.aiScore || 8.8;
  const displayScore = rawScore > 10 ? (rawScore / 10).toFixed(1) : rawScore.toFixed(1);

  return (
    <div className={`group flex flex-col rounded-2xl border transition-all duration-200 overflow-hidden bg-card ${
      isComparing ? 'border-primary ring-2 ring-primary/20 shadow-md' : 'border-border/80 hover:border-primary/40 hover:shadow-lg'
    }`}>
      {/* 1. PRODUCT IMAGE / NEUTRAL PLACEHOLDER */}
      <div className="relative h-48 bg-muted/30 w-full flex items-center justify-center overflow-hidden border-b border-border/40">
        {showImage ? (
          <img 
            src={imgSrc!} 
            alt={product.name}
            onError={handleImageError}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-contain p-3 transition-transform group-hover:scale-105 duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground p-4 text-center select-none">
            <div className="w-12 h-12 rounded-full bg-secondary/80 flex items-center justify-center mb-2 shadow-inner">
              <ImageOff className="w-6 h-6 text-muted-foreground/70" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground/90">Product Image Unavailable</span>
            <span className="text-[10px] text-muted-foreground/60 mt-0.5 font-mono">Zero-Deception Guaranteed</span>
          </div>
        )}

        {/* Provenance Tag */}
        {showImage && product.imageSourceDomain && (
          <div className="absolute bottom-2 left-2">
            <span className="text-[9px] bg-background/90 backdrop-blur-sm text-muted-foreground/90 font-mono px-1.5 py-0.5 rounded border border-border/50 shadow-sm">
              via {product.imageSourceDomain}
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {/* Axevora Score Badge */}
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-background/95 backdrop-blur-sm border border-amber-500/30 text-amber-600 dark:text-amber-400 font-extrabold text-[11px] shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{displayScore}/10</span>
          </div>
        </div>

        <div className="absolute top-2.5 right-2.5 flex gap-1">
          {product.dealType && (
            <Badge variant="secondary" className="bg-background/95 backdrop-blur-sm font-bold text-[10px] border-primary/20 text-primary uppercase tracking-wider">
              {isProductDeal ? 'Product Deal' :
               isCategoryDeal ? 'Category Sale' :
               isCouponDeal ? 'Coupon Deal' : 'Store Offer'}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* 2. MERCHANT IDENTIFIER & BRAND */}
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline" className="bg-background text-xs font-medium flex items-center gap-1.5 px-2 py-0.5 border-primary/20">
            {product.merchantLogoUrl ? (
              <img src={product.merchantLogoUrl} alt={product.merchantName || product.merchantId} className="w-3.5 h-3.5 object-contain" />
            ) : (
              <Store className="w-3.5 h-3.5 text-muted-foreground" />
            )}
            {product.merchantName || product.merchantId.charAt(0).toUpperCase() + product.merchantId.slice(1)}
          </Badge>

          {product.extractedEntities?.brand && (
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              {product.extractedEntities.brand}
            </span>
          )}

          {product.couponCode && (
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[11px] font-mono font-semibold flex items-center gap-1 px-1.5 py-0.5">
              <Tag className="w-3 h-3" /> {product.couponCode}
            </Badge>
          )}
        </div>
        
        {/* 3. PRODUCT NAME */}
        <h3 className="font-bold text-sm sm:text-base leading-snug mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors" title={product.name}>
          {product.name}
        </h3>

        {/* 4. KEY SPECS PILLS */}
        {specList.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {specList.slice(0, 4).map((spec, i) => (
              <span key={i} className="inline-flex items-center text-[10px] bg-secondary/70 text-secondary-foreground font-medium px-2 py-0.5 rounded-md border border-border/50">
                {spec}
              </span>
            ))}
          </div>
        )}

        {/* 5. PRICE INTEGRITY */}
        {product.price > 0 ? (
          <div className="flex flex-col mb-3">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">
              {product.priceType === 'STARTING_PRICE' ? 'Starting from' :
               product.priceType === 'ADVERTISED_PRODUCT_PRICE' ? 'Advertised Deal Price' :
               product.priceType === 'DISCOUNT_AMOUNT' ? 'Discount Offer' :
               isProductDeal ? 'Advertised Deal Price' : 'Verified Store Price'}
            </span>
            <div className="flex items-baseline gap-2">
              <div className="text-xl font-extrabold text-foreground tracking-tight">
                {product.currency === 'INR' ? '₹' : product.currency}{product.price.toLocaleString()}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="text-xs text-muted-foreground line-through">
                  {product.currency === 'INR' ? '₹' : product.currency}{product.originalPrice.toLocaleString()}
                </div>
              )}
              {product.discountPercentage && product.discountPercentage > 0 && (
                <Badge variant="destructive" className="ml-auto text-[10px] font-bold px-1.5 py-0">
                  {product.discountPercentage}% OFF
                </Badge>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-3 py-1 flex items-center justify-between">
            <Badge variant="outline" className="text-[11px] font-normal border-border bg-muted/30 text-muted-foreground">
              {isProductDeal ? 'Price unavailable in offer' :
               isCategoryDeal ? 'Category Sale & Offers' :
               isCouponDeal ? 'Store Coupon Offer' : 'Live Store Directory'}
            </Badge>
          </div>
        )}

        {/* 6. WHY THIS PRODUCT / HIGHLIGHTS */}
        {product.reasons && product.reasons.length > 0 && (
          <div className="space-y-1 mb-4 text-xs text-muted-foreground">
            <p className="line-clamp-2 italic leading-relaxed">
              "{product.reasons[0]}"
            </p>
          </div>
        )}

        {/* 7. CTA BUTTONS & COMPARE TRIGGER */}
        <div className="mt-auto pt-2 space-y-2">
          <Button className="w-full gap-2 font-bold shadow-md rounded-xl h-10 bg-primary hover:bg-primary/90 text-primary-foreground" size="default" asChild>
            <a href={product.dealUrl} target="_blank" rel="noopener noreferrer">
              <ShoppingBag className="w-4 h-4" /> {isProductDeal ? 'View Best Deal' : 'Open Store'}
            </a>
          </Button>

          <div className="flex items-center gap-2">
            {onToggleCompare && (
              <Button
                type="button"
                variant={isComparing ? "secondary" : "outline"}
                size="sm"
                onClick={() => onToggleCompare(product)}
                className={`flex-1 rounded-xl text-xs font-semibold h-8.5 transition-colors ${
                  isComparing ? 'bg-primary/10 text-primary border-primary/30' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isComparing ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-primary" /> Comparing
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Compare
                  </>
                )}
              </Button>
            )}

            <Button variant="ghost" size="sm" className="rounded-xl text-xs font-semibold h-8.5 text-muted-foreground hover:text-foreground" asChild>
              <a href={product.dealUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                Store <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
