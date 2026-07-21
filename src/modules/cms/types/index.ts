export type ContentStatus = 'draft' | 'published' | 'scheduled';
export type ContentVisibility = 'public' | 'private' | 'restricted';

export interface SEOData {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  schemaType?: string;
}

export interface CustomFieldSchema {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'rich-text' | 'select' | 'array';
  label: string;
  required?: boolean;
  options?: string[]; // Used for select type
  defaultValue?: any;
}

export interface ContentTypeConfig {
  type: string; // e.g. 'deals', 'blogs', 'coupons', 'reviews', 'comparisons', 'news'
  label: string;
  pluralLabel: string;
  iconName?: string;
  customFields: CustomFieldSchema[];
}

export interface ContentItem {
  id: string;
  type: string; // references ContentTypeConfig.type
  title: string;
  slug: string;
  status: ContentStatus;
  category: string;
  tags: string[];
  featuredImage?: string;
  gallery?: string[];
  seo: SEOData;
  createdDate: string;
  updatedDate: string;
  author: string;
  visibility: ContentVisibility;
  publishDate?: string;
  customFields: Record<string, any>; // Stores key-value mappings for dynamic schemas
}
