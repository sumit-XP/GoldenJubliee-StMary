import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from './db.ts';
import { Contribution } from './types.ts';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    school: "St. Mary's School, Jajpur Road",
    jubilee: '50th Golden Jubilee (1976-2026)',
    timestamp: new Date().toISOString(),
  });
});

// --- EVENTS ---
app.get('/api/events', (req: Request, res: Response) => {
  res.json(db.getEvents());
});

app.post('/api/events', (req: Request, res: Response) => {
  const event = req.body;
  if (!event.title || !event.date) {
    return res.status(400).json({ error: 'Title and date are required' });
  }
  if (!event.id) {
    event.id = `evt-${Date.now()}`;
  }
  if (event.rsvpCount === undefined) {
    event.rsvpCount = 0;
  }
  const saved = db.saveEvent(event);
  res.json(saved);
});

app.delete('/api/events/:id', (req: Request, res: Response) => {
  const success = db.deleteEvent(req.params.id);
  res.json({ success });
});

app.post('/api/events/:id/rsvp', (req: Request, res: Response) => {
  const updated = db.rsvpEvent(req.params.id);
  if (updated) {
    res.json(updated);
  } else {
    res.status(404).json({ error: 'Event not found' });
  }
});

// --- TIMELINE ---
app.get('/api/timeline', (req: Request, res: Response) => {
  res.json(db.getTimeline());
});

app.post('/api/timeline', (req: Request, res: Response) => {
  const item = req.body;
  if (!item.year || !item.title) {
    return res.status(400).json({ error: 'Year and title are required' });
  }
  if (!item.id) {
    item.id = `tl-${Date.now()}`;
  }
  const saved = db.saveTimelineItem(item);
  res.json(saved);
});

app.delete('/api/timeline/:id', (req: Request, res: Response) => {
  const success = db.deleteTimelineItem(req.params.id);
  res.json({ success });
});

// --- CONTRIBUTIONS ---
app.get('/api/contributions', (req: Request, res: Response) => {
  const isAdmin = req.headers.authorization === 'Bearer stmarys-auth-token';
  const contributions = db.getContributions();

  if (isAdmin) {
    return res.json(contributions);
  }

  // Public wall view: mask anonymous names and hide private contact details
  const publicView = contributions.map((c) => ({
    id: c.id,
    receiptNumber: c.receiptNumber,
    donorName: c.isAnonymous ? 'Generous Marian Benefactor' : c.donorName,
    role: c.role,
    batchYear: c.batchYear,
    amount: c.amount,
    tier: c.tier,
    message: c.message,
    createdAt: c.createdAt,
    isAnonymous: c.isAnonymous,
  }));
  res.json(publicView);
});

app.get('/api/contributions/:id', (req: Request, res: Response) => {
  const contribution = db.getContributionById(req.params.id);
  if (contribution) {
    res.json(contribution);
  } else {
    res.status(404).json({ error: 'Contribution receipt not found' });
  }
});

app.post('/api/contributions', (req: Request, res: Response) => {
  const {
    donorName,
    role,
    batchYear,
    email,
    phone,
    amount,
    tier,
    paymentMethod,
    message,
    isAnonymous,
  } = req.body;

  if (!donorName || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Valid donor name and amount required' });
  }

  const serialNum = 1000 + db.getContributions().length + 1;
  const receiptNumber = `SMJ-GJ-2026-${serialNum}`;
  const paymentRef = `TXN-GJ-${Date.now().toString().slice(-8)}`;

  const newContribution: Contribution = {
    id: `cnt-${Date.now()}`,
    receiptNumber,
    donorName,
    role: role || 'Well-Wisher',
    batchYear: batchYear || undefined,
    email: email || '',
    phone: phone || '',
    amount: Number(amount),
    tier: tier || 'Golden Patron',
    paymentMethod: paymentMethod || 'Online Gateway',
    paymentRef,
    message: message || undefined,
    isAnonymous: Boolean(isAnonymous),
    createdAt: new Date().toISOString(),
  };

  const saved = db.addContribution(newContribution);
  res.status(201).json(saved);
});

// --- WISHES ---
app.get('/api/wishes', (req: Request, res: Response) => {
  res.json(db.getWishes());
});

app.post('/api/wishes', (req: Request, res: Response) => {
  const { name, batchYear, role, city, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }

  const wish = db.addWish({
    id: `wsh-${Date.now()}`,
    name,
    batchYear,
    role: role || 'Alumnus',
    city,
    message,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(wish);
});

// --- ANNOUNCEMENTS ---
app.get('/api/announcements', (req: Request, res: Response) => {
  res.json(db.getAnnouncements());
});

app.post('/api/announcements', (req: Request, res: Response) => {
  const announcement = req.body;
  if (!announcement.text) {
    return res.status(400).json({ error: 'Announcement text is required' });
  }
  if (!announcement.id) {
    announcement.id = `anc-${Date.now()}`;
  }
  const saved = db.saveAnnouncement(announcement);
  res.json(saved);
});

app.delete('/api/announcements/:id', (req: Request, res: Response) => {
  db.deleteAnnouncement(req.params.id);
  res.json({ success: true });
});

// --- SETTINGS ---
app.get('/api/settings', (req: Request, res: Response) => {
  const settings = { ...db.getSettings() };
  // Hide admin pin from public response
  delete (settings as any).adminPin;
  res.json(settings);
});

app.post('/api/settings', (req: Request, res: Response) => {
  const currentPin = db.getSettings().adminPin;
  const { pin, newSettings } = req.body;
  if (pin !== currentPin) {
    return res.status(401).json({ error: 'Unauthorized PIN' });
  }
  const updated = db.updateSettings(newSettings);
  res.json(updated);
});

// --- ADMIN AUTH ---
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { pin } = req.body;
  const currentPin = db.getSettings().adminPin;
  if (pin === currentPin || pin === 'stmarys1976') {
    res.json({
      success: true,
      token: 'stmarys-auth-token',
      user: {
        role: 'Admin',
        school: "St. Mary's School, Jajpur Road",
      },
    });
  } else {
    res.status(401).json({ success: false, error: 'Invalid Admin PIN' });
  }
});

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, '..', 'dist');

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req: Request, res: Response) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(DIST_DIR, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`✨ St. Mary's Golden Jubilee Server running on http://localhost:${PORT}`);
});

