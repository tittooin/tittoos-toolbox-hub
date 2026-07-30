# COMMERCE DOMAIN ARCHITECTURE & BOUNDARY PLANNING REPORT (Prompt 07)

**Version:** v1.0  
**Date:** 15/07/2026  
**Planner:** Antigravity (AI Pair Programmer)

---

## 1. RECOMMENDED DOMAIN MODEL

Humare dynamic ecommerce architecture ke liye highly decoupled modular design model niche represent kiya gaya hai:

```
┌────────────────────────────────────────────────────────┐
│               Canonical Product Engine                 │
│         (Owns: Product Identity & Variants)            │
└──────────────────────────┬─────────────────────────────┘
                           │ (productId / variantId References)
                           ▼
┌────────────────────────────────────────────────────────┐
│                   Commerce Engine                      │
│   ├── Merchant Entity (Affiliate Network/API keys)     │
│   ├── Merchant Listing (listingId, merchantProductUrl) │
│   ├── Pricing (Current Price, Regional, Currency)      │
│   ├── Offers (Bank discounts, Cashback, Coupons)      │
│   └── Affiliate Mapping (Dynamic tracking generation)  │
└──────────────────────────┬─────────────────────────────┘
                           │ (listingId / offerId References)
                           ▼
┌────────────────────────────────────────────────────────┐
│                     Deals Engine                       │
│    (Owns: Editorials, Promotions, Deal Presentations)  │
└────────────────────────────────────────────────────────┘
```

---

## 2. RECOMMENDED OWNERSHIP MATRIX

Kaun sa data kis Engine/Domain ke under evaluate hoga:

| System Concept | Owner Engine | Reason / Architectural Decoupling |
| :--- | :---: | :--- |
| **Canonical Product** | `Product Engine` | Single Source of Truth (SSOT) for base brand details. |
| **Product Variants** | `Product Engine` | Variant base identity ka part hai, commercial pricing ka nahi. |
| **Merchant Configuration**| `Commerce Engine` | API key setups, credentials aur sync behaviors hold karne ke liye. |
| **Store Tagging** | `Taxonomy Engine` | Display name, category navigation aur UI visualization labels. |
| **Merchant Listing** | `Commerce Engine` | Specific seller link jo Product/Variant ko Merchant se link kare. |
| **Current Price** | `Commerce Engine` | Daily fluctuating property linked directly with listings. |
| **Price History** | `Commerce Engine` | Time-series historical records tracking listings prices. |
| **Commercial Offers** | `Commerce Engine` | Banks discounts, coupon facts, cashback models specifications. |
| **Deal Presentation** | `Deals Engine` | Editorial promotion dashboard display (Admin visual curation). |
| **Affiliate Mapping** | `Commerce Engine` | Dynamic tracking URL generation parameters management. |

---

## 3. RECOMMENDED DEPENDENCY GRAPH

Decoupled standard maintain karne ke liye unidirectional dependency graphs:

```
[Deals Engine] ───► [Commerce Engine] ───► [Product Engine]
      │                                           ▲
      └───────────────────────────────────────────┘
                           │
                           ▼
                  [Taxonomy Engine] (Shared references by all)
```

* **Dependency Rules:**
  * `Product Engine` completely independent rahega. Isko `Commerce Engine` ya `Deals Engine` ke types ki ko dependency nahi hogi (0 runtime code imports).
  * `Commerce Engine` reference ke taur par `productId` ya `variantId` import/consume karega.
  * `Deals Engine` display layouts normal render karne ke liye `listingId` aur `productId` reference consume karega.

---

## 4. PRODUCT VARIANT DECISION

* **Decision:** **Option B (Product Engine ke andar ek capability/subdomain)**.
* **Reasoning:** Product Variant (jaise iPhone 17 Pro 256GB Black vs 512GB Silver) product ki structural identity ka core attribute hai. Ye merchant-independent hai. Amazon par 256GB Black mil raha ho ya Flipkart par, product specs same rahengi. Isliye iski ownership `Product Engine` me hi secure honi chahiye.
* **Merchant Listings Link:** Ek same Variant ID multiple merchants key listings (`Merchant Listing`) ke saath bind ho sakega.

---

## 5. MERCHANT DECISION

* **Decision:** **Commerce Domain Entity (Independent from Taxonomy Store)**.
* **Reasoning:** 
  * Merchant identity ko `Taxonomy Engine` ke "Store" concept se completely independent rakha jayega.
  * Merchant Commerce Domain ka ek first-class independent object hoga jo apne sync integrations (APIs/Scrapers), integration type, status flags, credentials, aur network details ko control karega.
  * Taxonomy Engine ka "Store" concept sirf catalog tagging aur taxonomy categorizations hold karega, jabki Commerce Engine ka Merchant real-world business transactions aur affiliate integrations parameters own karega.

---

## 6. MERCHANT LISTING DECISION

* **Decision:** **Commerce Domain ka Subdomain / Capability**.
* **Reasoning:** `Merchant Listing` product/variant ko specific merchant platforms se link karne ka logical commercial element hai. 
* **Properties Owned:** Ye `listingId`, `productId`, `variantId`, `merchantId`, `externalProductId`, aur source listing landing URL (`merchantProductUrl`) own karega.
* **URLs separation:** Canonical merchant URL dynamically Listing me compile hoga aur final Affiliate tracking URL affiliate component parameters se append hokar render system me update hoga.

---

## 7. PRICING DECISION

* **Decision:** **Merchant Listing state entity (under Commerce Domain)**.
* **Reasoning:** Price ek real-time commercial value hai jo time-to-time update hoti hai. Ye listing data entity ka current status attributes block hoga.
* **Price History:** Dynamic history records ko resolve karne ke liye database logger table structures implement honge jo changes update ke time `listingId` and timestamps maintain karenge.
* **Currency & Region:** Price schema code format me `currencyCode` (e.g. INR, USD) and `regionId` configurations maintain karega, enabling multi-currency global support.

---

## 8. OFFER DECISION

* **Decision:** **Separate Commercial Entity inside Commerce Domain**.
* **Reasoning:** Price simple numeric data hai, jabki **Offer** (Bank cashbacks, coupons, time-bound discounts) ek complex logic matrix hai jo ek listing par multiple times dynamic evaluate ho sakta hai.
* **Distinction (Offer vs Deal):** 
  * **Offer:** Ek structural commercial fact hai (HDFC Card discount of 10% on Amazon).
  * **Deal:** Editorial/promotional representation layer hai jo Deals Engine curate karta hai user views display ke liye ("iPhone lowest price steal deal!").

---

## 9. DEAL RELATIONSHIP DECISION

* **Decision:** **Flexible Deal Target Reference (Combination of productId / listingId / offerId)**.
* **Reasoning:** 
  * Editorial teams ko visual flexibility dene ke liye Deal ek dynamic reference schema follow karega:
    - **`productId` Reference:** Product-level promotions ke liye (e.g., Brand launches, generic product updates).
    - **`listingId` Reference:** Specific merchant listings/price deals highlight karne ke liye (e.g., Amazon par price drop).
    - **`offerId` Reference:** Direct bank campaigns ya promotional codes target karne ke liye (e.g., Coupon code special).
  * Ye flexible target referencing model data redundancy avoid karega aur custom presentations compile karne me complete operational freedom dega.

---

## 10. AFFILIATE ARCHITECTURE DECISION

* **Decision:** **Commerce Domain subdomain capability**.
* **Reasoning:** Ek completely separate Affiliate Engine banana dynamic code flow ko complex karega (Over-engineering).
* **Implementation:** Affiliate network adapters, dynamic link builders aur conversion attributions rules capabilities ko standard `Affiliate Mapping` sub-layer me define kiya jayega inside the Commerce module.

---

## 11. EXTERNAL PROVIDER NORMALIZATION FLOW

Provider raw response leak prevent karne ke liye secure workflow:

```
[Scraper / API Provider Raw Data]
                │
                ▼
      [Provider Adapter]  <── (Converts unique JSONs to base objects)
                │
                ▼
     [Normalization Layer] <── (Resolves categories & stores map IDs)
                │
                ▼
  [Canonical Product Resolver] <── (Matches database canonical items)
                │
                ▼
 [Variant / Listing Resolver]  <── (Compiles current price and active offers)
```

---

## 12. DUPLICATE PREVENTION STRATEGY

Feeds parsing ke time duplicates prevent karne ka architecture:

1. **Unique Identifiers (EAN/UPC/ASIN/FSIN):** Structural matching attributes mapping base databases tables.
2. **Title Pattern Normalization:** RegEx cleaning standard parameters standard matching.
3. **Variant Resolution Matrix:** Match combinations dynamically (e.g. product name + color specification + RAM sizes specs).
4. **Manual Verification Queue:** Borderline cases check validations log configurations.

---

## 13. ENGINE VS SUBDOMAIN RECOMMENDATION

* **Recommendation:** **Single Modular Commerce Engine with Internal Subdomains**.
* **Reasoning:** Variant, Pricing, Affiliate, aur Offers separate engines hone se project directory and routes clutter increase hoga. Single structural modular `Commerce` package clean domains define kar dega.

---

## 14. FUTURE SCALABILITY ASSESSMENT

* Core structures schemas dynamic hain. Future me physical items ke alawa courses subscriptions, SaaS license voucher links, aur regional pricing dynamic currencies safely configure aur run ho sakenge.

---

## 15. RISKS

* **Performance lag:** Feeds parsing aur matching algorithm run hone par high-volume data load updates slow hone ka risk.
* **Affiliate URL changes:** Networks parameters format update hone par url parsers modify karne ka continuous maintenance overhead.
* **Hidden Coupling:** Layout templates (jaise `DealsHome.tsx`, `ProductDashboard.tsx`, `TaxonomyDashboard.tsx`) directly global client assets (`@/components/Header`, `@/components/Footer`) import karte hain. Agar in modules ko isolated independent npm packages me break kiya jaye to path resolutions fail honge. Is layout coupling ko resolve karne ke liye layout modules ko children/slot nodes accept karne honge.
* **Routing Leakage:** Naye paths configurations `src/App.tsx` me hardcoded elements update karte hain. Module registration dynamic router mapping follow nahi karta.
* **Shared Utility Redundancy:** Slug generators aur normalizers helpers multiple folders me (`products/utils`, `taxonomy/utils`) duplicate implemented hain, jo ek core shared library layer update demand karte hain.

---

## 16. PROS

* **Clear Boundaries:** Product Engine and Taxonomy Engine strictly isolated remain. Zero data pollution risks.
* **Zero redundancy:** Single source of truth is highly maintained.

---

## 17. CONS

* API adapters implementation details multiple models mapping parameters standard increase karegi (slightly high mapping configuration file count).

---

## 18. FINAL DECISION

```text
ARCHITECTURE APPROVED WITH CHANGES
```
**Changes Proposed:**
1. Future implementation steps me `extensions: Record<string, any>` ko resolve karke strict types mapping ya `Record<string, unknown>` shift dynamic target checks apply kiya jaye.
2. Merchant identity ko Taxonomy Store entity se completely independent structural object banaya jaye.
3. Deal Engine references flexible target modeling (productId / listingId / offerId combination) design follow karein.
4. Header/Footer layout references ko children slots injection style me change kiya jaye.

---

## 19. REWRITE PROBABILITY

```text
Rewrite Probability: 10% - 15%
```
*(Reason: Layout component direct imports coupling aur utility duplication ko resolve karne ke liye future packaging stages me routing aur shell layouts logic me adjustments required honge.)*
