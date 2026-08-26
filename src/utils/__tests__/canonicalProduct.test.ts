import { describe, it, expect } from 'vitest';
import {
  generateCanonicalProductId,
  validateCanonicalProductImage,
  scoreImageCandidate
} from '../canonicalProduct';

describe('Canonical Product Identity & Multi-Signal Image Validation Engine', () => {
  it('should generate standardized slug for canonicalProductId', () => {
    const id = generateCanonicalProductId('Samsung', 'Galaxy Tab S9 FE', '6GB 128GB');
    expect(id).toBe('samsung-galaxy-tab-s9-fe-6gb-128gb');
  });

  it('REGRESSION TEST: should REJECT Lenovo Gaming Chair for Lenovo LOQ 15 Gaming Laptop', () => {
    const product = {
      canonicalProductId: 'lenovo-loq-15-i5-12450hx-rtx3050',
      brand: 'Lenovo',
      model: 'LOQ 15',
      category: 'laptops'
    };

    const evaluation = scoreImageCandidate(product, {
      imageUrl: 'https://pisces.bbystatic.com/image2/products/6534/6534572_sd.jpg',
      pageTitle: 'Lenovo Ergonomic Gaming Chair with Lumbar Support - Black/Cyan',
      imageAltText: 'Lenovo Gaming Chair'
    });

    expect(evaluation.isAccepted).toBe(false);
    expect(evaluation.penalties.some(p => p.includes('chair'))).toBe(true);

    const validation = validateCanonicalProductImage(product, 'https://pisces.bbystatic.com/image2/products/6534/6534572_sd.jpg', {
      pageTitle: 'Lenovo Ergonomic Gaming Chair with Lumbar Support'
    });
    expect(validation.status).toBe('REJECT');
  });

  it('REGRESSION TEST: should REJECT TV Stand / Wall Mount for Sony Bravia KD-55X74L', () => {
    const product = {
      canonicalProductId: 'sony-bravia-kd-55x74l',
      brand: 'Sony',
      model: 'Bravia KD-55X74L',
      category: 'tvs'
    };

    const evaluation = scoreImageCandidate(product, {
      imageUrl: 'https://example.com/images/sony-universal-tv-wall-mount-bracket.jpg',
      pageTitle: 'Heavy Duty TV Wall Mount Bracket for Sony 55 inch TV',
      imageAltText: 'Sony TV Wall Bracket'
    });

    expect(evaluation.isAccepted).toBe(false);
    expect(evaluation.penalties.some(p => p.includes('wall-mount') || p.includes('bracket'))).toBe(true);
  });

  it('REGRESSION TEST: should REJECT Phone Case / Accessory for OnePlus 12R 5G', () => {
    const product = {
      canonicalProductId: 'oneplus-12r-5g',
      brand: 'OnePlus',
      model: '12R 5G',
      category: 'phones'
    };

    const evaluation = scoreImageCandidate(product, {
      imageUrl: 'https://example.com/images/oneplus-12r-silicone-case-cover.jpg',
      pageTitle: 'Shockproof Matte Back Cover Case for OnePlus 12R 5G',
      imageAltText: 'OnePlus 12R Back Cover'
    });

    expect(evaluation.isAccepted).toBe(false);
    expect(evaluation.penalties.some(p => p.includes('case') || p.includes('cover'))).toBe(true);
  });

  it('REGRESSION TEST: should REJECT generic asset / AppleCare logo for a tablet', () => {
    const product = {
      canonicalProductId: 'oneplus-pad-go',
      brand: 'OnePlus',
      model: 'Pad Go',
      category: 'tablets'
    };

    const result = validateCanonicalProductImage(
      product,
      'https://example.com/assets/applecare-plus-logo.png',
      { pageTitle: 'AppleCare+ 2 Year Protection Plan' }
    );

    expect(result.status).toBe('REJECT');
    expect(result.confidence).toBe(0.0);
  });

  it('REGRESSION TEST: should REJECT duplicate image reuse across distinct canonical products', () => {
    const claims = new Map<string, string>();
    claims.set('https://pisces.bbystatic.com/image2/products/6509/6509650_sd.jpg', 'apple-macbook-air-m2');

    const differentProduct = {
      canonicalProductId: 'lenovo-loq-15',
      brand: 'Lenovo',
      model: 'LOQ 15',
      category: 'laptops'
    };

    const result = validateCanonicalProductImage(
      differentProduct,
      'https://pisces.bbystatic.com/image2/products/6509/6509650_sd.jpg',
      { pageTitle: 'Lenovo LOQ 15 Gaming Laptop' },
      claims
    );

    expect(result.status).toBe('REJECT');
    expect(result.confidence).toBe(0.0);
    expect(result.reason).toContain('already claimed');
  });

  it('REGRESSION TEST: should ACCEPT Apple iPhone 15 with exact brand and model terms', () => {
    const product = {
      canonicalProductId: 'apple-iphone-15-128gb',
      brand: 'Apple',
      model: 'iPhone 15',
      category: 'phones'
    };

    const evaluation = scoreImageCandidate(product, {
      imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg',
      pageTitle: 'Apple iPhone 15 (128 GB) - Black',
      imageAltText: 'Apple iPhone 15 128GB Black'
    });

    expect(evaluation.isAccepted).toBe(true);
    expect(evaluation.score).toBeGreaterThanOrEqual(75);
  });

  it('REGRESSION TEST: should ACCEPT Apple MacBook Air M2 with exact brand and model terms', () => {
    const product = {
      canonicalProductId: 'apple-macbook-air-m2-13-6',
      brand: 'Apple',
      model: 'MacBook Air M2',
      category: 'laptops'
    };

    const evaluation = scoreImageCandidate(product, {
      imageUrl: 'https://m.media-amazon.com/images/I/71f5Eu5lJSL._SX679_.jpg',
      pageTitle: 'Apple 2022 MacBook Air Laptop with M2 chip: 13.6-inch Liquid Retina Display',
      imageAltText: 'Apple MacBook Air M2'
    });

    expect(evaluation.isAccepted).toBe(true);
    expect(evaluation.score).toBeGreaterThanOrEqual(75);
  });
});
