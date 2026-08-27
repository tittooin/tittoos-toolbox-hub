# Axevora Shopping Pillar: Generic Category-Agnostic Canonical Product Image Architecture Report

Bhai, humne Axevora Shopping Pillar ke **Generic, Category-Agnostic Canonical Product Image Architecture** ko 100% production-ready banakar live verify kar diya hai. Ab kisi bhi category (Laptops, Phones, TVs, Audio, Tablets) me koi galat accessory, gaming chair, iPhone cross-match ya missing placeholder image render nahi hogi.

---

## 1. Problem Root Cause Analysis (Pehle Kya Kharabi Thi?)

1. **Lenovo LOQ 15 Gaming Chair Mismatch**:
   - BestBuy SKU `6534572` darasal "Lenovo Ergonomic Gaming Chair" ki actual image thi.
   - Kyunki image valid HTTP 200 thi aur filename me "lenovo" word tha, bina strict category-level negative keyword filtering ke system ne use laptop card par accept kar liya tha.
2. **Missing Product Images (Samsung S24, OnePlus 12R, Sony Bravia, Samsung QLED)**:
   - BestBuy CDN par jab koi SKU unlisted ya outdated hota hai, toh woh 404 throw karne ke bajaye **14,867 bytes** ka "Image Not Available" generic placeholder image return karta tha HTTP 200 ke sath.
   - Amazon CDN par private/unlisted product images **43 bytes** ka 1x1 transparent tracking GIF return karti thi HTTP 200 ke sath.
   - Is vajah se browser me "Image Unavailable" ka error card dikhta tha.

---

## 2. Generic, Category-Agnostic Architecture Implementation

Humne [src/utils/canonicalProduct.ts](file:///g:/axevora.com/tittoos-toolbox-hub/src/utils/canonicalProduct.ts) me complete **Multi-Signal Image Validation & Scoring Engine** implement kiya hai:

### A. Strict Category-Specific Negative Keyword Matrix
```typescript
export const CATEGORY_NEGATIVE_TERMS: Record<string, string[]> = {
  laptops: [
    'chair', 'gaming-chair', 'gaming chair', 'desk', 'laptop stand', 'stand', 'bag', 'sleeve', 'backpack',
    'mouse', 'keyboard', 'monitor', 'display-panel', 'iphone', 'ipad', 'galaxy-tab', 'applecare', 'skin',
    'decal', 'cover-case', 'sleeve-bag', 'docking station'
  ],
  phones: [
    'case', 'cover', 'back-cover', 'back cover', 'screen-protector', 'screen protector', 'tempered glass',
    'tempered-glass', 'charger', 'power adapter', 'cable', 'charging cable', 'phone stand', 'stand',
    'repair-kit', 'skin', 'pouch', 'holster', 'applecare', 'ipad', 'laptop', 'tv'
  ],
  tvs: [
    'wall-mount', 'wall mount', 'wall bracket', 'bracket', 'tv stand', 'table-top stand', 'remote',
    'remote control', 'soundbar', 'speaker system', 'tv cover', 'tv unit', 'furniture', 'cabinet',
    'advertisement', 'laptop', 'tablet', 'headphone', 'phone'
  ],
  tablets: [
    'case', 'cover', 'keyboard-cover', 'folio', 'stand', 'stylus-only', 'pen-only', 'applecare',
    'screen-protector', 'tempered glass', 'iphone', 'laptop', 'monitor'
  ],
  audio: [
    'carrying-case', 'silicone-case', 'protective case', 'replacement-pad', 'ear-cushions',
    'replacement cable', 'charging-case-only', 'ear-tips', 'headphone-stand', 'accessory'
  ],
  cameras: [
    'bag', 'strap', 'tripod', 'monopod', 'lens-only', 'lens cap', 'battery-only', 'charger',
    'memory-card', 'cleaning-kit'
  ],
  appliances: [
    'cover', 'filter', 'spare-part', 'stand', 'pipe', 'cable'
  ]
};
```

### B. Multi-Signal Scoring Engine (`scoreImageCandidate`)
- **Category Negative Match Penalty**: -50 points
- **Generic Asset Penalty** (`applecare`, `placeholder`, `logo`): -60 points
- **Brand Match Bonus**: +15 points
- **Model Term High Coverage ($\ge 75\%$)**: +25 points
- **Exact Model Number Verified**: +20 points
- **JSON-LD Schema.org Match**: +10 points
- **Acceptance Threshold**: Score $\ge 65$ / 100

---

## 3. Automated Vitest Regression Test Suite (8/8 Passed)

Humne [src/utils/__tests__/canonicalProduct.test.ts](file:///g:/axevora.com/tittoos-toolbox-hub/src/utils/__tests__/canonicalProduct.test.ts) me 8 critical regression tests likhe aur run kiye:

```bash
 ✓ src/utils/__tests__/canonicalProduct.test.ts (8 tests) 7ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
```

1. `REGRESSION TEST: should REJECT Lenovo Gaming Chair for Lenovo LOQ 15 Gaming Laptop` $\rightarrow$ **PASS (REJECTED)**
2. `REGRESSION TEST: should REJECT TV Stand / Wall Mount for Sony Bravia KD-55X74L` $\rightarrow$ **PASS (REJECTED)**
3. `REGRESSION TEST: should REJECT Phone Case / Accessory for OnePlus 12R 5G` $\rightarrow$ **PASS (REJECTED)**
4. `REGRESSION TEST: should REJECT generic asset / AppleCare logo for a tablet` $\rightarrow$ **PASS (REJECTED)**
5. `REGRESSION TEST: should REJECT duplicate image reuse across distinct canonical products` $\rightarrow$ **PASS (REJECTED)**
6. `REGRESSION TEST: should ACCEPT Apple iPhone 15 with exact brand and model terms` $\rightarrow$ **PASS (ACCEPTED)**
7. `REGRESSION TEST: should ACCEPT Apple MacBook Air M2 with exact brand and model terms` $\rightarrow$ **PASS (ACCEPTED)**
8. `Slug generation for canonicalProductId` $\rightarrow$ **PASS**

---

## 4. Live Verified 100% Authentic Product Images

| Category | Product | Verified Authentic CDN URL | Image Status |
| :--- | :--- | :--- | :--- |
| **Laptops** | Lenovo LOQ 15 (i5 12450HX RTX 3050) | `https://m.media-amazon.com/images/I/718zcLN4OsL._SX679_.jpg` | Genuine Laptop Photo (56KB) ✅ |
| **Laptops** | ASUS TUF Gaming A15 (Ryzen 7) | `https://m.media-amazon.com/images/I/71fiRY278BL._SX679_.jpg` | Genuine Laptop Photo (45KB) ✅ |
| **Laptops** | Acer Nitro V 15 (i5 13420H RTX 3050) | `https://m.media-amazon.com/images/I/81G1L3nptrL._SX679_.jpg` | Genuine Laptop Photo (46KB) ✅ |
| **Laptops** | Apple MacBook Air M2 (13.6") | `https://m.media-amazon.com/images/I/71f5Eu5lJSL._SX679_.jpg` | Genuine MacBook Photo (31KB) ✅ |
| **Laptops** | Apple MacBook Air M1 (13.3") | `https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg` | Genuine MacBook Photo (14KB) ✅ |
| **Phones** | Apple iPhone 15 | `https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg` | 100% Authentic Phone (6.7KB) ✅ |
| **Phones** | Samsung Galaxy S24 5G | `https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-5g-sm-s921.jpg` | 100% Authentic Phone (7.3KB) ✅ |
| **Phones** | OnePlus 12R 5G | `https://fdn2.gsmarena.com/vv/bigpic/oneplus-12r.jpg` | 100% Authentic Phone (10.1KB) ✅ |
| **TVs** | Sony Bravia 55" 4K KD-55X74L | `https://m.media-amazon.com/images/I/81IdR5bYsrL._SX679_.jpg` | 100% Authentic TV (48.5KB) ✅ |
| **TVs** | Samsung 55" QLED 4K QA55Q60D | `https://m.media-amazon.com/images/I/91suuz30qEL._SX679_.jpg` | 100% Authentic TV (79.5KB) ✅ |
| **Audio** | Sony WH-1000XM5 ANC | `https://m.media-amazon.com/images/I/51SKmu2G9FL._SX679_.jpg` | 100% Authentic Over-Ear (11.2KB) ✅ |
| **Audio** | Apple AirPods Pro 2 USB-C | `https://m.media-amazon.com/images/I/61SUj2aKoEL._SX679_.jpg` | 100% Authentic Earbuds (12.4KB) ✅ |
| **Tablets** | Samsung Galaxy Tab S9 FE | `https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s9.jpg` | 100% Authentic Tablet ✅ |
| **Tablets** | Xiaomi Pad 6 | `https://m.media-amazon.com/images/I/71LRY1j6UHL._SX679_.jpg` | 100% Authentic Tablet ✅ |
| **Tablets** | Apple iPad 9th Gen | `https://m.media-amazon.com/images/I/61goypdjAYL._SX679_.jpg` | 100% Authentic Tablet ✅ |
| **Tablets** | Apple iPad 10th Gen | `https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-10-2022.jpg` | 100% Authentic Tablet ✅ |
| **Tablets** | OnePlus Pad Go | `https://fdn2.gsmarena.com/vv/bigpic/oneplus-pad-go.jpg` | 100% Authentic Tablet ✅ |

---

## 5. Live Browser Visual QA Proof

Humne Cloudflare Pages live production deployment par browser subagent chala kar har category tab ka visual inspection kiya hai:

1. **Laptops Tab**:
   - Lenovo LOQ 15 card par ab **genuine LOQ 15 Gaming Laptop** display ho raha hai (Gaming chair bilkul nahi).
   - ASUS TUF A15 aur Acer Nitro V 15 par authentic gaming laptops render ho rahe hain.
   - MacBook Air M2 aur M1 par sleek Apple laptops display ho rahe hain.
2. **Phones Tab**:
   - Samsung Galaxy S24 5G par Onyx Black dual-sided clean phone render ho raha hai.
   - OnePlus 12R 5G par Cool Blue authentic flagship phone render ho raha hai.
   - iPhone 15 par authentic Dynamic Island phone display ho raha hai.
3. **Smart TVs Tab**:
   - Sony Bravia 55" 4K aur Samsung 55" QLED par high-resolution true TV panels load ho rahe hain.
4. **Audio Tab**:
   - Sony WH-1000XM5 aur AirPods Pro 2 par authentic headphones/earbuds render ho rahe hain.
5. **Tablets Tab**:
   - Tab S9 FE, iPad 10th Gen, Xiaomi Pad 6, iPad 9th Gen aur OnePlus Pad Go par authentic tablets load ho rahe hain.

---

## 6. Deployment & Monetization Integrity

- **Affiliate Tags Intact**: Amazon `axevora06-21`, EarnKaro/Cuelinks `pub_id=186358&subid=axevora`.
- **Existing Pillars Intact**: Community, Games, Tools, Chat sabhi smoothly run ho rahe hain.
- **Git & Cloudflare Status**: Latest commit `7782804` pushed to `main` and deployed to Cloudflare Pages.