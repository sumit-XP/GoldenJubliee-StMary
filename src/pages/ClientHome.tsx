import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar.tsx';
import { Hero } from '../components/Hero.tsx';
import { Timeline } from '../components/Timeline.tsx';
import { EventsSection } from '../components/EventsSection.tsx';
import { DonorWall } from '../components/DonorWall.tsx';
import { WishesSection } from '../components/WishesSection.tsx';
import { Footer } from '../components/Footer.tsx';
import { ContributeModal } from '../components/ContributeModal.tsx';
import { AnnouncementsBar } from '../components/AnnouncementsBar.tsx';
import { JubileeTributeModal, FloatingTributeTrigger } from '../components/JubileeTributeModal.tsx';

interface ClientHomeProps {
  onOpenAdmin: () => void;
  currentPage: 'home' | 'admin' | 'contribute';
  setCurrentPage: (page: 'home' | 'admin' | 'contribute') => void;
}

export const ClientHome: React.FC<ClientHomeProps> = ({
  onOpenAdmin,
  currentPage,
  setCurrentPage,
}) => {
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [isTributeModalOpen, setIsTributeModalOpen] = useState(false);

  // Auto-trigger the Golden Jubilee Tribute Pop-up on landing (if not dismissed in this session)
  useEffect(() => {
    try {
      const isDismissed = sessionStorage.getItem('stmarys_jubilee_tribute_dismissed');
      if (!isDismissed) {
        const timer = setTimeout(() => {
          setIsTributeModalOpen(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // Ignore sessionStorage restrictions if any
      console.error(e);
    }
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-stone-900 selection:bg-amber-200 selection:text-amber-900">
      {/* Live Announcement Bulletin Bar */}
      <AnnouncementsBar />

      {/* Main Header / Navbar */}
      <Navbar
        onOpenContribute={() => setIsContributeModalOpen(true)}
        onOpenTribute={() => setIsTributeModalOpen(true)}
        onNavigate={scrollToSection}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero
          onOpenContribute={() => setIsContributeModalOpen(true)}
          onOpenTribute={() => setIsTributeModalOpen(true)}
          onNavigate={scrollToSection}
        />

        <Timeline />

        <EventsSection />

        <DonorWall onOpenContribute={() => setIsContributeModalOpen(true)} />

        <WishesSection onOpenTribute={() => setIsTributeModalOpen(true)} />
      </main>

      {/* Footer */}
      <Footer
        onOpenContribute={() => setIsContributeModalOpen(true)}
        onNavigate={scrollToSection}
        onOpenAdmin={onOpenAdmin}
      />

      {/* Interactive Contribution Modal */}
      <ContributeModal
        isOpen={isContributeModalOpen}
        onClose={() => setIsContributeModalOpen(false)}
      />

      {/* Floating Action Trigger for Golden Jubilee Memories (Notes, Photos & Videos) */}
      <FloatingTributeTrigger onOpen={() => setIsTributeModalOpen(true)} />

      {/* Golden Jubilee Tributes Pop-up Modal (Dual Options: Parents Note/Photo & Teachers/Alumni Video < 1 min) */}
      <JubileeTributeModal
        isOpen={isTributeModalOpen}
        onClose={() => setIsTributeModalOpen(false)}
      />
    </div>
  );
};
