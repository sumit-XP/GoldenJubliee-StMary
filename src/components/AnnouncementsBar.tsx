import React from 'react';
import { useJubilee } from '../context/JubileeContext.tsx';
import { Sparkles } from 'lucide-react';

export const AnnouncementsBar: React.FC = () => {
  const { announcements } = useJubilee();
  const activeAnnouncements = announcements.filter((a) => a.active);

  if (activeAnnouncements.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-900 py-2.5 px-4 overflow-hidden relative border-b border-amber-400 font-medium text-sm shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-900 text-amber-300 text-xs font-bold uppercase tracking-wider whitespace-nowrap shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
          Jubilee Bulletin
        </span>
        <div className="overflow-x-auto whitespace-nowrap scrollbar-none flex-1 text-xs sm:text-sm font-semibold tracking-wide">
          {activeAnnouncements.map((a, idx) => (
            <span key={a.id} className="inline-block mr-8 text-stone-950">
              {a.text}
              {idx < activeAnnouncements.length - 1 && <span className="mx-4 text-stone-800">✦</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
