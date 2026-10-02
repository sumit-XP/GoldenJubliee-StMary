import React from 'react';
import { Countdown } from './Countdown.tsx';
import { Heart, Calendar, Sparkles, ChevronDown, Award } from 'lucide-react';
import { useJubilee } from '../context/JubileeContext.tsx';

interface HeroProps {
  onOpenContribute: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenContribute, onNavigate }) => {
  const { settings } = useJubilee();

  return (
    <section id="hero" className="relative bg-gradient-to-b from-[#4A0405] via-[#2A0203] to-[#120102] text-amber-50 pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative Golden Starburst & Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-amber-500/15 via-amber-700/5 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        
        {/* Jubilee Insignia & Laurel Crest */}
        <div className="inline-flex flex-col items-center mb-6">
          <div className="relative mb-3">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-600 p-1 shadow-2xl flex items-center justify-center animate-pulse" style={{ animationDuration: '4s' }}>
              <div className="w-full h-full rounded-full bg-[#3B0304] border-2 border-amber-300 flex flex-col items-center justify-center p-2 text-center">
                <span className="font-serif text-[10px] sm:text-xs uppercase tracking-widest text-amber-300 font-semibold">1976</span>
                <span className="font-serif text-2xl sm:text-3xl font-black text-amber-400 leading-tight">50</span>
                <span className="font-serif text-[9px] sm:text-[10px] uppercase tracking-widest text-amber-300 font-semibold">2026</span>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 bg-amber-400 text-stone-900 rounded-full p-1 shadow-md">
              <Sparkles className="w-4 h-4 text-stone-900" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold tracking-wider uppercase backdrop-blur-sm">
            <span>✨ 50th Golden Jubilee Celebrations ✨</span>
          </div>
        </div>

        {/* Grand Title */}
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-amber-100 max-w-4xl mx-auto leading-tight drop-shadow-md">
          St. Mary's School, Jajpur Road
        </h1>
        
        <p className="mt-4 font-serif text-lg sm:text-2xl text-amber-300 font-semibold italic max-w-2xl mx-auto">
          "Service Through Excellence"
        </p>

        <p className="mt-4 text-sm sm:text-base text-amber-200/90 max-w-3xl mx-auto leading-relaxed">
          Celebrating half a century of values, wisdom, and leadership. From our humble beginnings in 1976 to a premier temple of learning, we honor our pioneers, teachers, students, and alumni.
        </p>

        {/* Live Countdown */}
        <div className="mt-8">
          <Countdown />
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenContribute}
            className="px-8 py-3.5 rounded-full font-bold text-base text-stone-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 shadow-xl hover:shadow-gold-glow transition-all duration-300 flex items-center gap-2 group scale-105"
          >
            <Heart className="w-5 h-5 fill-stone-950 group-hover:scale-110 transition-transform" />
            <span>Contribute to Jubilee Fund</span>
          </button>

          <button
            onClick={() => onNavigate('events')}
            className="px-6 py-3.5 rounded-full font-semibold text-sm sm:text-base text-amber-200 bg-white/5 hover:bg-white/10 border border-amber-400/40 hover:border-amber-400 transition-all duration-200 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Jubilee Events Schedule</span>
          </button>

          <button
            onClick={() => onNavigate('timeline')}
            className="px-6 py-3.5 rounded-full font-semibold text-sm sm:text-base text-amber-200 bg-white/5 hover:bg-white/10 border border-amber-400/40 hover:border-amber-400 transition-all duration-200 flex items-center gap-2"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>50-Year Journey</span>
          </button>
        </div>

        {/* Principal's Note Excerpt */}
        <div className="mt-14 max-w-3xl mx-auto bg-black/40 backdrop-blur-md border border-amber-500/30 rounded-2xl p-6 sm:p-8 text-left shadow-xl relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-300 to-amber-600 p-0.5 shrink-0 shadow-lg">
              <div className="w-full h-full rounded-full bg-[#4A0405] flex items-center justify-center text-amber-300 font-serif font-bold text-xl">
                SML
              </div>
            </div>
            <div>
              <p className="text-amber-100/90 text-sm sm:text-base italic leading-relaxed font-serif">
                "For fifty years, St. Mary's School has walked under the tender grace of Mother Mary, shaping young minds into principled global citizens. As we celebrate this monumental milestone, we warmly invite every alumnus, parent, and benefactor to rejoice in our shared heritage and contribute towards our vision for the next fifty years."
              </p>
              <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="font-serif font-bold text-amber-300 text-sm sm:text-base">
                    {settings.principalName || 'Sr. Mary Lina DungDung'}
                  </h4>
                  <p className="text-xs text-amber-200/70">Principal, St. Mary's School, Jajpur Road</p>
                </div>
                <span className="text-[11px] text-amber-400/80 font-mono">Archdiocese of Cuttack-Bhubaneswar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#3B0304]/60 border border-amber-500/20 rounded-xl p-4 text-center">
            <p className="font-serif text-2xl sm:text-3xl font-black text-amber-400">1976</p>
            <p className="text-xs text-amber-200/80 mt-1">Founded in Faith</p>
          </div>
          <div className="bg-[#3B0304]/60 border border-amber-500/20 rounded-xl p-4 text-center">
            <p className="font-serif text-2xl sm:text-3xl font-black text-amber-400">15,000+</p>
            <p className="text-xs text-amber-200/80 mt-1">Marian Alumni</p>
          </div>
          <div className="bg-[#3B0304]/60 border border-amber-500/20 rounded-xl p-4 text-center">
            <p className="font-serif text-2xl sm:text-3xl font-black text-amber-400">100%</p>
            <p className="text-xs text-amber-200/80 mt-1">ICSE Distinction Legacy</p>
          </div>
          <div className="bg-[#3B0304]/60 border border-amber-500/20 rounded-xl p-4 text-center">
            <p className="font-serif text-2xl sm:text-3xl font-black text-amber-400">5 Days</p>
            <p className="text-xs text-amber-200/80 mt-1">Jubilee Festivities</p>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => onNavigate('timeline')}
            className="text-amber-300/60 hover:text-amber-300 transition-colors flex flex-col items-center gap-1 text-xs"
          >
            <span>Explore the Golden Legacy</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>

      </div>
    </section>
  );
};
