import React from 'react';
import { useJubilee } from '../context/JubileeContext.tsx';
import { Award, Heart, Sparkles, Shield, User } from 'lucide-react';

interface DonorWallProps {
  onOpenContribute: () => void;
}

export const DonorWall: React.FC<DonorWallProps> = ({ onOpenContribute }) => {
  const { contributions } = useJubilee();

  const totalRaised = contributions.reduce((sum, c) => sum + (c.amount || 0), 0);
  const totalDonors = contributions.length;

  return (
    <section id="donors" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF6EE] relative">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-stone-900 border border-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5 text-amber-700" />
            Golden Jubilee Honour Roll
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#5A0506]">
            The Wall of Distinguished Patrons
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base">
            Honoring the noble individuals, alumni batches, parents, and benefactors whose benevolence powers our 50th Golden Jubilee infrastructure and future endowment.
          </p>
        </div>

        {/* Jubilee Fund Metrics Banner */}
        <div className="bg-gradient-to-r from-[#5A0506] via-[#7A0A0B] to-[#5A0506] text-amber-100 rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-500/40 mb-14 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center items-center">
            <div className="p-4 border-b md:border-b-0 md:border-r border-amber-500/30">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold">Total Funds Contributed</span>
              <p className="font-serif text-3xl sm:text-5xl font-black text-amber-300 mt-1">
                ₹{totalRaised.toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-amber-200/60 mt-1 block">Towards Jubilee Auditorium & Labs</span>
            </div>

            <div className="p-4 border-b md:border-b-0 md:border-r border-amber-500/30">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold">Distinguished Marian Donors</span>
              <p className="font-serif text-3xl sm:text-5xl font-black text-amber-300 mt-1">
                {totalDonors}
              </p>
              <span className="text-[11px] text-amber-200/60 mt-1 block">From India & Worldwide Chapters</span>
            </div>

            <div className="p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-amber-200 mb-2">Leave your permanent mark on this historic year</span>
              <button
                onClick={onOpenContribute}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 group transition-all"
              >
                <Heart className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                <span>Join the Honour Roll</span>
              </button>
            </div>
          </div>
        </div>

        {/* Donors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {contributions.map((c) => {
            const isHighTier = c.amount >= 10000;

            return (
              <div
                key={c.id}
                className={`bg-white rounded-2xl p-6 border transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between ${
                  isHighTier ? 'border-amber-400/80 ring-1 ring-amber-300/50' : 'border-stone-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                      {c.tier}
                    </span>
                    <span className="font-sans font-bold text-sm text-[#850B0C]">
                      ₹{c.amount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#850B0C] to-[#5A0506] text-amber-300 flex items-center justify-center font-serif font-bold text-sm shrink-0 shadow">
                      {c.isAnonymous ? '★' : c.donorName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-stone-900">
                        {c.donorName}
                      </h4>
                      <p className="text-xs text-stone-500 font-medium">
                        {c.role} {c.batchYear ? `• ${c.batchYear}` : ''}
                      </p>
                    </div>
                  </div>

                  {c.message && (
                    <p className="mt-3 text-xs italic text-stone-600 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100 leading-relaxed">
                      "{c.message}"
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-mono">
                  <span>{c.receiptNumber}</span>
                  <span>{new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
