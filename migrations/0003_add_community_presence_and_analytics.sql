-- AXEVORA COMMUNITY ENGINE - MIGRATION 0003: PRESENCE & AGGREGATE PRODUCT ANALYTICS
-- Database Engine: Cloudflare D1 (SQLite)

-- 1. Add last_active_at to community_users for lightweight presence
ALTER TABLE community_users ADD COLUMN last_active_at TEXT;

-- 2. Create index on last_active_at for sub-millisecond presence queries
CREATE INDEX IF NOT EXISTS idx_community_users_last_active ON community_users(last_active_at);

-- 3. Create aggregate analytics table for non-invasive product metrics
CREATE TABLE IF NOT EXISTS community_analytics_daily (
  event_date TEXT PRIMARY KEY, -- YYYY-MM-DD
  guest_views INTEGER NOT NULL DEFAULT 0,
  guest_conversions INTEGER NOT NULL DEFAULT 0,
  video_plays INTEGER NOT NULL DEFAULT 0,
  partner_clicks INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seed current date row
INSERT OR IGNORE INTO community_analytics_daily (event_date, guest_views, guest_conversions, video_plays, partner_clicks)
VALUES (date('now'), 0, 0, 0, 0);
