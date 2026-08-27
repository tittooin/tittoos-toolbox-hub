import { describe, it, expect } from 'vitest';
import { parseSearchIntent } from '../../../functions/api/commerce/search';
import { MASTER_CATALOG_INVENTORY } from '../../../functions/api/commerce/data/catalogInventory';

describe('AI Search Pipeline & Intent Parser Tests', () => {
  it('correctly parses "Best Tablet under 6000"', () => {
    const parsed = parseSearchIntent('Best Tablet under 6000');
    expect(parsed.category).toBe('tablets');
    expect(parsed.budgetMax).toBe(6000);
    expect(parsed.intent).toBe('recommendation');
  });

  it('correctly parses "best gaming laptop under 60000"', () => {
    const parsed = parseSearchIntent('best gaming laptop under 60000');
    expect(parsed.category).toBe('laptops');
    expect(parsed.budgetMax).toBe(60000);
    expect(parsed.priority).toBe('gaming');
  });

  it('correctly parses "best phone under 20000 camera"', () => {
    const parsed = parseSearchIntent('best phone under 20000 camera');
    expect(parsed.category).toBe('phones');
    expect(parsed.budgetMax).toBe(20000);
    expect(parsed.priority).toBe('camera');
  });

  it('correctly parses "best 55 inch 4K TV under 50000"', () => {
    const parsed = parseSearchIntent('best 55 inch 4K TV under 50000');
    expect(parsed.category).toBe('tvs');
    expect(parsed.budgetMax).toBe(50000);
    expect(parsed.screenSizeInch).toBe(55);
  });

  it('filters tablets strictly under budget ₹6,000 and finds genuine products', () => {
    const parsed = parseSearchIntent('Best Tablet under 6000');
    const tablets = MASTER_CATALOG_INVENTORY.tablets;
    const filtered = tablets.filter(t => t.price <= (parsed.budgetMax || 6000));

    expect(filtered.length).toBeGreaterThanOrEqual(3);
    filtered.forEach(p => {
      expect(p.price).toBeLessThanOrEqual(6000);
      expect(p.imageUrl).toBeDefined();
      expect(p.imageUrl).not.toBeNull();
      expect(p.dealType).toBe('PRODUCT_DEAL');
      expect(p.specs).toBeDefined();
      expect(p.whyWeLikeIt).toBeDefined();
      expect(p.dealUrl).toContain('tag=axevora06-21');
    });
  });

  it('guarantees ZERO Store Directory entries in master inventory', () => {
    Object.values(MASTER_CATALOG_INVENTORY).forEach(catList => {
      catList.forEach(prod => {
        expect(prod.dealType).toBe('PRODUCT_DEAL');
        expect(prod.price).toBeGreaterThan(0);
        expect(prod.name.toLowerCase()).not.toContain('store directory');
        expect(prod.name.toLowerCase()).not.toContain('live deals for');
      });
    });
  });
});
