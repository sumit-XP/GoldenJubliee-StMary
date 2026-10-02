import React, { useState } from 'react';
import { useJubilee } from '../context/JubileeContext.tsx';
import { MessageSquare, Send, Sparkles, User, MapPin } from 'lucide-react';

export const WishesSection: React.FC = () => {
  const { wishes, submitWish } = useJubilee();

  const [name, setName] = useState('');
  const [role, setRole] = useState('Alumnus');
  const [batchYear, setBatchYear] = useState('');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      await submitWish({
        name: name.trim(),
        role,
        batchYear: batchYear.trim() || undefined,
        city: city.trim() || undefined,
        message: message.trim(),
      });
      setMessage('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Error submitting message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="wishes" className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-100 relative">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200 text-stone-900 border border-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-stone-900" />
            Alumni Voice & Reminiscences
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#5A0506]">
            Marian Greetings & Memory Wall
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base">
            Read heartwarming memories and jubilee blessings from alumni across the globe, former teachers, and current students.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Submission Form Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm sticky top-28">
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-1">
                Post Your Jubilee Wishes
              </h3>
              <p className="text-xs text-stone-500 mb-6">
                Leave your congratulations and golden memories for the entire Marian family.
              </p>

              {submitted && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Your greeting has been posted on the Golden Jubilee Wall!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Subrat Das"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-xs sm:text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Role *</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-xs outline-none bg-white"
                    >
                      <option value="Alumnus">Alumnus</option>
                      <option value="Alumna">Alumna</option>
                      <option value="Current Student">Current Student</option>
                      <option value="Former Teacher">Former Teacher</option>
                      <option value="Parent">Parent</option>
                      <option value="Well-Wisher">Well-Wisher</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Batch Year</label>
                    <input
                      type="text"
                      placeholder="e.g. 2008"
                      value={batchYear}
                      onChange={(e) => setBatchYear(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-xs sm:text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Current City / Country</label>
                  <input
                    type="text"
                    placeholder="e.g. Bhubaneswar / London"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-xs sm:text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Memory or Jubilee Greeting *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Share your favorite memory, tribute to mentors, or Jubilee message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#850B0C] text-xs sm:text-sm outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-full bg-[#5A0506] hover:bg-[#850B0C] text-amber-200 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Posting...' : 'Post on Memory Wall'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Wishes Feed Column */}
          <div className="lg:col-span-2 space-y-4">
            {wishes.map((w) => (
              <div
                key={w.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 hover:border-amber-300 shadow-sm hover:shadow transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-stone-900 flex items-center justify-center font-serif font-bold text-sm shrink-0">
                      {w.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-stone-900 text-sm sm:text-base">
                        {w.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <span className="font-medium text-amber-800">{w.role}</span>
                        {w.batchYear && <span>• {w.batchYear}</span>}
                        {w.city && (
                          <span className="flex items-center gap-0.5 text-stone-400">
                            <MapPin className="w-3 h-3" /> {w.city}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] text-stone-400 font-mono shrink-0">
                    {new Date(w.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-stone-700 leading-relaxed font-sans pl-1 border-l-2 border-amber-300">
                  {w.message}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
