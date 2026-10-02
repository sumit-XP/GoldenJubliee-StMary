import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  JubileeEvent,
  TimelineItem,
  Contribution,
  AlumniWish,
  Announcement,
  JubileeSettings,
} from './types.ts';
import {
  initialEvents,
  initialTimeline,
  initialContributions,
  initialWishes,
  initialAnnouncements,
  initialSettings,
} from './seedData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface Schema {
  events: JubileeEvent[];
  timeline: TimelineItem[];
  contributions: Contribution[];
  wishes: AlumniWish[];
  announcements: Announcement[];
  settings: JubileeSettings;
}

function loadDb(): Schema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading db.json, resetting to seed data:', err);
  }

  const defaultDb: Schema = {
    events: initialEvents,
    timeline: initialTimeline,
    contributions: initialContributions,
    wishes: initialWishes,
    announcements: initialAnnouncements,
    settings: initialSettings,
  };

  saveDb(defaultDb);
  return defaultDb;
}

function saveDb(data: Schema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save to db.json:', err);
  }
}

export const db = {
  // Events
  getEvents: (): JubileeEvent[] => loadDb().events,
  saveEvent: (event: JubileeEvent): JubileeEvent => {
    const data = loadDb();
    const index = data.events.findIndex((e) => e.id === event.id);
    if (index >= 0) {
      data.events[index] = event;
    } else {
      data.events.push(event);
    }
    saveDb(data);
    return event;
  },
  deleteEvent: (id: string): boolean => {
    const data = loadDb();
    const initialLen = data.events.length;
    data.events = data.events.filter((e) => e.id !== id);
    saveDb(data);
    return data.events.length < initialLen;
  },
  rsvpEvent: (id: string): JubileeEvent | null => {
    const data = loadDb();
    const event = data.events.find((e) => e.id === id);
    if (event) {
      event.rsvpCount = (event.rsvpCount || 0) + 1;
      saveDb(data);
      return event;
    }
    return null;
  },

  // Timeline
  getTimeline: (): TimelineItem[] => {
    const items = loadDb().timeline;
    return items.sort((a, b) => a.year - b.year);
  },
  saveTimelineItem: (item: TimelineItem): TimelineItem => {
    const data = loadDb();
    const index = data.timeline.findIndex((t) => t.id === item.id);
    if (index >= 0) {
      data.timeline[index] = item;
    } else {
      data.timeline.push(item);
    }
    saveDb(data);
    return item;
  },
  deleteTimelineItem: (id: string): boolean => {
    const data = loadDb();
    const initialLen = data.timeline.length;
    data.timeline = data.timeline.filter((t) => t.id !== id);
    saveDb(data);
    return data.timeline.length < initialLen;
  },

  // Contributions
  getContributions: (): Contribution[] => {
    return loadDb().contributions.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
  addContribution: (contribution: Contribution): Contribution => {
    const data = loadDb();
    data.contributions.unshift(contribution);
    saveDb(data);
    return contribution;
  },
  getContributionById: (id: string): Contribution | undefined => {
    return loadDb().contributions.find((c) => c.id === id || c.receiptNumber === id);
  },

  // Wishes
  getWishes: (): AlumniWish[] => {
    return loadDb().wishes.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
  addWish: (wish: AlumniWish): AlumniWish => {
    const data = loadDb();
    data.wishes.unshift(wish);
    saveDb(data);
    return wish;
  },

  // Announcements
  getAnnouncements: (): Announcement[] => loadDb().announcements,
  saveAnnouncement: (announcement: Announcement): Announcement => {
    const data = loadDb();
    const index = data.announcements.findIndex((a) => a.id === announcement.id);
    if (index >= 0) {
      data.announcements[index] = announcement;
    } else {
      data.announcements.push(announcement);
    }
    saveDb(data);
    return announcement;
  },
  deleteAnnouncement: (id: string): boolean => {
    const data = loadDb();
    data.announcements = data.announcements.filter((a) => a.id !== id);
    saveDb(data);
    return true;
  },

  // Settings
  getSettings: (): JubileeSettings => loadDb().settings,
  updateSettings: (newSettings: Partial<JubileeSettings>): JubileeSettings => {
    const data = loadDb();
    data.settings = { ...data.settings, ...newSettings };
    saveDb(data);
    return data.settings;
  },
};
