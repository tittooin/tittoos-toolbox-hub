import { ContentTypeConfig } from "../types";

export const CONTENT_TYPES_REGISTRY: ContentTypeConfig[] = [
  {
    type: "deals",
    label: "Deal",
    pluralLabel: "Deals",
    iconName: "Tag",
    customFields: [
      { name: "originalPrice", type: "number", label: "Original Price (INR)", required: true },
      { name: "discountedPrice", type: "number", label: "Discounted Price (INR)", required: true },
      { name: "affiliateLink", type: "string", label: "Affiliate Link URL", required: true },
      { name: "storeName", type: "select", label: "Store", required: true, options: ["Amazon", "Flipkart", "Myntra", "Ajio", "Meesho"] },
      { name: "expiryDate", type: "string", label: "Deal Expiry Date" }
    ]
  },
  {
    type: "blogs",
    label: "Blog Post",
    pluralLabel: "Blog Posts",
    iconName: "FileText",
    customFields: [
      { name: "contentHtml", type: "rich-text", label: "Rich Text HTML Body", required: true },
      { name: "readTime", type: "string", label: "Estimated Read Time (e.g. 5 min read)" },
      { name: "authorSlug", type: "string", label: "Author URL Slug", required: true }
    ]
  },
  {
    type: "coupons",
    label: "Coupon",
    pluralLabel: "Coupons",
    iconName: "Scissors",
    customFields: [
      { name: "couponCode", type: "string", label: "Promo / Coupon Code", required: true },
      { name: "discountValue", type: "string", label: "Discount Description (e.g., 20% OFF)", required: true },
      { name: "termsAndConditions", type: "rich-text", label: "Terms & Conditions" }
    ]
  },
  {
    type: "reviews",
    label: "Product Review",
    pluralLabel: "Product Reviews",
    iconName: "Star",
    customFields: [
      { name: "rating", type: "number", label: "Score Rating (1-5)", required: true },
      { name: "pros", type: "array", label: "List of Pros" },
      { name: "cons", type: "array", label: "List of Cons" },
      { name: "verdict", type: "rich-text", label: "Final Review Verdict", required: true }
    ]
  },
  {
    type: "comparisons",
    label: "Comparison Versus",
    pluralLabel: "Comparisons",
    iconName: "Columns",
    customFields: [
      { name: "itemA", type: "string", label: "Product A Name", required: true },
      { name: "itemB", type: "string", label: "Product B Name", required: true },
      { name: "winner", type: "string", label: "Deducted Winner Name", required: true },
      { name: "verdictSummary", type: "rich-text", label: "Comparison Verdict Details", required: true }
    ]
  },
  {
    type: "news",
    label: "News Article",
    pluralLabel: "News Articles",
    iconName: "Globe",
    customFields: [
      { name: "sourceName", type: "string", label: "Original News Source" },
      { name: "sourceUrl", type: "string", label: "Original News URL" },
      { name: "articleBody", type: "rich-text", label: "News Body Content", required: true }
    ]
  }
];

export const getContentTypeConfig = (type: string): ContentTypeConfig | undefined => {
  return CONTENT_TYPES_REGISTRY.find(c => c.type === type);
};
