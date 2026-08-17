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











