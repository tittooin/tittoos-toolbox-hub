import { ProductTypeConfig } from "../types";

/**
 * ====================================================================
 * FUTURE ARCHITECTURE CONSIDERATION (DYNAMIC REGISTRY APIS)
 * ====================================================================
 * In the upcoming production stages, we can support dynamic product type
 * registrations by exposing these extension points:
 * 
 * 1. registerProductType(config: ProductTypeConfig): void
 *    - Allows dynamic plugins to register specialized generic types
 *      (e.g., custom virtual keys, tokens).
 * 
 * 2. unregisterProductType(type: string): boolean
 *    - Removes a custom type configuration with safety checks to prevent
 *      orphaning active product records.
 * ====================================================================
 */

export const PRODUCT_TYPES_REGISTRY: ProductTypeConfig[] = [
  {
    type: "physical",
    label: "Physical Product",
    pluralLabel: "Physical Products",
    iconName: "ShoppingBag",
    supportCustomFields: true,
    customAttributes: [
      { name: "weightGrams", type: "number", label: "Shipping Weight (grams)" },
      { name: "dimensions", type: "string", label: "Product Dimensions (LxWxH)" }
    ]
  },
  {
    type: "digital",
    label: "Digital Item",
    pluralLabel: "Digital Items",
    iconName: "FileText",
    supportCustomFields: true,
    customAttributes: [
      { name: "fileSizeMb", type: "number", label: "Download File Size (MB)" },
      { name: "fileFormat", type: "string", label: "Download Format (e.g., zip, pdf)" }
    ]
  },
  {
    type: "service",
    label: "Service Offering",
    pluralLabel: "Service Offerings",
    iconName: "Briefcase",
    supportCustomFields: true,
    customAttributes: [
      { name: "serviceDurationMinutes", type: "number", label: "Service Duration (minutes)" },
      { name: "locationType", type: "select", label: "Location", options: ["Remote", "On-site", "Hybrid"] }
    ]
  },
  {
    type: "subscription",
    label: "Subscription Plan",
    pluralLabel: "Subscription Plans",
    iconName: "Calendar",
    supportCustomFields: true,
    customAttributes: [
      { name: "billingPeriod", type: "select", label: "Billing Cycle", options: ["Monthly", "Quarterly", "Annual"], defaultValue: "Monthly" },
      { name: "trialDays", type: "number", label: "Free Trial Duration (days)" }
    ]
  },
  {
    type: "bundle",
    label: "Product Bundle",
    pluralLabel: "Product Bundles",
    iconName: "Package",
    supportCustomFields: false
  },
  {
    type: "license",
    label: "Software License",
    pluralLabel: "Software Licenses",
    iconName: "Key",
    supportCustomFields: true,
    customAttributes: [
      { name: "licenseDurationMonths", type: "number", label: "Validity Duration (months)" },
      { name: "maxActivations", type: "number", label: "Maximum Active Devices" }
    ]
  }
];

export const getProductTypeConfig = (type: string): ProductTypeConfig | undefined => {
  return PRODUCT_TYPES_REGISTRY.find(p => p.type === type);
};
