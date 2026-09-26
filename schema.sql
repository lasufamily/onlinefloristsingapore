CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  occasion TEXT,
  product TEXT,
  budget TEXT,
  delivery_date TEXT NOT NULL,
  delivery_postal_code TEXT NOT NULL,
  message TEXT,
  consent INTEGER NOT NULL CHECK (consent = 1),
  page_path TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  ip_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new'
);

CREATE INDEX IF NOT EXISTS enquiries_ip_created_at
  ON enquiries (ip_hash, created_at);

CREATE INDEX IF NOT EXISTS enquiries_created_at
  ON enquiries (created_at DESC);
