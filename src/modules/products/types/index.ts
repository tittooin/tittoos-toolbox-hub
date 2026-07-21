export type ProductType = 'physical' | 'digital' | 'service' | 'subscription' | 'bundle' | 'license' | string;

export interface ProductMetadata {
  systemVersion?: string;
  revisionNumber?: number;
  lastApprovedBy?: string;
  customFields?: Record<string, any>;
}

export interface ProductCustomAttributeSchema {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'array';
  label: string;
  required?: boolean;
  options?: string[];
  defaultValue?: any;
}

export interface ProductTypeConfig {
  type: ProductType;
  label: string;
  pluralLabel: string;
  iconName?: string;
  supportCustomFields: boolean;
  customAttributes?: ProductCustomAttributeSchema[];
}

export interface CanonicalProduct {
  id: string;
  type: ProductType; // references ProductTypeConfig.type
  name: string;
  shortDescription?: string;
  longDescription?: string;
  slug: string;
  canonicalUrl?: string;
  brandId?: string; // Reference to Brand Taxonomy
  taxonomyIds: string[]; // References to Category, Tag, Collection, Label etc Taxonomies
  mediaUrls: string[]; // References to image/video media files
  providerType: string; // e.g. manual, api, scraper
  sourceType: string; // e.g. amazon, flipkart, direct
  status: 'draft' | 'active' | 'archived';
  visibility: 'public' | 'private' | 'hidden';
  customAttributes: Record<string, any>; // Dynamic custom attributes unique to this product type
  metadata: ProductMetadata; // Generic system metadata
  createdDate: string;
  updatedDate: string;
  
  // ====================================================================
  // FUTURE EXTENSION REFERENCES (ARCHITECTURE LOCK)
  // ====================================================================
  // This field serves as a clean hook to extend product properties with
  // merchant rates, affiliate codes, notifications, or reviews parameters,
  // without modifying the core CanonicalProduct schema.
  // ====================================================================
  extensions?: Record<string, any>; 
}
