-- AXEVORA COMMUNITY ENGINE - MIGRATION 0002: BOT AUTOMATION SCHEMA & BOT USERS SEED
-- Database Engine: Cloudflare D1 (SQLite)

-- 1. ALTER COMMUNITY USERS TABLE (Add actor_type & bot_type)
ALTER TABLE community_users ADD COLUMN actor_type TEXT NOT NULL DEFAULT 'user';
ALTER TABLE community_users ADD COLUMN bot_type TEXT;

-- 2. ALTER COMMUNITY POSTS TABLE (Add is_automated)
ALTER TABLE community_posts ADD COLUMN is_automated INTEGER NOT NULL DEFAULT 0;

-- 3. COMMUNITY BOT POST HISTORY TABLE (For 24h Rate Limiting & 7-Day Duplicate Offer Protection)
CREATE TABLE IF NOT EXISTS community_bot_post_history (
  id TEXT PRIMARY KEY,
  bot_user_id TEXT NOT NULL,
  board_id TEXT NOT NULL,
  offer_id TEXT NOT NULL,
  merchant_name TEXT NOT NULL,
  post_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  valid_until TEXT,
  FOREIGN KEY (bot_user_id) REFERENCES community_users(id),
  FOREIGN KEY (board_id) REFERENCES community_boards(id),
  FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_bot_history_lookup ON community_bot_post_history(board_id, offer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bot_history_rate ON community_bot_post_history(board_id, created_at DESC);

-- 4. COMMUNITY BOT SETTINGS TABLE (Admin Control Settings per Board)
CREATE TABLE IF NOT EXISTS community_bot_settings (
  board_id TEXT PRIMARY KEY,
  is_enabled INTEGER NOT NULL DEFAULT 1,
  max_posts_per_day INTEGER NOT NULL DEFAULT 1,
  allowed_categories TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (board_id) REFERENCES community_boards(id) ON DELETE CASCADE
);

-- 5. SEED BOT USER ACCOUNTS & PROFILES
INSERT OR IGNORE INTO community_users (id, username, username_normalized, email, email_normalized, password_hash, platform_role, trust_level, status, actor_type, bot_type)
VALUES
  ('bot-user-creator-deals', 'Axevora Creator Deals Bot', 'axevoracreatordealsbot', 'bot.creator@axevora.com', 'bot.creator@axevora.com', 'SYSTEM_BOT_NO_LOGIN', 'user', 3, 'active', 'bot', 'commerce'),
  ('bot-user-creator-gear', 'Axevora Creator Gear Bot', 'axevoracreatorgearbot', 'bot.gear@axevora.com', 'bot.gear@axevora.com', 'SYSTEM_BOT_NO_LOGIN', 'user', 3, 'active', 'bot', 'commerce'),
  ('bot-user-social-deals', 'Axevora Social Deals Bot', 'axevorasocialdealsbot', 'bot.social@axevora.com', 'bot.social@axevora.com', 'SYSTEM_BOT_NO_LOGIN', 'user', 3, 'active', 'bot', 'commerce'),
  ('bot-user-web-tools', 'Axevora Web Tools Bot', 'axevorawebtoolsbot', 'bot.webtools@axevora.com', 'bot.webtools@axevora.com', 'SYSTEM_BOT_NO_LOGIN', 'user', 3, 'active', 'bot', 'commerce'),
  ('bot-user-business-deals', 'Axevora Business Deals Bot', 'axevorabusinessdealsbot', 'bot.business@axevora.com', 'bot.business@axevora.com', 'SYSTEM_BOT_NO_LOGIN', 'user', 3, 'active', 'bot', 'commerce'),
  ('bot-user-tech-deals', 'Axevora Tech Deals Bot', 'axevoratechdealsbot', 'bot.tech@axevora.com', 'bot.tech@axevora.com', 'SYSTEM_BOT_NO_LOGIN', 'user', 3, 'active', 'bot', 'commerce'),
  ('bot-user-gaming-deals', 'Axevora Gaming Deals Bot', 'axevoragamingdealsbot', 'bot.gaming@axevora.com', 'bot.gaming@axevora.com', 'SYSTEM_BOT_NO_LOGIN', 'user', 3, 'active', 'bot', 'commerce'),
  ('bot-user-general-deals', 'Axevora Deals Bot', 'axevoradealsbot', 'bot.deals@axevora.com', 'bot.deals@axevora.com', 'SYSTEM_BOT_NO_LOGIN', 'user', 3, 'active', 'bot', 'commerce');

INSERT OR IGNORE INTO community_profiles (user_id, display_name, bio)
VALUES
  ('bot-user-creator-deals', 'Axevora Creator Deals Bot', 'Automated partner deals for creator tools, cameras, and software.'),
  ('bot-user-creator-gear', 'Axevora Creator Gear Bot', 'Automated partner deals for microphones, cameras, and studio gear.'),
  ('bot-user-social-deals', 'Axevora Social Deals Bot', 'Automated partner deals for mobile accessories and social media tools.'),
  ('bot-user-web-tools', 'Axevora Web Tools Bot', 'Automated partner deals for web hosting, domains, and SaaS tools.'),
  ('bot-user-business-deals', 'Axevora Business Deals Bot', 'Automated partner deals for business software, finance, and productivity.'),
  ('bot-user-tech-deals', 'Axevora Tech Deals Bot', 'Automated partner deals for electronics, AI tools, and tech products.'),
  ('bot-user-gaming-deals', 'Axevora Gaming Deals Bot', 'Automated partner deals for gaming gear, consoles, and accessories.'),
  ('bot-user-general-deals', 'Axevora Deals Bot', 'Automated partner deals for top verified offers.');

-- 6. SEED BOT SETTINGS FOR OFFICIAL BOARDS (General Discussion is 0/disabled)
INSERT OR IGNORE INTO community_bot_settings (board_id, is_enabled, max_posts_per_day)
VALUES
  ('board-official-1', 1, 1),
  ('board-official-2', 1, 1),
  ('board-official-3', 1, 1),
  ('board-official-4', 1, 1),
  ('board-official-5', 1, 1),
  ('board-official-6', 1, 1),
  ('board-official-7', 1, 1),
  ('board-official-8', 1, 1),
  ('board-official-9', 0, 0); -- General Discussion strictly disabled
