-- AXEVORA COMMUNITY ENGINE - MIGRATION 0001: FOUNDATION SCHEMA & OFFICIAL BOARDS SEED
-- Database Engine: Cloudflare D1 (SQLite)

-- 1. COMMUNITY USERS TABLE (Platform User Account & Password Metadata)
CREATE TABLE IF NOT EXISTS community_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  username_normalized TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  email_normalized TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT,
  password_algorithm TEXT NOT NULL DEFAULT 'pbkdf2-sha256',
  password_iterations INTEGER NOT NULL DEFAULT 100000,
  password_version INTEGER NOT NULL DEFAULT 1,
  platform_role TEXT NOT NULL DEFAULT 'user', -- 'user', 'platform_moderator', 'platform_admin'
  trust_level INTEGER NOT NULL DEFAULT 1, -- 1: New User, 2: Member, 3: Trusted Member
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'suspended', 'banned'
  email_verified INTEGER NOT NULL DEFAULT 0, -- 0: false, 1: true
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_login_at TEXT
);

-- 2. COMMUNITY PROFILES TABLE (Public User Profile Information)
CREATE TABLE IF NOT EXISTS community_profiles (
  user_id TEXT PRIMARY KEY,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT, -- External URL only (No Base64 / Binary Image BLOBs)
  website_url TEXT,
  social_youtube TEXT,
  social_twitter TEXT,
  social_instagram TEXT,
  post_count INTEGER NOT NULL DEFAULT 0,
  reputation_score INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES community_users(id) ON DELETE CASCADE
);

-- 3. COMMUNITY SESSIONS TABLE (Hashed Session Tokens - Privacy First)
CREATE TABLE IF NOT EXISTS community_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  session_token_hash TEXT UNIQUE NOT NULL, -- Cryptographic Hash only (Raw Token NEVER stored)
  user_agent TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_used_at TEXT NOT NULL DEFAULT (datetime('now')),
  revoked_at TEXT,
  FOREIGN KEY (user_id) REFERENCES community_users(id) ON DELETE CASCADE
);

-- 4. COMMUNITY BOARDS TABLE (Official & User-Created Boards Foundation)
CREATE TABLE IF NOT EXISTS community_boards (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  board_type TEXT NOT NULL DEFAULT 'official', -- 'official', 'user_created'
  owner_user_id TEXT, -- NULL for Official Boards, Required for User-Created Boards
  visibility TEXT NOT NULL DEFAULT 'public', -- 'public', 'unlisted', 'private'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'suspended', 'archived', 'removed'
  icon_name TEXT DEFAULT 'MessageSquare',
  rules_text TEXT,
  is_locked INTEGER NOT NULL DEFAULT 0, -- 0: false, 1: true
  member_count INTEGER NOT NULL DEFAULT 0,
  post_count INTEGER NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0, -- Needed for Seed Insertion
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (owner_user_id) REFERENCES community_users(id) ON DELETE SET NULL
);

-- 5. COMMUNITY BOARD MEMBERSHIP TABLE (Board-Level Roles & Memberships)
CREATE TABLE IF NOT EXISTS community_board_members (
  id TEXT PRIMARY KEY,
  board_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  board_role TEXT NOT NULL DEFAULT 'member', -- 'member', 'moderator', 'admin', 'owner'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'muted', 'banned', 'left'
  joined_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(board_id, user_id),
  FOREIGN KEY (board_id) REFERENCES community_boards(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES community_users(id) ON DELETE CASCADE
);

-- 6. COMMUNITY POSTS TABLE (Text Content & Validated External URLs Only)
CREATE TABLE IF NOT EXISTS community_posts (
  id TEXT PRIMARY KEY,
  board_id TEXT NOT NULL,
  user_id TEXT, -- Nullable to support ON DELETE SET NULL (anonymizes deleted author content)
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  external_url TEXT,
  url_domain TEXT,
  embed_type TEXT NOT NULL DEFAULT 'none', -- 'none', 'youtube', 'instagram', 'twitter', 'website', 'image'
  status TEXT NOT NULL DEFAULT 'published', -- 'published', 'pending_review', 'removed'
  views_count INTEGER NOT NULL DEFAULT 0,
  upvotes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (board_id) REFERENCES community_boards(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES community_users(id) ON DELETE SET NULL
);

-- 7. COMMUNITY COMMENTS TABLE (Flat Thread Comments)
CREATE TABLE IF NOT EXISTS community_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id TEXT, -- Nullable to support ON DELETE SET NULL (anonymizes deleted author content)
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published', -- 'published', 'pending_review', 'removed'
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES community_users(id) ON DELETE SET NULL
);

-- 8. COMMUNITY REACTIONS TABLE (1-Click Upvotes)
CREATE TABLE IF NOT EXISTS community_reactions (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  reaction_type TEXT NOT NULL DEFAULT 'upvote',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES community_users(id) ON DELETE CASCADE
);

-- 9. COMMUNITY REPORTS TABLE (Risk & Moderation Queue Signals)
CREATE TABLE IF NOT EXISTS community_reports (
  id TEXT PRIMARY KEY,
  reporter_user_id TEXT, -- Nullable to support ON DELETE SET NULL
  target_type TEXT NOT NULL, -- 'post', 'comment', 'user', 'board'
  target_id TEXT NOT NULL,
  reason TEXT NOT NULL, -- 'spam', 'adult_content', 'scam', 'malware', 'harassment', 'impersonation', 'illegal_content', 'other'
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'resolved', 'dismissed'
  reviewed_by TEXT,
  reviewed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (reporter_user_id) REFERENCES community_users(id) ON DELETE SET NULL,
  FOREIGN KEY (reviewed_by) REFERENCES community_users(id) ON DELETE SET NULL
);

-- 10. COMMUNITY MODERATION ACTIONS TABLE (Platform & Board Audit Trail)
CREATE TABLE IF NOT EXISTS community_moderation_actions (
  id TEXT PRIMARY KEY,
  actor_user_id TEXT, -- Nullable to support ON DELETE SET NULL
  scope_type TEXT NOT NULL DEFAULT 'platform', -- 'platform', 'board'
  board_id TEXT, -- Nullable to support ON DELETE SET NULL
  target_type TEXT NOT NULL, -- 'post', 'comment', 'user', 'board', 'domain'
  target_id TEXT NOT NULL,
  action_type TEXT NOT NULL, -- 'remove_post', 'restore_post', 'lock_post', 'remove_comment', 'board_ban', 'board_unban', 'platform_suspend', 'platform_ban', 'block_domain'
  reason TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (actor_user_id) REFERENCES community_users(id) ON DELETE SET NULL,
  FOREIGN KEY (board_id) REFERENCES community_boards(id) ON DELETE SET NULL
);

-- 11. COMMUNITY BLOCKED DOMAINS TABLE (Global Platform Safety Denylist)
CREATE TABLE IF NOT EXISTS community_blocked_domains (
  id TEXT PRIMARY KEY,
  domain TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, -- 'adult', 'malware', 'phishing', 'scam', 'spam', 'dangerous_download', 'other'
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'inactive'
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (created_by) REFERENCES community_users(id) ON DELETE SET NULL
);

-- HIGH-PERFORMANCE INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_users_username ON community_users(username_normalized);
CREATE INDEX IF NOT EXISTS idx_users_email ON community_users(email_normalized);
CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON community_sessions(session_token_hash);
CREATE INDEX IF NOT EXISTS idx_boards_slug ON community_boards(slug);
CREATE INDEX IF NOT EXISTS idx_boards_type ON community_boards(board_type, status);
CREATE INDEX IF NOT EXISTS idx_board_members_lookup ON community_board_members(board_id, user_id);
CREATE INDEX IF NOT EXISTS idx_posts_board_feed ON community_posts(board_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_user ON community_posts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post ON community_comments(post_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_reactions_post ON community_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_reports_queue ON community_reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_moderation_actions_actor ON community_moderation_actions(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_blocked_domains_lookup ON community_blocked_domains(domain);

-- 12. IDEMPOTENT SEED DATA FOR 9 OFFICIAL AXEVORA BOARDS
INSERT OR IGNORE INTO community_boards (id, name, slug, description, board_type, owner_user_id, visibility, status, icon_name, display_order)
VALUES 
  ('board-official-1', 'Creator Promotion', 'creator-promotion', 'Share and showcase your creator profile, YouTube channels, Instagram accounts, and portfolios.', 'official', NULL, 'public', 'active', 'UserCheck', 1),
  ('board-official-2', 'YouTube Promotion', 'youtube-promotion', 'Promote your latest YouTube videos, Shorts, live streams, and channel updates.', 'official', NULL, 'public', 'active', 'Youtube', 2),
  ('board-official-3', 'Social Media Promotion', 'social-media-promotion', 'Share your Instagram Reels, X/Twitter posts, TikTok clips, and social updates.', 'official', NULL, 'public', 'active', 'Share2', 3),
  ('board-official-4', 'Websites & Blogs', 'websites-blogs', 'Showcase your websites, personal blogs, SaaS platforms, and online tools.', 'official', NULL, 'public', 'active', 'Globe', 4),
  ('board-official-5', 'Business Promotion', 'business-promotion', 'Promote your business services, startups, digital products, and brand launches.', 'official', NULL, 'public', 'active', 'Briefcase', 5),
  ('board-official-6', 'AI & Technology', 'ai-technology', 'Discuss AI tools, software development, technology news, and developer discussions.', 'official', NULL, 'public', 'active', 'Cpu', 6),
  ('board-official-7', 'Gaming', 'gaming', 'Share gaming clips, game reviews, strategies, esports, and gaming discussions.', 'official', NULL, 'public', 'active', 'Gamepad2', 7),
  ('board-official-8', 'Deals & Offers', 'deals-offers', 'Share legitimate promotional deals, sales, coupons, and shopping discounts.', 'official', NULL, 'public', 'active', 'Tag', 8),
  ('board-official-9', 'General Discussion', 'general-discussion', 'Open forum for general discussions, community introductions, and feedback.', 'official', NULL, 'public', 'active', 'MessageSquare', 9);
