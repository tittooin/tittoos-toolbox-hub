import { ShieldCheck, Truck, HeadphonesIcon, Store } from 'lucide-react';
import { Merchant } from '@/types/shopping';
import { Badge } from '@/components/ui/badge';

interface MerchantCardProps {
  merchant: Merchant;
}

export default function MerchantCard({ merchant }: MerchantCardProps) {
  return (
    <div className="flex flex-col p-4 rounded-xl border border-border bg-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-white rounded-lg border border-border p-1 flex items-center justify-center flex-shrink-0">
          {merchant.logoUrl ? (
            <img src={merchant.logoUrl} alt={merchant.name} className="w-full h-full object-contain" />
          ) : (
            <Store className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        <div>
          <h4 className="font-semibold">{merchant.name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-[10px] py-0 h-4 border-green-500/30 text-green-600 bg-green-500/10">
              <ShieldCheck className="w-3 h-3 mr-1" />
              {merchant.trustScore}% Trust
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <HeadphonesIcon className="w-4 h-4 text-primary" />
          <div className="flex flex-col">
            <span className="font-medium text-foreground">Support</span>
            <span>{merchant.supportRating}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Truck className="w-4 h-4 text-primary" />
          <div className="flex flex-col">
            <span className="font-medium text-foreground">Delivery</span>
            <span>{merchant.deliverySpeed}</span>
          </div>
        </div>
      </div>

      {merchant.offers && merchant.offers.length > 0 && (
        <div className="space-y-1 mt-auto border-t border-border pt-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Available Offers</p>
          <ul className="text-xs space-y-1.5">
            {merchant.offers.map((offer, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span className="text-muted-foreground">{offer}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
