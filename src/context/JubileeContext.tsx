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
  submitContribution: (data: Partial<Contribution>) => Promise<Contribution>;
  submitWish: (data: Partial<AlumniWish>) => Promise<AlumniWish>;
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
  principalName: 'Sr. Mary Lina DungDung',
  contactPhone: '06726-220393, 8763116421',
  contactEmail: 'stmary_jkr@rediffmail.com',
  schoolAddress: 'St. Mary\'s School, Jajpur Road, Odisha - 755019',
};

const JubileeContext = createContext<JubileeContextType | null>(null);

export const JubileeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isAdmin } = useAuth();
  const [events, setEvents] = useState<JubileeEvent[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
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

      if (evRes.ok) setEvents(await evRes.json());
      if (tlRes.ok) setTimeline(await tlRes.json());
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
        submitContribution,
        submitWish,
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
