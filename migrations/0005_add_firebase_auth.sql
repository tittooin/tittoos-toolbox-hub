-- AXEVORA COMMUNITY ENGINE - MIGRATION 0005: ADD FIREBASE UID

-- 1. Add firebase_uid to community_users
ALTER TABLE community_users ADD COLUMN firebase_uid TEXT UNIQUE;

-- 2. Make password fields nullable (Since Firebase handles Auth now)
-- SQLite doesn't support ALTER TABLE ... ALTER COLUMN for nullability directly without rebuilding the table.
-- But we can just stop inserting into them, wait, we must handle existing NOT NULL constraints.
-- In SQLite, we can recreate the table or just drop the NOT NULL constraint by creating a new table, copying data, and replacing it.

PRAGMA foreign_keys=off;

BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS community_users_new (
  id TEXT PRIMARY KEY,
  firebase_uid TEXT UNIQUE,
  username TEXT UNIQUE NOT NULL,
  username_normalized TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  email_normalized TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  password_salt TEXT,
  password_algorithm TEXT DEFAULT 'pbkdf2-sha256',
  password_iterations INTEGER DEFAULT 100000,
  password_version INTEGER DEFAULT 1,
  platform_role TEXT NOT NULL DEFAULT 'user',
  trust_level INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active',
  email_verified INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_login_at TEXT
);

INSERT INTO community_users_new (
  id, username, username_normalized, email, email_normalized,
  password_hash, password_salt, password_algorithm, password_iterations, password_version,
  platform_role, trust_level, status, email_verified, created_at, updated_at, last_login_at
)
SELECT 
  id, username, username_normalized, email, email_normalized,
  password_hash, password_salt, password_algorithm, password_iterations, password_version,
  platform_role, trust_level, status, email_verified, created_at, updated_at, last_login_at
FROM community_users;

DROP TABLE community_users;
ALTER TABLE community_users_new RENAME TO community_users;

CREATE UNIQUE INDEX idx_community_users_firebase_uid ON community_users(firebase_uid);
CREATE INDEX idx_community_users_username_normalized ON community_users(username_normalized);
CREATE INDEX idx_community_users_email_normalized ON community_users(email_normalized);

COMMIT;

PRAGMA foreign_keys=on;
