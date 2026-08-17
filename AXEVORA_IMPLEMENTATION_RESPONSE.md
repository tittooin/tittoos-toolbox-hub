# Axevora Implementation & Forensic Architecture Response

---

# PART I — CURRENT AUTHORITATIVE PRODUCTION STATE (LOCKED 🔒)

## 1. Executive Status Dashboard

| System Component | Authoritative Production State | Operational Mechanism |
|---|---|---|
| **Three-Layer Monetization Engine** | **`PASS (LOCKED 🔒)`** | Layer 1 (Amazon `axevora06-21`) ➔ Layer 2 (EarnKaro `bitli.in`) ➔ Layer 3 (Cuelinks `linksredirect.com`) |
| **Primary AI Reasoning Engine** | **`PASS (LOCKED 🔒)`** | Google Gemini 2.5 Flash via `context.env.GEMINI_API_KEY` |
| **Secondary Edge AI Engine** | **`PASS (LOCKED 🔒)`** | Cloudflare Workers AI (`@cf/zai-org/glm-4.7-flash`) via `context.env.AI` binding |
| **Cuelinks Merchant & Coupon Engine**| **`PASS (ACTIVE ✅)`** | Cuelinks V3 API (`offers.json` & `campaigns.json`) + LinkKit Publisher `186358` |
| **Zero-Mock & Zero-Hallucination Policy**| **`PASS (LOCKED 🔒)`** | Zero AI-guessed prices, zero synthetic star ratings, zero fake reviews, zero fake PDP links |
| **Real SKU-Level Price Retrieval** | **`BLOCKED (ZERO-COST LIMITATION)`** | No currently configured, verified, legitimate zero-cost SKU-level live product-price provider has been identified for Axevora |
| **Zero-Budget Real Deal Engine** | **`ACTIVE ✅`** | Intent-driven merchant discovery + verified store vouchers + unbiased value ranking |

---

## 2. Cuelinks Credential Architecture Reconciliation

### Distinction: Cuelinks V3 Publisher API vs Cuelinks LinkKit
To resolve historical diagnostic observations:
1. **Cuelinks V3 Publisher API (`Authorization: Token <CUELINKS_API_KEY>`)**:
   - **Credentials**: `CUELINKS_API_KEY` exists as a secret in Cloudflare Pages production environment.
   - **Purpose**: Backend server-to-server queries for live promotional offers, merchant campaigns (`/pub_api/v3/offers.json`, `/pub_api/v3/campaigns.json`), and programmatic link conversion (`/pub_api/v3/links/convert`).
2. **Cuelinks LinkKit / Public Publisher ID (`pub_id=186358`)**:
   - **Public Identifier**: Publisher ID `186358` with SubID `axevora`.
   - **Purpose**: Instant, client-safe URL redirection fallback via `https://linksredirect.com/?pub_id=186358&...` without requiring API key exposure in browser client bundles.
3. **Diagnostic Reconciliation**:
   - Both mechanisms work in unison: API Token handles deep campaign & offer discovery; Publisher ID ensures resilient, unblockable link tracking fallback.

> [!IMPORTANT]
> **Cuelinks Boundary Rule**: Cuelinks provides merchant campaign discovery, verified store offers, promotional coupon codes, and affiliate tracking. **Cuelinks is NOT an arbitrary live SKU-level price scraping database**. Axevora permanently prohibits treating campaign payouts or coupon discounts as a product's current selling price.

---

## 3. Authoritative Deal & Price Semantics

To prevent misleading claims, Axevora enforces strict semantic labels across backend and frontend:

| State | Semantic Label | Operational Condition |
|---|---|---|
| **Verified Product Price** | **`BEST PRICE`** | Only applied when an external provider returns a verified numeric product price from a real merchant feed. |
| **Verified Coupon / Promo** | **`BEST OFFER`** | Applied when a verified store coupon code, cashback, or promotional voucher is active. |
| **Merchant Directory** | **`BEST MERCHANT OPTION`** | Applied when merchant discovery identifies top relevant stores, but live product price is unlinked. |
| **No Live Data** | **`LIVE PRICE UNAVAILABLE`** | Displayed explicitly on product cards when `price === 0`. **`₹0` is NEVER displayed.** |

---

## 4. Zero-Budget Real Deal Execution Flow

```
USER QUERY (e.g., "best gaming laptop under 60000")
    │
    ▼
1. QUERY INTENT EXTRACTION (`extractEntities`)
   ├─ Category: "laptop" | Subcategory: "gaming" | BudgetMax: "60000"
   └─ (Note: BudgetMax guides search relevance, NEVER synthesized as product price)
    │
    ▼
2. MERCHANT DISCOVERY & INTENT FILTERING
   ├─ Tech / Laptops / TVs ➔ Amazon India, Croma, Flipkart, Reliance Digital
   ├─ Fashion ➔ Myntra, Amazon Fashion, Flipkart
   ├─ Travel ➔ MakeMyTrip, Goibibo, Yatra
   └─ Finance ➔ HDFC Bank, SBI Card, Axis Bank
    │
    ▼
3. CUELINKS OFFERS & COUPONS ENGINE (`/api/commerce/deals`)
   ├─ Streams verified non-expired discount vouchers & bank promo codes
   └─ Attaches verified expiry dates and store landing URLs
    │
    ▼
4. PRICE PROVENANCE & ZERO-MOCK ENFORCEMENT
   ├─ Is legitimate live SKU price available?
   │  ├─ YES: Passes verified numeric price to ComparisonEngine.
   │  └─ NO: Sets `price: 0`, `rating: null`, `urlType: "search"`. Renders "Verified Store Offer".
    │
    ▼
5. UNBIASED VALUE RANKING (`ComparisonEngine`)
   └─ Ranks offers strictly on price/discount value (Monetization commission NEVER biases ranking).
    │
    ▼
6. LOCKED THREE-LAYER MONETIZATION (`convertToAffiliateUrl`)
   └─ Layer 1 (Amazon Direct) ➔ Layer 2 (EarnKaro) ➔ Layer 3 (Cuelinks LinkKit)
    │
    ▼
7. AI REASONING & EXPLANATION (Gemini 2.5 Flash / Workers AI GLM-4.7-Flash)
   └─ Synthesizes specs, comparison guides, and buying advice WITHOUT inventing prices.
```

---

## 5. Live Production Verification Proofs

### A. Live Query: `"Best 55 inch 4K TV under ₹50000"`
- **Endpoint**: `https://axevora.com/api/commerce/search?q=Best+55+inch+4K+TV+under+50000`
- **Output Verified**:
  - `source`: `"merchant_search_directory"`
  - Items returned: Amazon, Croma, Flipkart
  - `price`: `0` (Frontend renders *"Verified Store Offer"*; `₹0` is completely hidden)
  - `rating`: `null` (No fake star ratings)
  - `reasons`: `["🏆 Best Merchant Option"]`
  - Monetization: Amazon Direct Tag (`tag=axevora06-21`) & Cuelinks LinkKit (`pub_id=186358`) active.

### B. Live Query: `"iPhone 15 128GB"` & `"best laptop under 60000"`
- **Output Verified**: Strict currency safety (`INR`), verified merchant discovery, zero AI-guessed prices.

---

## 6. Current Retrieval Provider State

- **Current Status**: **`REAL SKU-LEVEL PRICE RETRIEVAL = BLOCKED`**
- **Reason**: No currently configured, verified, legitimate zero-cost SKU-level live product-price provider has been identified for Axevora.
- **Future Upgrade Path**: When business budget allows, attaching an external key (e.g. `SERPAPI_KEY`) will instantly enable live SKU price scraping across all endpoints without requiring any core engine redesign.

---
---

# PART II — HISTORICAL FORENSIC FINDINGS & AUDIT ARCHIVE

> [!NOTE]
> The sections below document the initial forensic state discovered during the codebase audit before zero-mock enforcement, dual AI integration, and semantic locking were applied.

### Historical Finding 1: Early AI Price Synthesis Vulnerability
In previous iterations, `/api/commerce/search` prompted LLMs to guess approximate product prices from internal training weights. This was identified as a critical hallucination hazard and permanently eradicated.

### Historical Finding 2: Synthetic Rating Calculations
In earlier frontend builds, `ShoppingAssistant.tsx` calculated star ratings using character string hashing (`strHash`). This was completely removed in favor of strict source-provenance null rendering.

### Historical Finding 3: Missing Cloudflare Workers AI Binding
Initial production diagnostics returned `aiBindingPresent: false`. This was resolved by programmatically attaching the `AI` binding (`@cf/zai-org/glm-4.7-flash`) via Cloudflare API.

### Historical Finding 4: Retired PA-API 5.0 Connector
Investigation into `functions/api/shopping/providers/AmazonConnector.ts` confirmed that Amazon PA-API 5.0 was retired by Amazon in May 2026, necessitating the transition to Amazon Associate Direct Tagging (`tag=axevora06-21`) and Cuelinks LinkKit.

---
---

# PART III — CUELINKS DEAL INTELLIGENCE DATA AUDIT

## 1. Current Cuelinks Pipeline & Data Flow Audit

```
CUELINKS UPSTREAM API (`/pub_api/v3/offers` & `/pub_api/v3/campaigns`)
                 │
                 ▼
1. RAW RETRIEVAL (`functions/api/commerce/deals.ts`)
   ├─ Queries Cuelinks V3 API in parallel via `Promise.all` with `Authorization: Token <CUELINKS_API_KEY>`
   └─ Fallback: When API key is absent, returns static verified partner campaigns
                 │
                 ▼
2. NORMALIZATION & MERGING
   ├─ Filters expired offers using `end_date` / `valid_till`
   ├─ Resolves `destinationUrl` using upstream tracking params / campaign relationships
   ├─ Assigns `bannerImage` using keyword heuristic (`getDealBannerImage`)
   └─ Merges both streams: `[...normalizedOffers, ...normalizedCampaigns]`
                 │
                 ▼
3. FRONTEND CONSUMPTION (`src/pages/shopping/ShoppingAssistant.tsx` & `src/components/shopping/ProductCard.tsx`)
   ├─ `ShoppingAssistant.tsx` maps search results and deal cards
   └─ `ProductCard.tsx` renders `imgSrc = product.imageUrl || defaultFallback` (Unsplash fallback)
```

---

## 2. Live Cuelinks Schema & Field Reliability Matrix

| Raw Field Name | Semantic Meaning in Cuelinks | Reliability | Usable for Direct Display? | Usable for Price Extraction? | Usable for Product ID? | Usable for Image Selection? | Requires Pre-Validation? |
|---|---|---|---|---|---|---|---|
| **`id`** | Upstream Offer / Campaign ID | **HIGH** | Internal Only | No | Yes (Reference ID) | No | No |
| **`title`** | Promo / Product headline | **MEDIUM–HIGH** | Yes | Yes (Regex Parsing) | Yes (Entity Tokens) | No | Yes (Clean markdown/HTML) |
| **`description`** / **`terms`** | Offer terms, specs & bank promo details | **MEDIUM** | Yes | Yes (Stated price/discount) | Yes (Spec extraction) | No | Yes (Filter HTML tags) |
| **`merchantName`** / **`campaign_name`** | Store Name (Croma, Flipkart, Levi's) | **HIGH** | Yes | No | No (Store ID) | No | Yes (Sanitize spacing) |
| **`merchantLogo`** | Store Favicon / Brand Logo | **HIGH** | Yes | No | No | Yes (STORE_DEAL only) | Yes (Check fallback) |
| **`bannerImage`** | Category Artwork / Static Unsplash | **LOW (GENERIC)** | ⚠️ Category only | No | No | ❌ NEVER for Product | Yes (Block for PRODUCT_DEAL) |
| **`couponCode`** | Voucher code (e.g. `SAVE20`) | **HIGH** | Yes | Yes (Coupon Value) | No | No | Yes (Trim whitespace) |
| **`discountText`** | Advertised % off or Payout amount | **MEDIUM** | Yes (Badge) | Yes (Extract % / flat off)| No | No | Yes (Distinguish payout vs discount) |
| **`destinationUrl`** | Landing page (PDP, Search, Store) | **HIGH** | Yes (Click URL) | No | Yes (PDP URL Path) | No | Yes (Validate URL format) |
| **`trackingUrl`** | Monetized Affiliate Redirect Link | **HIGH** | Yes (Affiliate Outbound)| No | No | No | Yes (Check subid/pub_id) |
| **`validUntil`** | Expiry Date (ISO / Date String) | **HIGH** | Yes | No | No | No | Yes (Check expiration against `now`) |
| **`category`** | Upstream Category Tag | **LOW–MEDIUM** | ⚠️ Ambiguous | No | No | No | Yes (Re-classify with intent regex) |

---

## 3. Product Deal Classification Architecture

To ensure strict semantic honesty, records are categorized into 5 mutually exclusive types:

```
                                  INCOMING CUELINKS RECORD
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
                    ▼                                                   ▼
       Is specific model / variant / PDP?                   Is category or store wide?
        ├─ Title: "OnePlus Nord CE6 Lite 5G 8GB"             ├─ "QLED TVs Starting @..."
        ├─ Destination: `/p/322994` (PDP Path)               ├─ Destination: `/search` or `/c/tv`
        │                                                   │
        ▼                                                   ▼
   [PRODUCT_DEAL]                                      [CATEGORY_DEAL]
        │                                                   │
        ├─ Exact Model & Specs confirmed                    ├─ Broad Category Grouping
        ├─ Stated Advertised Price                          ├─ Advertised Starting Price
        └─ Strict Image Rule: `imageType = PRODUCT`         └─ Allowed: `imageType = CATEGORY_PROMO`

        ┌─────────────────────────┬─────────────────────────┐
        ▼                         ▼                         ▼
  [COUPON_DEAL]             [STORE_DEAL]               [CAMPAIGN]
  ├─ Has `couponCode`       ├─ Sitewide promo          ├─ General store listing
  ├─ Bank/Card conditions   ├─ Domain home landing     ├─ EPC payout signals
  └─ Min purchase terms     └─ Logo-only card          └─ Directory entrypoint
```

---

## 4. Price & Discount Extraction Rules

Prices extracted from Cuelinks feeds are strictly categorized by confidence and semantics:

| Extraction Pattern | Example Text in Title / Description | Extracted `priceType` | Extracted `advertisedPrice` | Stored `priceConfidence` | Verification Status |
|---|---|---|---|---|---|
| **Final / Advertised Price** | *"Final price Rs. 26,999 after discounts"* | `ADVERTISED_PRODUCT_PRICE` | `26999` | **HIGH (0.9)** | `SOURCE_STATED` |
| **Starting Price** | *"QLED TVs starting at Rs. 45,990"* | `STARTING_PRICE` | `45990` | **MEDIUM (0.7)** | `SOURCE_STATED` |
| **Flat Discount** | *"Flat Rs. 7,000 Off on Exchange"* | `DISCOUNT_AMOUNT` | `7000` | **HIGH (0.9)** | `SOURCE_STATED` |
| **Bank / Card Offer** | *"Additional Rs. 1,250 instant bank discount"*| `BANK_DISCOUNT` | `1250` | **HIGH (0.85)** | `SOURCE_STATED` |
| **Coupon Value** | *"Use Code SAVE500 for Rs. 500 off"* | `COUPON_DISCOUNT` | `500` | **HIGH (0.9)** | `SOURCE_STATED` |
| **Percentage Promo** | *"Up to 50% off on Laptops"* | `UNKNOWN` (No price) | `null` | **NONE (0.0)** | `UNVERIFIED` |

> [!IMPORTANT]
> **Anti-Hallucination Guardrail**: Extracted numbers are marked as `SOURCE_STATED` (Advertised Deal Price). They are **NEVER** marked as `LIVE_VERIFIED` checkout prices.

---

## 5. Product Entity Extraction Matrix

From unstructured deal strings, normalized entities are extracted without hallucinating missing fields:

| Field | Source Extraction Target | Example Regex / Parser Heuristic | Extracted Value |
|---|---|---|---|
| **Brand** | Title, Description, URL | Dictionary match against known brands | `OnePlus` |
| **Product Name** | Title | Token sequence excluding discount keywords | `Nord CE6 Lite 5G` |
| **RAM / Memory** | Title / Description | `/(?:[1-9][0-9]?)\s*(?:GB|TB)\s*RAM/i` | `8GB` |
| **Storage** | Title / Description | `/(?:16|32|64|128|256|512)\s*(?:GB|TB)\s*(?:ROM|Storage|SSD)?/i` | `128GB` |
| **Color** | Title / Description | Specific color list (Hyper Black, Blue, Midnight) | `Hyper Black` |
| **Size / Dimension**| Title | `/(?:[1-9][0-9]?(?:\.[0-9]+)?)\s*(?:inch|")/i` | `55 inch` |
| **Resolution** | Title | `/(?:4K|8K|UHD|FHD|1080p)/i` | `4K UHD` |

---

## 6. Critical Image / Thumbnail Audit & Root Cause

### Root Cause of Generic Browser Thumbnails:
1. **Upstream Cuelinks Behavior**: Cuelinks campaigns and generic offers do not provide dedicated SKU-level product image CDNs; their API returns generic merchant campaign placeholders (`Placeholder-Campaign.png`) or `image: null`.
2. **Backend Heuristic Assignment (`deals.ts:117-140`)**: `deals.ts` implements a fallback keyword matcher (`getDealBannerImage`) that assigns static Unsplash stock photos based on keywords:
   - Contains `'laptop'` or `'tv'` ➔ Assigns `photo-1498050108023-c5249f4df085` (Generic Laptop/Code screen).
   - Contains `'travel'` ➔ Assigns `photo-1488646953014-85cb44e25828` (Generic Travel photo).
3. **Frontend Fallback (`ProductCard.tsx:12-19`)**: When image loading fails, `ProductCard.tsx` sets `defaultFallback = 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece'`.

### Strict Image Source Hierarchy for Zero-Deception:

```
                               PRODUCT IMAGE DECISION TREE
                                            │
               ┌────────────────────────────┴────────────────────────────┐
               ▼                                                         ▼
    Is this a PRODUCT_DEAL?                                   Is this CATEGORY / STORE?
               │                                                         │
   ┌───────────┴───────────┐                                 ┌───────────┴───────────┐
   ▼                       ▼                                 ▼                       ▼
Exact SKU Image        No Exact SKU Image             Category Promo Art      Merchant Logo
Available in Feed?     Available?                     Available in Feed?      Available?
   │                       │                                 │                       │
   ▼                       ▼                                 ▼                       ▼
Render Product Image   Render Neutral SVG                Render Promo Banner   Render Store Logo
`imageType = PRODUCT`  "Image Unavailable"               `imageType=CATEGORY`  `imageType=MERCHANT`
                       (NEVER USE UNSPASH BANNER)
```

---

## 7. Destination URL Classification Patterns

| Destination URL Pattern | Example URL Structure | Inferred `urlType` | Semantic Meaning |
|---|---|---|---|
| **Product Detail Page** | `https://www.croma.com/p/322994`, `amazon.in/dp/B0...` | `PRODUCT_PDP` | Direct product buying link |
| **Category Listing** | `https://www.croma.com/televisions-accessories/c/10` | `CATEGORY_PAGE` | Broad product category |
| **Search Portal** | `https://www.croma.com/searchB?q=geyser`, `amazon.in/s?k=...` | `SEARCH_PAGE` | Keyword query search link |
| **Store Homepage** | `https://www.croma.com`, `https://www.levi.in` | `STORE_HOME` | Merchant root homepage |

---

## 8. Query-to-Deal Relevance Matching Architecture

Matching user query intent to Cuelinks records operates on multi-signal scoring:

```
TOTAL MATCH SCORE = (Product Entity Match * 0.35)
                  + (Query Keyword Relevance * 0.25)
                  + (Category Specificity * 0.15)
                  + (Budget Filter Compliance * 0.15)
                  + (Offer Freshness & Validity * 0.10)
```

- **Negative Signals (Instant Disqualification)**:
  - Expired timestamp (`validUntil < now`).
  - Category contradiction (e.g. user queried `"laptop"`, record is `"lipstick"`).
  - Out-of-budget advertised price (e.g. `advertisedPrice > budgetMax * 1.15`).

---

## 9. Normalized Deal Data Contract

Future normalized deal records will strictly conform to the following interface:

```typescript
export interface NormalizedDeal {
  id: string;
  dealType: 'PRODUCT_DEAL' | 'CATEGORY_DEAL' | 'STORE_DEAL' | 'COUPON_DEAL' | 'CAMPAIGN';
  title: string;
  description: string;
  merchantName: string;
  merchantLogoUrl: string;
  imageUrl: string | null;
  imageType: 'PRODUCT' | 'CATEGORY_PROMO' | 'MERCHANT' | 'NONE';
  advertisedPrice: number | null;
  originalPrice: number | null;
  discountText: string | null;
  discountPercentage: number | null;
  priceType: 'ADVERTISED_PRODUCT_PRICE' | 'STARTING_PRICE' | 'DISCOUNT_AMOUNT' | 'BANK_DISCOUNT' | 'COUPON_DISCOUNT' | 'UNKNOWN';
  priceConfidence: number; // 0.0 to 1.0
  verificationStatus: 'SOURCE_STATED' | 'SOURCE_VERIFIED' | 'LIVE_VERIFIED' | 'UNVERIFIED';
  couponCode?: string;
  destinationUrl: string;
  trackingUrl: string;
  affiliated: boolean;
  validUntil?: string;
  category: string;
  extractedEntities?: {
    brand?: string;
    model?: string;
    variant?: string;
    specs?: Record<string, string>;
  };
  retrievedAt: string;
}
```

---

## 10. Summary of Capabilities & Remaining Technical Gaps

| Capability Area | Confirmed Cuelinks Capability | Architectural Limitation (Zero-Budget Mode) |
|---|---|---|
| **Product Deal Retrieval** | ✅ Discovers high-value stated offers (e.g. OnePlus Nord @ Croma, Apple Airpods) | ⚠️ Coverage is limited to active merchant campaigns; not every arbitrary SKU has a deal. |
| **Advertised Price Intelligence**| ✅ Stated prices, bank discounts, and coupon values can be reliably extracted via regex | ❌ Advertised prices represent promotional terms, NOT live scraped checkout prices. |
| **Merchant Portals & Monetization**| ✅ 100% affiliate conversion via 3-Layer engine with direct deep links | None (Monetization is robust and locked). |
| **Exact Product Images** | ⚠️ Only available if upstream offer provides direct product thumbnail CDN | ❌ Generic banner art cannot be substituted; neutral SVG placeholder required when missing. |












