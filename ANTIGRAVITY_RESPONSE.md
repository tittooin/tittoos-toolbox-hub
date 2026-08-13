1. **Real-Time Web Search Asset Extractor & Dynamic Merchant Resolution (`search.ts`):**
   - Fixed bug where `fallbackItems` defaulted merchant to `"Amazon"` and image to Unsplash Laptop.
   - Dynamic Merchant Extractor now inspects query category:
     - **Finance Queries (`category = 'finance'`):** Resolves merchant names dynamically to `HDFC Bank` (`hdfcbank.com`), `SBI Card` (`sbicard.com`), or `Axis Bank` (`axisbank.com`).
     - **Travel Queries (`category = 'travel'`):** Resolves merchant names to `MakeMyTrip` (`makemytrip.com`) or `Goibibo` (`goibibo.com`).
     - **Electronics & GPU:** Resolves to `Amazon`, `Croma`, or `Flipkart`.
   - Card images dynamically map to domain-matched photography (Credit Cards photography for Finance, Flight/Hotel photography for Travel, GPU cards for PC Hardware).

2. **Universal Merchant Search URLs & 3-Layer Monetization (`createSearchUrl` & `convertUrl.ts`):**
   - Added destination URL resolvers for `hdfcbank.com`, `sbicard.com`, `axisbank.com`, `makemytrip.com`, and `goibibo.com`.
   - Every live destination URL passes through `convertUrl.ts` (Layer 1: Amazon Tag -> Layer 2: EarnKaro Bearer Token API -> Layer 3: Cuelinks Wrapper).

3. **Status:**
   - [x] Finance cards render `HDFC Bank` / `SBI Card` badges (Zero Amazon/Laptop desync).
   - [x] Travel cards render `MakeMyTrip` / `Goibibo` badges.
   - [x] Monetization 3-Layer Waterfall Active.

Test the AI Assistant with "Compare iPhone 15 and Samsung S24" on live preview to see the magic! 🪄
