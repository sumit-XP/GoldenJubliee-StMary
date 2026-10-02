import React, { useState } from 'react';
import { Navbar } from '../components/Navbar.tsx';
import { Hero } from '../components/Hero.tsx';
import { Timeline } from '../components/Timeline.tsx';
import { EventsSection } from '../components/EventsSection.tsx';
import { DonorWall } from '../components/DonorWall.tsx';
import { WishesSection } from '../components/WishesSection.tsx';
import { Footer } from '../components/Footer.tsx';
import { ContributeModal } from '../components/ContributeModal.tsx';
import { AnnouncementsBar } from '../components/AnnouncementsBar.tsx';

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
        onNavigate={scrollToSection}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero
          onOpenContribute={() => setIsContributeModalOpen(true)}
          onNavigate={scrollToSection}
        />

        <Timeline />

        <EventsSection />

        <DonorWall onOpenContribute={() => setIsContributeModalOpen(true)} />

        <WishesSection />
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
    </div>
  );
};
