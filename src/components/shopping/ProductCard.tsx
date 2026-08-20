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

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Product Image / Neutral Placeholder Area */}
      <div className="relative h-48 bg-muted/40 w-full flex items-center justify-center overflow-hidden border-b border-border/50">
        {showImage ? (
          <img 
            src={imgSrc!} 
            alt={product.name}
            onError={handleImageError}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground p-4 text-center select-none">
            <div className="w-12 h-12 rounded-full bg-secondary/80 flex items-center justify-center mb-2 shadow-inner">
              <ImageOff className="w-6 h-6 text-muted-foreground/70" />
            </div>
            <span className="text-xs font-medium text-muted-foreground/80">Product Image Unavailable</span>
            <span className="text-[10px] text-muted-foreground/50 mt-0.5">Zero-Deception Guaranteed</span>
          </div>
        )}

        {/* Honest Image Source Provenance */}
        {showImage && product.imageSourceDomain && (
          <div className="absolute bottom-2 left-2">
            <span className="text-[9px] bg-background/85 backdrop-blur-sm text-muted-foreground/90 font-mono px-1.5 py-0.5 rounded border border-border/50 shadow-sm">
              via {product.imageSourceDomain}
            </span>
          </div>
        )}

        {/* Top Floating Badges */}
        <div className="absolute top-2 right-2 flex gap-1">
          {product.dealType && (
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm font-semibold text-[10px] border-primary/20 text-primary uppercase tracking-wider">
              {product.dealType === 'PRODUCT_DEAL' ? 'Product Deal' :
               product.dealType === 'CATEGORY_DEAL' ? 'Category Sale' :
               product.dealType === 'COUPON_DEAL' ? 'Coupon Deal' : 'Store Offer'}
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
        {/* Merchant & Store Identifier */}
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="bg-background text-xs font-medium flex items-center gap-1.5 px-2 py-0.5 border-primary/20">
            {product.merchantLogoUrl ? (
              <img src={product.merchantLogoUrl} alt={product.merchantName || product.merchantId} className="w-3 h-3 object-contain" />
            ) : (
              <Store className="w-3 h-3 text-muted-foreground" />
            )}
            {product.merchantName || product.merchantId.charAt(0).toUpperCase() + product.merchantId.slice(1)}
          </Badge>

          {product.couponCode && (
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[11px] font-mono font-semibold flex items-center gap-1 px-1.5 py-0.5">
              <Tag className="w-3 h-3" /> {product.couponCode}
            </Badge>
          )}
        </div>
        
        {/* Product Title */}
        <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2">{product.name}</h3>
        
        {/* Rating / Review Count */}
        {product.rating && product.rating > 0 ? (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center text-amber-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="ml-1 text-sm font-medium">{product.rating}</span>
            </div>
            {product.reviewCount && product.reviewCount > 0 && (
              <span className="text-muted-foreground text-xs">({product.reviewCount.toLocaleString()} reviews)</span>
            )}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground mb-3 italic">Verified Merchant Listing</div>
        )}

        {/* Price Presentation with Explicit Provenance */}
        {product.price > 0 ? (
          <div className="flex flex-col mb-4">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              {product.priceType === 'STARTING_PRICE' ? 'Starting from' :
               product.priceType === 'ADVERTISED_PRODUCT_PRICE' ? 'Advertised Deal Price' :
               product.priceType === 'DISCOUNT_AMOUNT' ? 'Discount Offer' :
               isProductDeal ? 'Advertised Deal Price' : 'Verified Store Price'}
            </span>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold">
                {product.currency === 'INR' ? '₹' : product.currency}{product.price.toLocaleString()}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="text-sm text-muted-foreground line-through">
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
          <div className="mb-4 py-1 flex items-center justify-between">
            <Badge variant="outline" className="text-xs font-normal border-primary/20 bg-primary/5 text-primary">
              {isProductDeal ? 'Price unavailable in offer' :
               isCategoryDeal ? 'Category Sale & Offers' :
               isCouponDeal ? 'Store Coupon Offer' : 'Verified Store Offer'}
            </Badge>
            {product.discountText && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {product.discountText}
              </span>
            )}
          </div>
        )}

        {/* Delivery / Return Policy */}
        <div className="space-y-1.5 mb-4 text-xs text-muted-foreground">
          {product.deliveryEstimate && (
            <div className="flex items-center gap-2">
              <Box className="w-3.5 h-3.5" />
              <span>{product.deliveryEstimate}</span>
            </div>
          )}
          {product.validUntil && (
            <div className="flex items-center gap-2 text-amber-600/90 dark:text-amber-400/90">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Valid till: {new Date(product.validUntil).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Outbound CTA Buttons */}
        <div className="mt-auto space-y-2">
          {product.reasons && product.reasons.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {product.reasons.map((reason, i) => (
                <span key={i} className="inline-flex items-center rounded-md bg-secondary/50 px-2 py-1 text-[10px] font-medium text-secondary-foreground">
                  {reason}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex flex-col gap-2 pt-2">
            <Button className="w-full gap-2 font-bold" size="default" asChild>
              <a href={product.dealUrl} target="_blank" rel="noopener noreferrer">
                <ShoppingBag className="w-4 h-4" /> {isProductDeal ? 'View Deal' : 'Open Store'}
              </a>
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="w-full gap-1.5 text-xs h-9" asChild>
                <a href={product.dealUrl} target="_blank" rel="noopener noreferrer">
                  {isProductDeal ? 'Product Details' : 'Store Portal'} <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
              <Button variant="secondary" className="w-full gap-1.5 text-xs h-9" asChild>
                <a href={product.dealUrl} target="_blank" rel="noopener noreferrer">
                  {product.merchantName || product.merchantId.charAt(0).toUpperCase() + product.merchantId.slice(1)}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
