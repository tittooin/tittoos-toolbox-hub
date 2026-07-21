import { Store, Tag, DollarSign, Gift, Link } from "lucide-react";

export const COMMERCE_STORAGE_KEY_PREFIX = "axevora_commerce_";

export const COMMERCE_ICONS_MAP: Record<string, any> = {
  Store, // For Merchants
  Tag, // For Listings
  DollarSign, // For Pricing
  Gift, // For Offers
  Link // For Affiliate Mappings
};
