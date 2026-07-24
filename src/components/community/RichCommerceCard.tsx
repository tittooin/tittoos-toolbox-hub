import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tag, Copy, Check, ExternalLink, ShieldCheck, Clock, Share2, Sparkles, CheckCircle2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { CuelinksService } from '@/modules/commerce/services/CuelinksService';

export interface CommerceOfferPayload {
  offer_id?: string;
  id?: string;
  merchant?: string;
  merchantName?: string;
  merchant_logo?: string;
  merchantLogo?: string;
  banner_image?: string;
  bannerImage?: string;
  title: string;
  description?: string;
  coupon?: string;
  couponCode?: string;
  discount?: string;
  discountText?: string;
  destination_url?: string;
  destinationUrl?: string;
  tracking_url?: string;
  trackingUrl?: string;
  valid_until?: string;
  validUntil?: string;
  source?: string;
}

interface RichCommerceCardProps {
  offer: CommerceOfferPayload;
  className?: string;
  compact?: boolean;
}

// Axevora Branded Category Placeholder Component when no banner/logo exists
const AxevoraCategoryPlaceholder: React.FC<{ merchant: string }> = ({ merchant }) => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
      <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 border border-white/20 shadow-inner">
        <ShoppingBag className="w-6 h-6 text-white" />
      </div>
      <span className="text-white font-extrabold text-sm tracking-wide line-clamp-1">{merchant}</span>
      <span className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider mt-0.5">Verified Partner Deal</span>
    </div>
  );
};

export const RichCommerceCard: React.FC<RichCommerceCardProps> = ({ offer, className = '', compact = false }) => {
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);
  const [logoError, setLogoError] = useState<boolean>(false);

  const merchant = offer.merchant || offer.merchantName || 'Partner Store';
  const title = offer.title || 'Featured Offer';
  const description = offer.description || '';
  const coupon = offer.coupon || offer.couponCode || undefined;
  const discount = offer.discount || offer.discountText || 'Special Offer';
  const validUntil = offer.valid_until || offer.validUntil || undefined;
  
  const rawTargetUrl = offer.tracking_url || offer.trackingUrl || offer.destination_url || offer.destinationUrl || '';
  const domain = merchant.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';

  // Strict Image Priority:
  // Cuelinks actual image/banner -> Cuelinks merchant logo -> safe favicon/logo -> Axevora branded placeholder
  const actualBanner = offer.banner_image || offer.bannerImage;
  const actualLogo = offer.merchant_logo || offer.merchantLogo;
  const faviconLogo = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  const getPrimaryImageSrc = (): string | null => {
    if (!imgError && actualBanner && actualBanner.startsWith('http')) return actualBanner;
    if (!logoError && actualLogo && actualLogo.startsWith('http')) return actualLogo;
    return null;
  };

  const getLogoSrc = (): string => {
    if (!logoError && actualLogo && actualLogo.startsWith('http')) return actualLogo;
    return faviconLogo;
  };

  // Helper to ensure verified Cuelinks tracking URL
  const getVerifiedTrackingUrl = async (): Promise<string> => {
    if (rawTargetUrl && (rawTargetUrl.includes('clnk.in') || rawTargetUrl.includes('cuelinks.com') || rawTargetUrl.includes('linksredirect.com'))) {
      return rawTargetUrl;
    }
    if (!rawTargetUrl || !rawTargetUrl.startsWith('http')) return window.location.href;

    try {
      const converted = await CuelinksService.convertLink(rawTargetUrl, 'axevora_bot', 'rich_card');
      return converted.trackingUrl || rawTargetUrl;
    } catch {
      return rawTargetUrl;
    }
  };

  const handleOpenDeal = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const trackingUrl = await getVerifiedTrackingUrl();
    window.open(trackingUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!coupon) return;
    navigator.clipboard.writeText(coupon);
    setCopiedCode(true);
    toast.success(`Coupon code ${coupon} copied!`, { description: `Redeem at ${merchant}` });
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const trackingUrl = await getVerifiedTrackingUrl();
    navigator.clipboard.writeText(trackingUrl);
    setCopiedLink(true);
    toast.success("Affiliate tracking link copied!", { description: "You can now share it anywhere." });
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const trackingUrl = await getVerifiedTrackingUrl();
    const shareText = `🔥 ${merchant} Offer on Axevora: ${title}`;

    if (navigator.share && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text: shareText, url: trackingUrl });
        toast.success("Offer shared successfully!");
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(trackingUrl);
    toast.success("Affiliate link copied to clipboard!");
  };

  const imageSrc = getPrimaryImageSrc();

  return (
    <Card className={`bg-white border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group ${className}`}>
      {/* Card Header Banner Image or Branded Placeholder */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <AxevoraCategoryPlaceholder merchant={merchant} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent pointer-events-none" />

        {/* Merchant Logo Floating Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-md">
          <img
            src={getLogoSrc()}
            alt={merchant}
            className="w-4 h-4 rounded-full object-contain"
            onError={() => setLogoError(true)}
          />
          <span className="text-[11px] font-bold text-slate-900 tracking-tight">{merchant}</span>
        </div>

        {/* Discount Badge Top Right */}
        {discount && (
          <div className="absolute top-3 right-3 bg-indigo-600 text-white font-extrabold text-[11px] px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span>{discount}</span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <CardContent className="p-5 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
            {title}
          </h3>
          {description && (
            <p className="line-clamp-2 text-xs text-slate-600 mt-2 leading-relaxed font-normal">
              {description}
            </p>
          )}
        </div>

        <div className="space-y-3 pt-1">
          {/* Coupon Box */}
          {coupon ? (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-50/80 border border-dashed border-indigo-300 font-mono text-xs">
              <div className="flex items-center gap-2 text-indigo-900 font-bold tracking-wide">
                <Tag className="w-3.5 h-3.5 text-indigo-600" />
                <span>{coupon}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-3 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100 rounded-lg"
                onClick={handleCopyCode}
              >
                {copiedCode ? (
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
            <div className="p-2 rounded-xl bg-slate-100/80 border border-slate-200 text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>No Coupon Required — Instant Discount</span>
            </div>
          )}

          {/* Expiry Date */}
          {validUntil && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <Clock className="w-3 h-3 text-indigo-600" />
              <span>Valid Until {validUntil}</span>
            </div>
          )}

          {/* Action Row: View Deal + Share + Copy Link */}
          <div className="flex items-center gap-2 pt-1">
            <Button
              onClick={handleOpenDeal}
              className="flex-grow rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-10 shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>View Deal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>

            <Button
              onClick={handleShare}
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-600 shrink-0"
              title="Share Deal"
            >
              <Share2 className="w-4 h-4" />
            </Button>

            <Button
              onClick={handleCopyLink}
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-600 shrink-0"
              title="Copy Affiliate Link"
            >
              {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Clear Partner Disclosure */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-500 font-normal">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <p>Partner Offer — Axevora may earn a commission when you purchase through this link.</p>
        </div>
      </CardContent>
    </Card>
  );
};
