-- AXEVORA COMMUNITY ENGINE - MIGRATION 0004: EMAIL VERIFICATION & DISPOSABLE EMAIL PROTECTION
-- Database Engine: Cloudflare D1 (SQLite)

-- 1. Email verification token store (cryptographically secure, single-use, hashed)
CREATE TABLE IF NOT EXISTS community_email_verifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES community_users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_verify_token ON community_email_verifications(token_hash);
CREATE INDEX IF NOT EXISTS idx_verify_user ON community_email_verifications(user_id, used_at);

-- 2. Disposable / temporary email domain blocklist
CREATE TABLE IF NOT EXISTS community_blocked_email_domains (
  domain TEXT PRIMARY KEY,
  reason TEXT NOT NULL DEFAULT 'disposable',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seed: Known disposable / temporary email providers
INSERT OR IGNORE INTO community_blocked_email_domains (domain, reason) VALUES
  ('10minutemail.com', 'disposable'), ('mailinator.com', 'disposable'),
  ('guerrillamail.com', 'disposable'), ('guerrillamail.info', 'disposable'),
  ('guerrillamail.biz', 'disposable'), ('guerrillamail.de', 'disposable'),
  ('guerrillamail.net', 'disposable'), ('guerrillamail.org', 'disposable'),
  ('temp-mail.org', 'disposable'), ('throwaway.email', 'disposable'),
  ('yopmail.com', 'disposable'), ('sharklasers.com', 'disposable'),
  ('spam4.me', 'disposable'), ('trashmail.com', 'disposable'),
  ('trashmail.me', 'disposable'), ('trashmail.net', 'disposable'),
  ('trashmail.at', 'disposable'), ('dispostable.com', 'disposable'),
  ('mailnull.com', 'disposable'), ('maildrop.cc', 'disposable'),
  ('spamgourmet.com', 'disposable'), ('spamgourmet.net', 'disposable'),
  ('spamgourmet.org', 'disposable'), ('fakeinbox.com', 'disposable'),
  ('getairmail.com', 'disposable'), ('discard.email', 'disposable'),
  ('tempr.email', 'disposable'), ('anonaddy.com', 'disposable'),
  ('tempinbox.com', 'disposable'), ('emailondeck.com', 'disposable'),
  ('mohmal.com', 'disposable'), ('throwam.com', 'disposable'),
  ('meltmail.com', 'disposable'), ('tempemail.net', 'disposable'),
  ('spamoff.de', 'disposable'), ('ieatspam.eu', 'disposable'),
  ('spamfree24.org', 'disposable'), ('mailnesia.com', 'disposable'),
  ('mytemp.email', 'disposable'), ('tempmail.com', 'disposable'),
  ('getnada.com', 'disposable'), ('harakirimail.com', 'disposable'),
  ('mailfreeonline.com', 'disposable'), ('spambog.com', 'disposable'),
  ('trashdevil.com', 'disposable'), ('trashdevil.de', 'disposable');
