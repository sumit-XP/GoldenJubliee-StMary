import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  JubileeEvent,
  TimelineItem,
  Contribution,
  AlumniWish,
  Announcement,
  JubileeSettings,
} from '../types/index.ts';
import { useAuth } from './AuthContext.tsx';

interface JubileeContextType {
  events: JubileeEvent[];
  timeline: TimelineItem[];
  contributions: Contribution[];
  wishes: AlumniWish[];
  announcements: Announcement[];
  settings: JubileeSettings;
  loading: boolean;
  refreshData: () => Promise<void>;
  rsvpEvent: (id: string) => Promise<boolean>;
  checkEmailUsage: (email: string) => Promise<{ used: boolean; count: number; lastContribution: Contribution | null }>;
  submitContribution: (data: Partial<Contribution>) => Promise<Contribution>;
  deleteContribution: (id: string) => Promise<boolean>;
  submitWish: (data: Partial<AlumniWish>) => Promise<AlumniWish>;
  deleteWish: (id: string) => Promise<boolean>;
  saveEvent: (event: JubileeEvent) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  saveTimelineItem: (item: TimelineItem) => Promise<boolean>;
  deleteTimelineItem: (id: string) => Promise<boolean>;
  saveAnnouncement: (announcement: Announcement) => Promise<boolean>;
  deleteAnnouncement: (id: string) => Promise<boolean>;
  updateSettings: (newSettings: Partial<JubileeSettings>, pin: string) => Promise<boolean>;
}

const defaultSettings: JubileeSettings = {
  countdownDate: '2026-12-16T08:30:00',
  themeTitle: '50 Years of Service Through Excellence (1976 – 2026)',
  principalName: 'Sr. Indu Turkey',
  contactPhone: '06726-220393, 8763116421',
  contactEmail: 'stmary_jkr@rediffmail.com',
  schoolAddress: 'St. Mary\'s School, Jajpur Road, Odisha - 755019',
};

const defaultEvents: JubileeEvent[] = [
  {
    id: 'evt-1',
    title: 'Inaugural Thanksgiving Mass & Committee Assembly',
    date: '2026-12-16',
    time: '08:30 AM - 01:30 PM',
    venue: "St. Mary's Main School Grounds & Chapel",
    category: 'Ceremony',
    description: 'Solemn inaugural gathering exclusively for school members, teaching and non-teaching staff, Sisters, and the Managing Committee. Features Holy Eucharistic Mass of Thanksgiving, blessing of the Golden Jubilee Memorial, and committee felicitation.',
    chiefGuest: 'Diocesan Patrons & School Managing Committee',
    rsvpCount: 0,
    highlight: true,
  },
  {
    id: 'evt-2',
    title: 'Observation of Golden Jubilee — Day 1: Grand Celebrations & Alumni Homecoming',
    date: '2026-12-17',
    time: '09:00 AM - 08:30 PM',
    venue: 'Father Marian Memorial Auditorium & Campus Grounds',
    category: 'Alumni',
    description: 'Official public observation of the 50th Golden Jubilee open for all alumni, students, parents, and well-wishers. Features the grand jubilee assembly, global alumni homecoming spanning batches 1976–2025, felicitation of retired teachers, campus memory walk, and evening cultural musical concert.',
    chiefGuest: 'Distinguished Alumni Association Patrons & State Dignitaries',
    rsvpCount: 0,
    highlight: true,
  },
  {
    id: 'evt-3',
    title: 'Observation of Golden Jubilee — Day 2: Grand Cultural Fest & Valedictory Gala',
    date: '2026-12-18',
    time: '09:30 AM - 09:30 PM',
    venue: 'Central Jubilee Arena & Open Air Amphitheatre',
    category: 'Cultural',
    description: 'Grand Day 2 observation of the Golden Jubilee showcasing student dance drama, classical Odissi recitals, release of the 50th Anniversary Commemorative Souvenir ("Golden Pages"), awards ceremony, and grand jubilee valedictory banquet.',
    chiefGuest: 'Honorable State Education Dignitaries & Principal Sr. Indu Turkey',
    rsvpCount: 0,
    highlight: true,
  },
];

const defaultTimeline: TimelineItem[] = [
  {
    id: 'tl-1',
    year: 1976,
    title: "Foundation of St. Mary's School",
    description: 'Established under the visionary patronage of Cuttack Roman Catholic Diocesan Corporation (CRCDC) Archdiocese of Cuttack-Bhubaneswar to bring quality English medium education to Jajpur Road.',
    era: 'Foundation (1976-1985)',
    badge: 'Humble Beginnings',
    iconType: 'foundation',
  },
  {
    id: 'tl-2',
    year: 1982,
    title: 'Stewardship of the Sisters of Handmaids of Mary',
    description: 'The Sisters joined the mission, instilling disciplined values, compassion, moral stewardship, and establishing our motto: "Service Through Excellence".',
    era: 'Foundation (1976-1985)',
    badge: 'Spiritual Heritage',
    iconType: 'cross',
  },
  {
    id: 'tl-3',
    year: 1989,
    title: 'Affiliation with CISCE / ICSE New Delhi',
    description: 'The school gained formal affiliation with the Council for the Indian School Certificate Examinations (CISCE). The pioneer batch produced outstanding state ranks.',
    era: 'Expansion (1986-2000)',
    badge: 'Academic Milestone',
    iconType: 'book',
  },
  {
    id: 'tl-4',
    year: 1996,
    title: 'Inauguration of Modern Science Complex',
    description: 'Dedicated Physics, Chemistry, and Biology laboratories inaugurated alongside a state-of-the-art computer education facility.',
    era: 'Expansion (1986-2000)',
    badge: 'Infrastructure',
    iconType: 'microscope',
  },
  {
    id: 'tl-5',
    year: 2001,
    title: 'Silver Jubilee Celebration (25 Years)',
    description: 'Celebrated a quarter-century of educational brilliance with the construction of the Silver Jubilee Academic Block and the first grand Alumni meet.',
    era: 'Silver Era (2001-2015)',
    badge: 'Silver Jubilee',
    iconType: 'award',
  },
  {
    id: 'tl-isro',
    year: '2005-2018',
    title: 'ISRO Educational Visits by Students',
    description: 'Marian students embarked on prestigious study and educational visits to the Indian Space Research Organisation (ISRO), exploring satellite launch technology, space applications, and fostering scientific inquiry and innovation.',
    era: 'Silver Era (2001-2015)',
    badge: 'ISRO Space Exposure',
    iconType: 'compass',
  },
  {
    id: 'tl-6',
    year: 2011,
    title: 'Auditorium & Multipurpose Sports Ground',
    description: 'Inauguration of Father Marian Multipurpose Auditorium, standard basketball and volleyball courts, expanding cultural and physical training programs.',
    era: 'Silver Era (2001-2015)',
    badge: 'Campus Growth',
    iconType: 'trophy',
  },
  {
    id: 'tl-7',
    year: 2018,
    title: 'Smart Digital Classrooms & STEM Labs',
    description: 'Transformation into interactive smart classrooms equipped with multimedia visual aids, digital coding labs, and enriched library archives.',
    era: 'Golden Horizon (2016-2026)',
    badge: 'Tech Innovation',
    iconType: 'laptop',
  },
  {
    id: 'tl-8',
    year: 2024,
    title: 'Eco-Green Campus & Golden Jubilee Project Initiation',
    description: 'Installation of rooftop solar infrastructure, rainwater harvesting, and rollout of the Golden Jubilee Multipurpose Student Centre project.',
    era: 'Golden Horizon (2016-2026)',
    badge: 'Green Campus',
    iconType: 'leaf',
  },
  {
    id: 'tl-chess',
    year: 2026,
    title: 'State-Level Chess Competition',
    description: "St. Mary's School proudly hosted the prestigious State-Level Chess Championship, bringing together budding chess prodigies and school teams from across Odisha to showcase tactical mastery and sportsmanship.",
    era: 'Golden Horizon (2016-2026)',
    badge: 'State Championship',
    iconType: 'award',
  },
  {
    id: 'tl-9',
    year: 2026,
    title: 'The Golden Jubilee: 50 Glorious Years of Excellence',
    description: 'Half a century of nurturing leaders, doctors, engineers, educators, civil servants, and honest citizens. Proudly celebrating 1976 – 2026!',
    era: 'Golden Horizon (2016-2026)',
    badge: '50 Years Landmark',
    iconType: 'star',
  },
];

const JubileeContext = createContext<JubileeContextType | null>(null);

export const JubileeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isAdmin } = useAuth();
  const [events, setEvents] = useState<JubileeEvent[]>(defaultEvents);
  const [timeline, setTimeline] = useState<TimelineItem[]>(defaultTimeline);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [wishes, setWishes] = useState<AlumniWish[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [settings, setSettings] = useState<JubileeSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const [evRes, tlRes, cntRes, wshRes, ancRes, setRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/timeline'),
        fetch('/api/contributions', { headers }),
        fetch('/api/wishes'),
        fetch('/api/announcements'),
        fetch('/api/settings'),
      ]);

      if (evRes.ok) {
        const evData = await evRes.json();
        if (Array.isArray(evData) && evData.length > 0) setEvents(evData);
      }
      if (tlRes.ok) {
        const tlData = await tlRes.json();
        if (Array.isArray(tlData) && tlData.length > 0) setTimeline(tlData);
      }
      if (cntRes.ok) setContributions(await cntRes.json());
      if (wshRes.ok) setWishes(await wshRes.json());
      if (ancRes.ok) setAnnouncements(await ancRes.json());
      if (setRes.ok) setSettings(await setRes.json());
    } catch (err) {
      console.warn('API fetch warning, using seeded state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [isAdmin, token]);

  const rsvpEvent = async (id: string): Promise<boolean> => {
    try {
      // Optimistic update
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, rsvpCount: (e.rsvpCount || 0) + 1 } : e))
      );
      const res = await fetch(`/api/events/${id}/rsvp`, { method: 'POST' });
      return res.ok;
    } catch {
      return true;
    }
  };

  const checkEmailUsage = async (
    email: string
  ): Promise<{ used: boolean; count: number; lastContribution: Contribution | null }> => {
    try {
      const res = await fetch(`/api/contributions/check-email/${encodeURIComponent(email)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API check-email failed, falling back to local state:', err);
    }
    const clean = email.trim().toLowerCase();
    const found = contributions.filter(
      (c) => c.email && c.email.trim().toLowerCase() === clean
    );
    return {
      used: found.length > 0,
      count: found.length,
      lastContribution: found[0] || null,
    };
  };

  const submitContribution = async (data: Partial<Contribution>): Promise<Contribution> => {
    const res = await fetch('/api/contributions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error('Failed to record contribution');
    }

    const created: Contribution = await res.json();
    setContributions((prev) => [created, ...prev]);
    return created;
  };

  const submitWish = async (data: Partial<AlumniWish>): Promise<AlumniWish> => {
    const res = await fetch('/api/wishes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error('Failed to post wish');
    }

    const created: AlumniWish = await res.json();
    setWishes((prev) => [created, ...prev]);
    return created;
  };

  const deleteContribution = async (id: string): Promise<boolean> => {
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`/api/contributions/${id}`, { method: 'DELETE', headers });
      if (res.ok) {
        setContributions((prev) => prev.filter((c) => c.id !== id && c.receiptNumber !== id));
        return true;
      }
    } catch (err) {
      console.error('Failed to delete contribution:', err);
    }
    return false;
  };

  const deleteWish = async (id: string): Promise<boolean> => {
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`/api/wishes/${id}`, { method: 'DELETE', headers });
      if (res.ok) {
        setWishes((prev) => prev.filter((w) => w.id !== id));
        return true;
      }
    } catch (err) {
      console.error('Failed to delete wish:', err);
    }
    return false;
  };

  const saveEvent = async (event: JubileeEvent): Promise<boolean> => {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    if (res.ok) {
      await refreshData();
      return true;
    }
    return false;
  };

  const deleteEvent = async (id: string): Promise<boolean> => {
    const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
      return true;
    }
    return false;
  };

  const saveTimelineItem = async (item: TimelineItem): Promise<boolean> => {
    const res = await fetch('/api/timeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (res.ok) {
      await refreshData();
      return true;
    }
    return false;
  };

  const deleteTimelineItem = async (id: string): Promise<boolean> => {
    const res = await fetch(`/api/timeline/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setTimeline((prev) => prev.filter((t) => t.id !== id));
      return true;
    }
    return false;
  };

  const saveAnnouncement = async (announcement: Announcement): Promise<boolean> => {
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(announcement),
    });
    if (res.ok) {
      await refreshData();
      return true;
    }
    return false;
  };

  const deleteAnnouncement = async (id: string): Promise<boolean> => {
    const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      return true;
    }
    return false;
  };

  const updateSettings = async (
    newSettings: Partial<JubileeSettings>,
    pin: string
  ): Promise<boolean> => {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, newSettings }),
    });
    if (res.ok) {
      const updated = await res.json();
      setSettings(updated);
      return true;
    }
    return false;
  };

  return (
    <JubileeContext.Provider
      value={{
        events,
        timeline,
        contributions,
        wishes,
        announcements,
        settings,
        loading,
        refreshData,
        rsvpEvent,
        checkEmailUsage,
        submitContribution,
        deleteContribution,
        submitWish,
        deleteWish,
        saveEvent,
        deleteEvent,
        saveTimelineItem,
        deleteTimelineItem,
        saveAnnouncement,
        deleteAnnouncement,
        updateSettings,
      }}
    >
      {children}
    </JubileeContext.Provider>
  );
};

export const useJubilee = () => {
  const context = useContext(JubileeContext);
  if (!context) {
    throw new Error('useJubilee must be used within a JubileeProvider');
  }
  return context;
};
