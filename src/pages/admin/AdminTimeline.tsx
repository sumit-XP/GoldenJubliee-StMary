import React, { useState } from 'react';
import { useJubilee } from '../../context/JubileeContext.tsx';
import { TimelineItem } from '../../types/index.ts';
import { Plus, Edit2, Trash2, X, Award, CheckCircle } from 'lucide-react';

export const AdminTimeline: React.FC = () => {
  const { timeline, saveTimelineItem, deleteTimelineItem } = useJubilee();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [year, setYear] = useState<number>(2026);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [era, setEra] = useState<TimelineItem['era']>('Golden Horizon (2016-2026)');
  const [badge, setBadge] = useState('Landmark');

  const handleOpenNew = () => {
    setEditingId(null);
    setYear(2026);
    setTitle('');
    setDescription('');
    setEra('Golden Horizon (2016-2026)');
    setBadge('Landmark');
    setIsEditing(true);
  };

  const handleEdit = (item: TimelineItem) => {
    setEditingId(item.id);
    setYear(item.year);
    setTitle(item.title);
    setDescription(item.description);
    setEra(item.era);
    setBadge(item.badge || 'Milestone');
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!year || !title.trim()) return;

    const itemToSave: TimelineItem = {
      id: editingId || `tl-${Date.now()}`,
      year: Number(year),
      title: title.trim(),
      description: description.trim(),
      era,
      badge: badge.trim() || undefined,
    };

    await saveTimelineItem(itemToSave);
    setIsEditing(false);
  };

  const handleDelete = async (id: string, itemTitle: string) => {
    if (window.confirm(`Delete milestone "${itemTitle}"?`)) {
      await deleteTimelineItem(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h3 className="font-serif text-xl font-bold text-stone-900">
            50-Year Milestone Timeline Management (1976 – 2026)
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Add or edit historical achievements, ICSE milestones, and campus transformations.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleOpenNew}
            className="px-4 py-2.5 rounded-full bg-[#5A0506] hover:bg-[#850B0C] text-amber-200 font-bold text-xs flex items-center gap-2 shadow transition-all self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Add Milestone</span>
          </button>
        )}
      </div>

      {/* Edit Form */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-amber-300 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h4 className="font-serif font-bold text-base text-[#5A0506]">
              {editingId ? 'Edit Milestone Entry' : 'Add New Historical Milestone'}
            </h4>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Year (e.g. 1976 - 2026) *</label>
              <input
                type="number"
                required
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Historical Era</label>
              <select
                value={era}
                onChange={(e) => setEra(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-sm outline-none bg-white"
              >
                <option value="Foundation (1976-1985)">Foundation (1976-1985)</option>
                <option value="Expansion (1986-2000)">Expansion (1986-2000)</option>
                <option value="Silver Era (2001-2015)">Silver Era (2001-2015)</option>
                <option value="Golden Horizon (2016-2026)">Golden Horizon (2016-2026)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Badge Tag</label>
              <input
                type="text"
                placeholder="e.g. Academic Excellence"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-sm outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Milestone Headline *</label>
              <input
                type="text"
                required
                placeholder="e.g. Inauguration of State-of-the-Art Science Complex"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-sm outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Detailed Historical Context</label>
              <textarea
                rows={3}
                placeholder="Describe this landmark event in St. Mary's history..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-sm outline-none resize-none"
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
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* Timeline List */}
      <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 shadow-sm">
        {timeline.map((item) => (
          <div key={item.id} className="p-5 flex items-start justify-between gap-4 hover:bg-stone-50 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-lg text-[#850B0C]">
                  {item.year}
                </span>
                <span className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                  {item.badge}
                </span>
                <span className="text-xs text-stone-400">
                  {item.era}
                </span>
              </div>
              <h4 className="font-serif font-bold text-base text-stone-900">
                {item.title}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed max-w-3xl">
                {item.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 pt-1">
              <button
                onClick={() => handleEdit(item)}
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                title="Edit Milestone"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(item.id, item.title)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Milestone"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
