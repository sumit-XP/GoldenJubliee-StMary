import React, { useState } from 'react';
import { useJubilee } from '../../context/JubileeContext.tsx';
import { JubileeEvent } from '../../types/index.ts';
import { Plus, Edit2, Trash2, Calendar, MapPin, Clock, User, Check, X } from 'lucide-react';

export const AdminEvents: React.FC = () => {
  const { events, saveEvent, deleteEvent } = useJubilee();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-12-18');
  const [time, setTime] = useState('10:00 AM - 01:00 PM');
  const [venue, setVenue] = useState("St. Mary's School Grounds");
  const [category, setCategory] = useState<JubileeEvent['category']>('Ceremony');
  const [description, setDescription] = useState('');
  const [chiefGuest, setChiefGuest] = useState('');
  const [highlight, setHighlight] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(0);

  const handleOpenNew = () => {
    setEditingId(null);
    setTitle('');
    setDate('2026-12-18');
    setTime('10:00 AM - 01:00 PM');
    setVenue("St. Mary's School Grounds");
    setCategory('Ceremony');
    setDescription('');
    setChiefGuest('');
    setHighlight(false);
    setRsvpCount(0);
    setIsEditing(true);
  };

  const handleEdit = (evt: JubileeEvent) => {
    setEditingId(evt.id);
    setTitle(evt.title);
    setDate(evt.date);
    setTime(evt.time);
    setVenue(evt.venue);
    setCategory(evt.category);
    setDescription(evt.description);
    setChiefGuest(evt.chiefGuest || '');
    setHighlight(Boolean(evt.highlight));
    setRsvpCount(evt.rsvpCount || 0);
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    const eventToSave: JubileeEvent = {
      id: editingId || `evt-${Date.now()}`,
      title: title.trim(),
      date,
      time,
      venue: venue.trim(),
      category,
      description: description.trim(),
      chiefGuest: chiefGuest.trim() || undefined,
      rsvpCount,
      highlight,
    };

    await saveEvent(eventToSave);
    setIsEditing(false);
  };

  const handleDelete = async (id: string, evtTitle: string) => {
    if (window.confirm(`Are you sure you want to delete event "${evtTitle}"?`)) {
      await deleteEvent(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h3 className="font-serif text-xl font-bold text-stone-900">
            Jubilee Events Schedule Management
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Create, update or remove jubilee celebration ceremonies, sports and reunions.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleOpenNew}
            className="px-4 py-2.5 rounded-full bg-[#5A0506] hover:bg-[#850B0C] text-amber-200 font-bold text-xs flex items-center gap-2 shadow transition-all self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Event</span>
          </button>
        )}
      </div>

      {/* Add / Edit Form Modal or Inline Panel */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-amber-300 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h4 className="font-serif font-bold text-base text-[#5A0506]">
              {editingId ? 'Edit Jubilee Event' : 'Add New Jubilee Event'}
            </h4>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Event Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Grand Golden Jubilee Alumni Global Homecoming"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-sm outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Time Range</label>
              <input
                type="text"
                placeholder="09:00 AM - 02:00 PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Venue Location</label>
              <input
                type="text"
                placeholder="Father Marian Memorial Auditorium / School Grounds"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-sm outline-none bg-white"
              >
                <option value="Ceremony">Ceremony</option>
                <option value="Alumni">Alumni</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Academic">Academic</option>
                <option value="Exhibition">Exhibition</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Chief Guest / Presiding Dignitary</label>
              <input
                type="text"
                placeholder="e.g. Archbishop of Cuttack-Bhubaneswar / Distinguished Alumni"
                value={chiefGuest}
                onChange={(e) => setChiefGuest(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-sm outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
              <textarea
                rows={3}
                placeholder="Detailed itinerary and celebration highlights..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-sm outline-none resize-none"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="highlightEvt"
                  checked={highlight}
                  onChange={(e) => setHighlight(e.target.checked)}
                  className="w-4 h-4 rounded text-[#850B0C]"
                />
                <label htmlFor="highlightEvt" className="text-xs font-medium text-stone-700">
                  Feature as Signature Jubilee Event
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Current RSVP Count</label>
              <input
                type="number"
                value={rsvpCount}
                onChange={(e) => setRsvpCount(parseInt(e.target.value, 10) || 0)}
                className="w-32 px-3.5 py-1.5 rounded-xl border border-stone-300 text-xs outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#5A0506] hover:bg-[#850B0C] text-amber-200 font-bold text-xs shadow"
            >
              Save Event Changes
            </button>
          </div>
        </form>
      )}

      {/* Events Table / List */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="divide-y divide-stone-100">
          {events.map((evt) => (
            <div key={evt.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                    {evt.category}
                  </span>
                  {evt.highlight && (
                    <span className="text-[11px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                      ★ Signature
                    </span>
                  )}
                  <span className="text-xs font-semibold text-stone-500">
                    {evt.rsvpCount} RSVPs
                  </span>
                </div>

                <h4 className="font-serif font-bold text-base text-stone-900">
                  {evt.title}
                </h4>

                <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    {evt.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    {evt.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    {evt.venue}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => handleEdit(evt)}
                  className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                  title="Edit Event"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(evt.id, evt.title)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
