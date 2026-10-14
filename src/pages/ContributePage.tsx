import React from 'react';
import { ArrowLeft, School, ShieldCheck, Heart } from 'lucide-react';
import { UpiPaymentFlow } from '../components/UpiPaymentFlow.tsx';
import { AnnouncementsBar } from '../components/AnnouncementsBar.tsx';
import { Footer } from '../components/Footer.tsx';

interface ContributePageProps {
  onBackToHome: () => void;
  onOpenAdmin: () => void;
}

export const ContributePage: React.FC<ContributePageProps> = ({
  onBackToHome,
  onOpenAdmin,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-stone-900 selection:bg-amber-200 selection:text-amber-900">
      {/* Live Bulletin Bar */}
      <AnnouncementsBar />

      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#5A0506]/95 backdrop-blur-md text-amber-50 border-b border-amber-600/30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onBackToHome}>
            <button
              onClick={onBackToHome}
              className="p-2 rounded-full hover:bg-white/10 text-amber-200 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to School Homepage</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full p-0.5 bg-white shadow-md border border-amber-300 shrink-0">
              <img
                src="/school-logo.png"
                alt="St. Mary's School Emblem"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="text-right">
              <span className="font-serif font-bold text-sm sm:text-base text-amber-100 block">
                St. Mary's School, Jajpur Road
              </span>
              <span className="text-[11px] text-amber-300/80">
                Golden Jubilee Contribution Fund (1976–2026)
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Payment Section */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full space-y-8">
        
        {/* Intro Hero Badge */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-xs font-bold text-[#850B0C] uppercase tracking-wider shadow-sm">
            <Heart className="w-3.5 h-3.5 fill-[#850B0C]" />
            Official Jubilee Endowment Portal
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Golden Jubilee Contribution
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Your generous contributions fund the new <strong>Golden Jubilee Student Memorial Auditorium</strong> and the <strong>Marian Science & Technology Endowment</strong>. Every contribution is officially recognized with a personalized Patron Certificate.
          </p>
        </div>

        {/* Embedded UPI Flow */}
        <UpiPaymentFlow isModal={false} />

      </main>

      {/* Footer */}
      <Footer
        onOpenContribute={() => {}}
        onNavigate={(sec) => {
          onBackToHome();
          setTimeout(() => {
            const el = document.getElementById(sec);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onOpenAdmin={onOpenAdmin}
      />
    </div>
  );
};
