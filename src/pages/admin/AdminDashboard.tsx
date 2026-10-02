import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useJubilee } from '../../context/JubileeContext.tsx';
import { AdminEvents } from './AdminEvents.tsx';
import { AdminTimeline } from './AdminTimeline.tsx';
import { AdminContributions } from './AdminContributions.tsx';
import { AdminNotices } from './AdminNotices.tsx';
import { Calendar, Clock, Heart, Megaphone, LayoutDashboard, LogOut, Globe, Sparkles, Award } from 'lucide-react';

interface AdminDashboardProps {
  onBackToHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToHome }) => {
  const { logout } = useAuth();
  const { events, contributions, timeline, wishes } = useJubilee();

  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'timeline' | 'contributions' | 'notices'>('overview');

  const totalFunds = contributions.reduce((sum, c) => sum + (c.amount || 0), 0);
  const totalRsvps = events.reduce((sum, e) => sum + (e.rsvpCount || 0), 0);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 flex flex-col">
      
      {/* Admin Top Navbar */}
      <header className="bg-[#480304] text-amber-100 border-b border-amber-600/40 shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-serif font-black text-sm shadow">
              50
            </div>
            <div>
              <span className="font-serif font-bold text-base text-amber-200">
                St. Mary's School — Admin Secretariat
              </span>
              <p className="text-[10px] text-amber-300/70 font-mono">
                Golden Jubilee Portal Control (1976–2026)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>View Public Webpage</span>
            </button>

            <button
              onClick={logout}
              className="p-1.5 text-amber-200/80 hover:text-amber-100 hover:bg-white/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Admin Subheader & Navigation Tabs */}
      <div className="bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-2 text-xs font-semibold">
            
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#5A0506] text-amber-200 shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview & Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'events'
                  ? 'bg-[#5A0506] text-amber-200 shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Events Schedule ({events.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'timeline'
                  ? 'bg-[#5A0506] text-amber-200 shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>50-Year Milestones ({timeline.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('contributions')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'contributions'
                  ? 'bg-[#5A0506] text-amber-200 shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Contributions & Ledger ({contributions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('notices')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'notices'
                  ? 'bg-[#5A0506] text-amber-200 shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>Notices & Settings</span>
            </button>

          </div>
        </div>
      </div>

      {/* Main Admin Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-bold text-stone-500">Total Funds Raised</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-stone-900 flex items-center justify-center">
                    <Heart className="w-4 h-4 fill-current" />
                  </div>
                </div>
                <p className="font-serif text-3xl font-black text-[#850B0C]">
                  ₹{totalFunds.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-stone-400 mt-1 block">From {contributions.length} verified benefactors</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-bold text-stone-500">Scheduled Events</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-stone-900 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <p className="font-serif text-3xl font-black text-stone-900">
                  {events.length}
                </p>
                <span className="text-[11px] text-stone-400 mt-1 block">{totalRsvps} Total Event RSVPs</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-bold text-stone-500">Historical Milestones</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-stone-900 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <p className="font-serif text-3xl font-black text-stone-900">
                  {timeline.length}
                </p>
                <span className="text-[11px] text-stone-400 mt-1 block">Spanning 1976 – 2026</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-bold text-stone-500">Alumni Messages</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-stone-900 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <p className="font-serif text-3xl font-black text-stone-900">
                  {wishes.length}
                </p>
                <span className="text-[11px] text-stone-400 mt-1 block">Wishes on Memory Wall</span>
              </div>
            </div>

            {/* Recent Activity Table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Recent Contributions */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    Latest Jubilee Contributions
                  </h3>
                  <button
                    onClick={() => setActiveTab('contributions')}
                    className="text-xs text-[#850B0C] font-semibold hover:underline"
                  >
                    View All ({contributions.length}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {contributions.slice(0, 5).map((c) => (
                    <div key={c.id} className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-stone-900">{c.donorName}</div>
                        <div className="text-[11px] text-stone-500">
                          {c.role} {c.batchYear ? `• ${c.batchYear}` : ''} • {c.receiptNumber}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold font-sans text-sm text-[#850B0C]">
                          ₹{c.amount.toLocaleString('en-IN')}
                        </span>
                        <div className="text-[10px] text-stone-400">{c.tier}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Events Overview */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    Signature Jubilee Events
                  </h3>
                  <button
                    onClick={() => setActiveTab('events')}
                    className="text-xs text-[#850B0C] font-semibold hover:underline"
                  >
                    Manage Schedule ({events.length}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {events.slice(0, 4).map((evt) => (
                    <div key={evt.id} className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-stone-900">{evt.title}</div>
                        <div className="text-[11px] text-stone-500">{evt.date} • {evt.venue}</div>
                      </div>
                      <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                        {evt.rsvpCount} RSVPs
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: EVENTS */}
        {activeTab === 'events' && <AdminEvents />}

        {/* TAB 3: TIMELINE */}
        {activeTab === 'timeline' && <AdminTimeline />}

        {/* TAB 4: CONTRIBUTIONS */}
        {activeTab === 'contributions' && <AdminContributions />}

        {/* TAB 5: NOTICES & SETTINGS */}
        {activeTab === 'notices' && <AdminNotices />}

      </main>

    </div>
  );
};
