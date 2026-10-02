import React, { useState } from 'react';
import { useJubilee } from '../../context/JubileeContext.tsx';
import { Announcement } from '../../types/index.ts';
import { Plus, Trash2, Megaphone, Settings, Check, Sparkles } from 'lucide-react';

export const AdminNotices: React.FC = () => {
  const { announcements, saveAnnouncement, deleteAnnouncement, settings, updateSettings } = useJubilee();

  const [newNoticeText, setNewNoticeText] = useState('');
  const [noticeType, setNoticeType] = useState<Announcement['type']>('highlight');

  // Settings form
  const [countdownDate, setCountdownDate] = useState(settings.countdownDate || '2026-12-16T08:30:00');
  const [principalName, setPrincipalName] = useState(settings.principalName || 'Sr. Mary Lina DungDung');
  const [contactPhone, setContactPhone] = useState(settings.contactPhone || '06726-220393, 8763116421');
  const [contactEmail, setContactEmail] = useState(settings.contactEmail || 'stmary_jkr@rediffmail.com');
  const [pinPrompt, setPinPrompt] = useState('stmarys1976');
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeText.trim()) return;

    await saveAnnouncement({
      id: `anc-${Date.now()}`,
      text: newNoticeText.trim(),
      active: true,
      type: noticeType,
    });

    setNewNoticeText('');
  };

  const handleToggleNotice = async (anc: Announcement) => {
    await saveAnnouncement({
      ...anc,
      active: !anc.active,
    });
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateSettings(
      {
        countdownDate,
        principalName,
        contactPhone,
        contactEmail,
      },
      pinPrompt
    );

    if (success) {
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } else {
      alert('Failed to update settings. Please check admin pin.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Announcements Manager */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-stone-900 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Live Jubilee Bulletin Ticker
            </h3>
            <p className="text-xs text-stone-500">
              Broadcast urgent notifications and greetings at the top of the webpage.
            </p>
          </div>
        </div>

        {/* Add Announcement Form */}
        <form onSubmit={handleAddNotice} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              New Bulletin Notice
            </label>
            <input
              type="text"
              required
              placeholder="e.g. ✨ Alumni registration for Batches 1980-2000 is now extended..."
              value={newNoticeText}
              onChange={(e) => setNewNoticeText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#850B0C] text-xs sm:text-sm outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-full bg-[#5A0506] hover:bg-[#850B0C] text-amber-200 font-bold text-xs shadow flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Notice to Top Ticker</span>
          </button>
        </form>

        {/* Notices List */}
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            Active & Archived Notices
          </h4>
          {announcements.map((anc) => (
            <div
              key={anc.id}
              className="p-3 rounded-xl border border-stone-200 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="checkbox"
                  checked={anc.active}
                  onChange={() => handleToggleNotice(anc)}
                  className="w-4 h-4 rounded text-[#850B0C]"
                  title="Toggle Display"
                />
                <span className={anc.active ? 'text-stone-900 font-medium' : 'text-stone-400 line-through'}>
                  {anc.text}
                </span>
              </div>
              <button
                onClick={() => deleteAnnouncement(anc.id)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Celebration Settings */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-stone-900 flex items-center justify-center">
            <Settings className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Celebration Countdown & Meta Settings
            </h3>
            <p className="text-xs text-stone-500">
              Configure target countdown date and official signatures.
            </p>
          </div>
        </div>

        {settingsSaved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Target Jubilee Celebration Date & Time *
            </label>
            <input
              type="datetime-local"
              required
              value={countdownDate}
              onChange={(e) => setCountdownDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-xs sm:text-sm outline-none"
            />
            <span className="text-[11px] text-stone-400 mt-1 block">
              Powers the hero live countdown timer.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Principal's Name (for Certificate & Welcome)
            </label>
            <input
              type="text"
              required
              value={principalName}
              onChange={(e) => setPrincipalName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-xs sm:text-sm outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">School Phone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">School Email</label>
              <input
                type="text"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-[#5A0506] hover:bg-[#850B0C] text-amber-200 font-bold text-xs shadow flex items-center justify-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Update Celebration Settings</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
