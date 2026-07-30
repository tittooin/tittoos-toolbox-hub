# AXEVORA COMMUNITY ENGINE — PHASE 1 ARCHITECTURE AUDIT & IMPLEMENTATION PLAN

---

## 1. Executive Summary
Axevora platform par ek naya, highly secure, high-performance **Axevora Community Engine** add karne ka architectural plan design kiya gaya hai. Ye community forum users ko legitimate content, creator profiles, YouTube videos, Instagram posts, websites, blogs, deals, aur discussions promote/share karne ki permission dega.

Is architecture me **Zero Binary Storage Rule** enforce kiya gaya hai: Axevora user-uploaded images, videos, ya files ko apne Cloudflare storage/database me store nahi karega. Database me sirf structured text, metadata, validate kiye gaye external URLs, aur moderation records store honge. User Auth ko Admin Auth se 100% isolate rakha gaya hai.

---

## 2. Current Repository Architecture
- **Frontend Framework:** `react` v18.3.1 (TypeScript v5.5.3 ke sath).
- **Routing Engine:** `react-router-dom` v6.26.2 using `HashRouter` (`src/App.tsx`).
- **Build System:** `vite` v5.4.1 swc compiler ke sath.
- **UI & Styling:** TailwindCSS v3.4.11, Shadcn UI / Radix UI primitives (`src/components/ui/`), `framer-motion` v12.25.0, aur `lucide-react` icons.
- **State & Data Fetching:** `@tanstack/react-query` v5.56.2.

---

## 3. Current Cloudflare Architecture
- **Deployment Model:** Cloudflare Pages + Cloudflare Pages Functions (`functions/api/` directory me serverless routes like `functions/api/commerce/deals.ts` aur `functions/api/commerce/convert.ts`).
- **Worker Infrastructure:** Separate worker script `workers/chat-server.js` (configured in `wrangler.toml` with `Durable Object` `CHAT_ROOM`).
- **Database & Storage Status:** Abhi repository me Cloudflare D1 database binding configured nahi hai. Community Engine ke liye Cloudflare D1 integration initiate kiya jayega.

---

## 4. Existing Auth Audit
- **User Authentication:** Existing system me regular users ke liye koi User Auth / Account management system nahi hai.
- **Admin Authentication:** `AdminRouteGuard.tsx` (`src/components/AdminRouteGuard.tsx`) ek SHA-256 client-side passcode gate (`VITE_ADMIN_GATE_HASH`) use karta hai jo `sessionStorage` / `localStorage` me state store karta hai.
- **Isolation Requirement:** Community User Auth system ko Admin Gate se 100% separate aur server-side Worker architecture par construct kiya jayega.

---

## 5. Recommended Community Architecture
```
User Browser (React + HashRouter)
       │
       │ HTTPS / API Requests (HttpOnly Cookies / Bearer)
       ▼
Cloudflare Pages Functions (/functions/api/community/*)
       │
       ├─► Security Controls (Rate Limiter, Turnstile, Input Sanitization)
       ├─► Auth Service (Password Hash via Web Crypto API, Session Validator)
       └─► Cloudflare D1 Database (Structured Tables & Prepared Statements)
```

---

## 6. Authentication Design
- Server-side trusted authentication flow Cloudflare Pages Functions (`functions/api/community/auth/*`) par chalega.
- Signup Endpoint: Username, Email, Password.
- Login Endpoint: Email/Username + Password verify karke secure session issue karega.
- Admin passcodes aur Community user credentials completely isolated rahenge.

---

## 7. Session Security
- **Token Type:** High-entropy cryptographically random session tokens (32-byte / 256-bit hexadecimal generated via `crypto.getRandomValues()`).
- **Cookie Security:** `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`.
- **Session Lifespan:** 14-day rolling session expiry with automatic session rotation on login.
- **CSRF Protection:** Double Submit CSRF token header check for all state-changing POST/DELETE requests.

---

## 8. Password Security
- Plaintext passwords database, logs, localStorage, ya API responses me kabhi store ya log nahi honge.
- Cloudflare Workers runtime compatible **Web Crypto API (`crypto.subtle`)** use karke **PBKDF2-HMAC-SHA256** with 100,000+ iterations aur 16-byte random salt se password hashing design ki gayi hai.

---

## 9. Email Verification Recommendation
- **MVP Phase:** Account creation ke waqt Email syntax validation + disposable email domain denylist check use hoga.
- **Future Phase:** Full transactional email OTP / Magic link verification via Cloudflare Workers Email Routing / Resend API integrate kiya ja sakta hai.

---

## 10. D1 Database Architecture
Cloudflare D1 (SQLite-backed edge database) use karke normalized, indexed, aur relational schema create kiya jayega. All queries parameterized SQL statements use karengi.

---

## 11. Complete Proposed Schema

```sql
-- 1. USERS TABLE
CREATE TABLE community_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user', -- 'user', 'moderator', 'admin'
  trust_level INTEGER NOT NULL DEFAULT 1, -- 1: New, 2: Member, 3: Trusted
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'suspended', 'banned'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP
);

-- 2. USER PROFILES TABLE
CREATE TABLE community_profiles (
  user_id TEXT PRIMARY KEY FOREIGN KEY REFERENCES community_users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  website_url TEXT,
  social_youtube TEXT,
  social_twitter TEXT,
  social_instagram TEXT,
  post_count INTEGER DEFAULT 0,
  reputation_score INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. USER SESSIONS TABLE
CREATE TABLE community_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL FOREIGN KEY REFERENCES community_users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. BOARDS TABLE
CREATE TABLE community_boards (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT,
  is_locked BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. POSTS TABLE
CREATE TABLE community_posts (
  id TEXT PRIMARY KEY,
  board_id TEXT NOT NULL FOREIGN KEY REFERENCES community_boards(id),
  user_id TEXT NOT NULL FOREIGN KEY REFERENCES community_users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  external_url TEXT,
  url_domain TEXT,
  embed_type TEXT DEFAULT 'none', -- 'youtube', 'instagram', 'twitter', 'website', 'image', 'none'
  status TEXT NOT NULL DEFAULT 'published', -- 'published', 'pending_review', 'removed'
  views_count INTEGER DEFAULT 0,
  upvotes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. COMMENTS TABLE
CREATE TABLE community_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL FOREIGN KEY REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL FOREIGN KEY REFERENCES community_users(id),
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. REACTIONS TABLE
CREATE TABLE community_reactions (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL FOREIGN KEY REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL FOREIGN KEY REFERENCES community_users(id),
  reaction_type TEXT NOT NULL DEFAULT 'upvote',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id)
);

-- 8. REPORTS TABLE
CREATE TABLE community_reports (
  id TEXT PRIMARY KEY,
  reporter_user_id TEXT NOT NULL FOREIGN KEY REFERENCES community_users(id),
  target_type TEXT NOT NULL, -- 'post', 'comment', 'user'
  target_id TEXT NOT NULL,
  reason TEXT NOT NULL, -- 'spam', 'adult', 'malware', 'harassment', 'other'
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'resolved', 'dismissed'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. DENIED DOMAINS DENYLIST
CREATE TABLE community_blocked_domains (
  id TEXT PRIMARY KEY,
  domain TEXT UNIQUE NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_posts_board ON community_posts(board_id, status, created_at DESC);
CREATE INDEX idx_posts_user ON community_posts(user_id);
CREATE INDEX idx_comments_post ON community_comments(post_id, created_at ASC);
CREATE INDEX idx_sessions_token ON community_sessions(session_token);
```

---

## 12. Community Board Taxonomy
Propose 9 initial clean, scalable boards:
1. `creator-promotion` — **Creator Promotion** (YouTube Channels, Instagram Profiles, Portfolios)
2. `youtube-promotion` — **YouTube Promotion** (Videos, Shorts, Live Streams)
3. `social-media-promotion` — **Social Media Promotion** (Reels, Tweets, Posts)
4. `websites-blogs` — **Websites & Blogs** (Websites, Personal Blogs, Portfolios)
5. `business-promotion` — **Business Promotion** (Startups, Products, SaaS Tools)
6. `ai-technology` — **AI & Technology** (AI Tools, Coding, Software Discussions)
7. `gaming` — **Gaming** (Clips, Guides, Discussions)
8. `deals-offers` — **Deals & Offers** (Promotional Sales, Coupons, Discounts)
9. `general-discussion` — **General Discussion** (Open Community Chat)

---

## 13. Post Architecture
- Post Form: Title, Board Selector, Content (Markdown/Text), Optional External Link.
- Validation: Title 10-150 chars, Content 20-5000 chars, External Link HTTP/HTTPS validated.

---

## 14. Comment Architecture
- Single-level / Flat Comment System MVP ke liye select kiya gaya hai queries fast aur simple rakhne ke liye.
- Rate limit: Max 5 comments per minute per user.

---

## 15. Reaction Architecture
- Simple 1-Click Upvote system.
- Unique constraint `UNIQUE(post_id, user_id)` double-upvoting prevent karti hai.

---

## 16. External Link Architecture
- Strictly `http://` aur `https://` URLs allowed.
- `javascript:`, `data:`, `file:`, `vbscript:` protocols automatically reject honge.
- User-submitted links link attributes: `rel="ugc nofollow noopener noreferrer"`.

---

## 17. External Media/Embed Architecture
- **No Arbitrary HTML / iFrames:** User-submitted iFrames or embed scripts reject honge.
- **Click-to-Load / Safe Embed Cards:**
  - YouTube URLs: Extract video ID -> Render privacy-enhanced `https://www.youtube-nocookie.com/embed/{id}` click-to-play.
  - Instagram URLs: Render safe metadata card with thumbnail preview.
  - Twitter/X URLs: Render structured preview card.
  - Websites: Open Graph preview card (Title, Description, Favicon, Domain).

---

## 18. Adult Content Protection
- Multi-layer defense:
  1. Automated Domain Denylist Check against known adult / explicit hosts.
  2. Keywords heuristic scanner for explicit title/content terms.
  3. Community Reporting system with auto-quarantine when threshold reached.
  4. Manual Moderator Queue.

---

## 19. Malicious Link Protection
- Denylist scanning for phishing, malware, scam, and crypto-fake domains.
- Suspicious domains auto-flagged as `pending_review`.

---

## 20. Spam Protection
- Account Age & Trust Level restrictions.
- Post Creation Cooldown: 2 minutes between posts for new users.
- Daily Posting Cap: Max 5 posts per day for Trust Level 1.
- Duplicate URL Detection: Same external URL cannot be posted multiple times in a short window.

---

## 21. Rate Limiting
Cloudflare Workers IP + Session based Rate Limiter:
- Login: 5 requests / minute
- Signup: 3 requests / hour
- Post Creation: 1 request / 2 minutes
- Comment Creation: 5 requests / minute

---

## 22. Bot Protection
- Integration of **Cloudflare Turnstile** on Signup, Login, and Post Creation forms.

---

## 23. Trust Level System
1. **Level 1 (New User):** Cooldown 2 min, max 5 posts/day, links scanned.
2. **Level 2 (Member):** 5+ posts, 3 days account age, instant publishing.
3. **Level 3 (Trusted):** High reputation, no captcha challenges.
4. **Level 4 (Moderator/Admin):** Content management privileges.

---

## 24. Affiliate Link Policy
- User-submitted external links retain user ownership.
- User links will NOT be converted to Axevora Cuelinks links.
- Axevora Cuelinks monetization stays strictly isolated in the Commerce Section.

---

## 25. SEO Link Policy
- All UGC links rendered with `rel="ugc nofollow noopener noreferrer"` to prevent spam indexing abuse.

---

## 26. Report System
- Report options on every post/comment: `Spam`, `Adult Content`, `Scam`, `Harassment`, `Other`.
- Auto-flag post to `pending_review` if reports count >= 3.

---

## 27. Moderation System
- Moderator Actions: Approve, Remove, Lock, Ban User, Add Blocked Domain.
- Audit Log stored in D1.

---

## 28. Admin/Moderator Architecture
- Role-based permissions (`role = 'admin'` or `'moderator'`) validated server-side on Pages Functions endpoints.

---

## 29. SSRF Protection
- Outbound link metadata fetchers strictly block Private IP ranges (`127.0.0.1`, `10.0.0.0/8`, `192.168.0.0/16`, `169.254.169.254`, `localhost`).

---

## 30. XSS Protection
- All text rendered via React JSX (automatically HTML-escaped).
- Optional Markdown parsed using `DOMPurify` / safe sanitizer.

---

## 31. CSRF Protection
- Custom Header (`X-Axevora-CSRF`) check for state-changing requests + `SameSite=Lax` cookies.

---

## 32. SQL Injection Protection
- 100% Parameterized SQL Queries using D1 binding prepared statements (`db.prepare("SELECT ... WHERE id = ?").bind(id)`).

---

## 33. CSP/Security Headers
- Content Security Policy (CSP) updated to allow `https://www.youtube-nocookie.com`, `https://logo.clearbit.com`, `https://www.google.com`.

---

## 34. Privacy Architecture
- Minimal data collection: Username, Email, Hashed Password. No phone, location, or tracking.

---

## 35. User Account Deletion
- Self-service "Delete Account" button: Anonymizes post authorship (`[Deleted User]`) and purges credentials & sessions.

---

## 36. Community Guidelines Requirements
- Clear guidelines against adult content, harassment, malware, scam links, and spam.

---

## 37. Community UX
- Modern, clean layout matching Axevora design system (Indigo/Dark glassmorphic accents).

---

## 38. Mobile UX
- Fully responsive mobile drawer navigation, sticky post actions, touch-friendly buttons.

---

## 39. Homepage Integration
- A compact "Community Highlights & Latest Discussions" widget added to homepage without disrupting Tools, Games, Product Analyzer, or Commerce Cards.

---

## 40. Search Strategy
- D1 SQL `LIKE` query search on `title` and `content` for MVP.

---

## 41. Pagination Strategy
- Cursor-based / Page-based SQL Limit Offset pagination (`LIMIT 20 OFFSET ?`).

---

## 42. Performance Strategy
- Lazy loading for images, click-to-load embeds, D1 query indexing, client React Query caching.

---

## 43. External Embed Performance
- Embeds do NOT auto-load scripts on feed load; cards use static thumbnails with click-to-play triggers.

---

## 44. Threat Model Summary
| Threat | Risk | Mitigation | Priority |
| :--- | :--- | :--- | :--- |
| Credential Stuffing / Brute Force | High | Rate Limiter + Turnstile | MVP |
| Stored XSS | Critical | React Auto-escaping + DOMPurify | MVP |
| SQL Injection | Critical | Parameterized D1 Statements | MVP |
| Spam Bot Mass Posting | High | Rate Limit + Trust Level + Turnstile | MVP |
| Adult / Malicious Link Posting | High | Domain Denylist + Report Queue | MVP |
| SSRF via Link Preview | High | Private IP Blocklist in Worker | MVP |

---

## 45. MVP MUST HAVE
- D1 Database Schema + Migrations
- Auth Signup / Login / Logout API & Client Forms
- Community Boards & Feed Page (`/community`, `/community/board/:slug`)
- Create Post & Comment Form (`/community/post/:id`)
- Basic Upvote & Report Action
- Domain Denylist & Rate Limiting

---

## 46. SHOULD HAVE SOON
- Click-to-Play YouTube/Instagram embed cards
- User Public Profile (`/community/user/:username`)
- Trust Level auto-escalation

---

## 47. FUTURE FEATURES
- Email OTP Verification
- Advanced AI-based Automated Content Moderation API
- Real-time notification webhooks

---

## 48. Cost/Infrastructure Analysis
- **Cloudflare D1:** Free tier includes 5 Million read operations/day & 100k write operations/day (Zero extra cost for MVP).
- **Cloudflare Pages Functions:** 100k requests/day free tier.
- **Total MVP Hosting Cost:** $0 / Month.

---

## 49. Files Proposed To Create
- `functions/api/community/auth/signup.ts`
- `functions/api/community/auth/login.ts`
- `functions/api/community/auth/logout.ts`
- `functions/api/community/auth/me.ts`
- `functions/api/community/boards.ts`
- `functions/api/community/posts/index.ts`
- `functions/api/community/posts/[id].ts`
- `functions/api/community/comments.ts`
- `functions/api/community/reactions.ts`
- `functions/api/community/reports.ts`
- `src/modules/community/pages/CommunityHome.tsx`
- `src/modules/community/pages/BoardFeed.tsx`
- `src/modules/community/pages/PostDetail.tsx`
- `src/modules/community/pages/CreatePost.tsx`
- `src/modules/community/components/CommunityNavbar.tsx`
- `src/modules/community/components/PostCard.tsx`
- `src/modules/community/components/ShareModal.tsx`
- `src/modules/community/services/CommunityService.ts`

---

## 50. Files Proposed To Modify
- `src/App.tsx` (Add `/community` routes)
- `wrangler.toml` (Add D1 database binding `COMMUNITY_DB`)
- `src/components/Header.tsx` (Add Community navigation link)
- `src/pages/Index.tsx` (Add Community Highlights section)

---

## 51. D1 Migrations Proposed
- `migrations/0001_create_community_tables.sql` (Creates users, profiles, sessions, boards, posts, comments, reactions, reports, blocked_domains tables and indexes).

---

## 52. API Endpoints Proposed
- `POST /api/community/auth/signup`
- `POST /api/community/auth/login`
- `POST /api/community/auth/logout`
- `GET /api/community/auth/me`
- `GET /api/community/boards`
- `GET /api/community/posts`
- `POST /api/community/posts`
- `GET /api/community/posts/:id`
- `POST /api/community/comments`
- `POST /api/community/reactions`
- `POST /api/community/reports`

---

## 53. Detailed Phase-by-Phase Implementation Plan

### Phase 1A: Foundation & Database Setup
- Bind Cloudflare D1 database in `wrangler.toml`.
- Write `migrations/0001_create_community_tables.sql` and initialize D1 tables.

### Phase 1B: Authentication & User Profiles
- Implement `signup.ts`, `login.ts`, `logout.ts`, `me.ts` in Pages Functions.
- Implement client Auth modal and session state hook.

### Phase 1C: Board & Post Engine
- Seed 9 initial boards.
- Implement Create Post form and Feed APIs.
- Build UI for `/community`, `/community/board/:slug`, `/community/post/:id`.

### Phase 1D: Comments & Upvotes
- Implement Comment creation and 1-click Upvote APIs.
- Build UI components for comment thread and upvote counter.

### Phase 1E: Link Preview & Embed Security
- Implement safe OpenGraph URL preview parser and YouTube/Instagram embed cards.

### Phase 1F: Moderation, Reports & Security
- Implement Rate Limiting, Turnstile, Denylist scanning, and Report submission APIs.

### Phase 1G: Homepage Integration & Polish
- Integrate Community Widget on Homepage and perform end-to-end audit.

---

## 54. Existing Axevora Systems Preservation Confirmation
CONFIRMED. Existing Utility Tools, Games, Product Analyzer, Cuelinks Commerce Cards, Affiliate CTAs, Tracked Share Links, Amazon Affiliate tags (`axevora06-21`), and Recommendation Engines par zero impact hoga.

---

## 55. Cuelinks/User Links Separation Confirmation
CONFIRMED. User-submitted promotional links untouched rahenge. Unhe Cuelinks links me convert nahi kiya jayega. Axevora Commerce Section ka affiliate architecture completely separate rahega.

---

## 56. Risks & Blockers
- None. Cloudflare D1 database binding CLI initialization required on deployment.

---

## 57. Founder Decisions Required Before Implementation
1. Confirm initial 9 board names & taxonomy.
2. Approve D1 database integration.
3. Confirm permission to begin Phase 1A implementation prompt.

---

## 58. Recommended First Implementation Phase
**Phase 1A: Foundation, D1 Binding & Database Schema Migration**.

---

====================================================================
FINAL CLASSIFICATION
====================================================================

COMMUNITY PHASE 1 ARCHITECTURE READY — AWAITING FOUNDER APPROVAL
