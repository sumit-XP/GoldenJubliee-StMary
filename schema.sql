-- St. Mary's Golden Jubilee Cloudflare D1 Database Schema

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  venue TEXT,
  category TEXT,
  description TEXT,
  chiefGuest TEXT,
  rsvpCount INTEGER DEFAULT 0,
  highlight INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS timeline (
  id TEXT PRIMARY KEY,
  year INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  era TEXT,
  iconType TEXT,
  badge TEXT
);

CREATE TABLE IF NOT EXISTS contributions (
  id TEXT PRIMARY KEY,
  receiptNumber TEXT NOT NULL,
  donorName TEXT NOT NULL,
  role TEXT,
  batchYear TEXT,
  email TEXT,
  phone TEXT,
  amount REAL NOT NULL,
  tier TEXT,
  paymentMethod TEXT,
  paymentRef TEXT,
  message TEXT,
  isAnonymous INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL,
  screenshotUrl TEXT,
  utrNumber TEXT,
  upiId TEXT,
  receiverName TEXT,
  status TEXT DEFAULT 'completed'
);

CREATE TABLE IF NOT EXISTS wishes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  batchYear TEXT,
  role TEXT,
  city TEXT,
  message TEXT NOT NULL,
  createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS jubilee_tributes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  studentDetails TEXT,
  batchOrSubject TEXT,
  contact TEXT,
  note TEXT NOT NULL,
  mediaType TEXT NOT NULL, -- 'photo' | 'video'
  driveUrl TEXT NOT NULL,
  driveFileId TEXT,
  videoDurationSeconds INTEGER,
  status TEXT DEFAULT 'approved', -- 'pending' | 'approved'
  createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  active INTEGER DEFAULT 1,
  type TEXT DEFAULT 'info'
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Performance indices for high-traffic production lookups
CREATE INDEX IF NOT EXISTS idx_contributions_email ON contributions(email);
CREATE INDEX IF NOT EXISTS idx_contributions_created ON contributions(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_wishes_created ON wishes(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_tributes_created ON jubilee_tributes(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date ASC);
CREATE INDEX IF NOT EXISTS idx_timeline_year ON timeline(year ASC);
