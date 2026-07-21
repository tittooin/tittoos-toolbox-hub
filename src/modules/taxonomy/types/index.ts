export type TaxonomyType = 'categories' | 'tags' | 'brands' | 'collections' | 'labels' | 'stores' | 'attributes' | string;

export interface TaxonomyMetadata {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
}

export interface CustomAttributeSchema {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'array';
  label: string;
  required?: boolean;
  options?: string[]; // for select types
  defaultValue?: any;
}

export interface TaxonomyTypeConfig {
  type: TaxonomyType;
  label: string;
  pluralLabel: string;
  iconName?: string;
  supportHierarchy: boolean;
  supportCustomFields: boolean;
  customAttributes?: CustomAttributeSchema[];
}

export interface TaxonomyItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: TaxonomyType; // References TaxonomyTypeConfig.type
  parentId?: string; // Supporting hierarchy (e.g. parent category)
  createdDate: string;
  updatedDate: string;
  metadata?: TaxonomyMetadata;
  customAttributes?: Record<string, any>; // Key-value store for taxonomy specific attributes (like storeLogo, storeWebsite)
}
