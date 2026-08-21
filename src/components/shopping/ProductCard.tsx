import { useState, useEffect } from 'react';
import { Star, ShieldCheck, Box, RotateCcw, Zap, ExternalLink, ShoppingBag, Store, Tag, ImageOff } from 'lucide-react';
import { Product } from '@/types/shopping';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Determine legitimate initial image
  const initialImage = product.imageUrl && product.imageUrl.trim().length > 0 ? product.imageUrl : null;
  const [imgSrc, setImgSrc] = useState<string | null>(initialImage);
  const [imageFailed, setImageFailed] = useState<boolean>(false);

  // Synchronize when product.imageUrl arrives dynamically from OpenSERP
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
  const isStoreDeal = product.dealType === 'STORE_DEAL' || product.dealType === 'CAMPAIGN';
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

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* 1. PRODUCT IMAGE / NEUTRAL PLACEHOLDER */}
      <div className="relative h-48 bg-muted/40 w-full flex items-center justify-center overflow-hidden border-b border-border/50">
        {showImage ? (
          <img 
            src={imgSrc!} 
            alt={product.name}
            onError={handleImageError}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain p-2 transition-transform hover:scale-105 duration-500"
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

        {/* Top Floating Badges */}
        <div className="absolute top-2 right-2 flex gap-1">
          {product.dealType && (
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm font-semibold text-[10px] border-primary/20 text-primary uppercase tracking-wider">
              {isProductDeal ? 'Product Deal' :
               isCategoryDeal ? 'Category Sale' :
               isCouponDeal ? 'Coupon Deal' : 'Store Offer'}
            </Badge>
          )}
          {product.verificationStatus && (
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm font-medium text-[10px] text-muted-foreground">
              {product.verificationStatus === 'LIVE_VERIFIED' ? 'Live Verified' :
               product.verificationStatus === 'SOURCE_STATED' ? 'Advertised' : 'Verified Merchant'}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
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
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
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
        <h3 className="font-bold text-base leading-snug mb-2 line-clamp-2 text-foreground" title={product.name}>
          {product.name}
        </h3>

        {/* 4. KEY SPECS PILLS */}
        {specList.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {specList.map((spec, i) => (
              <span key={i} className="inline-flex items-center text-[10px] bg-secondary/60 text-secondary-foreground font-medium px-1.5 py-0.5 rounded border border-border/40">
                {spec}
              </span>
            ))}
          </div>
        )}
        
        {/* Rating / Review Count */}
        {product.rating && product.rating > 0 ? (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="ml-1 text-xs font-medium">{product.rating}</span>
            </div>
            {product.reviewCount && product.reviewCount > 0 && (
              <span className="text-muted-foreground text-[11px]">({product.reviewCount.toLocaleString()} reviews)</span>
            )}
          </div>
        ) : (
          <div className="text-[11px] text-muted-foreground mb-2 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>{isProductDeal ? 'Verified Product Identity' : 'Verified Merchant Portal'}</span>
          </div>
        )}

        {/* 5. PRICE INTEGRITY */}
        {product.price > 0 ? (
          <div className="flex flex-col mb-3">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              {product.priceType === 'STARTING_PRICE' ? 'Starting from' :
               product.priceType === 'ADVERTISED_PRODUCT_PRICE' ? 'Advertised Deal Price' :
               product.priceType === 'DISCOUNT_AMOUNT' ? 'Discount Offer' :
               isProductDeal ? 'Advertised Deal Price' : 'Verified Store Price'}
            </span>
            <div className="flex items-baseline gap-2">
              <div className="text-xl font-extrabold text-foreground">
                {product.currency === 'INR' ? '₹' : product.currency}{product.price.toLocaleString()}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="text-xs text-muted-foreground line-through">
                  {product.currency === 'INR' ? '₹' : product.currency}{product.originalPrice.toLocaleString()}
                </div>
              )}
              {product.discountPercentage && product.discountPercentage > 0 && (
                <Badge variant="destructive" className="ml-auto text-[10px] px-1.5 py-0">
                  {product.discountPercentage}% OFF
                </Badge>
              )}
              {!product.discountPercentage && product.discountText && (
                <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20">
                  {product.discountText}
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
            {product.discountText && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {product.discountText}
              </span>
            )}
          </div>
        )}

        {/* 6. WHY THIS PRODUCT / HIGHLIGHTS */}
        {product.reasons && product.reasons.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.reasons.slice(0, 2).map((reason, i) => (
              <span key={i} className="inline-flex items-center rounded bg-primary/5 text-primary border border-primary/15 px-1.5 py-0.5 text-[10px] font-medium">
                {reason}
              </span>
            ))}
          </div>
        )}

        {/* 7. CTA BUTTONS */}
        <div className="mt-auto space-y-1.5 pt-1">
          <Button className="w-full gap-2 font-bold shadow-sm" size="default" asChild>
            <a href={product.dealUrl} target="_blank" rel="noopener noreferrer">
              <ShoppingBag className="w-4 h-4" /> {isProductDeal ? 'View Deal' : 'Open Store'}
            </a>
          </Button>
          <div className="grid grid-cols-2 gap-1.5">
            <Button variant="outline" className="w-full gap-1 text-[11px] h-8" asChild>
              <a href={product.dealUrl} target="_blank" rel="noopener noreferrer">
                {isProductDeal ? 'Product Details' : 'Store Portal'} <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </Button>
            <Button variant="secondary" className="w-full gap-1 text-[11px] h-8 truncate" asChild>
              <a href={product.dealUrl} target="_blank" rel="noopener noreferrer">
                {product.merchantName || product.merchantId.charAt(0).toUpperCase() + product.merchantId.slice(1)}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
