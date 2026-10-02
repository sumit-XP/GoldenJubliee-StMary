export interface JubileeEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  category: 'Ceremony' | 'Cultural' | 'Alumni' | 'Sports' | 'Academic' | 'Exhibition';
  description: string;
  chiefGuest?: string;
  rsvpCount: number;
  highlight?: boolean;
}

export interface TimelineItem {
  id: string;
  year: number;
  title: string;
  description: string;
  era: 'Foundation (1976-1985)' | 'Expansion (1986-2000)' | 'Silver Era (2001-2015)' | 'Golden Horizon (2016-2026)';
  iconType?: string;
  badge?: string;
}

export interface Contribution {
  id: string;
  receiptNumber: string;
  donorName: string;
  role: 'Alumnus' | 'Parent' | 'Former Teacher' | 'Staff' | 'Well-Wisher';
  batchYear?: string;
  email?: string;
  phone?: string;
  amount: number;
  tier: 'Silver Supporter' | 'Golden Patron' | 'Platinum Benefactor' | 'Diamond Visionary' | 'Custom Donor';
  paymentMethod?: string;
  paymentRef?: string;
  message?: string;
  isAnonymous: boolean;
  createdAt: string;
}

export interface AlumniWish {
  id: string;
  name: string;
  batchYear?: string;
  role: string;
  city?: string;
  message: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  text: string;
  active: boolean;
  type: 'urgent' | 'highlight' | 'info';
}

export interface JubileeSettings {
  countdownDate: string;
  themeTitle: string;
  principalName: string;
  contactPhone: string;
  contactEmail: string;
  schoolAddress: string;
}
