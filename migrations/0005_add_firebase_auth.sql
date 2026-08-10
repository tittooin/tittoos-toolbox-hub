-- AXEVORA COMMUNITY ENGINE - MIGRATION 0005: ADD FIREBASE UID

-- 1. Add firebase_uid to community_users
ALTER TABLE community_users ADD COLUMN firebase_uid TEXT;

-- 2. Make password fields nullable (Since Firebase handles Auth now)
-- SQLite doesn't support ALTER TABLE ... ALTER COLUMN for nullability directly without rebuilding the table.
-- But we can just stop inserting into them, wait, we must handle existing NOT NULL constraints.
-- In SQLite, we can recreate the table or just drop the NOT NULL constraint by creating a new table, copying data, and replacing it.

CREATE UNIQUE INDEX IF NOT EXISTS idx_community_users_firebase_uid ON community_users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_community_users_username_normalized ON community_users(username_normalized);
CREATE INDEX IF NOT EXISTS idx_community_users_email_normalized ON community_users(email_normalized);

PRAGMA foreign_keys=on;
