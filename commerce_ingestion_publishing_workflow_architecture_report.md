# AXEVORA ENTERPRISE AI GROWTH ENGINE
## MVP Architecture Planning Report: Manual Commerce Ingestion & Publishing Workflow
**Version:** v1.0  
**Date:** 15/07/2026  
**Status:** Architecture Planning & Evaluation  

---

### 1. Actual Repository Findings

*   **Static & Git-Backed CMS Pattern:** Axevora repository me dynamic data ko handle karne ke liye static `.json` files aur client-side loading ka use kiya gaya hai (jaise [generated_blogs.json](file:///d:/axevora.com/tittoos-toolbox-hub/src/data/generated_blogs.json)). 
*   **GitHub API Integration:** Admin panel se data persistence ke liye [BlogManager.tsx](file:///d:/axevora.com/tittoos-toolbox-hub/src/pages/admin/BlogManager.tsx) me [GitHubClient](file:///d:/axevora.com/tittoos-toolbox-hub/src/utils/githubClient.ts) utility class use ki gayi hai, jo founder ke authorized GitHub API token se direkt files modify/commit karti hai. Isse CI/CD dynamic build triggers generate hote hain aur static hosting (Vercel/Cloudflare) par dynamic site updates propagate ho jate hain.
*   **Decoupled Modules:** Product, Commerce, Deals, CMS, aur Taxonomy modules [src/App.tsx](file:///d:/axevora.com/tittoos-toolbox-hub/src/App.tsx) me parallelly registered hain, lekin unke data stores aur structures isolated interfaces conform karte hain. Commerce Module me abhi live pricing database ya external API scrapers placeholders hain aur backend absent hai.

---

### 2. Recommended MVP Architecture

MVP ke liye hum **Static Git-Backed Client-Side Data Ingestion Model** design karenge. Jab founder Admin UI use karke naya product publish karega:
1.  **Draft State Memory:** Pure multi-step wizard form ka state React environment ke control variables aur `localStorage` me parse hoga.
2.  **Sequential Commits:** Ek click par [GitHubClient](file:///d:/axevora.com/tittoos-toolbox-hub/src/utils/githubClient.ts) coordinate karega aur respective JSON databases update karega.
3.  **Client-Side Resolution:** Webpage load hone par hooks local files data reference lookups use karke related details ko dynamically compile and visual cards render karenge.

---

### 3. Orchestration Ownership Decision (Question 1)

*   **Decision:** **Option D (Dedicated Application / Workflow / Orchestration Layer)** with Option E (Existing Admin patterns) integration sabse best option hai.
*   **Why A, B, C are rejected:** 
    *   *Option A (Commerce Engine owns orchestration)*: Agar commerce module direct coordinate karega, to use CMS and Product types import karne padenge, jisse locked architectural boundary check fail ho jayega.
    *   *Option B (CMS Engine owns orchestration)*: Same coupling issues.
    *   *Option C (Admin UI directly coordinates)*: Form component code bohot redundant aur maintenance me hard ho jayega.
*   **Workflow Service Implementation:** Hum `src/modules/commerce/services/PublishingWorkflow.ts` create karenge jo raw form payloads input lega aur generic inputs ko isolate karke distinct engine validation APIs (`validateProduct`, `validateListing`, `validatePrice`, etc.) hit karega aur fir state sequence GitHub commit commands pipeline me feed karega.

---

### 4. Manual Input Field Matrix (Question 2)

| Form Section | Field Name | Required / Optional | System Generated | Type |
| :--- | :--- | :--- | :--- | :--- |
| **Product Core** | Product Name | **Required** | No | `string` |
| | Product Type | **Required** | No (Default: 'physical') | `select` |
| | Category | **Required** | No | `select` (Taxonomy selection) |
| | Brand | **Required** | No | `select` (Taxonomy selection) |
| | Short Description | Optional | No | `string` |
| | Long Description | Optional | No | `textarea` |
| | Image URL | **Required** | No | `string` (External link or asset reference) |
| **Listing** | Merchant | **Required** | No (e.g. Amazon, Flipkart) | `select` |
| | External Product ID (ASIN) | **Required** | No | `string` |
| | Merchant Product URL | **Required** | No | `string` |
| **Pricing & Affiliate** | Current Price | **Required** | No | `number` |
| | Original Price (MRP) | Optional | No | `number` |
| | Affiliate Tracking Ref | Optional | No | `string` (Defaults to system tag if blank) |
| | Affiliate URL | Optional | No | `string` (Override link if manual) |
| **Deal & Editorial** | Offer Title | Optional | No | `string` |
| | Offer Discount Value | Optional | No | `string` (e.g. '10% OFF') |
| | Deal Headline | Optional | No | `string` |
| | Article HTML Body | Optional | No | `rich-text` |
| **Metadata Keys** | Product ID | System Generated | **Yes** (UUID) | `string` |
| | Listing ID | System Generated | **Yes** (UUID) | `string` |
| | Slug | System Generated | **Yes** (Automated clean URL string) | `string` |
| | Created/Updated Date | System Generated | **Yes** (ISO Timestamp) | `string` |

---

### 5. Domain Ownership Mapping (Question 3 & 5)

Data ownership standard boundaries rule comply karega:
*   [CanonicalProduct](file:///d:/axevora.com/tittoos-toolbox-hub/src/modules/products/types/index.ts) **owns:** `id`, `name`, `slug`, `type`, `brandId`, `taxonomyIds`, `mediaUrls`, `shortDescription`, `longDescription`, `status`, `visibility`.
*   [MerchantListing](file:///d:/axevora.com/tittoos-toolbox-hub/src/modules/commerce/types/index.ts) **owns:** `id`, `productId`, `merchantId`, `externalProductId`, `merchantProductUrl`, `status`.
*   `Price` **owns:** `listingId`, `amount`, `currencyCode`, `status` ('observed'), `observedDate`.
*   `AffiliateMapping` **owns:** `id`, `merchantId`, `listingId`, `networkRef`, `trackingRef`, `status`.
*   `Offer` **owns:** `id`, `listingId`, `type`, `title`, `benefitValue`, `status`.
*   `DealProduct` **owns:** `id`, `title`, `description`, `originalPrice`, `discountedPrice`, `discountPercentage`, `imageUrl`, `affiliateLink`, `expiryDate`, `storeName`. (Used by Deals module pages).
*   `ContentItem` (CMS) **owns:** Article elements, referring `productId` or `dealId` in custom schema properties mappings.

---

### 6. Amazon Manual Data Mapping (Question 3)

Canonical Product core properties standard ko dynamic clean rakhne ke liye Amazon specific identifiers leak nahi kiye jayenge:
*   **ASIN:** `MerchantListing` ke `externalProductId` attribute me stored hoga.
*   **Amazon URL:** `MerchantListing` ke `merchantProductUrl` me define rahega.
*   **Affiliate URL / Tracking Reference:** `AffiliateMapping` metadata configurations me compile hoga.
*   **Current Price:** `Price` object me `listingId` refer karke saved hoga.
*   **Image reference:** Core global image path `CanonicalProduct.mediaUrls` array list me exist karega. Amazon variant-specific image reference string `MerchantListing` variables metadata details configurations me optional saved ho sakti hai.

---

### 7. Merchant Bootstrap Strategy (Question 4)

*   **Simplest Clean Approach:** Commerce Registry ([registry/index.ts](file:///d:/axevora.com/tittoos-toolbox-hub/src/modules/commerce/registry/index.ts)) static array use karegi.
*   **Bootstrapping:** Default Merchants list (Amazon, Flipkart, Myntra) system code me default seed parameters ke roop me hardcoded standard database file target me populate rahegi. 
*   Admin UI dynamic dropdown options fetch karne ke liye `src/modules/commerce/constants/registry.ts` configuration options use karega, jisse runtime memory allocation lightweight and error-proof ho sake.

---

### 8. Product Deduplication Strategy (Question 5)

*   **Deterministic Validation Check:** System dynamic matching algorithms call nahi karega.
*   **Ingestion logic:** Jab developer brand ID aur category set karke Product Name input hit karega:
    1.  Normalize title input (remove special characters, whitespaces, clean lowercase strings).
    2.  Check matching slug patterns with existing local data `generated_products.json`.
    3.  Agar title matching logic pass ho jata hai (duplicate detected), to user validation prompt block display hoga: *"This Product already exists. Do you want to map a new Merchant Listing to it instead of creating a new product identity?"*
    4.  Confirmation sequence selection handle karega mapping routes logic.

---

### 9. Listing Deduplication Strategy (Question 6)

*   **Identity Rule:** Duplicate check ke liye custom key composite identity standard: `merchantId` + `externalProductId` (ASIN code).
*   **Why this works:** Ek hi merchant platform (e.g. Amazon India) par same product ke multiple distinct listings duplicate identifiers check bypass nahi kar payenge.
*   **Future Automation:** Automation API calls (PA-API imports) directly composite checks perform karenge, updates validation simple run logic apply hoga.

---

### 10. Pricing Strategy (Question 7)

*   **Price Entity structure:** Commerce guidelines ensure karte hue separate `Price` model define rahega referencing `listingId`.
*   **Current Price representation:** Current Price array listings models update standard timestamp key mapping trace sequence verify default check observed parameters properties update karega.
*   **MRP Pricing:** `Price` record model configurations standard logic maintain karega where currency value standard `INR` validate default rahega. Price history log tracking tables currently globally disabled rahenge.

---

### 11. Affiliate Link Strategy (Question 8)

*   **MVP Execution:** Direct affiliate tracking template parameters `trackingRef` and tracking template format configs use honge.
*   **Link Mapping:** Manual URL validation directly `AffiliateMapping` record schema parameters targets key overrides target configure ho sakegi.
*   **Migration path:**
    ```mermaid
    graph LR
        A["Manual Affiliate URL"] --> B["Stored Mapping Link"]
        C["API URL Ingestion"] --> D["Tracking Ref Mapping Builder"]
        D --> E["Dynamic CTA Redirect Generator"]
    ```

---

### 12. Offer / Deal Strategy (Question 9)

Boundaries standard checks isolate kiye jayenge:
*   **Offer:** Purely commercial fact (e.g. "Get 10% Cash back using HDFC Bank Cards"). Saved under `Offer` referencing `listingId`.
*   **Deal:** Promotional presentation (e.g. "Special Summer Super Deals banner, high recommendation scores"). Saved in Deals Engine definitions.
*   **Creation Flow Options Matrix:**
    1.  *Product Only* (No active listing) -> Draft.
    2.  *Product + Listing + Price* -> Standard Commercial catalog page display active.
    3.  *Product + Listing + Price + Offer* -> Coupon highlight active.
    4.  *Product + Listing + Price + Deal + Article* -> Dynamic deals frontpage layout active.

---

### 13. CMS Integration Strategy (Question 10)

*   **Content mapping structure:** Existing [ContentItem](file:///d:/axevora.com/tittoos-toolbox-hub/src/modules/cms/types/index.ts) model generic configurations preserve karega.
*   CMS article dynamic fields configurations check parameters (custom schemas database fields mappings parameters) block call lookups coordinate queries references dynamically call structure standard follow key fields map karega:
    ```typescript
    // In CMS ContentItem customFields schema definition
    customFields: {
       productIdRef: "canonical-product-uuid-code",
       dealIdRef: "deals-presentation-uuid-code"
    }
    ```
*   Real-time renderer static components loading hooks pricing values target engines components call data fetch reference render layouts build up run time render queries output direct check coordinate, commercial fields duplicate parameters saved nahi rahenge.

---

### 14. Content Generation Strategy (Question 11)

*   **Fastest MVP Approach:** Client-Side Template-Based structure mapping builder shell scripts.
*   Founder form page content creation panel hit check trigger karega. System properties inputs read karega, outline content standard HTML template parse placeholder textarea fields settings block populate karega:
    *   *Sample template:* `<h2>Review of ${productName}</h2><p>Here is our technical analysis for this recommended product...</p>`
*   Developer template formats outline manually customize updates form editors standard execute handles process triggers.

---

### 15. Public Page Strategy (Question 12)

*   **Fastest & Clean Path:** **CMS-driven Article Page with Product Commerce Widget** template structure implementation strategy.
*   Public routing path dynamic route maps `src/App.tsx` configurations me read check standard options conform handle routes dynamic load inputs. Page components canonical targets components standard dynamic elements modules hooks updates loop trigger resolve elements layouts format targets.

---

### 16. Image Strategy (Question 13)

*   **MVP Execution:** System only `mediaUrls: string[]` save standard database parameters values format save karega mapping references logic path conform.
*   **Local Image support:** Upload option fallback directly files configurations details manual links targets coordinate karega. Standard files media directories paths maps dynamically preserve paths maps details future Media Engine implementation.

---

### 17. Basic SEO Strategy (Question 14)

Integrated validation rules dynamic structures `generate-static-pages.cjs` SEO schema properties list outputs:
1.  **Title tag:** `<title>Brand Name + Product Name Reviews Review - Axevora</title>`.
2.  **Meta Description:** Description snippets values.
3.  **Canonical URL:** `${SITEMAP_BASE_URL}/deals/product/${slug}` path matching patterns.
4.  **JSON-LD Structured data snippet:** Embedded JSON Product structural descriptions specifications markup layout.

---

### 18. Persistence Strategy (Question 15)

Persistence architecture existing project status comply file arrays updates triggers:
*   **JSON Data Storage Files Path:**
    *   `src/data/generated_products.json`
    *   `src/data/generated_listings.json`
    *   `src/data/generated_prices.json`
    *   `src/data/generated_deals.json`
    *   `src/data/generated_affiliates.json`
*   Admin Client panel uses [GitHubClient](file:///d:/axevora.com/tittoos-toolbox-hub/src/utils/githubClient.ts) API updates sequence directly modifications write backend triggers main main branch tracking code, and automated builds handle static assets deployments updates automatically without backend setup dependencies database.

---

### 19. Admin Workflow (Question 16)

*   **Usability UI Layout:** **Single Multi-Step wizard layout form panel** page template under `/admin/commerce/publish`.
*   Wizard flow divisions blocks:
    *   *Step 1 (Product Attributes):* Input name, brand selection, category selection, image URL list.
    *   *Step 2 (Store Listing details):* Target merchant options configuration dropdown select list, ASIN code text.
    *   *Step 3 (Pricing Facts):* Input retail pricing tags parameters settings, affiliate mappings values checks.
    *   *Step 4 (Editorial layouts configurations):* Deal headers custom fields summaries body HTML text.
    *   *Submit Button:* Trigger orchestration workflow pipeline save.

---

### 20. Failure / Retry Strategy (Question 17)

Static persistence workflow transactional errors block handle standard model logic:
1.  **Local Storage Caching:** Submit click updates trigger state variables are cached inside local cache.
2.  **Atomic Commits chain execution sequential checks:** System commits JSON updates files sequence APIs chain loops sequence.
3.  **Error Handling visual notifications:** Agar transaction fail (e.g. internet loss, invalid token API responses error flags), process pause state me active visual indicators highlight karega: *"Ingestion partially completed, click Retry to update remaining data arrays."*
4.  Data variables input text fields values active memory indicators format me secure load rahenge block retry checks configurations.

---

### 21. Automation Migration Path (Question 18)

Future auto syncing adapter pipelines dynamic structures:
```text
[Amazon PA-API / Feeds JSON Response Data]
          │
          ▼
┌──────────────────────────────────────┐
│  CommerceAdapter Normalizer Parser   │
└──────────────────────────────────────┘
          │
          ▼  (Outputs Identical JSON Schemas)
┌──────────────────────────────────────┐
│ Canonical Product + Listings + Price │
└──────────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│ Orchestrated Publishing Pipeline    │
└──────────────────────────────────────┘
```

---

### 22. Security Considerations

*   **Token Protection:** GitHub Access Credentials API key parameters client code repositories checks standard format file sets patterns parameters check leaks me check ignore constraints check patterns files me store check skip karegi. System token local storage format safe load checks logic read checks validation configurations verify keys values locally runtime browser.

---

### 23. MVP Scope

*   **MUST HAVE NOW:**
    *   Workflow Orchestration logic layer definitions.
    *   Pre-populated Local JSON files formats definitions databases configurations setup templates.
    *   Admin panel publishing multi-step wizard interface console component.
    *   GitHubClient commits integration pipelines.
    *   Commerce links redirects routing endpoints paths standard mapping.
*   **SHOULD HAVE SOON:**
    *   Lookup product duplicate selectors validation popups.
    *   Automatic Slug validators patterns.
*   **LATER:**
    *   Amazon PA-API dynamic parsers.
    *   Live scraper adapters modules.

---

### 24. Exact Implementation Sequence

*   **Prompt 09A:** Application Workflow Foundation, Types Registry modifications configuration updates.
*   **Prompt 09B:** Multi-step wizard layout Form component implementation admin pages.
*   **Prompt 09C:** GitHubClient integration persistence write checks.
*   **Prompt 09D:** Public pages render widgets details dynamic maps.
*   **Prompt 09E:** System compilation review end-to-end routing validation tests.

---

### 25. Estimated Prompt Breakdown

1.  **Prompt 09A:** `types` config update and Workflow Service helper implementation.
2.  **Prompt 09B:** Multi-step wizard publish form page creation in `/admin`.
3.  **Prompt 09C:** GitHub client integration logic to write static JSON files on commit.
4.  **Prompt 09D:** Public details card view component matching dynamic taxonomy categories.

---

### 26. Final Decision

```text
READY WITH MINOR ARCHITECTURE CHANGES
```

**Reason:** Core design architectures and engines are isolated properly. Custom file commits standard implementation path details logic clear and structured.
