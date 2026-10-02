import React, { useState } from 'react';
import { Menu, X, Award, Heart, Lock, Calendar, Clock, BookOpen, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface NavbarProps {
  onOpenContribute: () => void;
  onNavigate: (sectionId: string) => void;
  currentPage: 'home' | 'admin' | 'contribute';
  setCurrentPage: (page: 'home' | 'admin' | 'contribute') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenContribute,
  onNavigate,
  currentPage,
  setCurrentPage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAdmin, logout } = useAuth();

  const handleNavClick = (sectionId: string) => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => onNavigate(sectionId), 100);
    } else {
      onNavigate(sectionId);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#5A0506]/95 backdrop-blur-md text-amber-50 border-b border-amber-600/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & School Title */}
          <div 
            onClick={() => { setCurrentPage('home'); onNavigate('hero'); }}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            {/* School Crest Badge */}
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-[#5A0506] flex items-center justify-center text-amber-300">
                <span className="font-serif font-black text-lg tracking-tighter">SMJ</span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-stone-900 text-[10px] font-bold px-1 rounded-full border border-stone-900 shadow">
                50
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-wide text-amber-100 group-hover:text-amber-300 transition-colors">
                  St. Mary's School
                </span>
                <span className="hidden sm:inline-block bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Golden Jubilee
                </span>
              </div>
              <p className="text-xs text-amber-200/80 font-medium">
                Jajpur Road, Odisha • Estd. 1976
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => handleNavClick('timeline')}
              className="px-3 py-2 text-sm font-medium text-amber-100 hover:text-amber-300 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Clock className="w-4 h-4 text-amber-400" />
              50-Year Journey
            </button>

            <button
              onClick={() => handleNavClick('events')}
              className="px-3 py-2 text-sm font-medium text-amber-100 hover:text-amber-300 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              Jubilee Events
            </button>

            <button
              onClick={() => handleNavClick('donors')}
              className="px-3 py-2 text-sm font-medium text-amber-100 hover:text-amber-300 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-amber-400" />
              Wall of Honour
            </button>

            <button
              onClick={() => handleNavClick('wishes')}
              className="px-3 py-2 text-sm font-medium text-amber-100 hover:text-amber-300 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              Alumni Wishes
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className="px-3 py-2 text-sm font-medium text-amber-100 hover:text-amber-300 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              Heritage
            </button>
          </nav>

          {/* CTA & Admin Link */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onOpenContribute}
              className="relative group overflow-hidden px-4 py-2.5 rounded-full font-semibold text-sm text-stone-900 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 shadow-md hover:shadow-gold-glow transition-all duration-300 flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-stone-900 text-stone-900 group-hover:scale-110 transition-transform" />
              <span>Contribute to Jubilee</span>
            </button>

            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage('admin')}
                  className="px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded-lg text-xs font-semibold hover:bg-amber-500/30 transition-colors"
                >
                  Admin Console
                </button>
                <button
                  onClick={logout}
                  className="text-xs text-amber-200/70 hover:text-amber-100 underline"
                >
                  Exit
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage('admin')}
                className="p-2 text-amber-300/80 hover:text-amber-200 hover:bg-white/5 rounded-full transition-colors title='Admin Portal'"
                title="Admin Control"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenContribute}
              className="px-3 py-1.5 text-xs font-bold text-stone-950 bg-amber-400 rounded-full flex items-center gap-1 shadow"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              Contribute
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-amber-200 hover:text-amber-100 rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#480304] border-b border-amber-600/40 px-4 pt-3 pb-6 space-y-2 shadow-2xl">
          <button
            onClick={() => handleNavClick('timeline')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-amber-100 font-medium hover:bg-white/10 flex items-center gap-2"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            50-Year Journey Timeline
          </button>
          <button
            onClick={() => handleNavClick('events')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-amber-100 font-medium hover:bg-white/10 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            Jubilee Events Schedule
          </button>
          <button
            onClick={() => handleNavClick('donors')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-amber-100 font-medium hover:bg-white/10 flex items-center gap-2"
          >
            <Award className="w-4 h-4 text-amber-400" />
            Donor Wall of Honour
          </button>
          <button
            onClick={() => handleNavClick('wishes')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-amber-100 font-medium hover:bg-white/10 flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            Alumni Wishes & Memories
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-amber-100 font-medium hover:bg-white/10 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            School Heritage & Mission
          </button>

          <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between">
            <button
              onClick={() => {
                setCurrentPage('admin');
                setMobileMenuOpen(false);
              }}
              className="text-xs text-amber-300 font-semibold flex items-center gap-1.5 py-1"
            >
              <Lock className="w-3.5 h-3.5" />
              {isAdmin ? 'Admin Console' : 'Admin Login'}
            </button>
            <span className="text-xs text-amber-300/60 font-serif">1976 – 2026</span>
          </div>
        </div>
      )}
    </header>
  );
};
