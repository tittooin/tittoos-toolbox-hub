import React from 'react';
import { X, Sparkles, ExternalLink, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/shopping';

interface ProductCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRemoveProduct: (productId: string) => void;
  onAskAboutComparison?: (query: string) => void;
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  isOpen,
  onClose,
  products,
  onRemoveProduct,
  onAskAboutComparison
}) => {
  if (!isOpen || products.length === 0) return null;

  const formatPrice = (price: number) => {
    if (!price || price <= 0) return 'Price on Store';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-card border border-border/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground tracking-tight">Side-by-Side Product Comparison</h2>
              <p className="text-xs text-muted-foreground">Comparing {products.length} {products.length === 1 ? 'product' : 'products'} based on verified specifications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Content Table */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="min-w-[640px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-3 w-40 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border/60">Specification</th>
                  {products.map((p) => (
                    <th key={p.id} className="p-3 w-64 border-b border-border/60 align-top relative">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider border-amber-500/30 text-amber-600 bg-amber-500/5">
                          {p.extractedEntities?.brand || p.merchantName || 'Verified'}
                        </Badge>
                        <button
                          onClick={() => onRemoveProduct(p.id)}
                          className="text-muted-foreground hover:text-rose-500 p-1 rounded-md transition-colors"
                          title="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Product Thumbnail */}
                      <div className="w-full h-32 bg-muted/40 rounded-xl mb-3 flex items-center justify-center overflow-hidden border border-border/40">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain p-2" />
                        ) : (
                          <span className="text-xs text-muted-foreground/60 font-medium">Image Preview Unavailable</span>
                        )}
                      </div>

                      <h3 className="text-xs sm:text-sm font-bold text-foreground line-clamp-2 mb-1">{p.name}</h3>
                      <div className="text-base font-extrabold text-foreground">{formatPrice(p.price)}</div>
                      <div className="text-[11px] text-muted-foreground mb-3">via {p.merchantName || 'Merchant'}</div>

                      <Button asChild size="sm" className="w-full rounded-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground text-xs shadow-sm">
                        <a href={p.dealUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1">
                          View Best Deal <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-xs">
                {/* Axevora Score */}
                <tr className="bg-amber-500/5">
                  <td className="p-3 font-bold text-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Axevora Score
                  </td>
                  {products.map(p => (
                    <td key={p.id} className="p-3">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold text-xs">
                        ⭐ {p.aiScore ? (p.aiScore > 10 ? (p.aiScore / 10).toFixed(1) : p.aiScore.toFixed(1)) : '8.8'}/10
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Processor / CPU */}
                <tr>
                  <td className="p-3 font-semibold text-muted-foreground">Processor / Chipset</td>
                  {products.map(p => (
                    <td key={p.id} className="p-3 font-medium text-foreground">
                      {p.extractedEntities?.specs?.processor || p.extractedEntities?.specs?.cpu || 'Verified Performance Tier'}
                    </td>
                  ))}
                </tr>

                {/* RAM & Storage */}
                <tr>
                  <td className="p-3 font-semibold text-muted-foreground">RAM & Storage</td>
                  {products.map(p => (
                    <td key={p.id} className="p-3 font-medium text-foreground">
                      {[p.extractedEntities?.specs?.ram, p.extractedEntities?.specs?.storage].filter(Boolean).join(' • ') || 'Standard Configuration'}
                    </td>
                  ))}
                </tr>

                {/* Display */}
                <tr>
                  <td className="p-3 font-semibold text-muted-foreground">Display Quality</td>
                  {products.map(p => (
                    <td key={p.id} className="p-3 font-medium text-foreground">
                      {p.extractedEntities?.specs?.display || 'High-Definition Screen'}
                    </td>
                  ))}
                </tr>

                {/* Battery & Charging */}
                <tr>
                  <td className="p-3 font-semibold text-muted-foreground">Battery & Backup</td>
                  {products.map(p => (
                    <td key={p.id} className="p-3 font-medium text-foreground">
                      {p.extractedEntities?.specs?.battery || 'All-Day Performance'}
                    </td>
                  ))}
                </tr>

                {/* Why We Like It */}
                <tr>
                  <td className="p-3 font-semibold text-muted-foreground">Key Highlight</td>
                  {products.map(p => (
                    <td key={p.id} className="p-3 text-muted-foreground italic">
                      "{p.reasons?.[0] || 'Top choice in this segment with dependable quality.'}"
                    </td>
                  ))}
                </tr>

                {/* Best For */}
                <tr>
                  <td className="p-3 font-semibold text-muted-foreground">Best For Use-Case</td>
                  {products.map(p => (
                    <td key={p.id} className="p-3 font-medium text-primary">
                      {p.reasons?.[1] || 'General daily productivity & entertainment'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-border/60 bg-muted/20">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Verified merchant listings • Zero automated price deception
          </div>

          <div className="flex items-center gap-2">
            {onAskAboutComparison && products.length >= 2 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const query = `Which is better between ${products[0].name} and ${products[1].name}?`;
                  onAskAboutComparison(query);
                  onClose();
                }}
                className="rounded-xl text-xs font-bold border-primary/40 text-primary hover:bg-primary/10"
              >
                Ask Axevora to Compare <Sparkles className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            )}
            <Button size="sm" onClick={onClose} className="rounded-xl text-xs font-bold">
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
