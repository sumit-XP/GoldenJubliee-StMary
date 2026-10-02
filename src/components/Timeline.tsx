import React, { useState } from 'react';
import { useJubilee } from '../context/JubileeContext.tsx';
import { Award, BookOpen, Sparkles, Building, Landmark, Compass, CheckCircle } from 'lucide-react';

export const Timeline: React.FC = () => {
  const { timeline } = useJubilee();
  const [selectedEra, setSelectedEra] = useState<string>('All');

  const eras = [
    'All',
    'Foundation (1976-1985)',
    'Expansion (1986-2000)',
    'Silver Era (2001-2015)',
    'Golden Horizon (2016-2026)',
  ];

  const filteredItems = selectedEra === 'All'
    ? timeline
    : timeline.filter((item) => item.era === selectedEra);

  const getIcon = (index: number) => {
    switch (index % 5) {
      case 0: return <Landmark className="w-5 h-5 text-amber-300" />;
      case 1: return <Compass className="w-5 h-5 text-amber-300" />;
      case 2: return <BookOpen className="w-5 h-5 text-amber-300" />;
      case 3: return <Building className="w-5 h-5 text-amber-300" />;
      default: return <Award className="w-5 h-5 text-amber-300" />;
    }
  };

  return (
    <section id="timeline" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF6EE] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-10 left-0 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-72 h-72 bg-red-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Half a Century of Glory (1976 – 2026)
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#5A0506]">
            The 50-Year Milestone Timeline
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base">
            Trace the remarkable journey of St. Mary's School, Jajpur Road — from its humble foundation under the shade of trees to a revered sanctuary of wisdom.
          </p>
        </div>

        {/* Era Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-14">
          {eras.map((era) => (
            <button
              key={era}
              onClick={() => setSelectedEra(era)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                selectedEra === era
                  ? 'bg-[#5A0506] text-amber-200 shadow-md scale-105'
                  : 'bg-white text-stone-700 hover:bg-amber-50 border border-stone-200 shadow-sm'
              }`}
            >
              {era === 'All' ? 'Full 50 Years (1976–2026)' : era}
            </button>
          ))}
        </div>

        {/* Timeline Line & Items */}
        <div className="relative">
          {/* Central Vertical Line */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-gradient-to-b from-amber-400 via-[#850B0C] to-amber-400 rounded-full shadow-sm" />
          
          {/* Mobile Line */}
          <div className="md:hidden absolute left-6 top-4 bottom-4 w-1 bg-gradient-to-b from-amber-400 via-[#850B0C] to-amber-400 rounded-full" />

          <div className="space-y-10 md:space-y-16">
            {filteredItems.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={item.id}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Node Icon (Center on desktop, Left on mobile) */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 p-1 shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                      <div className="w-full h-full rounded-full bg-[#5A0506] flex items-center justify-center shadow-inner">
                        {getIcon(index)}
                      </div>
                    </div>
                  </div>

                  {/* Content Card (Opposite sides on desktop, offset on mobile) */}
                  <div className="ml-14 md:ml-0 md:w-1/2 md:px-8 w-full">
                    <div className="bg-white border border-stone-200 hover:border-amber-400/80 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 group">
                      
                      {/* Card Header: Year badge & Era */}
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                        <span className="font-serif text-2xl font-black text-[#850B0C] group-hover:text-amber-600 transition-colors flex items-center gap-2">
                          <span>{item.year}</span>
                          {item.year === 2026 && (
                            <span className="text-xs bg-amber-400 text-stone-900 font-bold px-2 py-0.5 rounded-full font-sans uppercase">
                              Golden Jubilee
                            </span>
                          )}
                        </span>
                        {item.badge && (
                          <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full font-semibold">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-[#5A0506] transition-colors">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-2 text-stone-600 text-sm leading-relaxed">
                        {item.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                        <span className="font-medium text-stone-500">{item.era}</span>
                        <span className="flex items-center gap-1 text-amber-700 font-medium">
                          <CheckCircle className="w-3.5 h-3.5 text-amber-600" /> Milestone Archival
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Empty Spacer for the alternate column on Desktop */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
