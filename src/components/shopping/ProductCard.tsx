import { Star, ShieldCheck, Box, RotateCcw, Zap, ExternalLink, ShoppingBag, Store } from 'lucide-react';
import { Product } from '@/types/shopping';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-muted w-full">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm font-semibold text-xs border-primary/20 text-primary flex items-center gap-1">
            <Zap className="w-3 h-3" />
            AI {product.aiScore}
          </Badge>
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm font-semibold text-xs flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-green-500" />
            {product.communityScore}% Trust
          </Badge>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="bg-background text-xs font-medium flex items-center gap-1.5 px-2 py-0.5 border-primary/20">
            {product.merchantLogoUrl ? (
              <img src={product.merchantLogoUrl} alt={product.merchantName || product.merchantId} className="w-3 h-3 object-contain" />
            ) : (
              <Store className="w-3 h-3 text-muted-foreground" />
            )}
            {product.merchantName || product.merchantId.charAt(0).toUpperCase() + product.merchantId.slice(1)}
          </Badge>
        </div>
        
        <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2">{product.name}</h3>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-muted-foreground text-xs">({product.reviewCount.toLocaleString()} reviews)</span>
        </div>
        
        <div className="flex items-baseline gap-2 mb-4">
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
        </div>

        <div className="space-y-2 mb-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Box className="w-3.5 h-3.5" />
            <span>{product.deliveryEstimate}</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{product.returnPolicy}</span>
          </div>
        </div>

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
                <ShoppingBag className="w-4 h-4" /> Buy Now
              </a>
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="w-full gap-1.5 text-xs h-9" asChild>
                <a href={product.dealUrl} target="_blank" rel="noopener noreferrer">
                  View Product <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
              <Button variant="secondary" className="w-full gap-1.5 text-xs h-9" asChild>
                <a href={product.dealUrl} target="_blank" rel="noopener noreferrer">
                  Open {product.merchantName || product.merchantId.charAt(0).toUpperCase() + product.merchantId.slice(1)}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
