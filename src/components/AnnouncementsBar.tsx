import React from 'react';
import { useJubilee } from '../context/JubileeContext.tsx';
import { Sparkles } from 'lucide-react';

export const AnnouncementsBar: React.FC = () => {
  const { announcements } = useJubilee();
  const activeAnnouncements = announcements.filter((a) => a.active);

  if (activeAnnouncements.length === 0) return null;

  // Duplicate items to ensure uninterrupted, infinite loop
  const repeatedAnnouncements = [...activeAnnouncements, ...activeAnnouncements];

  return (
    <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-900 py-2 px-4 overflow-hidden relative border-b border-amber-400 font-medium text-sm shadow-inner select-none">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Static Left Badge */}
        <div className="shrink-0 z-10 flex items-center pr-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900 text-amber-300 text-xs font-bold uppercase tracking-wider whitespace-nowrap shadow-md border border-amber-400/40">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            Jubilee Bulletin
          </span>
        </div>

        {/* Autoscrolling Marquee Container */}
        <div className="overflow-hidden flex-1 relative no-scrollbar">
          <div className="animate-marquee items-center text-xs sm:text-sm font-semibold tracking-wide py-0.5">
            {repeatedAnnouncements.map((a, idx) => (
              <span key={`${a.id}-${idx}`} className="inline-flex items-center mr-10 text-stone-950 whitespace-nowrap">
                <span>{a.text}</span>
                <span className="ml-8 text-amber-900 font-bold">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
