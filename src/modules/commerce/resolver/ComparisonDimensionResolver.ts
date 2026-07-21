import { ComparisonDimension } from './types';

export interface ComparisonProfile {
  categoryId: string;
  dimensions: string[];
  labels: Record<string, string>;
  weights: Record<string, number>;
  directions: Record<string, 'HIGHER_BETTER' | 'LOWER_BETTER' | 'NEUTRAL' | 'PREFERENCE_DEPENDENT'>;
  types: Record<string, 'numeric' | 'categorical' | 'boolean'>;
}

export class ComparisonDimensionResolver {
  private registry: Map<string, ComparisonProfile> = new Map();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults() {
    // 1. Phones comparison profile
    this.registry.set('category-phones', {
      categoryId: 'category-phones',
      dimensions: ['ram', 'storage', 'battery', 'price'],
      labels: {
        ram: 'RAM Size',
        storage: 'Storage Capacity',
        battery: 'Battery Capacity',
        price: 'Selling Price',
      },
      weights: {
        ram: 0.25,
        storage: 0.25,
        battery: 0.2,
        price: 0.3,
      },
      directions: {
        ram: 'HIGHER_BETTER',
        storage: 'HIGHER_BETTER',
        battery: 'HIGHER_BETTER',
        price: 'LOWER_BETTER',
      },
      types: {
        ram: 'numeric',
        storage: 'numeric',
        battery: 'numeric',
        price: 'numeric',
      },
    });

    // 2. Laptops comparison profile
    this.registry.set('category-laptops', {
      categoryId: 'category-laptops',
      dimensions: ['processor', 'ram', 'storage', 'price'],
      labels: {
        processor: 'Processor CPU',
        ram: 'RAM Size',
        storage: 'Storage Size',
        price: 'Selling Price',
      },
      weights: {
        processor: 0.3,
        ram: 0.25,
        storage: 0.2,
        price: 0.25,
      },
      directions: {
        processor: 'NEUTRAL',
        ram: 'HIGHER_BETTER',
        storage: 'HIGHER_BETTER',
        price: 'LOWER_BETTER',
      },
      types: {
        processor: 'categorical',
        ram: 'numeric',
        storage: 'numeric',
        price: 'numeric',
      },
    });
  }

  /**
   * Resolves the profile matching a given Category ID, fallback to dynamic generic profile.
   */
  public resolve(
    categoryId: string,
    allAttributeKeys: string[]
  ): ComparisonProfile {
    const profile = this.registry.get(categoryId);
    if (profile) {
      return profile;
    }

    // Dynamic Generic Fallback Profile (MVP Fallback)
    const dimensions = [...new Set([...allAttributeKeys, 'price'])];
    const labels: Record<string, string> = { price: 'Selling Price' };
    const weights: Record<string, number> = {};
    const directions: Record<string, 'HIGHER_BETTER' | 'LOWER_BETTER' | 'NEUTRAL' | 'PREFERENCE_DEPENDENT'> = {
      price: 'LOWER_BETTER',
    };
    const types: Record<string, 'numeric' | 'categorical' | 'boolean'> = {
      price: 'numeric',
    };

    const defaultWeight = 1 / dimensions.length;

    for (const key of dimensions) {
      if (key === 'price') continue;
      labels[key] = key.charAt(0).toUpperCase() + key.slice(1);
      weights[key] = defaultWeight;
      directions[key] = 'NEUTRAL'; // Safe default (no guessing)
      types[key] = 'categorical'; // Safe default categorical
    }
    weights['price'] = defaultWeight;

    return {
      categoryId,
      dimensions,
      labels,
      weights,
      directions,
      types,
    };
  }
}
