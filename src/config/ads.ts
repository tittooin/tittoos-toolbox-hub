// Placeholder configuration for AdSense unit slots and layout keys.
// Replace the values with actual IDs from your AdSense account.

export type AdUnitConfig = {
  slot: string;
  layoutKey?: string; // required for in-feed units
};

export type AdsConfig = {
  display: Record<string, AdUnitConfig>;
  inArticle: Record<string, AdUnitConfig>;
  multiplex: Record<string, AdUnitConfig>;
  inFeed: Record<string, AdUnitConfig>;
};

export const ADS_CONFIG: AdsConfig = {
  display: {
    homeTop: { slot: 'REPLACE_WITH_SLOT' },
    toolsMid: { slot: 'REPLACE_WITH_SLOT' },
    blogTop: { slot: 'REPLACE_WITH_SLOT' },
  },
  inArticle: {
    blogInline: { slot: 'REPLACE_WITH_SLOT' },
  },
  multiplex: {
    blogEnd: { slot: 'REPLACE_WITH_SLOT' },
  },
  inFeed: {
    listMid: { slot: 'REPLACE_WITH_SLOT', layoutKey: 'REPLACE_WITH_LAYOUT_KEY' },
  },
};

// Example usage:
// import { ADS_CONFIG } from '@/config/ads';
// <AdSense adSlot={ADS_CONFIG.display.homeTop.slot} adType="display" />
// <AdSense adSlot={ADS_CONFIG.inFeed.listMid.slot} adType="in_feed" layoutKey={ADS_CONFIG.inFeed.listMid.layoutKey} />