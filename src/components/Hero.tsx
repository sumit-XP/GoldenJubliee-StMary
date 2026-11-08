import React from 'react';
import { Countdown } from './Countdown.tsx';
import { Heart, Calendar, Sparkles, ChevronDown, Award } from 'lucide-react';
import { useJubilee } from '../context/JubileeContext.tsx';

interface HeroProps {
  onOpenContribute: () => void;
  onOpenTribute?: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenContribute, onOpenTribute, onNavigate }) => {
  const { settings } = useJubilee();

  return (
    <section id="hero" className="relative bg-gradient-to-b from-[#4A0405] via-[#2A0203] to-[#120102] text-amber-50 pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative Golden Starburst & Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-amber-500/15 via-amber-700/5 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        
        {/* Jubilee Insignia & School Logo */}
        <div className="inline-flex flex-col items-center mb-6">
          <div className="relative mb-3">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-600 p-1.5 shadow-2xl flex items-center justify-center group hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-white p-1 flex items-center justify-center overflow-hidden shadow-inner">
                <img
                  src="/school-logo.png"
                  alt="St. Mary's School Official Emblem"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-stone-950 font-serif font-black text-xs px-2.5 py-0.5 rounded-full border-2 border-[#3B0304] shadow-lg">
              1976–2026
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
        <h1 className="font-serif text-2xl sm:text-4xl lg:text-6xl font-black tracking-tight text-amber-100 max-w-4xl mx-auto leading-tight drop-shadow-md">
          St. Mary's School, Jajpur Road
        </h1>
        
        <p className="mt-3 sm:mt-4 font-serif text-base sm:text-xl lg:text-2xl text-amber-300 font-semibold italic max-w-2xl mx-auto">
          "Service Through Excellence"
        </p>

        <p className="mt-3 sm:mt-4 text-xs sm:text-base text-amber-200/90 max-w-3xl mx-auto leading-relaxed px-2">
          Celebrating half a century of values, wisdom, and leadership. From our humble beginnings in 1976 to a premier temple of learning, we honor our pioneers, teachers, students, and alumni.
        </p>

        {/* Live Countdown */}
        <div className="mt-6 sm:mt-8 w-full flex justify-center px-2">
          <Countdown />
        </div>

        {/* Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-none mx-auto">
          <button
            onClick={onOpenContribute}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-stone-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 shadow-xl hover:shadow-gold-glow transition-all duration-300 flex items-center justify-center gap-2 group sm:scale-105"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-stone-950 group-hover:scale-110 transition-transform shrink-0" />
            <span>Contribute to Jubilee Fund</span>
          </button>

          {onOpenTribute && (
            <button
              onClick={onOpenTribute}
              className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm text-stone-950 bg-amber-400 hover:bg-amber-300 border border-amber-300 shadow-lg hover:shadow-gold-glow transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-stone-950 group-hover:scale-110 transition-transform shrink-0" />
              <span>Share Note, Photo & Video</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('events')}
            className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-full font-semibold text-xs sm:text-sm text-amber-200 bg-white/5 hover:bg-white/10 border border-amber-400/40 hover:border-amber-400 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Jubilee Events Schedule</span>
          </button>

          <button
            onClick={() => onNavigate('timeline')}
            className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-full font-semibold text-xs sm:text-sm text-amber-200 bg-white/5 hover:bg-white/10 border border-amber-400/40 hover:border-amber-400 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span>50-Year Journey</span>
          </button>
        </div>

        {/* Principal's Note Excerpt */}
        <div className="mt-10 sm:mt-14 max-w-3xl mx-auto bg-black/40 backdrop-blur-md border border-amber-500/30 rounded-2xl p-5 sm:p-8 text-center sm:text-left shadow-xl relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-300 to-amber-600 p-0.5 shrink-0 shadow-lg">
              <div className="w-full h-full rounded-full bg-[#4A0405] flex items-center justify-center text-amber-300 font-serif font-bold text-lg sm:text-xl">
                SIT
              </div>
            </div>
            <div className="w-full">
              <p className="text-amber-100/90 text-xs sm:text-base italic leading-relaxed font-serif">
                "For fifty years, St. Mary's School has walked under the tender grace of Mother Mary, shaping young minds into principled global citizens. As we celebrate this monumental milestone, we warmly invite every alumnus, parent, and benefactor to rejoice in our shared heritage and contribute towards our vision for the next fifty years."
              </p>
              <div className="mt-4 pt-3 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-2">
                <div>
                  <h4 className="font-serif font-bold text-amber-300 text-sm sm:text-base">
                    {settings.principalName || 'Sr. Indu Turkey'}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-amber-200/70">Principal, St. Mary's School, Jajpur Road</p>
                </div>
                <span className="text-[10px] sm:text-[11px] text-amber-400/80 font-mono">Archdiocese of Cuttack-Bhubaneswar</span>
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
            <p className="font-serif text-2xl sm:text-3xl font-black text-amber-400">3 Days</p>
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
