import React, { useState } from 'react';
import { useJubilee } from '../context/JubileeContext.tsx';
import { JubileeEvent } from '../types/index.ts';
import { Calendar, Clock, MapPin, User, Check, Users, Sparkles, Share2 } from 'lucide-react';

export const EventsSection: React.FC = () => {
  const { events, rsvpEvent } = useJubilee();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [rsvpdEvents, setRsvpdEvents] = useState<Record<string, boolean>>({});
  const [selectedEvent, setSelectedEvent] = useState<JubileeEvent | null>(null);

  const categories = ['All', 'Ceremony', 'Alumni', 'Cultural', 'Sports', 'Academic'];

  const filteredEvents = selectedCategory === 'All'
    ? events
    : events.filter((e) => e.category === selectedCategory);

  const handleRsvp = async (eventId: string) => {
    if (rsvpdEvents[eventId]) return;
    setRsvpdEvents((prev) => ({ ...prev, [eventId]: true }));
    await rsvpEvent(eventId);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="events" className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-100 relative">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200 text-stone-900 border border-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-stone-900" />
            Celebration Calendar
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#5A0506]">
            Golden Jubilee Events & Schedule
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base">
            Join the grand congregation of teachers, students, alumni, and distinguished guests celebrating 50 years of excellence at St. Mary's School, Jajpur Road.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#850B0C] text-amber-200 shadow-md scale-105'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200 shadow-sm'
              }`}
            >
              {cat === 'All' ? 'All Jubilee Events' : cat}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => {
            const hasRsvpd = rsvpdEvents[evt.id];

            return (
              <div
                key={evt.id}
                className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl ${
                  evt.highlight ? 'border-amber-400/80 ring-1 ring-amber-300' : 'border-stone-200'
                }`}
              >
                {/* Event Card Header */}
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                      {evt.category}
                    </span>
                    {evt.highlight && (
                      <span className="text-[11px] font-bold text-amber-600 bg-amber-100/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                        ★ Signature Event
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 leading-snug hover:text-[#850B0C] transition-colors">
                    {evt.title}
                  </h3>

                  <div className="mt-4 space-y-2 text-xs sm:text-sm text-stone-600">
                    <div className="flex items-center gap-2 text-stone-800 font-medium">
                      <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{formatDate(evt.date)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{evt.time}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="line-clamp-1">{evt.venue}</span>
                    </div>

                    {evt.chiefGuest && (
                      <div className="flex items-start gap-2 pt-1 text-stone-700">
                        <User className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span className="italic line-clamp-1">
                          <strong className="font-semibold not-italic">Guest:</strong> {evt.chiefGuest}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="mt-4 text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {evt.description}
                  </p>
                </div>

                {/* Event Card Footer */}
                <div className="bg-stone-50 p-4 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                    <Users className="w-4 h-4 text-amber-600" />
                    <span>{evt.rsvpCount} Attending</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRsvp(evt.id)}
                      disabled={hasRsvpd}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                        hasRsvpd
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-[#5A0506] hover:bg-[#850B0C] text-amber-200 shadow-sm'
                      }`}
                    >
                      {hasRsvpd ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>RSVP'd</span>
                        </>
                      ) : (
                        <span>RSVP / Attend</span>
                      )}
                    </button>

                    <button
                      onClick={() => setSelectedEvent(evt)}
                      className="p-1.5 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-200 transition-colors"
                      title="View Details"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Note for Traveling Alumni */}
        <div className="mt-12 bg-white border border-amber-300 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-stone-900 text-base sm:text-lg">
                Planning your trip to Jajpur Road for the Golden Jubilee?
              </h4>
              <p className="text-xs sm:text-sm text-stone-600">
                Alumni coordination desks are being arranged at Jajpur Keonjhar Road Railway Station (JJKR) and major highway junctions.
              </p>
            </div>
          </div>
          <a
            href="mailto:stmary_jkr@rediffmail.com?subject=Golden%20Jubilee%20Alumni%20Reunion%20Inquiry"
            className="px-5 py-2.5 rounded-full bg-stone-900 text-amber-300 font-semibold text-xs sm:text-sm hover:bg-stone-800 transition-colors whitespace-nowrap shadow"
          >
            Contact Reunion Committee
          </a>
        </div>

      </div>

      {/* Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-amber-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-900">
                {selectedEvent.category} Event
              </span>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-stone-400 hover:text-stone-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#5A0506]">
              {selectedEvent.title}
            </h3>

            <div className="mt-4 space-y-2.5 text-sm text-stone-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span className="font-semibold">{formatDate(selectedEvent.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{selectedEvent.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>{selectedEvent.venue}</span>
              </div>
              {selectedEvent.chiefGuest && (
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-amber-600 mt-1" />
                  <span><strong>Chief Guest / Speaker:</strong> {selectedEvent.chiefGuest}</span>
                </div>
              )}
            </div>

            <p className="mt-4 text-sm text-stone-600 leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-100">
              {selectedEvent.description}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-5 py-2.5 text-xs font-bold text-stone-600 hover:text-stone-900"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleRsvp(selectedEvent.id);
                  setSelectedEvent(null);
                }}
                className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#5A0506] text-amber-200 hover:bg-[#850B0C] shadow-md"
              >
                Confirm RSVP
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
