-- AXEVORA COMMUNITY ENGINE - MIGRATION 0002: USER IDENTITY FOUNDATION
-- Database Engine: Cloudflare D1 (SQLite)

-- 1. Extend community_profiles table for future-ready Axevora Identity
ALTER TABLE community_profiles ADD COLUMN cover_image TEXT;
ALTER TABLE community_profiles ADD COLUMN social_facebook TEXT;
ALTER TABLE community_profiles ADD COLUMN social_github TEXT;
ALTER TABLE community_profiles ADD COLUMN social_linkedin TEXT;
ALTER TABLE community_profiles ADD COLUMN followers INTEGER NOT NULL DEFAULT 0;
ALTER TABLE community_profiles ADD COLUMN following INTEGER NOT NULL DEFAULT 0;
ALTER TABLE community_profiles ADD COLUMN verified_creator INTEGER NOT NULL DEFAULT 0; -- 0: false, 1: true
ALTER TABLE community_profiles ADD COLUMN badges TEXT; -- JSON array of badge IDs/Names
ALTER TABLE community_profiles ADD COLUMN reputation INTEGER NOT NULL DEFAULT 0;
ALTER TABLE community_profiles ADD COLUMN last_seen TEXT;
ALTER TABLE community_profiles ADD COLUMN profile_visibility TEXT NOT NULL DEFAULT 'public'; -- 'public', 'private', 'friends_only'
ALTER TABLE community_profiles ADD COLUMN profile_slug TEXT;
CREATE UNIQUE INDEX idx_community_profiles_slug ON community_profiles(profile_slug);

-- 2. Create community_username_history table for auditing username changes
CREATE TABLE IF NOT EXISTS community_username_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  old_username TEXT NOT NULL,
  new_username TEXT NOT NULL,
  changed_at TEXT NOT NULL DEFAULT (datetime('now')),
  changed_by TEXT NOT NULL, -- 'user', 'admin'
  FOREIGN KEY (user_id) REFERENCES community_users(id) ON DELETE CASCADE
);

-- 3. Create community_profile_audit table for tracking important profile edits
CREATE TABLE IF NOT EXISTS community_profile_audit (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  field_changed TEXT NOT NULL, -- 'avatar', 'bio', 'display_name', etc.
  old_value TEXT,
  new_value TEXT,
  changed_at TEXT NOT NULL DEFAULT (datetime('now')),
  changed_by TEXT NOT NULL, -- 'user', 'admin'
  FOREIGN KEY (user_id) REFERENCES community_users(id) ON DELETE CASCADE
);
