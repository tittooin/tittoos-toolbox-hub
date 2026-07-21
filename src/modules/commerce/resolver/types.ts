export enum LinkType {
  STANDARD_PRODUCT_URL = 'STANDARD_PRODUCT_URL',
  AFFILIATE_URL = 'AFFILIATE_URL',
  SHORT_URL = 'SHORT_URL',
  UNKNOWN_URL = 'UNKNOWN_URL',
}

export enum ResolutionContext {
  PUBLIC = 'PUBLIC',
  ADMIN = 'ADMIN',
}

export enum ResolverErrorType {
  INVALID_URL = 'INVALID_URL',
  UNSAFE_URL = 'UNSAFE_URL',
  UNSUPPORTED_MERCHANT = 'UNSUPPORTED_MERCHANT',
  UNSUPPORTED_PROTOCOL = 'UNSUPPORTED_PROTOCOL',
  UNSAFE_REDIRECT = 'UNSAFE_REDIRECT',
  REDIRECT_LIMIT_EXCEEDED = 'REDIRECT_LIMIT_EXCEEDED',
  PROVIDER_NOT_CONFIGURED = 'PROVIDER_NOT_CONFIGURED',
  PROVIDER_TIMEOUT = 'PROVIDER_TIMEOUT',
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  PARTIAL_PRODUCT_DATA = 'PARTIAL_PRODUCT_DATA',
  INVALID_PRODUCT_IDENTIFIER = 'INVALID_PRODUCT_IDENTIFIER',
  UNTRUSTED_SHORT_LINK_HOST = 'UNTRUSTED_SHORT_LINK_HOST',
  FINAL_MERCHANT_MISMATCH = 'FINAL_MERCHANT_MISMATCH',
  SHORT_LINK_RESOLUTION_FAILED = 'SHORT_LINK_RESOLUTION_FAILED',
  STALE_DATA = 'STALE_DATA',
  TAXONOMY_UNRESOLVED = 'TAXONOMY_UNRESOLVED',
  BRAND_UNRESOLVED = 'BRAND_UNRESOLVED',
}

export class ResolverError extends Error {
  constructor(public type: ResolverErrorType, message: string) {
    super(message);
    this.name = 'ResolverError';
  }
}

export interface ResolvedProductData {
  merchantId?: string;
  externalProductId?: string; // e.g. ASIN
  
  // URL Identity Model
  inputUrl: string; // Exactly what the user pasted
  resolvedUrl?: string; // The URL after following short-links
  canonicalProductUrl?: string; // Clean product URL without tracking parameters
  merchantProductUrl?: string; // Merchant domain base URL representation
  affiliateUrl?: string; // Final monetized URL if applicable
  
  title?: string;
  brand?: string;
  category?: string;
  description?: string;
  images?: string[];
  
  price?: {
    amount: number;
    currency: string; // ISO 4217, e.g. 'INR'
    isAvailable: boolean;
    observedAt: string; // ISO string
    source?: string;
  };
  
  specifications?: Record<string, string>;
  
  // Provenance Readiness
  provider?: string;
  source?: string;
  confidence?: number;
  fetchedAt?: string;
  
  // Resolution Model Status
  resolutionStatus?: 'COMPLETE' | 'PARTIAL' | 'FAILED';
}

export interface ProvenanceField<T> {
  value: T;
  source: 'official_api' | 'approved_provider' | 'existing_catalog' | 'manual' | 'metadata' | 'ai_inferred';
  confidence: 'VERIFIED' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFERRED';
  observedAt: string;
  providerId?: string;
}

export interface ProductIntelligenceResult {
  identity: {
    merchantId: string;
    externalProductId: string; // ASIN
    canonicalProductUrl: string;
    inputUrl: string;
    resolvedUrl?: string;
  };
  productFacts: {
    title?: ProvenanceField<string>;
    brandId?: ProvenanceField<string>;
    taxonomyIds?: ProvenanceField<string[]>;
    description?: ProvenanceField<string>;
    mediaUrls?: ProvenanceField<string[]>;
    customAttributes?: ProvenanceField<Record<string, unknown>>;
  };
  commerceFacts: {
    price?: ProvenanceField<{ amount: number; currency: string }>;
    availability?: ProvenanceField<boolean>;
    affiliateUrl?: ProvenanceField<string>;
  };
  taxonomyHints: {
    rawCategory?: string;
    rawBrand?: string;
  };
  provenance: {
    resolvedAt: string;
  };
  completeness: 'IDENTITY_ONLY' | 'BASIC' | 'COMMERCE_READY' | 'COMPARISON_READY';
  warnings: string[];
}

export interface ComparableProductCandidate {
  productId: string;
  merchantListingId?: string;
  productIntelligence: ProductIntelligenceResult;
  discoverySource: 'existing_catalog' | 'external_provider' | 'manual';
  matchReasons: string[];
  score: number; // 0-100 normalized range
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  warnings: string[];
}

export interface ComparableDiscoveryResult {
  target: ProductIntelligenceResult;
  candidates: ComparableProductCandidate[];
  status: 'SUCCESS' | 'NO_COMPARABLE_PRODUCTS' | 'INSUFFICIENT_COMPARABLE_PRODUCTS' | 'TARGET_PRODUCT_NOT_RESOLVED';
  warnings: string[];
  strategyVersion: string;
  requestedLimit: number;
  returnedCount: number;
}

export interface ComparisonRequest {
  target: ProductIntelligenceResult;
  candidates: ComparableProductCandidate[];
  intent?: 'BEST_OVERALL' | 'BEST_VALUE';
  preferences?: Record<string, string>;
}

export interface ComparisonEvidence {
  productId: string;
  dimension: string;
  value: string;
  source: 'official_api' | 'approved_provider' | 'existing_catalog' | 'manual' | 'metadata' | 'ai_inferred';
  confidence: 'VERIFIED' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFERRED';
  observedAt: string;
  attributeId?: string;
  normalizedValue?: unknown;
}

export interface ComparisonDimension {
  name: string;
  label: string;
  type: 'numeric' | 'categorical' | 'boolean';
  direction: 'HIGHER_BETTER' | 'LOWER_BETTER' | 'NEUTRAL' | 'PREFERENCE_DEPENDENT';
  values: Record<string, string>; // Maps productId -> value string
}

export interface ProductComparisonResult {
  targetId: string;
  comparisonSet: string[]; // List of product IDs (including target)
  dimensions: ComparisonDimension[];
  recommendation?: {
    winnerId?: string;
    outcome: 'WINNER' | 'NO_CLEAR_WINNER' | 'INSUFFICIENT_EVIDENCE' | 'VALUE_RECOMMENDATION_UNAVAILABLE';
    score: number;
    intent: 'BEST_OVERALL' | 'BEST_VALUE';
    explanation: string;
    reasons: string[];
    pros: Record<string, string[]>; // Maps productId -> list of Pros
    cons: Record<string, string[]>; // Maps productId -> list of Cons
  };
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  warnings: string[];
  strategyVersion: string;
}

export type StageStatus = 'SUCCESS' | 'PARTIAL' | 'SKIPPED' | 'FAILED';

export interface SmartProductAnalysisResult {
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  stages: {
    resolution: StageStatus;
    intelligence: StageStatus;
    discovery: StageStatus;
    comparison: StageStatus;
  };
  productIntelligence?: ProductIntelligenceResult;
  comparableDiscovery?: ComparableDiscoveryResult;
  comparisonResult?: ProductComparisonResult;
  warnings: string[];
  metadata: {
    requestId: string;
    durationMs: number;
    resolvedAt: string;
    strategyVersion: string;
  };
}
