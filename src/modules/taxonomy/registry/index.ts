import { TaxonomyTypeConfig } from "../types";

/**
 * ====================================================================
 * FUTURE ARCHITECTURE CONSIDERATION (EXTENSION POINTS)
 * ====================================================================
 * To support modular expansion of taxonomies by other engines or custom
 * third-party plugins, this registry can be upgraded with dynamic APIs:
 * 
 * 1. registerTaxonomy(config: TaxonomyTypeConfig): void
 *    - Dynamically appends a new Taxonomy Configuration to the active list.
 *    - Validates schema name collision checks.
 * 
 * 2. unregisterTaxonomy(type: string): boolean
 *    - Removes a custom classification configuration from the active list.
 *    - Guarantees safety checks to prevent orphan items.
 * 
 * For this foundation phase, the configuration registry is stored as a 
 * static read-only setup mapping the core engine requirements.
 * ====================================================================
 */

export const TAXONOMY_TYPES_REGISTRY: TaxonomyTypeConfig[] = [
  {
    type: "categories",
    label: "Category",
    pluralLabel: "Categories",
    iconName: "Folder",
    supportHierarchy: true,
    supportCustomFields: false
  },
  {
    type: "tags",
    label: "Tag",
    pluralLabel: "Tags",
    iconName: "Tag",
    supportHierarchy: false,
    supportCustomFields: false
  },
  {
    type: "brands",
    label: "Brand",
    pluralLabel: "Brands",
    iconName: "Award",
    supportHierarchy: false,
    supportCustomFields: true,
    customAttributes: [
      { name: "logoUrl", type: "string", label: "Logo Image URL" },
      { name: "brandWebsite", type: "string", label: "Brand Official Website" }
    ]
  },
  {
    type: "collections",
    label: "Collection",
    pluralLabel: "Collections",
    iconName: "Layers",
    supportHierarchy: false,
    supportCustomFields: false
  },
  {
    type: "labels",
    label: "Label",
    pluralLabel: "Labels",
    iconName: "Bookmark",
    supportHierarchy: false,
    supportCustomFields: false
  },
  {
    type: "stores",
    label: "Store",
    pluralLabel: "Stores",
    iconName: "ShoppingBag",
    supportHierarchy: false,
    supportCustomFields: true,
    customAttributes: [
      { name: "storeUrl", type: "string", label: "Store Affiliate Landing URL", required: true },
      { name: "logoUrl", type: "string", label: "Store Logo Image URL" },
      { name: "storeRating", type: "number", label: "Store Trust Score Rating (1-5)" }
    ]
  },
  {
    type: "attributes",
    label: "Attribute",
    pluralLabel: "Attributes",
    iconName: "Sliders",
    supportHierarchy: false,
    supportCustomFields: false
  }
];

export const getTaxonomyTypeConfig = (type: string): TaxonomyTypeConfig | undefined => {
  return TAXONOMY_TYPES_REGISTRY.find(t => t.type === type);
};
