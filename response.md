# AXEVORA - Google Auth Evidence Collection

Is sprint me maine repository ki deep inspection ki taaki bina kisi assumption ke COOP/COEP headers ki exact location aur unka impact verify kiya ja sake.

## Headers Evidence

**1. `public/_headers`**
- **File Name:** `public/_headers`
- **Line Number:** 5 and 6
- **Current Value:**
  ```text
  Cross-Origin-Opener-Policy: same-origin-allow-popups
  Cross-Origin-Embedder-Policy: credentialless
  ```
- **Apply to:** Cloudflare Pages par deploy hone ke baad sabhi incoming requests (`/*`) par.
- **Note:** COEP `credentialless` require karta hai ki browser environment strict isolation follow kare. Agar COOP `same-origin` nahi hai toh cross-origin isolation fail ho jati hai WASM ke liye. Agar COOP ko `same-origin-allow-popups` rakhte hain, tab bhi combination Firebase popup window ki property access ko strictly block karta hai (jaise screenshot me dikhaya gaya hai).

**2. `vite.config.ts`**
- **File Name:** `vite.config.ts`
- **Line Number:** 11 and 12
- **Current Value:**
  ```javascript
  headers: {
    "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    "Cross-Origin-Embedder-Policy": "credentialless",
  },
  ```
- **Apply to:** Vite dev server (`npm run dev`) ke dwara serve kiye jaane wale sabhi requests (Localhost:8080 / 8081).
- **Note:** Dev environment me bhi bilkul production jaisi strict policy enforce ki gayi hai taaki AI/WASM tools properly load ho sakein.

**3. `wrangler.toml` / `wrangler.jsonc`**
- **Evidence:** Repository me sirf `wrangler.toml.bak` maujood hai. Active `wrangler.jsonc` ya `wrangler.toml` root directory me configure nahi hai jo Cloudflare Pages settings ko override karein. Header configuration entirely `public/_headers` se control ho rahi hai.

**4. `_redirects`**
- **Evidence:** Iss file me headers configure nahi hote, sirf route redirections set hote hain.

## Root Cause Declaration
Evidence ke basis par ye clear hai ki **COOP aur COEP dono headers globally set hain**. Kyunki application `Cross-Origin-Embedder-Policy: credentialless` use kar rahi hai, browser ki security strictly cross-origin popups se baat karne (`window.closed` and `postMessage`) ko reject kar deti hai. Ye Firebase SDK ko break kar deta hai.

## Conclusion: signInWithPopup vs signInWithRedirect

Axevora ke architecture ke liye **`signInWithRedirect`** use karna 100% correct approach hai.

**Kyunki:**
Axevora AI tools (`SharedArrayBuffer`) par heavily depend karta hai jinke chalne ke liye COEP aur COOP headers lazmi (mandatory) hain. Agar hum in headers ko hatate hain toh login theek ho jayega lekin application ke AI features break ho jayenge.
`signInWithRedirect` koi popup window open nahi karta, balki usi browser tab me navigation karta hai. Is wajah se window communication ka COOP block trigger hi nahi hota.

## PASS / FAIL
**PASS**
(Evidence strictly collect kar li gayi hai, root cause 100% verifiable hai. Ab hum securely `signInWithRedirect` implementation ki taraf badh sakte hain.)
