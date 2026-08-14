# Axevora Implementation Response

## 1. Task & Context
Investigate and resolve runtime secret delivery issues (`GEMINI_API_KEY`, `EARNKARO_API_TOKEN`, `CUELINKS_API_KEY`) and Workers AI (`env.AI`) bindings in Cloudflare production environment, centralize Workers AI fallback to active `@cf/zai-org/glm-4.7-flash`, audit hardcoded ratings/consensus, enforce a strict zero-mock policy, and document full tracing of commerce calls.

## 2. Production Deployment Chain & Architecture Trace

### A. Deployment Mechanism
- **Frontend & API Functions**: Deployed via **Cloudflare Pages** (with file-based routing via `functions/api/*`).
- **Real-Time Live Chat**: Deployed via separate **Cloudflare Worker** (`workers/chat-server.js`) with Durable Objects on `chat.tittoosss.workers.dev`.
- **Primary Domain**: `https://axevora.com/` maps to the **Cloudflare Pages** project (`axevora-toolbox`).

### B. Current Repository Configuration (`wrangler.toml`)
- The repository `wrangler.toml` targets `name = "chat"` and `main = "workers/chat-server.js"` with Durable Object class `ChatRoom`.
- **Crucial Architectural Rule**: The root `wrangler.toml` does NOT control Cloudflare Pages Functions environment variables. Cloudflare Pages Functions receive their secrets (`GEMINI_API_KEY`, etc.) and bindings (`env.AI`) strictly from the **Cloudflare Pages Dashboard Settings** (`Settings` -> `Environment variables` and `Settings` -> `Functions`).

### C. Live Production Diagnostic Trace
Live HTTPS GET request to `https://axevora.com/api/commerce/diagnostic`:
```json
{
  "ok": true,
  "geminiKeyPresent": false,
  "earnkaroTokenPresent": false,
  "cuelinksKeyPresent": false,
  "aiBindingPresent": false
}
```
**Evidence Finding**: The production runtime context (`context.env`) in the live Cloudflare Pages deployment does NOT have access to the dashboard secrets or Workers AI binding.

## 3. Root Cause Analysis
1. **Secrets / Bindings Environment Mismatch or Stale Build in Cloudflare Pages**:
   - Secrets may have been set only in **Preview** environment instead of **Production** environment.
   - OR, secrets and Workers AI binding were added to the dashboard AFTER the last deployment, and Cloudflare Pages Functions require a **fresh build / deployment retry** to bake runtime bindings into the Pages worker bundle.
2. **Dashboard Actions Outside Agent Local Boundary**:
   - The agent has full control of Git, code, and Worker deployments via CLI (`wrangler deploy` for chat worker), but Cloudflare Pages project secrets dashboard is managed at the Cloudflare account level.

## 4. Required Production Bindings (LOCKED Names)
The production Pages Functions runtime requires:
1. `GEMINI_API_KEY` (Secret String)
2. `EARNKARO_API_TOKEN` (Secret String)
3. `CUELINKS_API_KEY` (Secret String)
4. `AI` (Cloudflare Workers AI Binding)

## 5. Exact Manual Actions Required in Cloudflare Dashboard
The human operator must execute these exact steps in the Cloudflare Dashboard:

1. **Log in to Cloudflare Dashboard** -> Navigate to **Workers & Pages** -> Select the active Pages project (e.g., `axevora-toolbox` / `tittoos-toolbox-hub`).
2. Go to **Settings** -> **Environment variables**:
   - Ensure the variables are added under the **Production** tab (not just Preview):
     - Variable Name: `GEMINI_API_KEY` | Value: *[Your Google AI Studio Gemini API Key]*
     - Variable Name: `EARNKARO_API_TOKEN` | Value: *[Your EarnKaro Token]*
     - Variable Name: `CUELINKS_API_KEY` | Value: *[Your Cuelinks API Key]*
   - Click **Save**.
3. Go to **Settings** -> **Functions**:
   - Scroll down to **Workers AI Bindings**.
   - Click **Add binding**.
   - Binding name: `AI` (must be exact uppercase `AI`).
   - Click **Save**.
4. Go to **Deployments** tab:
   - Click on the latest Production deployment (`...` menu) -> Select **Retry deployment** (OR push a commit to trigger a fresh production build).
   - *Note: In Cloudflare Pages, environment variable changes take effect ONLY on deployments built AFTER the variable was added.*

## 6. Verification Plan Post-Configuration (Execution Gates)

- **GATE 1 — Runtime Diagnostic**:
  `https://axevora.com/api/commerce/diagnostic` must return:
  `geminiKeyPresent: true`, `earnkaroTokenPresent: true`, `cuelinksKeyPresent: true`, `aiBindingPresent: true`.
- **GATE 2 — AI Invocation**:
  Verify real Gemini 2.5 Flash invocation and Workers AI (`@cf/zai-org/glm-4.7-flash`) failover.
- **GATE 3 — Retrieval & Intelligence**:
  Verify real shopping queries ("Compare iPhone 15 and Samsung S24") without mock data.
- **GATE 4 — Zero-Mock Rating Compliance**:
  Verified: Static `4.8/5` rating has been purged from frontend and backend.
- **GATE 5 — Three-Tier Monetization**:
  Verify Amazon (`axevora06-21`), EarnKaro, and Cuelinks URL conversion pipelines.

## 7. Status
**BLOCKED — MANUAL CLOUDFLARE CONFIGURATION REQUIRED**
(Codebase is clean, tested, and ready; awaiting Cloudflare Pages Dashboard environment variable injection and build retry by operator).


